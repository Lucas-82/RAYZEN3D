/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  title: string;
  description: string;
  images: string[];
  colors: string[];
  stock: boolean; // true if "SI", false if "NO" or other
  price: number;
  type?: string;
}

export interface CartItem {
  product: Product;
  selectedColor: string;
  selectedFilament?: string;
  quantity: number;
}

export interface SheetsConfig {
  sheetId: string;
  sheetName: string;
  isFallback: boolean;
}
