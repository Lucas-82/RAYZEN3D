/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ShoppingBag, Clock, Check, ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react";
import { Product, CartItem } from "../types";

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
}

const getColorStyle = (colorName: string, isSelected: boolean) => {
  const name = colorName.trim().toLowerCase();
  
  // Define default values
  let background = "";
  let textColor = "#ffffff";
  let border = "border-transparent";
  let textShadow = "0 1px 2px rgba(0, 0, 0, 0.5)";

  switch (name) {
    case "negro":
      background = "#18181b"; // zinc-900 black
      border = "border-zinc-900";
      break;
    case "blanco":
      background = "#ffffff";
      textColor = "#18181b";
      border = "border-gray-200";
      textShadow = "none";
      break;
    case "rojo":
      background = "#dc2626"; // Red 600
      border = "border-red-700";
      break;
    case "amarillo":
      background = "#ca8a04"; // Yellow 600
      border = "border-yellow-700";
      break;
    case "azul":
      background = "#1d4ed8"; // Blue 700
      border = "border-blue-800";
      break;
    case "naranja":
      background = "#ea580c"; // Orange 600
      border = "border-orange-700";
      break;
    case "verde":
      background = "#15803d"; // Green 700
      border = "border-green-800";
      break;
    case "violeta":
      background = "#6d28d9"; // Violet 700
      border = "border-violet-800";
      break;
    case "gris":
      background = "#4b5563"; // Gray 600
      border = "border-gray-700";
      break;
    case "marrón":
    case "marron":
      background = "#78350f"; // Amber/brown 900
      border = "border-amber-950";
      break;
    case "rosa":
      background = "#db2777"; // Pink 600
      border = "border-pink-700";
      break;
    case "turquesa":
      background = "#0f766e"; // Teal 700
      border = "border-teal-800";
      break;
    case "celeste":
      background = "#0284c7"; // Sky 600
      border = "border-sky-700";
      break;
    case "oro":
      background = "linear-gradient(135deg, #d97706 0%, #f59e0b 50%, #b45309 100%)";
      border = "border-amber-700";
      break;
    case "plata":
      background = "linear-gradient(135deg, #94a3b8 0%, #cbd5e1 50%, #64748b 100%)";
      border = "border-slate-400";
      break;
    case "beige":
      background = "#b49b85"; // beige
      border = "border-amber-800/20";
      break;
    case "crema":
      background = "#fdf5e6"; // Cream
      textColor = "#4a3b32"; // Dark warm brown text
      border = "border-amber-200";
      textShadow = "none";
      break;
    case "lila":
      background = "#a78bfa"; // Violet 400
      border = "border-violet-500";
      break;
    case "otro":
      background = "linear-gradient(135deg, #ff007f 0%, #7f00ff 50%, #00ffff 100%)";
      border = "border-purple-500/30";
      break;
    case "estándar":
    case "estandar":
    default:
      background = "#18181b"; // Default dark gray
      border = "border-zinc-900";
      break;
  }

  // Ring styling and scaling for selected pills, smooth hover effect
  const selectionClasses = isSelected
    ? "ring-4 ring-indigo-500 ring-offset-1 scale-105 shadow-md z-10"
    : "hover:scale-102 hover:shadow-xs active:scale-98 cursor-pointer";

  return {
    style: {
      background,
      color: textColor,
      textShadow,
    },
    className: `${border} ${selectionClasses} font-bold transition-all duration-200`,
  };
};

export default function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
}: ProductDetailModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedFilament, setSelectedFilament] = useState("PLA");
  const [customFilament, setCustomFilament] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  // Reset local adjustments if the product changes
  useEffect(() => {
    if (product) {
      setActiveImageIndex(0);
      setSelectedColor(product.colors[0] || "");
      setSelectedFilament("PLA");
      setCustomFilament("");
      setQuantity(1);
      setIsAdded(false);
    }
  }, [product]);

  if (!product) return null;

  const handleAddToCart = () => {
    const finalFilament =
      selectedFilament === "OTRO"
        ? `Otro: ${customFilament.trim() || "No especificado"}`
        : selectedFilament;

    onAddToCart({
      product,
      selectedColor,
      selectedFilament: finalFilament,
      quantity,
    });
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1200);
  };

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          id="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-xs"
          onClick={onClose}
        />

        {/* Modal body container */}
        <motion.div
          id="modal-container"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
          className="relative z-10 w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl md:grid md:grid-cols-2 max-h-[90vh] md:max-h-none overflow-y-auto"
        >
          {/* Close button */}
          <button
            id="btn-close-modal"
            onClick={onClose}
            className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 border border-gray-100 text-gray-700 shadow-md transition-colors hover:bg-gray-100 hover:text-black"
          >
            <X size={20} />
          </button>

          {/* Left Panel: Images Carousel */}
          <div className="relative flex flex-col bg-gray-50 p-6 justify-center items-center">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white shadow-inner flex items-center justify-center">
              <img
                src={product.images[activeImageIndex]}
                alt={product.title}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />

              {product.images.length > 1 && (
                <>
                  <button
                    id="btn-prev-image"
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 items-center justify-center rounded-full bg-white/95 text-gray-700 shadow-md hover:bg-white flex transition-all"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    id="btn-next-image"
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 items-center justify-center rounded-full bg-white/95 text-gray-700 shadow-md hover:bg-white flex transition-all"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail selector */}
            {product.images.length > 1 && (
              <div className="mt-4 flex gap-2 overflow-x-auto py-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    id={`btn-thumbnail-${idx}`}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                      idx === activeImageIndex ? "border-indigo-600 scale-105 shadow-sm" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx}`} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Panel: Configuration and Details */}
          <div className="flex flex-col p-8 justify-between bg-white">
            <div>
              {/* Stock Badge */}
              <div className="mb-4">
                {product.stock ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    En Stock (Listo para entregar)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                    <Clock size={12} className="text-amber-600" />
                    A Pedido (Demora de fabricación)
                  </span>
                )}
              </div>

              <h2 className="font-sans text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
                {product.title}
              </h2>

              <p className="mt-2 font-sans text-2xl font-black text-indigo-600">
                {formatPrice(product.price)}
              </p>

              {/* Description body */}
              <div className="mt-4 border-t border-gray-100 pt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Descripción</h4>
                <p className="mt-1 text-sm text-gray-600 leading-relaxed font-sans">
                  {product.description || "Este modelo 3D premium se personaliza y fabrica con los más altos estándares tecnológicos de filamentos biodegradables (PLA)."}
                </p>
              </div>

              {/* Stock alert triggers for Stock === "NO" */}
              {!product.stock && (
                <div id="stock-warning" className="mt-4 flex items-start gap-2.5 rounded-2xl bg-amber-50/50 border border-amber-200/40 p-4 text-xs font-medium text-amber-950">
                  <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-sm text-amber-950 mb-0.5">Producto a Fabricar</span>
                    No disponible para entrega inmediata. Se fabrica a pedido con una demora aproximada de 2 días hábiles.
                  </div>
                </div>
              )}

              {/* Color list selector */}
              <div className="mt-6">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2.5">
                  Elige el Color disponible:
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => {
                    const colorStyle = getColorStyle(color, selectedColor === color);
                    return (
                      <button
                        key={color}
                        id={`color-pill-${color.replace(/\s+/g, "-")}`}
                        onClick={() => setSelectedColor(color)}
                        style={colorStyle.style}
                        className={`relative flex items-center justify-center rounded-xl px-4 py-2 text-xs border-2 ${colorStyle.className}`}
                      >
                        {selectedColor === color && <Check size={12} className="mr-1" />}
                        {color}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Filament Type selector */}
              <div className="mt-6">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2.5">
                  Tipo de Filamento:
                </span>
                <div className="flex flex-wrap gap-2">
                  {["PLA", "PETG", "TPU/FLEX", "OTRO"].map((filament) => (
                    <button
                      key={filament}
                      id={`filament-pill-${filament.replace(/\s+/g, "-")}`}
                      onClick={() => setSelectedFilament(filament)}
                      className={`relative flex items-center justify-center rounded-xl px-4 py-2 text-xs font-semibold border-2 transition-all duration-200 ${
                        selectedFilament === filament
                          ? "border-indigo-600 bg-indigo-600 text-white shadow-sm scale-102"
                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-405 hover:text-black cursor-pointer"
                      }`}
                    >
                      {selectedFilament === filament && <Check size={12} className="mr-1" />}
                      {filament}
                    </button>
                  ))}
                </div>

                {/* Custom filament text input if "OTRO" is selected */}
                <AnimatePresence>
                  {selectedFilament === "OTRO" && (
                    <motion.div
                      id="custom-filament-container"
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: 12 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      transition={{ duration: 0.15 }}
                      className="overflow-hidden"
                    >
                      <label htmlFor="custom-filament-input" className="text-xs font-semibold text-gray-500 block mb-1.5">
                        Especifica el filamento (máx. 20 caracteres):
                      </label>
                      <div className="relative">
                        <input
                          id="custom-filament-input"
                          type="text"
                          maxLength={20}
                          value={customFilament}
                          onChange={(e) => setCustomFilament(e.target.value)}
                          placeholder="Ej: ABS, PLA+, PET, etc..."
                          className="w-full rounded-xl border-2 border-gray-200 px-4 py-2 text-xs font-semibold text-gray-800 outline-hidden focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all font-sans"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-gray-400">
                          {customFilament.length}/20
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Quantity input counter */}
              <div className="mt-6">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2.5">
                  Cantidad:
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    id="btn-qty-minus"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 font-bold text-gray-800 transition-colors"
                  >
                    -
                  </button>
                  <span id="qty-indicator" className="w-12 text-center font-mono font-bold text-lg text-gray-900">
                    {quantity}
                  </span>
                  <button
                    id="btn-qty-plus"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 font-bold text-gray-800 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Actions CTA panel */}
            <div className="mt-8 border-t border-gray-100 pt-6">
              <button
                id="btn-add-to-cart-submit"
                onClick={handleAddToCart}
                disabled={isAdded}
                className={`w-full flex items-center justify-center gap-2 rounded-2xl py-4 text-sm font-bold text-white shadow-lg transition-all duration-200 ${
                  isAdded
                    ? "bg-emerald-600 shadow-emerald-200"
                    : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-900/10 hover:shadow-indigo-500/20 active:scale-98 cursor-pointer"
                }`}
              >
                {isAdded ? (
                  <>
                    <Check size={18} />
                    Agregado con Éxito!
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} />
                    Agregar al Carrito • {formatPrice(product.price * quantity)}
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
