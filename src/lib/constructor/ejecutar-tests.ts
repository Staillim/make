/**
 * Script para ejecutar tests del detector
 * node ejecutarTests.js o tsx ejecutar-tests.ts
 */

import { detectarTipoNegocio, validarTipoIndustria, obtenerCategoriasSugeridas } from './detector';

const casosDeteccion = [
  {
    descripcion: "Quiero vender hamburguesas y papas fritas con delivery",
    esperado: { tipo: "restaurante", confianzaMinima: 70 },
  },
  {
    descripcion: "Tienda de ropa urbana para jóvenes, camisetas y jeans",
    esperado: { tipo: "tienda_ropa", confianzaMinima: 70 },
  },
  {
    descripcion: "Vendo laptops, celulares y accesorios tecnológicos",
    esperado: { tipo: "tecnologia", confianzaMinima: 80 },
  },
  {
    descripcion: "Gimnasio con clases de spinning, yoga y entrenamiento funcional",
    esperado: { tipo: "gimnasio", confianzaMinima: 75 },
  },
  {
    descripcion: "Cursos online de programación, diseño web y marketing digital",
    esperado: { tipo: "educacion", confianzaMinima: 70 },
  },
  {
    descripcion: "Consultoría de marketing digital y manejo de redes sociales",
    esperado: { tipo: "servicios", confianzaMinima: 65 },
  },
  {
    descripcion: "Pizza italiana artesanal a domicilio",
    esperado: { tipo: "restaurante", confianzaMinima: 80 },
  },
  {
    descripcion: "Zapatos deportivos y tenis para running",
    esperado: { tipo: "tienda_ropa", confianzaMinima: 70 },
  },
  {
    descripcion: "Audífonos gaming y teclados mecánicos",
    esperado: { tipo: "tecnologia", confianzaMinima: 75 },
  },
  {
    descripcion: "Membresías de gym con coach personal",
    esperado: { tipo: "gimnasio", confianzaMinima: 80 },
  },
  {
    descripcion: "Academia de inglés online para niños",
    esperado: { tipo: "educacion", confianzaMinima: 75 },
  },
  {
    descripcion: "Diseño de páginas web y desarrollo de apps",
    esperado: { tipo: "servicios", confianzaMinima: 70 },
  },
  {
    descripcion: "Vendo cosas", // Caso ambiguo
    esperado: { tipo: "otro", confianzaMinima: 0 },
  },
];

async function ejecutarTests() {
  console.log("🧪 EJECUTANDO TESTS DEL DETECTOR DE INDUSTRIA\n");
  console.log("═".repeat(70));
  
  let testsPasados = 0;
  let testsFallidos = 0;
  
  for (let i = 0; i < casosDeteccion.length; i++) {
    const caso = casosDeteccion[i];
    const numero = `Test ${i + 1}`.padEnd(8);
    
    try {
      console.log(`\n${numero} | Descripción: "${caso.descripcion}"`);
      
      // Ejecutar detección
      const resultado = await detectarTipoNegocio(caso.descripcion, {
        incluirRazonamiento: true,
        incluirSugerencias: true,
        umbralConfianza: 30 // Bajo para testing
      });
      
      console.log(`         | Detectado: ${resultado.tipo} (confianza: ${resultado.confianza}%)`);
      console.log(`         | Esperado: ${caso.esperado.tipo} (confianza mín: ${caso.esperado.confianzaMinima}%)`);
      
      // Validar
      const tipoMatch = resultado.tipo === caso.esperado.tipo;
      const confianzaMatch = resultado.confianza >= caso.esperado.confianzaMinima;
      
      if (tipoMatch && confianzaMatch) {
        console.log(`         | ✅ PASS`);
        testsPasados++;
      } else {
        console.log(`         | ❌ FAIL`);
        if (!tipoMatch) console.log(`         |    - Tipo no coincide`);
        if (!confianzaMatch) console.log(`         |    - Confianza muy baja`);
        testsFallidos++;
      }
      
      // Mostrar info adicional
      if (resultado.razonamiento) {
        console.log(`         | 💡 Razonamiento: ${resultado.razonamiento}`);
      }
      if (resultado.categorias_sugeridas && resultado.categorias_sugeridas.length > 0) {
        console.log(`         | 📦 Categorías sugeridas: ${resultado.categorias_sugeridas.join(", ")}`);
      }
      if (resultado.tipo_producto) {
        console.log(`         | 🎁 Tipo producto: ${resultado.tipo_producto}`);
      }
      if (resultado.alcance_sugerido) {
        console.log(`         | 🌍 Alcance: ${resultado.alcance_sugerido}`);
      }
      
    } catch (error) {
      console.log(`         | ❌ ERROR: ${error}`);
      testsFallidos++;
    }
  }
  
  // Resumen final
  console.log("\n" + "═".repeat(70));
  console.log("\n📊 RESUMEN DE TESTS\n");
  console.log(`   Total: ${casosDeteccion.length}`);
  console.log(`   ✅ Pasados: ${testsPasados} (${Math.round(testsPasados / casosDeteccion.length * 100)}%)`);
  console.log(`   ❌ Fallidos: ${testsFallidos} (${Math.round(testsFallidos / casosDeteccion.length * 100)}%)`);
  
  if (testsFallidos === 0) {
    console.log("\n🎉 TODOS LOS TESTS PASARON!");
  } else {
    console.log(`\n⚠️  ${testsFallidos} test(s) fallaron. Revisar arriba para detalles.`);
  }
  
  console.log("\n" + "═".repeat(70));
  
  // Test de funciones utilitarias
  console.log("\n🔧 TESTS DE UTILIDADES\n");
  
  // Test validarTipoIndustria
  console.log("validarTipoIndustria('restaurante'):", validarTipoIndustria('restaurante'));
  console.log("validarTipoIndustria('TIENDA ROPA'):", validarTipoIndustria('TIENDA ROPA'));
  console.log("validarTipoIndustria('invalido'):", validarTipoIndustria('invalido'));
  
  // Test obtenerCategoriasSugeridas
  console.log("\nobtenerCategoriasSugeridas('restaurante'):", obtenerCategoriasSugeridas('restaurante'));
  console.log("obtenerCategoriasSugeridas('tecnologia'):", obtenerCategoriasSugeridas('tecnologia'));
  console.log("obtenerCategoriasSugeridas('otro'):", obtenerCategoriasSugeridas('otro'));
  
  console.log("\n" + "═".repeat(70));
  
  // Salir con código apropiado
  process.exit(testsFallidos === 0 ? 0 : 1);
}

// Ejecutar tests
ejecutarTests().catch((error) => {
  console.error("\n❌ ERROR FATAL ejecutando tests:", error);
  process.exit(1);
});
