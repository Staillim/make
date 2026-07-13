import { NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from "next/headers";

// Create Supabase client for server-side
async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set(name, value, options);
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.delete(name);
        },
      },
    }
  );
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createSupabaseServerClient();
    
    // Get authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('Auth error:', userError);
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;

    // Fetch business ensuring user owns it
    const { data: negocio, error } = await supabase
      .from('negocios')
      .select(`
        id_negocio,
        id_usuario,
        nombre,
        estado,
        fecha_creacion,
        fecha_activacion,
        url_tienda,
        created_at,
        updated_at
      `)
      .eq('id_negocio', id)
      .eq('id_usuario', user.id)
      .single();

    if (error || !negocio) {
      return NextResponse.json(
        { error: "Negocio no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ negocio });
  } catch (error) {
    console.error('Get business error:', error);
    return NextResponse.json(
      { error: "Error al obtener negocio" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createSupabaseServerClient();
    
    // Get authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('Auth error:', userError);
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Whitelist de campos actualizables. Mantener sincronizado con el hook
    // `useNegocios.actualizarNegocio` del cliente.
    const allowedFields = ['nombre', 'estado', 'url_tienda'] as const;
    type AllowedField = (typeof allowedFields)[number];
    const updateData: Partial<Record<AllowedField, string | null>> = {};

    for (const key of allowedFields) {
      const value = (body as Record<string, unknown>)[key];
      if (value !== undefined) {
        updateData[key] = value as string | null;
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No hay campos válidos para actualizar" },
        { status: 400 }
      );
    }

    // Update business ensuring user owns it
    const { data: negocio, error } = await supabase
      .from('negocios')
      .update(updateData)
      .eq('id_negocio', id)
      .eq('id_usuario', user.id)
      .select(`
        id_negocio,
        id_usuario,
        nombre,
        estado,
        fecha_creacion,
        fecha_activacion,
        url_tienda,
        created_at,
        updated_at
      `)
      .single();

    if (error) {
      console.error('Update business error:', error);
      return NextResponse.json(
        { error: "Error al actualizar negocio" },
        { status: 500 }
      );
    }

    if (!negocio) {
      return NextResponse.json(
        { error: "Negocio no encontrado o sin permisos" },
        { status: 404 }
      );
    }

    return NextResponse.json({ negocio });
  } catch (error) {
    console.error('Update business error:', error);
    return NextResponse.json(
      { error: "Error al actualizar negocio" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createSupabaseServerClient();
    
    // Get authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('Auth error:', userError);
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;

    // Delete business ensuring user owns it (cascade will handle related data)
    const { error } = await supabase
      .from('negocios')
      .delete()
      .eq('id_negocio', id)
      .eq('id_usuario', user.id);

    if (error) {
      console.error('Delete business error:', error);
      return NextResponse.json(
        { error: "Error al eliminar negocio" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete business error:', error);
    return NextResponse.json(
      { error: "Error al eliminar negocio" },
      { status: 500 }
    );
  }
}


