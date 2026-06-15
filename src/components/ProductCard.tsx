/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { Eye, Clock, CheckCircle } from "lucide-react";
import { Product } from "../types";

interface ProductCardProps {
  key?: React.Key;
  product: Product;
  onViewDetails: (product: Product) => void;
}

export default function ProductCard({ product, onViewDetails }: ProductCardProps): React.JSX.Element {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <motion.div
      id={`product-card-${product.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xs transition-shadow duration-300 hover:shadow-lg"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      {/* Product Image Panel */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={product.images[0] || "https://images.unsplash.com/photo-1615840287214-7fe58a8f3685?auto=format&fit=crop&w=800&q=80"}
          alt={product.title}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />

        {/* Hover view overlay */}
        <div className="absolute inset-0 bg-black/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
          <button
            id={`btn-hover-view-${product.id}`}
            onClick={() => onViewDetails(product)}
            className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 shadow-xl hover:bg-gray-100 transition-colors"
          >
            <Eye size={16} />
            Ver Detalles
          </button>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
          {product.stock ? (
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-600/90 px-3 py-1 text-xs font-semibold text-white shadow-xs backdrop-blur-xs">
              <CheckCircle size={11} />
              En Stock
            </span>
          ) : (
            <span className="flex items-center gap-1.5 rounded-full bg-amber-500/95 px-3 py-1 text-xs font-semibold text-white shadow-xs backdrop-blur-xs">
              <Clock size={11} />
              A Pedido (48hs hábiles)
            </span>
          )}
        </div>
      </div>

      {/* Product Information */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-1 font-sans text-lg font-bold text-neutral-900 group-hover:text-indigo-600 transition-colors">
          {product.title}
        </h3>

        {product.description ? (
          <p className="mt-1 line-clamp-2 text-sm text-neutral-500 leading-relaxed flex-1">
            {product.description}
          </p>
        ) : (
          <p className="mt-1 italic text-xs text-neutral-400 flex-1">
            Sin descripción detallada disponible.
          </p>
        )}

        {/* Price & Action Section */}
        <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-neutral-400 block font-medium">Precio</span>
            <span className="font-sans text-xl font-black text-neutral-900">
              {formatPrice(product.price)}
            </span>
          </div>

          <button
            id={`btn-view-${product.id}`}
            onClick={() => onViewDetails(product)}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white transition-colors duration-200 hover:bg-indigo-700 cursor-pointer"
          >
            Ver Más
          </button>
        </div>
      </div>
    </motion.div>
  );
}
