/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product } from "../types";

export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "1",
    title: "Dragón Articulado Imperial",
    description: "Impresionante dragón de fantasía con articulaciones fluidas en cada vértebra. Perfecto como objeto de decoración, antiestrés o regalo de colección. Impreso en alta definición con filamento PLA de primera calidad.",
    images: [
      "https://images.unsplash.com/photo-1608156639585-b3a032ef9689?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80"
    ],
    colors: ["Rojo Fuego", "Seda Oro", "Negro Mate", "Fluorescente"],
    stock: true,
    price: 4500,
    type: "Coleccionables"
  },
  {
    id: "2",
    title: "Maceta Geométrica Low-Poly",
    description: "Macetero moderno de diseño geométrico facetado de estilo escandinavo. Ideal de adorno para suculentas o plantas pequeñas. Cuenta con orificio de drenaje integrado.",
    images: [
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80"
    ],
    colors: ["Blanco Puro", "Gris Mármol", "Verde Oliva", "Pastel Rosa"],
    stock: true,
    price: 1800,
    type: "Decoración"
  },
  {
    id: "3",
    title: "Soporte de Escritorio Calavera",
    description: "Soporte multifunción premium con forma de calavera esculpida en 3D. Excelente para colocar auriculares de vincha, tarjetas de visita o simplemente lucir increíble en tu escritorio setup gamer.",
    images: [
      "https://images.unsplash.com/photo-1615840287214-7fe58a8f3685?auto=format&fit=crop&w=800&q=80"
    ],
    colors: ["Hueso Real", "Negro Absoluto", "Oro Viejo"],
    stock: false, // "NO" in sheet
    price: 3200,
    type: "Adornos"
  },
  {
    id: "4",
    title: "Soporte Plegable para Celular",
    description: "Soporte para celular y tablet con inclinación regulable y diseño compacto ultraportátil. Cabe en tu billetera o bolsillo. Ofrece máxima estabilidad para llamadas de video y consumo de contenido.",
    images: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80"
    ],
    colors: ["Negro", "Azul Eléctrico", "Amarillo Neón"],
    stock: true,
    price: 1200,
    type: "Accesorios"
  },
  {
    id: "5",
    title: "Organizador de Cables Wave",
    description: "Práctico organizador con sujeción flexible tipo onda para sujetar y peinar hasta 5 cables USB en tu escritorio. Evita enredos y caídas incómodas al suelo.",
    images: [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80"
    ],
    colors: ["Gris Oscuro", "Blanco", "Celeste Pastel"],
    stock: true,
    price: 900,
    type: "Accesorios"
  }
];
