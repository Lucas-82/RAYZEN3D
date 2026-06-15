/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, FileSpreadsheet, Share2, Rocket, HelpCircle, Columns, ExternalLink, Check } from "lucide-react";

interface SheetsHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SheetsHelpModal({ isOpen, onClose }: SheetsHelpModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          id="help-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-xs"
          onClick={onClose}
        />

        {/* Modal Panel */}
        <motion.div
          id="help-container"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl max-h-[85vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
            <div className="flex items-center gap-2">
              <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600">
                <FileSpreadsheet size={20} />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-gray-900 font-sans">Guía de Conexión: Rayzen 3D</h2>
                <p className="text-xs text-gray-400">Cómo configurar tu catálogo autogestionable gratis.</p>
              </div>
            </div>
            <button
              id="btn-close-help"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-black transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Guide contents */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-gray-600 leading-relaxed">
            {/* Step 1: Create Spreadsheet */}
            <div className="space-y-2">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">1</span>
                Crear tu Hoja de Cálculo
              </h3>
              <p>
                Creá una nueva planilla en <span className="font-semibold text-gray-800">Google Sheets</span>. Podés nombrar las pestañas como quieras, pero te aconsejamos usar la primera pestaña por defecto. Las columnas de la fila 1 deben llamarse exactamente así o estar en este orden exacto:
              </p>

              {/* Column representation */}
              <div className="rounded-xl border border-gray-150 p-4 bg-gray-50/50 space-y-3 font-mono text-xs">
                <div className="flex items-center gap-1.5 font-bold text-indigo-700">
                  <Columns size={14} />
                  <span>Columnas de la Planilla (Fila 1):</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] md:grid-cols-4">
                  <div className="rounded-md border border-gray-200 bg-white p-2">
                    <span className="block font-black text-gray-800">A: ID</span>
                    <span className="text-gray-400 block mt-0.5">Ej: 1, 2, 3</span>
                  </div>
                  <div className="rounded-md border border-gray-200 bg-white p-2">
                    <span className="block font-black text-gray-800">B: Título</span>
                    <span className="text-gray-400 block mt-0.5">Nombre de producto</span>
                  </div>
                  <div className="rounded-md border border-gray-200 bg-white p-2">
                    <span className="block font-black text-gray-800">C: Descripción</span>
                    <span className="text-gray-400 block mt-0.5">Detalles del modelo</span>
                  </div>
                  <div className="rounded-md border border-gray-200 bg-white p-2">
                    <span className="block font-black text-gray-800">D: URL_Fotos</span>
                    <span className="text-gray-400 block mt-0.5">Separadas por comas</span>
                  </div>
                  <div className="rounded-md border border-gray-200 bg-white p-2">
                    <span className="block font-black text-gray-800">E: Colores</span>
                    <span className="text-gray-400 block mt-0.5">Ej: Rojo, Negro</span>
                  </div>
                  <div className="rounded-md border border-gray-200 bg-white p-2">
                    <span className="block font-black text-gray-800">F: Stock</span>
                    <span className="text-gray-400 block mt-0.5">Escribir SI o NO</span>
                  </div>
                  <div className="rounded-md border border-gray-200 bg-white p-2">
                    <span className="block font-black text-gray-800">G: Precio por unidad</span>
                    <span className="text-gray-400 block mt-0.5">Ej: 4500 (solo número)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Share Spreadsheet */}
            <div className="space-y-2">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">2</span>
                Habilitar Acceso Público
              </h3>
              <p>
                Para que la web pueda leer tus productos en tiempo real, la planilla debe estar compartida de forma pública (como lector):
              </p>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Arriba a la derecha, hacé clic en el botón <span className="font-semibold text-gray-800">"Compartir"</span>.</li>
                <li>En "Acceso General", cambia "Restringido" por <span className="font-semibold text-gray-800">"Cualquier usuario con el enlace"</span>.</li>
                <li>Aseguráte de que el rol asignado sea de <span className="font-semibold text-gray-800">"Lector"</span>.</li>
                <li>Copiá el enlace de la planilla.</li>
              </ol>
            </div>

            {/* Step 3: Get unique sheet ID */}
            <div className="space-y-2">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">3</span>
                Identificar tu Sheet ID
              </h3>
              <p>
                El <span className="font-semibold text-gray-800">Sheet ID</span> es la cadena larga que figura en la barra de direcciones de tu navegador, situada entre <code className="bg-gray-100 p-0.5 rounded text-rose-600">/d/</code> y <code className="bg-gray-100 p-0.5 rounded text-rose-600">/edit</code>.
              </p>
              <div className="rounded-xl bg-gray-100 p-3 font-mono text-[11px] text-gray-700 leading-tight border border-gray-205">
                https://docs.google.com/spreadsheets/d/<span className="bg-indigo-50 text-indigo-950 font-black px-1.5 py-0.5 rounded shadow-2xs border border-indigo-200">1aBCDeFGHiJKlMnOpQrStUvWxYz1234567890AbCdEfG</span>/edit#gid=0
              </div>
              <p className="text-xs text-gray-400 italic">
                Copiá ese bloque de caracteres y pégalo directamente en la barra de configuración superior de esta web para probar y vincular tu inventario al instante.
              </p>
            </div>

            {/* Step 4: Costless publishing guidance */}
            <div className="space-y-2 border-t border-gray-100 pt-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">4</span>
                Cómo Publicar tu Web GRATIS (Paso a Paso)
              </h3>
              <p>
                Como buscas una alternativa sin costos fijos, podés subir esta web de forma 100% gratuita usando plataformas modernas que ofrecen hosting estático ilimitado. Te sugerimos dos opciones super simples:
              </p>

              <div className="space-y-3.5 mt-2">
                {/* Netlify Option */}
                <div className="rounded-2xl border border-gray-100 p-4 bg-white shadow-xs">
                  <div className="flex items-center gap-2 font-bold text-teal-700 mb-1">
                    <Rocket size={16} />
                    <span>Opción A: Netlify (La más rápida y sin código)</span>
                  </div>
                  <ol className="list-decimal pl-5 space-y-1 text-xs">
                    <li>Generá la carpeta de producción en tu proyecto ejecutando <code className="bg-gray-100 px-1 py-0.5 rounded font-mono">npm run build</code>. Esto creará una carpeta llamada <code className="bg-gray-100 px-1 py-0.5 rounded font-mono">dist</code>.</li>
                    <li>Registrate gratis en <a href="https://www.netlify.com/" target="_blank" rel="noreferrer" className="text-teal-600 underline inline-flex items-center font-semibold gap-0.5">Netlify <ExternalLink size={10} /></a>.</li>
                    <li>Ve a la pestaña "Sites" y arrastrá directamente la carpeta <span className="font-semibold text-gray-800">"dist"</span> de tu computadora dentro del recuadro que dice "Drag and drop your site folder here".</li>
                    <li>¡Listo! Netlify te dará un enlace único público en menos de 5 segundos. Podés cambiar el subdominio o conectarle un dominio propio si lo deseas más adelante.</li>
                  </ol>
                </div>

                {/* GitHub Pages Option */}
                <div className="rounded-2xl border border-gray-100 p-4 bg-white shadow-xs">
                  <div className="flex items-center gap-2 font-bold text-indigo-700 mb-1">
                    <HelpCircle size={16} />
                    <span>Opción B: Vercel (Excelente integración)</span>
                  </div>
                  <ol className="list-decimal pl-5 space-y-1 text-xs">
                    <li>Creado un repositorio en GitHub con el código de tu proyecto.</li>
                    <li>Iniciá sesión en <a href="https://vercel.com/" target="_blank" rel="noreferrer" className="text-indigo-600 underline inline-flex items-center font-semibold gap-0.5">Vercel <ExternalLink size={10} /></a> usando tu cuenta de GitHub.</li>
                    <li>Hacé clic en "Add New" → "Project" e importá el repositorio de Rayzen 3D.</li>
                    <li>Vercel detectará que es un proyecto Vite/React, hacé clic en "Deploy". Se compila y publica automáticamente cada vez que hagas un cambio de código.</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          {/* Footer controls */}
          <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
            <button
              id="btn-help-accept-ok"
              onClick={onClose}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 text-xs font-bold text-white transition-colors cursor-pointer"
            >
              <Check size={14} />
              Excelente, Entendido!
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
