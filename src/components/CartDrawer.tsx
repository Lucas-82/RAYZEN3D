/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ShoppingBag, Trash2, Smartphone, User, ArrowRight, Clock, CheckCircle } from "lucide-react";
import { CartItem } from "../types";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartDrawerProps) {
  const [customerName, setCustomerName] = useState("");
  const [showError, setShowError] = useState(false);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, curr) => acc + curr.product.price * curr.quantity, 0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setShowError(true);
      return;
    }
    setShowError(false);

    // Format the WhatsApp message beautifully!
    let message = `*Hola Rayzen 3D! 👋*\n\nMi nombre es *${customerName.trim()}* y me gustaría realizar el siguiente pedido:\n\n`;
    message += `📋 *PRODUCTOS PEDIDOS:*\n`;
    
    cartItems.forEach((item, index) => {
      const { product, selectedColor, selectedFilament, quantity } = item;
      const stockStatusText = product.stock 
        ? "✅ Entrega inmediata" 
        : "⚠️ Se fabrica a pedido (Demora 2 días hábiles)";
      const itemTotal = product.price * quantity;

      message += `*${index + 1}. ${product.title}*\n`;
      message += `   • *Color:* ${selectedColor}\n`;
      if (selectedFilament) {
        message += `   • *Filamento:* ${selectedFilament}\n`;
      }
      message += `   • *Cantidad:* ${quantity}\n`;
      message += `   • *Precio unitario:* ${formatPrice(product.price)}\n`;
      message += `   • *Subtotal:* ${formatPrice(itemTotal)}\n`;
      message += `   • *Estado:* ${stockStatusText}\n\n`;
    });

    message += `💰 *TOTAL DEL PEDIDO:* *${formatPrice(subtotal)}*\n\n`;
    message += `_Espero tu confirmación para coordinar el pago y el retiro / envío. ¡Muchas gracias!_`;

    // WhatsApp API URL builder
    const whatsappNum = "5493471588444"; // +54 9 3471 588444
    const url = `https://api.whatsapp.com/send?phone=${whatsappNum}&text=${encodeURIComponent(message)}`;
    
    // Open standard Whatsapp deep link
    window.open(url, "_blank");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Dark Backdrop */}
        <motion.div
          id="cart-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-xs"
          onClick={onClose}
        />

        <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
          <motion.div
            id="cart-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <div className="relative p-2.5 bg-amber-50 rounded-xl text-amber-600">
                  <ShoppingBag size={20} />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-600 text-[10px] font-bold text-white ring-2 ring-white">
                      {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-bold font-sans text-gray-900">Tu Pedido</h2>
              </div>
              <button
                id="btn-close-cart"
                onClick={onClose}
                className="p-2 -mr-2 rounded-full hover:bg-gray-50 text-gray-400 hover:text-black transition-colors"
                aria-label="Cerrar"
              >
                <X size={20} />
              </button>
            </div>

            {/* List of Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-4 py-12">
                  <div className="p-4 bg-gray-50 text-gray-400 rounded-full mb-4">
                    <ShoppingBag size={48} className="stroke-1" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">El carrito está vacío</h3>
                  <p className="text-sm text-gray-400 mt-1 max-w-[240px]">
                    Navegá el catálogo y seleccioná tus modelos 3D preferidos para agregarlos acá.
                  </p>
                  <button
                    id="btn-cart-back-to-shop"
                    onClick={onClose}
                    className="mt-6 rounded-xl bg-gray-900 px-6 py-2.5 text-xs font-bold text-white transition-colors hover:bg-amber-600"
                  >
                    Ver Catálogo
                  </button>
                </div>
              ) : (
                cartItems.map((item, index) => (
                  <motion.div
                    key={`${item.product.id}-${item.selectedColor}-${item.selectedFilament || "PLA"}-${index}`}
                    id={`cart-item-${index}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-4 p-4 rounded-2xl border border-gray-100 bg-white shadow-xs"
                  >
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-gray-50 border border-gray-100">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.title}
                        className="h-full w-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-sans font-bold text-sm text-gray-900 truncate">
                        {item.product.title}
                      </h4>
                      <div className="mt-0.5 flex flex-wrap gap-1.5 items-center">
                        <span className="inline-block rounded-md bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold text-neutral-600">
                          Color: {item.selectedColor}
                        </span>

                        {item.selectedFilament && (
                          <span className="inline-block rounded-md bg-indigo-50 border border-indigo-100/50 px-2 py-0.5 text-[10px] font-bold text-indigo-600">
                            Filamento: {item.selectedFilament}
                          </span>
                        )}
                        
                        {item.product.stock ? (
                          <span className="flex items-center gap-0.5 text-[10px] font-medium text-emerald-600">
                            <CheckCircle size={10} />
                            En stock
                          </span>
                        ) : (
                          <span className="flex items-center gap-0.5 text-[10px] font-medium text-amber-600">
                            <Clock size={10} />
                            A pedido (2d)
                          </span>
                        )}
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        {/* Quantity Counter */}
                        <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-0.5 border border-gray-100">
                          <button
                            id={`btn-cart-qty-minus-${index}`}
                            onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                            className="h-6 w-6 rounded-md hover:bg-white text-xs font-bold text-gray-600 flex items-center justify-center transition-colors"
                          >
                            -
                          </button>
                          <span className="w-6 text-center font-mono text-xs font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            id={`btn-cart-qty-plus-${index}`}
                            onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                            className="h-6 w-6 rounded-md hover:bg-white text-xs font-bold text-gray-600 flex items-center justify-center transition-colors"
                          >
                            +
                          </button>
                        </div>

                        {/* Price Row */}
                        <div className="text-right">
                          <span className="font-mono text-sm font-bold text-gray-900">
                            {formatPrice(item.product.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Trash delete action */}
                    <button
                      id={`btn-cart-remove-${index}`}
                      onClick={() => onRemoveItem(index)}
                      className="text-gray-300 hover:text-rose-600 p-1 self-start transition-colors"
                      title="Eliminar de carrito"
                    >
                      <Trash2 size={16} />
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            {/* Bottom Checkout Section */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-gray-100 bg-gray-50/70 space-y-4">
                {/* Pricing Summary */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-500">Monto Total:</span>
                  <span className="font-sans text-2xl font-black text-indigo-600">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                {/* Form Inputs for Surname details */}
                <form id="checkout-form" onSubmit={handleCheckout} className="space-y-3 pt-2">
                  <div>
                    <label htmlFor="customer-name" className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                      <User size={13} className="text-gray-400" />
                      Nombre y Apellido del Cliente <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="customer-name"
                      type="text"
                      required
                      placeholder="Ej: Juan Pérez"
                      value={customerName}
                      onChange={(e) => {
                        setCustomerName(e.target.value);
                        if (e.target.value.trim()) setShowError(false);
                      }}
                      className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm outline-hidden transition-all placeholder:text-gray-400 ${
                        showError ? "border-rose-500 ring-2 ring-rose-100" : "border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-505"
                      }`}
                    />
                    {showError && (
                      <span id="name-error" className="text-rose-500 text-xs mt-1 block">
                        Por favor, ingresá tu Nombre y Apellido para completar tu orden.
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    Al confirmar, serás redirigido a WhatsApp Web o App con un mensaje pre-formateado. Allí podrás enviarlo directamente para coordinar el retiro física o de envío.
                  </p>

                  <button
                    id="btn-confirm-checkout-whatsapp"
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-emerald-600/10 hover:shadow-emerald-500/20 active:scale-98 transition-all duration-200"
                  >
                    Confirmar Pedido por WhatsApp
                    <ArrowRight size={16} />
                  </button>
                </form>

                {/* Clear Cart utility code */}
                <button
                  id="btn-clear-cart"
                  onClick={onClearCart}
                  className="w-full text-center text-xs text-gray-400 hover:text-gray-600 transition-colors py-1 block"
                >
                  Vaciar Carrito
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
