/**
 * Ejemplo de Uso: Inyección de Catálogo en Agentes Vendedores
 * 
 * Este archivo demuestra cómo usar la funcionalidad de catálogo
 * para que los agentes conozcan exactamente qué venden.
 */

import {
  obtenerPromptConCatalogo,
  Producto,
} from "./index";

// ============================================================================
// EJEMPLO 1: Restaurante con productos disponibles y no disponibles
// ============================================================================

const productosRestaurante: Producto[] = [
  {
    id: "h1",
    nombre: "Hamburguesa Clásica",
    descripcion: "Carne 100% res, queso cheddar, lechuga, tomate",
    precio: 12.99,
    categoria: "Hamburguesas",
    disponible: true,
  },
  {
    id: "h2",
    nombre: "Hamburguesa BBQ",
    descripcion: "Carne, tocineta, cebolla caramelizada, salsa BBQ",
    precio: 14.99,
    categoria: "Hamburguesas",
    disponible: true,
  },
  {
    id: "p1",
    nombre: "Pizza Margherita",
    descripcion: "Salsa de tomate, mozzarella, albahaca fresca",
    precio: 15.99,
    categoria: "Pizzas",
    disponible: false, // ❌ Agotada
  },
  {
    id: "b1",
    nombre: "Coca-Cola 500ml",
    precio: 2.50,
    categoria: "Bebidas",
    disponible: true,
  },
  {
    id: "b2",
    nombre: "Limonada Natural",
    precio: 3.00,
    categoria: "Bebidas",
    disponible: true,
  },
];

console.log("=== EJEMPLO 1: RESTAURANTE ===\n");
const promptRestaurante = obtenerPromptConCatalogo("restaurante", productosRestaurante);
console.log(promptRestaurante.substring(0, 800) + "...\n");

// ============================================================================
// EJEMPLO 2: Tienda de Tecnología con variantes
// ============================================================================

const productosTech: Producto[] = [
  {
    id: "laptop-01",
    nombre: "MacBook Air M2",
    descripcion: "Chip M2, 8GB RAM, 256GB SSD",
    precio: 1199.99,
    categoria: "Laptops",
    disponible: true,
    variantes: {
      ram: ["8GB", "16GB"],
      almacenamiento: ["256GB", "512GB"],
      colores: ["Gris espacial", "Plata"],
    },
  },
  {
    id: "phone-01",
    nombre: "iPhone 15 Pro",
    descripcion: "A17 Pro, cámara 48MP, Titanio",
    precio: 999.99,
    categoria: "Smartphones",
    disponible: true,
    variantes: {
      almacenamiento: ["128GB", "256GB", "512GB"],
      colores: ["Titanio natural", "Azul titanio", "Negro titanio"],
    },
  },
  {
    id: "tablet-01",
    nombre: "iPad Pro 11\"",
    precio: 799.99,
    categoria: "Tablets",
    disponible: false, // ❌ No disponible
  },
];

console.log("=== EJEMPLO 2: TECNOLOGÍA ===\n");
const promptTech = obtenerPromptConCatalogo("tecnologia", productosTech);
console.log(promptTech.substring(0, 800) + "...\n");

// ============================================================================
// EJEMPLO 3: Gimnasio (servicios en lugar de productos)
// ============================================================================

const serviciosGym: Producto[] = [
  {
    id: "memb-basica",
    nombre: "Membresía Básica",
    descripcion: "Acceso al gimnasio 24/7, uso de equipos",
    precio: 49.99,
    categoria: "Membresías",
    disponible: true,
  },
  {
    id: "memb-premium",
    nombre: "Membresía Premium",
    descripcion: "Básica + Clases grupales + Zona funcional",
    precio: 79.99,
    categoria: "Membresías",
    disponible: true,
  },
  {
    id: "clase-yoga",
    nombre: "Clases de Yoga",
    descripcion: "Lunes, Miércoles y Viernes 6:00 PM",
    precio: 15.00,
    categoria: "Clases",
    disponible: true,
  },
  {
    id: "clase-spinning",
    nombre: "Clases de Spinning",
    descripcion: "Martes y Jueves 7:00 AM",
    precio: 15.00,
    categoria: "Clases",
    disponible: false, // ❌ Cupo lleno
  },
  {
    id: "pt-sesion",
    nombre: "Sesión Personal Training",
    descripcion: "Entrenamiento 1-a-1 con coach certificado (1 hora)",
    precio: 50.00,
    categoria: "Servicios Adicionales",
    disponible: true,
  },
];

console.log("=== EJEMPLO 3: GIMNASIO ===\n");
const promptGym = obtenerPromptConCatalogo("gimnasio", serviciosGym);
console.log(promptGym.substring(0, 800) + "...\n");

// ============================================================================
// EJEMPLO 4: Catálogo vacío (negocio nuevo)
// ============================================================================

const productoVacio: Producto[] = [];

console.log("=== EJEMPLO 4: CATÁLOGO VACÍO ===\n");
const promptVacio = obtenerPromptConCatalogo("tienda_ropa", productoVacio);
console.log(promptVacio.substring(0, 600) + "...\n");

// ============================================================================
// EJEMPLO 5: Simulación de conversación con catálogo
// ============================================================================

console.log("=== EJEMPLO 5: CONVERSACIÓN SIMULADA ===\n");

const conversacion = [
  {
    cliente: "Hola, ¿tienen hamburguesas?",
    contexto: "Restaurante con catálogo [productosRestaurante]",
    respuestaEsperada:
      "Sí! Tengo la Hamburguesa Clásica o la BBQ que están deliciosas 🍔",
  },
  {
    cliente: "¿Y pizzas?",
    contexto: "Restaurante con catálogo [productosRestaurante]",
    respuestaEsperada:
      "Lamentablemente la Pizza Margherita no está disponible hoy 😔 Pero las hamburguesas son increíbles!",
  },
  {
    cliente: "¿Tienen laptops?",
    contexto: "Restaurante con catálogo [productosRestaurante]",
    respuestaEsperada:
      "Jaja, somos un restaurante no una tienda de tecnología 😅 ¿Te provoca una hamburguesa o algo de comer?",
  },
  {
    cliente: "Dame una hamburguesa",
    contexto: "Tienda de tecnología con catálogo [productosTech]",
    respuestaEsperada:
      "Jaja, me encantaría ayudarte pero vendemos tecnología 😅 ¿Buscas una laptop, smartphone o tablet?",
  },
];

conversacion.forEach((conv, i) => {
  console.log(`${i + 1}. Cliente: "${conv.cliente}"`);
  console.log(`   Contexto: ${conv.contexto}`);
  console.log(`   Respuesta esperada: "${conv.respuestaEsperada}"\n`);
});

// ============================================================================
// SALIDA DE EJEMPLO
// ============================================================================

console.log("=== RESUMEN ===\n");
console.log("✅ Los agentes CONOCEN su catálogo");
console.log("✅ No inventan productos que no existen");
console.log("✅ Redirigen amablemente cuando piden algo no disponible");
console.log("✅ Respetan el campo 'disponible' (no ofrecen productos agotados)");
console.log("✅ Manejan categorías, precios y variantes");
console.log("\n🎯 Esto soluciona el problema de que Alex (tech) ofreciera hamburguesas!");

/**
 * Para ejecutar este ejemplo:
 * 
 * $ npx tsx src/lib/templates/vendedor/ejemplo-catalogo.ts
 * 
 * O importar las funciones en tu API route:
 * 
 * import { obtenerPromptConCatalogo, Producto } from '@/lib/templates/vendedor';
 */
