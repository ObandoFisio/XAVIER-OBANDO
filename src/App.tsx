/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Activity, 
  Info, 
  AlertTriangle, 
  CheckCircle2, 
  Zap, 
  TableProperties 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Estados de los inputs
  const [latenciaDistal, setLatenciaDistal] = useState(''); // L1 en ms
  const [latenciaProximal, setLatenciaProximal] = useState(''); // L2 en ms
  const [distancia, setDistancia] = useState(''); // Distancia
  const [unidadDistancia, setUnidadDistancia] = useState('mm'); // 'mm' o 'cm'
  const [tipoNervio, setTipoNervio] = useState('superior'); // 'superior' o 'inferior'

  // Estados de resultados y validación
  const [velocidad, setVelocidad] = useState<string | null>(null);
  const [error, setError] = useState('');

  // Efecto para calcular la velocidad cuando cambian los inputs
  useEffect(() => {
    calcularVCN();
  }, [latenciaDistal, latenciaProximal, distancia, unidadDistancia]);

  const calcularVCN = () => {
    setError('');
    setVelocidad(null);

    const l1 = parseFloat(latenciaDistal);
    const l2 = parseFloat(latenciaProximal);
    let dist = parseFloat(distancia);

    // Validaciones básicas de que existan números
    if (isNaN(l1) || isNaN(l2) || isNaN(dist)) return;

    // Validaciones lógicas
    if (l1 < 0 || l2 < 0 || dist <= 0) {
      setError('Los valores deben ser positivos.');
      return;
    }

    if (l2 <= l1) {
      setError('La latencia proximal debe ser mayor que la distal.');
      return;
    }

    // Convertir la distancia a milímetros si está en centímetros
    if (unidadDistancia === 'cm') {
      dist = dist * 10;
    }

    const diferenciaLatencia = l2 - l1;
    const vcn = dist / diferenciaLatencia;
    
    setVelocidad(vcn.toFixed(1));
  };

  // Evaluar si el resultado es normal según el tipo de nervio
  const evaluacion = useMemo(() => {
    if (velocidad === null) return null;
    const v = parseFloat(velocidad);
    
    if (tipoNervio === 'superior') {
      return v >= 50 ? 'normal' : 'anormal'; // > 50 m/s normal general para ext. superiores
    } else {
      return v >= 40 ? 'normal' : 'anormal'; // > 40 m/s normal general para ext. inferiores
    }
  }, [velocidad, tipoNervio]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        
        {/* Encabezado */}
        <header className="flex items-center space-x-3 pb-6 border-b border-slate-200">
          <div className="p-3 bg-blue-600 rounded-lg text-white shadow-sm">
            <Activity size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Calculadora de VCN</h1>
            <p className="text-slate-500 text-sm">Velocidad de Conducción Nerviosa</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Panel de Entradas */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-semibold mb-4 flex items-center text-slate-800">
                <Zap size={20} className="mr-2 text-yellow-500" />
                Datos del Estudio (Neuroconducción)
              </h2>

              <div className="space-y-5">
                {/* Latencia Distal */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Latencia Distal (L1)
                  </label>
                  <div className="relative">
                    <input
                      id="l1-input"
                      type="number"
                      step="0.1"
                      min="0"
                      value={latenciaDistal}
                      onChange={(e) => setLatenciaDistal(e.target.value)}
                      className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none"
                      placeholder="Ej. 3.2"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-500 text-sm font-medium">
                      ms
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Tiempo al sitio de estimulación distal.</p>
                </div>

                {/* Latencia Proximal */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Latencia Proximal (L2)
                  </label>
                  <div className="relative">
                    <input
                      id="l2-input"
                      type="number"
                      step="0.1"
                      min="0"
                      value={latenciaProximal}
                      onChange={(e) => setLatenciaProximal(e.target.value)}
                      className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none"
                      placeholder="Ej. 7.5"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-500 text-sm font-medium">
                      ms
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Tiempo al sitio de estimulación proximal.</p>
                </div>

                {/* Distancia */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Distancia entre estímulos
                  </label>
                  <div className="flex space-x-2">
                    <input
                      id="dist-input"
                      type="number"
                      step="0.1"
                      min="0"
                      value={distancia}
                      onChange={(e) => setDistancia(e.target.value)}
                      className="flex-1 pl-4 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none"
                      placeholder="Ej. 240"
                    />
                    <select
                      id="unit-select"
                      value={unidadDistancia}
                      onChange={(e) => setUnidadDistancia(e.target.value)}
                      className="w-24 bg-slate-50 border border-slate-300 rounded-xl px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-medium text-slate-700"
                    >
                      <option value="mm">mm</option>
                      <option value="cm">cm</option>
                    </select>
                  </div>
                </div>

              </div>
            </div>

            {/* Selector de Referencia */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-sm font-semibold mb-3 text-slate-800">Contexto Clínico General</h2>
              <div className="flex gap-4">
                <button 
                  id="sup-btn"
                  onClick={() => setTipoNervio('superior')}
                  className={`flex-1 flex items-center justify-center py-3 px-4 rounded-xl border cursor-pointer transition-all ${tipoNervio === 'superior' ? 'bg-blue-50 border-blue-500 text-blue-700 ring-2 ring-blue-500/20' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                >
                  Extremidad Superior
                </button>
                <button 
                  id="inf-btn"
                  onClick={() => setTipoNervio('inferior')}
                  className={`flex-1 flex items-center justify-center py-3 px-4 rounded-xl border cursor-pointer transition-all ${tipoNervio === 'inferior' ? 'bg-blue-50 border-blue-500 text-blue-700 ring-2 ring-blue-500/20' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                >
                  Extremidad Inferior
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-3 text-center">
                *Esto ajusta el umbral de normalidad básico en la tarjeta de resultados.
              </p>
            </div>
          </div>

          {/* Panel de Resultados y Fórmula */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Tarjeta Principal de Resultado */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center min-h-[280px] relative overflow-hidden">
              {/* Fondo decorativo */}
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-slate-50 opacity-50 blur-2xl pointer-events-none"></div>
              
              <h2 className="text-sm uppercase tracking-wider font-semibold text-slate-500 mb-2">Velocidad Resultante</h2>
              
              <AnimatePresence mode="wait">
                {error ? (
                  <motion.div 
                    key="error"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center text-amber-600 p-4 bg-amber-50 rounded-xl mt-4"
                  >
                    <AlertTriangle className="mb-2" size={32} />
                    <p className="text-sm font-medium">{error}</p>
                  </motion.div>
                ) : velocidad ? (
                  <motion.div 
                    key="result"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col items-center mt-2"
                  >
                    <div className="flex items-baseline text-6xl font-extrabold text-slate-800 tracking-tight">
                      {velocidad}
                      <span className="text-2xl font-semibold text-slate-500 ml-2">m/s</span>
                    </div>
                    
                    {/* Etiqueta de Interpretación */}
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className={`mt-6 inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${
                      evaluacion === 'normal' 
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                        : 'bg-rose-100 text-rose-700 border border-rose-200'
                    }`}>
                      {evaluacion === 'normal' ? (
                        <><CheckCircle2 size={16} className="mr-1.5" /> Dentro del límite general</>
                      ) : (
                        <><AlertTriangle size={16} className="mr-1.5" /> Bajo el límite general</>
                      )}
                    </motion.div>
                    
                    <p className="text-xs text-slate-400 mt-4">
                      Límite general de ref: {tipoNervio === 'superior' ? '≥ 50 m/s' : '≥ 40 m/s'}
                    </p>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-slate-400 flex flex-col items-center mt-4"
                  >
                    <div className="w-16 h-1 rounded bg-slate-200 mb-4 animate-pulse"></div>
                    <p className="text-sm">Ingrese los valores para ver el cálculo</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Tarjeta de Información / Fórmula */}
            <div className="bg-slate-800 p-6 rounded-2xl shadow-sm text-slate-200">
              <h3 className="flex items-center font-semibold text-white mb-3">
                <Info size={18} className="mr-2 text-blue-400" />
                Fórmula Aplicada
              </h3>
              <div className="bg-slate-900 rounded-xl p-4 font-mono text-sm text-center border border-slate-700">
                <div className="border-b border-slate-700 pb-2 mb-2">
                  <span className="text-emerald-400">Distancia</span> (mm)
                </div>
                <div>
                  <span className="text-rose-400">L2</span> (ms) - <span className="text-blue-400">L1</span> (ms)
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Tabla de Referencias */}
        <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center mb-6">
            <TableProperties size={24} className="text-blue-600 mr-3" />
            <div>
              <h2 className="text-xl font-bold text-slate-800">Valores de Referencia Aproximados (VCN)</h2>
              <p className="text-sm text-slate-500">Promedios normales en <span className="font-semibold text-slate-700">adultos jóvenes sanos (20-40 años)</span> a temperatura estándar de extremidad (32-34°C).</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-sm uppercase tracking-wider">
                  <th className="px-4 py-3 border-b border-slate-200 font-semibold rounded-tl-xl text-xs sm:text-sm">Nervio / Área</th>
                  <th className="px-4 py-3 border-b border-slate-200 font-semibold text-xs sm:text-sm">Tipo</th>
                  <th className="px-4 py-3 border-b border-slate-200 font-semibold text-xs sm:text-sm">VCN Promedio (m/s)</th>
                  <th className="px-4 py-3 border-b border-slate-200 font-semibold rounded-tr-xl text-xs sm:text-sm">Límite Inferior (m/s)</th>
                </tr>
              </thead>
              <tbody className="text-xs sm:text-sm text-slate-700">
                {/* Extremidad Superior */}
                <tr className="bg-blue-50/30">
                  <td colSpan={4} className="px-4 py-2 font-bold text-blue-800 border-b border-slate-200">Extremidad Superior</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 border-b border-slate-200 font-medium">Mediano (Antebrazo)</td>
                  <td className="px-4 py-3 border-b border-slate-200"><span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">Motor</span></td>
                  <td className="px-4 py-3 border-b border-slate-200">58 ± 5</td>
                  <td className="px-4 py-3 border-b border-slate-200 font-semibold text-slate-900">≥ 50</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 border-b border-slate-200 font-medium">Mediano (Mano-Muñeca)</td>
                  <td className="px-4 py-3 border-b border-slate-200"><span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Sensitivo</span></td>
                  <td className="px-4 py-3 border-b border-slate-200">55 ± 5</td>
                  <td className="px-4 py-3 border-b border-slate-200 font-semibold text-slate-900">≥ 50</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 border-b border-slate-200 font-medium">Cubital (Antebrazo)</td>
                  <td className="px-4 py-3 border-b border-slate-200"><span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">Motor</span></td>
                  <td className="px-4 py-3 border-b border-slate-200">60 ± 5</td>
                  <td className="px-4 py-3 border-b border-slate-200 font-semibold text-slate-900">≥ 50</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 border-b border-slate-200 font-medium">Radial (Brazo)</td>
                  <td className="px-4 py-3 border-b border-slate-200"><span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">Motor</span></td>
                  <td className="px-4 py-3 border-b border-slate-200">65 ± 5</td>
                  <td className="px-4 py-3 border-b border-slate-200 font-semibold text-slate-900">≥ 50</td>
                </tr>

                {/* Extremidad Inferior */}
                <tr className="bg-blue-50/30">
                  <td colSpan={4} className="px-4 py-2 font-bold text-blue-800 border-b border-slate-200">Extremidad Inferior</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 border-b border-slate-200 font-medium">Peroneo / Fibular (Pierna)</td>
                  <td className="px-4 py-3 border-b border-slate-200"><span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">Motor</span></td>
                  <td className="px-4 py-3 border-b border-slate-200">50 ± 5</td>
                  <td className="px-4 py-3 border-b border-slate-200 font-semibold text-slate-900">≥ 40</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 border-b border-slate-200 font-medium">Tibial (Pierna)</td>
                  <td className="px-4 py-3 border-b border-slate-200"><span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">Motor</span></td>
                  <td className="px-4 py-3 border-b border-slate-200">50 ± 5</td>
                  <td className="px-4 py-3 border-b border-slate-200 font-semibold text-slate-900">≥ 40</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 border-b border-slate-200 font-medium">Sural (Pierna)</td>
                  <td className="px-4 py-3 border-b border-slate-200"><span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Sensitivo</span></td>
                  <td className="px-4 py-3 border-b border-slate-200">45 ± 5</td>
                  <td className="px-4 py-3 border-b border-slate-200 font-semibold text-slate-900">≥ 40</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-100 flex items-start">
            <Info size={20} className="text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-amber-800 space-y-2">
              <p><strong>Notas clínicas importantes:</strong></p>
              <ul className="list-disc pl-4 space-y-1">
                <li>La velocidad de conducción disminuye naturalmente con la edad (aprox. 1-2 m/s por década después de los 60 años).</li>
                <li>La temperatura de la piel afecta drásticamente los resultados. Por cada grado Celsius por debajo de 32°C, la VCN puede disminuir entre 1.5 y 2.5 m/s.</li>
                <li>Los valores de referencia exactos pueden variar ligeramente dependiendo del protocolo del laboratorio y el equipo utilizado.</li>
              </ul>
            </div>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
