/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  ShoppingBag,
  FileSpreadsheet,
  HelpCircle,
  Search,
  Instagram,
  Facebook,
  Mail,
  AlertCircle,
  Database,
  RefreshCw,
  X,
  Sparkles,
  Layers,
  Printer,
  ChevronRight,
  Info,
  Smartphone
} from "lucide-react";

import { Product, CartItem, SheetsConfig } from "./types";
import { fetchProductsFromSheets } from "./utils/sheets";
import { FALLBACK_PRODUCTS } from "./data/fallbackProducts";
import ProductCard from "./components/ProductCard";
import ProductDetailModal from "./components/ProductDetailModal";
import CartDrawer from "./components/CartDrawer";
import SheetsHelpModal from "./components/SheetsHelpModal";
import { RayzenLogo } from "./components/RayzenLogo";
import HeroSlider from "./components/HeroSlider";


export default function App() {
  // --- State Initialization ---
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sheets configuration (persisted in localStorage for convenience)
  const [sheetId, setSheetId] = useState(() => {
    return localStorage.getItem("rayzen3d_sheet_id") || "";
  });
  const [sheetName, setSheetName] = useState(() => {
    return localStorage.getItem("rayzen3d_sheet_name") || "";
  });
  const [isUsingFallback, setIsUsingFallback] = useState(() => {
    return !localStorage.getItem("rayzen3d_sheet_id");
  });

  // UI state toggles
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedColorFilter, setSelectedColorFilter] = useState("Todos");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState("Todo");

  // Admin Mode state to toggle developer/owner options from standard client view (persisted in localStorage)
  const [isAdminMode, setIsAdminMode] = useState(() => {
    return localStorage.getItem("rayzen3d_admin_mode") === "true";
  });

  const toggleAdminMode = () => {
    const nextMode = !isAdminMode;
    setIsAdminMode(nextMode);
    localStorage.setItem("rayzen3d_admin_mode", String(nextMode));
  };

  // Listen for secret query parameter "?admin=true" or "?admin=1" to unlock Admin Mode
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const adminParam = params.get("admin");
    if (adminParam !== null) {
      if (adminParam === "true" || adminParam === "1") {
        setIsAdminMode(true);
        localStorage.setItem("rayzen3d_admin_mode", "true");
      } else if (adminParam === "false" || adminParam === "0") {
        setIsAdminMode(false);
        localStorage.setItem("rayzen3d_admin_mode", "false");
      }
      // Clean up the URL parameter for a secure, pristine user experience
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, []);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("rayzen3d_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (err) {
        console.error("No se pudo cargar el carrito anterior");
      }
    }
  }, []);

  // Save cart changes to localStorage
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("rayzen3d_cart", JSON.stringify(newCart));
  };

  // Load products when sheetId changes or on startup
  useEffect(() => {
    async function loadProducts() {
      if (!sheetId.trim()) {
        setProducts(FALLBACK_PRODUCTS);
        setIsUsingFallback(true);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const fetched = await fetchProductsFromSheets(sheetId, sheetName);
        if (fetched.length === 0) {
          throw new Error("No se encontraron filas con productos válidos en la planilla.");
        }
        setProducts(fetched);
        setIsUsingFallback(false);
        setError(null);
      } catch (err: any) {
        console.error("gviz fetch error:", err);
        setError(err.message || "Error al leer los datos de Google Sheets.");
        // Fallback safety to keep UI functional
        setProducts(FALLBACK_PRODUCTS);
        setIsUsingFallback(true);
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, [sheetId, sheetName]);

  // Reset filters when the products catalog changes
  useEffect(() => {
    setSelectedColorFilter("Todos");
    setSelectedTypeFilter("Todo");
  }, [products]);

  // Handle Sheet Connection submission
  const handleConnectSheet = (e: React.FormEvent) => {
    e.preventDefault();
    const inputElement = document.getElementById("sheet-id-input") as HTMLInputElement;
    const nameElement = document.getElementById("sheet-name-input") as HTMLInputElement;
    const value = inputElement?.value.trim() || "";
    const nameValue = nameElement?.value.trim() || "";

    if (!value) {
      // Clear connection to restore fallback
      setSheetId("");
      setSheetName("");
      localStorage.removeItem("rayzen3d_sheet_id");
      localStorage.removeItem("rayzen3d_sheet_name");
      setIsUsingFallback(true);
      setError(null);
      return;
    }

    // Attempt to extract sheet ID in case they pasted the whole URL
    let extractedId = value;
    if (value.includes("/d/")) {
      const parts = value.split("/d/");
      if (parts[1]) {
        extractedId = parts[1].split("/")[0];
      }
    }

    setSheetId(extractedId);
    setSheetName(nameValue);
    localStorage.setItem("rayzen3d_sheet_id", extractedId);
    localStorage.setItem("rayzen3d_sheet_name", nameValue);
  };

  // Disconnect Sheet
  const handleResetToFallback = () => {
    setSheetId("");
    setSheetName("");
    localStorage.removeItem("rayzen3d_sheet_id");
    localStorage.removeItem("rayzen3d_sheet_name");
    setIsUsingFallback(true);
    setProducts(FALLBACK_PRODUCTS);
    setError(null);
  };

  // --- Cart Operations ---
  const handleAddToCart = (item: CartItem) => {
    const existingIndex = cart.findIndex(
      (c) =>
        c.product.id === item.product.id &&
        c.selectedColor === item.selectedColor &&
        c.selectedFilament === item.selectedFilament
    );

    let updatedCart = [...cart];
    if (existingIndex > -1) {
      updatedCart[existingIndex].quantity += item.quantity;
    } else {
      updatedCart.push(item);
    }
    saveCart(updatedCart);
  };

  const handleUpdateCartQuantity = (index: number, quantity: number) => {
    if (quantity < 1) return;
    const updatedCart = [...cart];
    updatedCart[index].quantity = quantity;
    saveCart(updatedCart);
  };

  const handleRemoveCartItem = (index: number) => {
    const updatedCart = cart.filter((_, idx) => idx !== index);
    saveCart(updatedCart);
  };

  const handleClearCart = () => {
    saveCart([]);
  };

  // --- Search and Filtering ---
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesColor =
      selectedColorFilter === "Todos" ||
      p.colors.some((c) => c.toLowerCase() === selectedColorFilter.toLowerCase());

    const matchesType =
      selectedTypeFilter === "Todo" ||
      (p.type &&
        p.type
          .split(",")
          .map((t) => t.trim().toLowerCase())
          .includes(selectedTypeFilter.toLowerCase()));

    return matchesSearch && matchesColor && matchesType;
  });

  // Calculate unique colors in currently loaded catalog for filtering
  const allUniqueColors = Array.from(
    new Set(products.flatMap((p) => p.colors))
  ).filter(Boolean);

  // Calculate unique categories (TIPO) in currently loaded catalog for filtering, splitting by comma and sorting "Otros" last
  const allUniqueTypes = Array.from(
    new Set(
      products.flatMap((p) => {
        const t = p.type || "Otros";
        return t.split(",").map((s) => s.trim());
      })
    )
  )
    .filter(Boolean)
    .sort((a, b) => {
      const strA = a as string;
      const strB = b as string;
      if (strA.toLowerCase() === "otros") return 1;
      if (strB.toLowerCase() === "otros") return -1;
      return strA.localeCompare(strB);
    }) as string[];

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div id="rayzen-app-root" className="min-h-screen bg-gray-50 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-950">

      {/* 1. Header & Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">

            {/* Logo */}
            <div className="flex items-center cursor-pointer select-none" onClick={() => window.location.reload()}>
              <RayzenLogo
                className="flex items-center gap-2.5 select-none hover:scale-[1.02] transition-transform duration-200"
                iconClassName="h-10 md:h-12 w-auto text-gray-950"
                textClassName="font-display font-black tracking-wider text-xl md:text-2xl text-gray-950"
              />
            </div>

            {/* Quick config and support triggers */}
            <div className="flex items-center gap-3">

              {/* Database quick guide trigger - Admin Mode only */}
              {isAdminMode && (
                <button
                  id="btn-trigger-help"
                  onClick={() => setIsHelpOpen(true)}
                  className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white hover:border-gray-900 px-4 py-2.5 text-xs font-bold text-gray-700 hover:text-black transition-all cursor-pointer"
                >
                  <HelpCircle size={15} className="text-indigo-500" />
                  <span className="hidden sm:inline">Guía Google Sheets</span>
                </button>
              )}

              {/* Shopping Bag Button */}
              <button
                id="btn-toggle-cart"
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:shadow-indigo-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <ShoppingBag size={16} />
                <span className="hidden xs:inline">Mi Carrito</span>
                {cartItemsCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-black text-white ring-2 ring-gray-950 animate-pulse">
                    {cartItemsCount}
                  </span>
                )}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* 2. Google Sheets Config Bar - Admin Mode only */}
      {isAdminMode && (
        <section className="bg-neutral-100/70 border-b border-neutral-200/50 py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">

              {/* Status indicators */}
              <div className="flex items-center gap-2 text-xs">
                <Database size={14} className={isUsingFallback ? "text-indigo-650" : "text-emerald-600"} />
                <span className="text-gray-500 font-medium">Base de Datos:</span>
                {isUsingFallback ? (
                  <span className="inline-flex items-center gap-1 font-bold text-indigo-700 bg-indigo-50 rounded-md px-2 py-0.5 shadow-3xs">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                    Catálogo Demo Activo
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md shadow-3xs truncate max-w-[180px] xs:max-w-[280px]">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Planilla Conectada ({sheetId.slice(0, 6)}...)
                  </span>
                )}

                {isLoading && (
                  <span className="flex items-center gap-1 text-gray-500 font-semibold animate-pulse ml-2">
                    <RefreshCw size={11} className="animate-spin" />
                    Sincronizando...
                  </span>
                )}
              </div>

              {/* Dynamic settings form */}
              <form id="sheets-connection-form" onSubmit={handleConnectSheet} className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <div className="flex gap-1.5 flex-1 md:flex-none">
                  <input
                    id="sheet-id-input"
                    type="text"
                    placeholder="Pegá tu Google Sheet URL o ID"
                    defaultValue={sheetId}
                    className="rounded-lg border border-gray-255 bg-white px-3 py-1.5 text-xs text-gray-705 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 min-w-0 flex-1 md:w-64"
                  />
                  <input
                    id="sheet-name-input"
                    type="text"
                    placeholder="Hoja (opcional)"
                    defaultValue={sheetName}
                    className="rounded-lg border border-gray-255 bg-white px-2 py-1.5 text-xs text-slate-700 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 w-24 hidden sm:block"
                    title="Nombre exacto de la pestaña secundario de tu hoja; si está en la primera, dejalo vacío."
                  />
                </div>

                <div className="flex gap-1">
                  <button
                    id="btn-submit-connect"
                    type="submit"
                    className="rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 cursor-pointer transition-colors"
                  >
                    Vincular
                  </button>

                  {!isUsingFallback && (
                    <button
                      id="btn-reset-demo"
                      type="button"
                      onClick={handleResetToFallback}
                      className="rounded-lg border border-gray-200 bg-white text-gray-400 hover:text-rose-600 hover:border-rose-200 px-2 py-1.5 text-xs transition-colors cursor-pointer"
                      title="Restaurar catálogo de demostración"
                    >
                      Desvincular
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Connection Error Notification */}
            {error && (
              <div id="sheets-connection-error-box" className="mt-2.5 flex items-start gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800">
                <AlertCircle size={15} className="text-rose-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-bold block text-rose-950 mb-0.5">Error al leer Google Sheets</span>
                  {error} <span className="font-bold underline cursor-pointer hover:text-rose-900 ml-1" onClick={() => setIsHelpOpen(true)}>¿Cómo se soluciona?</span>
                </div>
                <button id="btn-close-error" type="button" onClick={() => setError(null)} className="p-0.5 hover:bg-rose-100 rounded-md">
                  <X size={14} className="text-rose-600" />
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 3. Hero Showcase Slider */}
      <HeroSlider />

      {/* 4. Active Catalog Interface */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">

        {/* Dynamic Navigation Rails */}
        <div id="catalog-controls" className="mb-8 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
              Productos Disponibles
              <span className="rounded-full bg-gray-100 text-gray-600 px-2.5 py-0.5 text-xs font-mono font-bold">
                {filteredProducts.length}
              </span>
            </h2>
            <p className="text-xs text-gray-400">Hace click en cualquier modelo para ver colores, demoras y ordenar.</p>
          </div>

          {/* Search bar inside header rails */}
          <div className="flex flex-col sm:flex-row gap-2.5 min-w-0 md:w-[60%]">

            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
              <input
                id="catalog-search-field"
                type="text"
                placeholder="Buscar por nombre, dragón, soporte, etc..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm text-gray-700 outline-hidden transition-all focus:border-indigo-505 focus:ring-4 focus:ring-indigo-50"
              />
              {searchQuery && (
                <button
                  id="btn-clear-search"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Colors filters list listbox */}
            {allUniqueColors.length > 0 && (
              <div className="flex-shrink-0">
                <select
                  id="color-filter-select"
                  value={selectedColorFilter}
                  onChange={(e) => setSelectedColorFilter(e.target.value)}
                  className="w-full sm:w-auto rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 font-medium font-sans outline-hidden focus:border-indigo-500 cursor-pointer"
                >
                  <option value="Todos">Colores: Todos ({allUniqueColors.length})</option>
                  {allUniqueColors.map((color) => (
                    <option key={color} value={color}>
                      Filamento: {color}
                    </option>
                  ))}
                </select>
              </div>
            )}

          </div>
        </div>

        {/* Warning notification about fallbacks - Admin Mode only */}
        {isAdminMode && isUsingFallback && !error && (
          <div id="demo-notification" className="mb-6 rounded-2xl bg-indigo-50/50 border border-indigo-100/50 p-4 flex items-center md:items-start gap-3.5 text-xs leading-relaxed text-indigo-950">
            <Info size={18} className="text-indigo-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold text-sm text-indigo-950 block mb-0.5">💡 Catálogo interactivo de demostración</span>
              Estás visualizando nuestro catálogo precargado para conocer los detalles visuales. Podés conectar tu propia hoja de cálculo de Google Sheets ingresando el enlace en la cabecera. Es inmediato y gratis.
            </div>
            <button
              id="btn-demo-how-to"
              onClick={() => setIsHelpOpen(true)}
              className="hidden md:block rounded-xl bg-indigo-650 text-white px-4 py-2 font-bold hover:bg-indigo-700 text-xs shadow-xs flex-shrink-0 cursor-pointer"
            >
              Cómo Conectar
            </button>
          </div>
        )}

        {/* Responsive Grid Layout: Left Sidebar + Right Catalog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
          
          {/* Category Filter Panel (Left Sidebar on desktop, horizontal scroll on mobile) */}
          <div className="md:col-span-1">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs md:sticky md:top-24">
              <h3 className="hidden md:block text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
                Categorías
              </h3>
              <div className="flex md:flex-col gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none snap-x">
                {/* "todo" pill */}
                <button
                  id="type-pill-todo"
                  onClick={() => setSelectedTypeFilter("Todo")}
                  className={`flex-shrink-0 snap-start flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all duration-200 text-left w-auto md:w-full cursor-pointer ${
                    selectedTypeFilter === "Todo"
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10 scale-102"
                      : "border border-gray-100 bg-white text-gray-700 hover:border-gray-300 hover:text-black md:border-0"
                  }`}
                >
                  <span>Todo</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold font-mono ${
                    selectedTypeFilter === "Todo" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                  }`}>
                    {products.length}
                  </span>
                </button>

                {/* Unique category types */}
                {allUniqueTypes.map((type) => {
                  const count = products.filter((p) => {
                    const productTypes = (p.type || "Otros")
                      .split(",")
                      .map((t) => t.trim().toLowerCase());
                    return productTypes.includes(type.toLowerCase());
                  }).length;
                  return (
                    <button
                      key={type}
                      id={`type-pill-${type.replace(/\s+/g, "-")}`}
                      onClick={() => setSelectedTypeFilter(type)}
                      className={`flex-shrink-0 snap-start flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all duration-200 text-left w-auto md:w-full cursor-pointer ${
                        selectedTypeFilter.toLowerCase() === type.toLowerCase()
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10 scale-102"
                          : "border border-gray-100 bg-white text-gray-700 hover:border-gray-300 hover:text-black md:border-0"
                      }`}
                    >
                      <span>{type}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold font-mono ${
                        selectedTypeFilter.toLowerCase() === type.toLowerCase() ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Product Grid Area */}
          <div className="md:col-span-3 w-full">
            {/* Catalog Grid View */}
            {isLoading ? (
              <div id="grid-loading-skeletons" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((num) => (
                  <div key={num} className="rounded-2xl border border-gray-100 bg-white p-5 animate-pulse space-y-4">
                    <div className="aspect-square bg-gray-100 rounded-xl w-full" />
                    <div className="h-6 bg-gray-100 rounded-md w-[80%]" />
                    <div className="h-4 bg-gray-100 rounded-md w-[50%]" />
                    <div className="h-10 bg-gray-100 rounded-md w-full pt-4" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div id="products-catalog-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onViewDetails={(prod) => setSelectedProduct(prod)}
                  />
                ))}
              </div>
            ) : (
              <div id="no-matching-products" className="rounded-3xl border border-dashed border-gray-200 bg-white text-center py-16 px-4">
                <Search size={40} className="text-gray-350 mx-auto stroke-1.5 mb-3" />
                <h3 className="text-lg font-bold text-gray-800">No se encontraron productos</h3>
                <p className="text-sm text-gray-400 mt-1 max-w-md mx-auto">
                  Prueba modificando los términos de búsqueda o filtros de categorías/colores.
                </p>
                <button
                  id="btn-clear-all-search-filters"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedColorFilter("Todos");
                    setSelectedTypeFilter("Todo");
                  }}
                  className="mt-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white px-5 py-2.5 transition-colors cursor-pointer"
                >
                  Limpiar Filtros
                </button>
              </div>
            )}
          </div>
        </div>

      </main>

      {/* 5. Support Modals and Cart Panels */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
      />

      <SheetsHelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      {/* 6. Footer (Sections de Contacto) */}
      <footer id="rayzen-footer" className="bg-gray-900 text-gray-300 border-t border-gray-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-gray-800 pb-12 mb-12">

            {/* Branding Column */}
            <div className="space-y-3">
              <span className="flex items-center">
                <RayzenLogo
                  className="flex items-center gap-2 select-none"
                  iconClassName="h-8 md:h-9 w-auto text-white"
                  textClassName="font-display font-black tracking-wider text-lg md:text-xl text-white"
                />
              </span>
              <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
                Fabricamos tus archivos .STL y .3MF con altísima fidelidad y rigidez mecánica. Oficinas físicas en Argentina con envíos a todo el territorio nacional.
              </p>
            </div>

            {/* Aesthetic Contact Coordinates */}
            <div className="space-y-4">
              <h4 className="font-display text-lg font-bold text-white uppercase tracking-wider">Contacto Directo</h4>
              <div className="space-y-2.5 text-sm">
                <a
                  id="link-footer-mailto"
                  href="mailto:rayzen3d.arg@gmail.com"
                  className="flex items-center gap-2 text-gray-400 hover:text-indigo-400 transition-colors"
                >
                  <Mail size={16} className="text-indigo-500" />
                  <span>rayzen3d.arg@gmail.com</span>
                </a>
                <div className="flex items-center gap-2 text-gray-400">
                  <Smartphone size={16} className="text-indigo-500" />
                  <span>+54 9 3471 588444</span>
                </div>
              </div>
            </div>

            {/* Redes Sociales Coordinates */}
            <div className="space-y-4">
              <h4 className="font-display text-lg font-bold text-white uppercase tracking-wider">Seguinos en Redes</h4>
              <p className="text-xs text-gray-400 max-w-xs">
                ¡Mirá nuestros videos e historias de producción diaria, nuevos lanzamientos y sorteos!
              </p>
              <div className="flex gap-3">
                <a
                  id="link-footer-instagram"
                  href="https://www.instagram.com/rayzen3d/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-800 border border-gray-700 hover:bg-indigo-650 hover:border-indigo-500 hover:text-white text-gray-300 transition-all shadow-md cursor-pointer"
                  title="Síguenos en Instagram"
                >
                  <Instagram size={18} />
                </a>
                <a
                  id="link-footer-facebook"
                  href="https://www.facebook.com/Rayzen3d"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-800 border border-gray-700 hover:bg-indigo-650 hover:border-indigo-500 hover:text-white text-gray-300 transition-all shadow-md cursor-pointer"
                  title="Síguenos en Facebook"
                >
                  <Facebook size={18} />
                </a>
              </div>
            </div>

          </div>

          {/* Legal / Copyright disclaimer */}
          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
            <p>© {new Date().getFullYear()} Rayzen 3D. Todos los derechos reservados. Hecho en Argentina.</p>
            <div className="flex items-center gap-4">
              {isAdminMode && (
                <>
                  <span className="cursor-pointer hover:text-white transition-colors" onClick={() => setIsHelpOpen(true)}>Manual de Google Sheets</span>
                  <span>•</span>
                  <button
                    id="btn-toggle-admin-mode"
                    onClick={toggleAdminMode}
                    className="inline-flex items-center gap-1 cursor-pointer font-semibold transition-colors text-indigo-400 hover:text-indigo-300 focus:outline-hidden"
                  >
                    <Database size={12} />
                    <span>Salir de Admin</span>
                  </button>
                  <span>•</span>
                </>
              )}
              <span className="text-gray-650">FDM Precision Printing</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
