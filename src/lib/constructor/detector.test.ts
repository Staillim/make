/**
 * Tests de la función detectarTipoNegocio
 * Casos de prueba para validar la detección automática
 */

import { detectarTipoNegocio, validarTipoIndustria, obtenerCategoriasSugeridas } from './detector';

// Test cases para validar
export const casosDeteccion = [
  {
    descripcion: "Quiero vender hamburguesas y papas fritas con delivery",
    esperado: {
      tipo: "restaurante",
      confianzaMinima: 70,
    },
  },
  {
    descripcion: "Tienda de ropa urbana para jóvenes, camisetas y jeans",
    esperado: {
      tipo: "tienda_ropa",
      confianzaMinima: 70,
    },
  },
  {
    descripcion: "Vendo laptops, celulares y accesorios tecnológicos",
    esperado: {
      tipo: "tecnologia",
      confianzaMinima: 80,
    },
  },
  {
    descripcion: "Gimnasio con clases de spinning, yoga y entrenamiento funcional",
    esperado: {
      tipo: "gimnasio",
      confianzaMinima: 75,
    },
  },
  {
    descripcion: "Cursos online de programación, diseño web y marketing digital",
    esperado: {
      tipo: "educacion",
      confianzaMinima: 70,
    },
  },
  {
    descripcion: "Consultoría de marketing digital y manejo de redes sociales",
    esperado: {
      tipo: "servicios",
      confianzaMinima: 65,
    },
  },
  {
    descripcion: "Pizza italiana artesanal a domicilio",
    esperado: {
      tipo: "restaurante",
      confianzaMinima: 80,
    },
  },
  {
    descripcion: "Zapatos deportivos y tenis para running",
    esperado: {
      tipo: "tienda_ropa",
      confianzaMinima: 70,
    },
  },
  {
    descripcion: "Audífonos gaming y teclados mecánicos",
    esperado: {
      tipo: "tecnologia",
      confianzaMinima: 75,
    },
  },
  {
    descripcion: "Membresías de gym con coach personal",
    esperado: {
      tipo: "gimnasio",
      confianzaMinima: 80,
    },
  },
  {
    descripcion: "Academia de inglés online para niños",
    esperado: {
      tipo: "educacion",
      confianzaMinima: 75,
    },
  },
  {
    descripcion: "Diseño de páginas web y desarrollo de apps",
    esperado: {
      tipo: "servicios",
      confianzaMinima: 70,
    },
  },
  {
    descripcion: "Vendo cosas", // Caso ambiguo
    esperado: {
      tipo: "otro",
      confianzaMinima: 0,
    },
  },
];

/**
 * Ejecuta todos los tests de detección
 */
export async function ejecutarTests() {
  console.log("🧪 Iniciando tests de detección de industria...\n");

  let pasados = 0;
  let fallados = 0;

  for (const caso of casosDeteccion) {
    try {
      const resultado = await detectarTipoNegocio(caso.descripcion);

      const pasoTipo = resultado.tipo === caso.esperado.tipo;
      const pasoConfianza = resultado.confianza >= caso.esperado.confianzaMinima;

      if (pasoTipo && pasoConfianza) {
        console.log(`✅ PASADO: "${caso.descripcion}"`);
        console.log(`   → Detectado: ${resultado.tipo} (${resultado.confianza}%)`);
        pasados++;
      } else {
        console.log(`❌ FALLADO: "${caso.descripcion}"`);
        console.log(`   → Esperado: ${caso.esperado.tipo} (>=${caso.esperado.confianzaMinima}%)`);
        console.log(`   → Obtenido: ${resultado.tipo} (${resultado.confianza}%)`);
        fallados++;
      }
      console.log();
    } catch (error) {
      console.log(`💥 ERROR: "${caso.descripcion }"`);
      console.log(`   → ${error}`);
      fallados++;
      console.log();
    }
  }

  console.log("═".repeat(50));
  console.log(`📊 Resultados: ${pasados}/${casosDeteccion.length} tests pasados`);
  console.log(`✅ Pasados: ${pasados}`);
  console.log(`❌ Fallados: ${fallados}`);
  console.log(`📈 Tasa de éxito: ${Math.round((pasados / casosDeteccion.length) * 100)}%`);
  console.log("═".repeat(50));

  return {
    pasados,
    fallados,
    total: casosDeteccion.length,
    tasaExito: (pasados / casosDeteccion.length) * 100,
  };
}

/**
 * Test individual para desarrollo
 */
export async function testDeteccion(descripcion: string) {
  console.log(`\n🔍 Detectando tipo de: "${descripcion}"\n`);

  const resultado = await detectarTipoNegocio(descripcion, {
    incluirRazonamiento: true,
    incluirSugerencias: true,
  });

  console.log("📋 Resultado:");
  console.log(`   Tipo: ${resultado.tipo}`);
  console.log(`   Confianza: ${resultado.confianza}%`);
  console.log(`   Razonamiento: ${resultado.razonamiento}`);

  if (resultado.tipo_producto) {
    console.log(`   Tipo de producto: ${resultado.tipo_producto}`);
  }

  if (resultado.alcance_sugerido) {
    console.log(`   Alcance: ${resultado.alcance_sugerido}`);
  }

  if (resultado.categorias_sugeridas) {
    console.log(`   Categorías sugeridas: ${resultado.categorias_sugeridas.join(", ")}`);
  }

  // Obtener categorías default del sistema
  const categoriasDefault = obtenerCategoriasSugeridas(resultado.tipo);
  if (categoriasDefault) {
    console.log(`   Categorías por defecto: ${categoriasDefault.join(", ")}`);
  }

  console.log();

  return resultado;
}

// Ejecutar tests si se corre directamente
if (require.main === module) {
  ejecutarTests().catch(console.error);
}

export default {
  ejecutarTests,
  testDeteccion,
  casosDeteccion,
};
