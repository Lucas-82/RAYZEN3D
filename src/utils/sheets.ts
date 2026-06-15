/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product } from "../types";

/**
 * Fetches and parses a public Google Sheet using the Google Visualization API.
 * This method is completely free, does not expose secret keys, and supports instant updates.
 *
 * @param sheetId The 44-character unique identifier of the Google Sheet (from its URL)
 * @param sheetName Optional name of the tab (defaults to first tab if empty)
 * @returns An array of Product objects
 */
export async function fetchProductsFromSheets(
  sheetId: string,
  sheetName: string = ""
): Promise<Product[]> {
  const cleanId = sheetId.trim();
  if (!cleanId) {
    throw new Error("El ID de la planilla está vacío.");
  }

  // Construct URL. We append sheet name as 'sheet' parameter if specified
  let url = `https://docs.google.com/spreadsheets/d/${cleanId}/gviz/tq?tqx=out:json`;
  if (sheetName.trim()) {
    url += `&sheet=${encodeURIComponent(sheetName.trim())}`;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error al conectar con Google Sheets (Status: ${response.status})`);
  }

  const text = await response.text();

  // The Visualization API returns a JSON wrapped inside a JS callback:
  // google.visualization.Query.setResponse({ ... });
  const regex = /google\.visualization\.Query\.setResponse\(([\s\S]*)\);?/;
  const match = text.match(regex);

  if (!match) {
    throw new Error(
      "No se pudo descifrar la respuesta de Google Sheets. Aseguráte de que el enlace de la planilla tiene configurado el acceso 'Cualquier persona con el enlace puede ver'."
    );
  }

  let jsonData;
  try {
    jsonData = JSON.parse(match[1]);
  } catch (err) {
    throw new Error("Error al analizar el formato devuelto por Google Sheets.");
  }

  if (jsonData.status === "error") {
    const errorMsg = jsonData.errors?.[0]?.detailed_message || jsonData.errors?.[0]?.message || "Error desconocido.";
    throw new Error(`Google Sheets reportó un error: ${errorMsg}`);
  }

  const table = jsonData.table;
  if (!table || !table.rows) {
    throw new Error("La planilla no contiene filas o datos válidos.");
  }

  const parsedProducts: Product[] = [];

  for (const row of table.rows) {
    // If the entire row is empty or has no columns return
    if (!row.c || row.c.length === 0) continue;

    // Safely extract values checking for null cells
    const getVal = (index: number): any => {
      const cell = row.c[index];
      return cell ? cell.v : null;
    };

    // Columns:
    // 0: ID
    // 1: Título
    // 2: Descripción
    // 3: URL_Fotos
    // 4: Colores
    // 5: Stock
    // 6: Precio por unidad

    const rawId = getVal(0);
    const title = getVal(1);

    // If there is no title or no ID, skip row (could be header or blank line)
    if (title === null || title === undefined || String(title).trim() === "" || title === "Título") {
      continue;
    }

    const id = rawId !== null ? String(rawId).trim() : Math.random().toString(36).substr(2, 9);
    const description = getVal(2) !== null ? String(getVal(2)).trim() : "";

    // URL_Fotos (comma-separated if multiple, fallback to high-quality placeholder)
    const rawPhotos = getVal(3);
    let images: string[] = [];
    if (rawPhotos !== null && String(rawPhotos).trim() !== "") {
      images = String(rawPhotos)
        .split(",")
        .map((url) => {
          const trimmed = url.trim();
          // Convert Google Drive sharing links to direct embeddable links
          if (trimmed.includes("drive.google.com") || trimmed.includes("docs.google.com")) {
            let fileId = "";
            const fileDMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
            if (fileDMatch && fileDMatch[1]) {
              fileId = fileDMatch[1];
            } else {
              const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
              if (idMatch && idMatch[1]) {
                fileId = idMatch[1];
              }
            }
            if (fileId) {
              return `https://lh3.googleusercontent.com/d/${fileId}`;
            }
          }
          return trimmed;
        })
        .filter((url) => url.startsWith("http") || url.startsWith("https"));
    }
    // Fallback if no valid images are specified
    if (images.length === 0) {
      images = ["https://images.unsplash.com/photo-1615840287214-7fe58a8f3685?auto=format&fit=crop&w=800&q=80"];
    }

    // Colores (either "todos" to load all, or empty/anything else for "Estándar")
    const rawColors = getVal(4);
    let colors: string[] = ["Estándar"];
    if (rawColors !== null && String(rawColors).trim() !== "") {
      const trimmedVal = String(rawColors).trim().toLowerCase();
      if (trimmedVal === "todos") {
        colors = [
          "Negro",
          "Blanco",
          "Rojo",
          "Amarillo",
          "Azul",
          "Naranja",
          "Verde",
          "Violeta",
          "Gris",
          "Marrón",
          "Rosa",
          "Turquesa",
          "Celeste",
          "Oro",
          "Plata",
          "Beige",
          "Crema",
          "Lila",
          "Otro",
        ];
      }
    }

    // Stock ("SI" or "NO")
    const rawStock = getVal(5);
    const stockStr = rawStock !== null ? String(rawStock).trim().toUpperCase() : "SI";
    const stock = stockStr === "SI" || stockStr === "SÍ" || stockStr === "YES" || stockStr === "TRUE";

    // Precio por unidad
    const rawPrice = getVal(6);
    let price = 0;
    if (rawPrice !== null) {
      // Handles numeric or formatted prices
      price = Number(rawPrice);
      if (isNaN(price)) {
        // Strip non-numbers if it has currency signs
        const cleaned = String(rawPrice).replace(/[^0-9.-]+/g, "");
        price = parseFloat(cleaned) || 0;
      }
    }

    // TIPO (Category, e.g. Veladores, llaveros, etc.)
    const rawType = getVal(7);
    let type = "Otros";
    if (rawType !== null && String(rawType).trim() !== "") {
      const trimmed = String(rawType).trim();
      type = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    }

    parsedProducts.push({
      id,
      title: String(title).trim(),
      description,
      images,
      colors,
      stock,
      price,
      type,
    });
  }

  return parsedProducts;
}
