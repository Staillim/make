// Wrapper de la DB SQLite local.
//
// Decisiones de diseño:
// - Un solo archivo .db en data/maket.db (gitignored).
// - Las migraciones corren idempotentemente en cada import del módulo.
// - AUTH local: tabla `usuarios` con password_hash (bcrypt), tabla
//   `sessions` con token uuid + expires_at. Cookie HttpOnly `maket_session`.
// - Fachada "Supabase-like" mínima para no reescribir las API routes:
//   .from(t).select().eq().single() | .insert() | .update().eq().select()
//   | .delete().eq().

import Database from 'better-sqlite3'
import path from 'node:path'
import fs from 'node:fs'
import bcrypt from 'bcryptjs'

let _db: Database.Database | null = null

const DB_DIR = path.join(process.cwd(), 'data')
const DB_PATH = path.join(DB_DIR, 'maket.db')

function open(): Database.Database {
  if (_db) return _db
  if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true })
  _db = new Database(DB_PATH)
  _db.pragma('journal_mode = WAL')
  _db.pragma('foreign_keys = ON')
  migrate(_db)
  seed(_db)
  return _db
}

// ============================================================================
// MIGRACIONES — idempotentes
// ============================================================================

function migrate(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id_usuario TEXT PRIMARY KEY,
      nombre TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      plan TEXT NOT NULL DEFAULT 'free' CHECK(plan IN ('free','premium')),
      fecha_registro TEXT NOT NULL DEFAULT (datetime('now')),
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS negocios (
      id_negocio TEXT PRIMARY KEY,
      id_usuario TEXT NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
      nombre TEXT,
      estado TEXT NOT NULL DEFAULT 'en_configuracion'
        CHECK(estado IN ('en_configuracion','activo','pausado')),
      fecha_creacion TEXT NOT NULL DEFAULT (datetime('now')),
      fecha_activacion TEXT,
      url_tienda TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_negocios_usuario ON negocios(id_usuario);

    CREATE TABLE IF NOT EXISTS tema (
      id_tema TEXT PRIMARY KEY,
      id_negocio TEXT NOT NULL UNIQUE REFERENCES negocios(id_negocio) ON DELETE CASCADE,
      tipo_negocio TEXT NOT NULL,
      categoria_principal TEXT NOT NULL,
      tipo_producto TEXT NOT NULL CHECK(tipo_producto IN ('fisico','digital','mixto')),
      alcance TEXT NOT NULL CHECK(alcance IN ('local','nacional','internacional')),
      descripcion_ia TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS plantillas (
      id_plantilla TEXT PRIMARY KEY,
      nombre TEXT NOT NULL,
      descripcion TEXT NOT NULL,
      preview_url TEXT,
      tipo_plan TEXT NOT NULL CHECK(tipo_plan IN ('free','premium')),
      categorias_compatibles TEXT,
      configuracion_base TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS marca (
      id_marca TEXT PRIMARY KEY,
      id_negocio TEXT NOT NULL UNIQUE REFERENCES negocios(id_negocio) ON DELETE CASCADE,
      nombre_negocio TEXT NOT NULL,
      slogan TEXT,
      color_primario TEXT NOT NULL,
      color_secundario TEXT,
      color_acento TEXT,
      estilo_visual TEXT NOT NULL,
      publico_objetivo TEXT,
      tono_comunicacion TEXT NOT NULL,
      logo_url TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS configuracion_visual (
      id_config TEXT PRIMARY KEY,
      id_negocio TEXT NOT NULL UNIQUE REFERENCES negocios(id_negocio) ON DELETE CASCADE,
      id_plantilla TEXT NOT NULL REFERENCES plantillas(id_plantilla),
      configuracion TEXT NOT NULL,
      ultima_modificacion TEXT NOT NULL DEFAULT (datetime('now')),
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS categorias (
      id_categoria TEXT PRIMARY KEY,
      id_negocio TEXT NOT NULL REFERENCES negocios(id_negocio) ON DELETE CASCADE,
      nombre TEXT NOT NULL,
      orden INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_categorias_negocio ON categorias(id_negocio);

    CREATE TABLE IF NOT EXISTS productos (
      id_producto TEXT PRIMARY KEY,
      id_negocio TEXT NOT NULL REFERENCES negocios(id_negocio) ON DELETE CASCADE,
      id_categoria TEXT NOT NULL REFERENCES categorias(id_categoria) ON DELETE CASCADE,
      nombre TEXT NOT NULL,
      descripcion TEXT,
      precio REAL NOT NULL,
      imagenes TEXT,
      variantes TEXT,
      stock INTEGER DEFAULT 0,
      estado TEXT NOT NULL DEFAULT 'borrador'
        CHECK(estado IN ('activo','borrador','agotado')),
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_productos_negocio ON productos(id_negocio);

    CREATE TABLE IF NOT EXISTS variantes_config (
      id_variante_config TEXT PRIMARY KEY,
      id_negocio TEXT NOT NULL UNIQUE REFERENCES negocios(id_negocio) ON DELETE CASCADE,
      tallas TEXT,
      colores TEXT,
      tipo_inventario TEXT DEFAULT 'propio',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS reglas_negocio (
      id_regla TEXT PRIMARY KEY,
      id_negocio TEXT NOT NULL UNIQUE REFERENCES negocios(id_negocio) ON DELETE CASCADE,
      dominio_permitido TEXT NOT NULL,
      dominios_bloqueados TEXT,
      palabras_clave TEXT,
      palabras_prohibidas TEXT,
      reglas_personalizadas TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS agentes (
      id_agente TEXT PRIMARY KEY,
      id_negocio TEXT NOT NULL REFERENCES negocios(id_negocio) ON DELETE CASCADE,
      tipo TEXT NOT NULL CHECK(tipo IN ('vendedor','administrador')),
      nombre TEXT NOT NULL,
      personalidad TEXT NOT NULL,
      prompt_base TEXT NOT NULL,
      avatar_url TEXT,
      estado TEXT DEFAULT 'activo',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS config_comercial (
      id_config TEXT PRIMARY KEY,
      id_negocio TEXT NOT NULL UNIQUE REFERENCES negocios(id_negocio) ON DELETE CASCADE,
      metodos_pago TEXT NOT NULL,
      politica_devoluciones TEXT,
      tiempo_entrega TEXT,
      zonas_envio TEXT,
      costo_envio TEXT,
      moneda TEXT DEFAULT 'COP',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS automatizaciones (
      id_automatizacion TEXT PRIMARY KEY,
      id_negocio TEXT NOT NULL REFERENCES negocios(id_negocio) ON DELETE CASCADE,
      tipo TEXT NOT NULL,
      activo INTEGER DEFAULT 1,
      configuracion TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      id_usuario TEXT NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(id_usuario);

    CREATE TABLE IF NOT EXISTS constructor_mensajes (
      id_mensaje TEXT PRIMARY KEY,
      id_negocio TEXT NOT NULL REFERENCES negocios(id_negocio) ON DELETE CASCADE,
      rol TEXT NOT NULL CHECK(rol IN ('bot','usuario')),
      contenido TEXT NOT NULL,
      fase TEXT NOT NULL,
      metadata TEXT,
      timestamp TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_mensajes_negocio ON constructor_mensajes(id_negocio);

    CREATE TABLE IF NOT EXISTS constructor_progreso (
      id_negocio TEXT PRIMARY KEY REFERENCES negocios(id_negocio) ON DELETE CASCADE,
      fase_actual TEXT NOT NULL DEFAULT 'inicio',
      fases_completadas TEXT NOT NULL DEFAULT '[]',
      porcentaje INTEGER NOT NULL DEFAULT 0,
      datos_por_fase TEXT NOT NULL DEFAULT '{}',
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `)
}

function seed(db: Database.Database) {
  const count = (db.prepare('SELECT COUNT(*) as n FROM plantillas').get() as { n: number }).n
  if (count > 0) return
  const insertPlantilla = db.prepare(`
    INSERT INTO plantillas (id_plantilla, nombre, descripcion, tipo_plan, configuracion_base)
    VALUES (?, ?, ?, ?, ?)
  `)
  const plantillas: Array<[string, string, string, string, string]> = [
    ['minimal', 'Minimal', 'Plantilla minimalista y elegante', 'free', JSON.stringify({ estilo: 'minimal', colores: ['#ffffff', '#000000'] })],
    ['modern', 'Modern', 'Plantilla moderna con gradientes', 'free', JSON.stringify({ estilo: 'modern', colores: ['#4f46e5', '#7c3aed'] })],
    ['classic', 'Classic', 'Plantilla clásica y profesional', 'free', JSON.stringify({ estilo: 'classic', colores: ['#374151', '#6b7280'] })],
    ['pro', 'Ecommerce Pro', 'Plantilla premium para tiendas', 'premium', JSON.stringify({ estilo: 'pro', colores: ['#059669', '#10b981'] })],
    ['fashion', 'Fashion Store', 'Especializada en moda y estilo', 'premium', JSON.stringify({ estilo: 'fashion', colores: ['#ec4899', '#f472b6'] })],
    ['tech', 'Tech Store', 'Optimizada para productos tecnológicos', 'premium', JSON.stringify({ estilo: 'tech', colores: ['#3b82f6', '#60a5fa'] })],
  ]
  const tx = db.transaction(() => {
    for (const p of plantillas) insertPlantilla.run(...p)
  })
  tx()
}

// ============================================================================
// AUTH LOCAL
// ============================================================================

const SESSION_TTL_DAYS = 7

export function createUser(nombre: string, email: string, password: string) {
  const db = open()
  const id_usuario = crypto.randomUUID()
  const password_hash = bcrypt.hashSync(password, 10)
  try {
    db.prepare(
      'INSERT INTO usuarios (id_usuario, nombre, email, password_hash) VALUES (?, ?, ?, ?)'
    ).run(id_usuario, nombre, email, password_hash)
  } catch (e: unknown) {
    if (e instanceof Error && e.message.includes('UNIQUE')) {
      throw new Error('El email ya está registrado')
    }
    throw e
  }
  return { id_usuario, nombre, email, plan: 'free' }
}

export function verifyLogin(email: string, password: string) {
  const db = open()
  const row = db.prepare(
    'SELECT id_usuario, nombre, email, password_hash, plan FROM usuarios WHERE email = ?'
  ).get(email) as
    | { id_usuario: string; nombre: string; email: string; password_hash: string; plan: string }
    | undefined
  if (!row) return null
  if (!bcrypt.compareSync(password, row.password_hash)) return null
  return { id_usuario: row.id_usuario, nombre: row.nombre, email: row.email, plan: row.plan }
}

export function createSession(id_usuario: string) {
  const db = open()
  const token = crypto.randomUUID()
  const expires_at = new Date(Date.now() + SESSION_TTL_DAYS * 86400_000).toISOString()
  db.prepare(
    'INSERT INTO sessions (token, id_usuario, expires_at) VALUES (?, ?, ?)'
  ).run(token, id_usuario, expires_at)
  return { token, expires_at }
}

export function getSessionUser(token: string | undefined | null) {
  if (!token) return null
  const db = open()
  const row = db.prepare(`
    SELECT u.id_usuario, u.nombre, u.email, u.plan, s.expires_at
    FROM sessions s
    JOIN usuarios u ON u.id_usuario = s.id_usuario
    WHERE s.token = ? AND s.expires_at > datetime('now')
  `).get(token) as
    | { id_usuario: string; nombre: string; email: string; plan: string; expires_at: string }
    | undefined
  return row ?? null
}

export function deleteSession(token: string | undefined | null) {
  if (!token) return
  open().prepare('DELETE FROM sessions WHERE token = ?').run(token)
}

// ============================================================================
// Fachada "Supabase-like" — compatible con await supabase.from('x').select(...)
// ============================================================================

type Row = Record<string, unknown>

// Builder compartido para .eq() / .neq() / filtros.
class FilterBuilder {
  protected filters: Array<{ col: string; op: string; vals: unknown[] }> = []
  eq(col: string, val: unknown): this {
    this.filters.push({ col, op: '=', vals: [val] })
    return this
  }
  neq(col: string, val: unknown): this {
    this.filters.push({ col, op: '!=', vals: [val] })
    return this
  }
}

// SELECT: .from(t).select('*').eq().single() | thenable (array)
class SelectBuilder<T extends Row = Row> extends FilterBuilder {
  private _single = false
  private _limitN: number | null = null
  private _orderBy: { col: string; dir: 'ASC' | 'DESC' } | null = null
  constructor(private table: string, private cols: string) { super() }

  limit(n: number): this { this._limitN = n; return this }
  order(col: string, opts?: { ascending?: boolean }): this {
    this._orderBy = { col, dir: opts?.ascending === false ? 'DESC' : 'ASC' }
    return this
  }
  single(): { data: T | null; error: { message: string } | null } {
    this._single = true
    return this._exec() as { data: T | null; error: { message: string } | null }
  }
  then<TResult1 = { data: T[]; error: { message: string } | null }, TResult2 = never>(
    onfulfilled?: ((value: { data: T[]; error: { message: string } | null }) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ): PromiseLike<TResult1 | TResult2> {
    const r = this._exec() as { data: T[]; error: { message: string } | null }
    return Promise.resolve(r).then(onfulfilled, onrejected)
  }

  private _exec(): { data: T | T[] | null; error: { message: string } | null } {
    const db = open()
    let sql = `SELECT ${this.cols} FROM ${this.table}`
    const params: unknown[] = []
    if (this.filters.length) {
      const parts = this.filters.map(f => {
        const placeholders = f.vals.map(() => '?').join(',')
        params.push(...f.vals)
        return `${f.col} ${f.op} ${placeholders === '?' ? '?' : `(${placeholders})`}`
      })
      sql += ` WHERE ${parts.join(' AND ')}`
    }
    if (this._orderBy) sql += ` ORDER BY ${this._orderBy.col} ${this._orderBy.dir}`
    if (this._limitN) sql += ` LIMIT ${this._limitN}`
    try {
      const rows = (params.length ? db.prepare(sql).all(...params) : db.prepare(sql).all()) as T[]
      if (this._single) return { data: rows[0] ?? null, error: null }
      return { data: rows, error: null }
    } catch (e: unknown) {
      return { data: this._single ? null : [], error: { message: e instanceof Error ? e.message : String(e) } }
    }
  }
}

// UPDATE: .from(t).update(patch).eq() — thenable directo que devuelve rows
// actualizadas. También soporta .select() y .single() si se quiere encadenar.
class UpdateBuilder<T extends Row = Row> extends FilterBuilder {
  private _single = false
  constructor(private table: string, private patch: Partial<T>) { super() }
  select(_cols: string = '*'): this { return this }  // no-op, la fachada ya devuelve rows
  single(): this { this._single = true; return this }
  private _exec(): { data: T[] | T | null; error: { message: string } | null } {
    const db = open()
    const set = Object.keys(this.patch)
    if (!set.length) return { data: null, error: { message: 'nothing to update' } }
    const setSql = set.map(k => `${k} = ?`).join(', ')
    const params: unknown[] = []
    for (const k of set) params.push((this.patch as Row)[k])
    let sql = `UPDATE ${this.table} SET ${setSql}, updated_at = datetime('now')`
    if (this.filters.length) {
      const parts = this.filters.map(f => {
        const placeholders = f.vals.map(() => '?').join(',')
        params.push(...f.vals)
        return `${f.col} ${f.op} ${placeholders === '?' ? '?' : `(${placeholders})`}`
      })
      sql += ` WHERE ${parts.join(' AND ')}`
    }
    sql += ` RETURNING *`
    try {
      const rows = db.prepare(sql).all(...params) as T[]
      if (this._single) return { data: rows[0] ?? null, error: null }
      return { data: rows, error: null }
    } catch (e: unknown) {
      return { data: null, error: { message: e instanceof Error ? e.message : String(e) } }
    }
  }
  then<TResult1 = { data: T[] | T | null; error: { message: string } | null }, TResult2 = never>(
    onfulfilled?: ((value: { data: T[] | T | null; error: { message: string } | null }) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ): PromiseLike<TResult1 | TResult2> {
    return Promise.resolve(this._exec()).then(onfulfilled, onrejected)
  }
}

// DELETE: .from(t).delete().eq() — thenable que devuelve rows borrados
class DeleteBuilder<T extends Row = Row> extends FilterBuilder {
  constructor(private table: string) { super() }
  then<TResult1 = { data: T[] | null; error: { message: string } | null }, TResult2 = never>(
    onfulfilled?: ((value: { data: T[] | null; error: { message: string } | null }) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ): PromiseLike<TResult1 | TResult2> {
    return Promise.resolve(this._exec()).then(onfulfilled, onrejected)
  }
  private _exec() {
    const db = open()
    if (!this.filters.length) return { data: null, error: { message: 'delete requires .eq()' } }
    const params: unknown[] = []
    const parts = this.filters.map(f => {
      const placeholders = f.vals.map(() => '?').join(',')
      params.push(...f.vals)
      return `${f.col} ${f.op} ${placeholders === '?' ? '?' : `(${placeholders})`}`
    })
    const sql = `DELETE FROM ${this.table} WHERE ${parts.join(' AND ')} RETURNING *`
    try {
      return { data: db.prepare(sql).all(...params) as T[], error: null }
    } catch (e: unknown) {
      return { data: null, error: { message: e instanceof Error ? e.message : String(e) } }
    }
  }
}

// INSERT: .from(t).insert(row).then() — no encadena filtros
function runInsert<T extends Row>(table: string, row: Partial<T> | Partial<T>[]): Promise<{ data: T[] | null; error: { message: string } | null }> {
  const db = open()
  const rows = (Array.isArray(row) ? row : [row]) as Array<Partial<T>>
  if (!rows.length) return Promise.resolve({ data: [], error: { message: 'nothing to insert' } })
  const cols = Object.keys(rows[0] as Row)
  const placeholders = rows.map(() => `(${cols.map(() => '?').join(',')})`).join(',')
  const sql = `INSERT INTO ${table} (${cols.join(',')}) VALUES ${placeholders} RETURNING *`
  const params: unknown[] = []
  for (const r of rows) for (const c of cols) params.push((r as Row)[c])
  try {
    const out = db.prepare(sql).all(...params) as T[]
    return Promise.resolve({ data: out, error: null })
  } catch (e: unknown) {
    return Promise.resolve({ data: null, error: { message: e instanceof Error ? e.message : String(e) } })
  }
}

// Cliente fachada
export interface DbClient {
  from<T extends Row = Row>(table: string): {
    select(cols?: string): SelectBuilder<T>;
    insert(row: Partial<T>[] | Partial<T>): Promise<{ data: T[] | null; error: { message: string } | null }>;
    update(patch: Partial<T>): UpdateBuilder<T>;
    delete(): DeleteBuilder<T>;
  };
}

function tableApi<T extends Row>(table: string) {
  return {
    select: (cols: string = '*') => new SelectBuilder<T>(table, cols),
    insert: (row: Partial<T>[] | Partial<T>) => runInsert<T>(table, row),
    update: (patch: Partial<T>) => new UpdateBuilder<T>(table, patch),
    delete: () => new DeleteBuilder<T>(table),
  };
}

export function getDb(): DbClient {
  open()
  return { from: tableApi };
}

// Aliases de back-compat.
export const getSupabase = getDb
export const getSupabaseAdmin = getDb
export type SupabaseClient = DbClient
