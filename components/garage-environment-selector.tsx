"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, Lock, Check, Sparkles } from "lucide-react"

interface GarageTheme {
  id: string
  name: string
  description: string
  cost: number
  owned: boolean
  preview: string
  gradient: string
  accentColor: string
  icon: string
}

const garageThemes: GarageTheme[] = [
  {
    id: "showroom",
    name: "SHOWROOM",
    description: "Clean white infinity room with spot lighting",
    cost: 15000,
    owned: true,
    preview: "/placeholder.svg?height=200&width=300",
    gradient: "from-gray-100 via-white to-gray-200",
    accentColor: "#e5e7eb",
    icon: "💡",
  },
  {
    id: "underground",
    name: "UNDERGROUND",
    description: "Tokyo drift style with neon strips and wet concrete",
    cost: 25000,
    owned: false,
    preview: "/placeholder.svg?height=200&width=300",
    gradient: "from-purple-900 via-pink-600 to-cyan-400",
    accentColor: "#ff00ff",
    icon: "🌃",
  },
  {
    id: "penthouse",
    name: "PENTHOUSE",
    description: "Glass walls overlooking city at night, modern luxury",
    cost: 35000,
    owned: true,
    preview: "/placeholder.svg?height=200&width=300",
    gradient: "from-blue-900 via-indigo-800 to-purple-900",
    accentColor: "#3b82f6",
    icon: "🏙️",
  },
  {
    id: "cyber",
    name: "CYBER",
    description: "Tron-like grid floor with holographic effects",
    cost: 50000,
    owned: false,
    preview: "/placeholder.svg?height=200&width=300",
    gradient: "from-cyan-400 via-blue-500 to-purple-600",
    accentColor: "#00ffff",
    icon: "⚡",
  },
]

export default function GarageEnvironmentSelector() {
  const [selectedTheme, setSelectedTheme] = useState<string>("showroom")
  const [hoveredTheme, setHoveredTheme] = useState<string | null>(null)

  const handleThemeSelect = (themeId: string) => {
    const theme = garageThemes.find((t) => t.id === themeId)
    if (theme?.owned) {
      setSelectedTheme(themeId)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl font-bold text-white mb-4 tracking-wider">GARAGE ENVIRONMENTS</h1>
          <p className="text-xl text-gray-300">Choose your perfect racing sanctuary</p>

          {/* Festival-style decorative elements */}
          <div className="flex justify-center items-center mt-8 space-x-4">
            <div className="w-16 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
            <Sparkles className="w-8 h-8 text-yellow-400" />
            <div className="w-16 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
          </div>
        </motion.div>

        {/* Theme Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {garageThemes.map((theme, index) => (
            <motion.div
              key={theme.id}
              className="relative group cursor-pointer"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onHoverStart={() => setHoveredTheme(theme.id)}
              onHoverEnd={() => setHoveredTheme(null)}
              onClick={() => handleThemeSelect(theme.id)}
            >
              {/* Main Card */}
              <div className="relative overflow-hidden rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10">
                {/* Selection Glow Border */}
                <AnimatePresence>
                  {(selectedTheme === theme.id || hoveredTheme === theme.id) && (
                    <motion.div
                      className="absolute inset-0 rounded-2xl"
                      style={{
                        background: `linear-gradient(45deg, ${theme.accentColor}40, transparent, ${theme.accentColor}40)`,
                        boxShadow: `0 0 30px ${theme.accentColor}60`,
                      }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </AnimatePresence>

                {/* Preview Thumbnail */}
                <div className="relative h-48 overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-80`} />

                  {/* Animated Background Pattern */}
                  <div className="absolute inset-0">
                    {theme.id === "showroom" && (
                      <div className="absolute inset-0 bg-white/20">
                        {[...Array(6)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-2 h-full bg-white/10"
                            style={{ left: `${i * 20}%` }}
                            animate={{
                              opacity: [0.1, 0.3, 0.1],
                              scaleY: [0.8, 1.2, 0.8],
                            }}
                            transition={{
                              duration: 2,
                              delay: i * 0.2,
                              repeat: Number.POSITIVE_INFINITY,
                            }}
                          />
                        ))}
                      </div>
                    )}

                    {theme.id === "underground" && (
                      <div className="absolute inset-0">
                        {[...Array(8)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute h-1 bg-gradient-to-r from-pink-500 to-cyan-400"
                            style={{
                              top: `${10 + i * 10}%`,
                              left: "10%",
                              right: "10%",
                            }}
                            animate={{
                              opacity: [0.3, 1, 0.3],
                              scaleX: [0.8, 1, 0.8],
                            }}
                            transition={{
                              duration: 1.5,
                              delay: i * 0.1,
                              repeat: Number.POSITIVE_INFINITY,
                            }}
                          />
                        ))}
                      </div>
                    )}

                    {theme.id === "penthouse" && (
                      <div className="absolute inset-0">
                        {[...Array(12)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-1 bg-blue-400/30"
                            style={{
                              left: `${5 + i * 8}%`,
                              height: `${30 + Math.random() * 40}%`,
                              bottom: "20%",
                            }}
                            animate={{
                              opacity: [0.2, 0.8, 0.2],
                              height: [
                                `${30 + Math.random() * 40}%`,
                                `${50 + Math.random() * 30}%`,
                                `${30 + Math.random() * 40}%`,
                              ],
                            }}
                            transition={{
                              duration: 3,
                              delay: i * 0.2,
                              repeat: Number.POSITIVE_INFINITY,
                            }}
                          />
                        ))}
                      </div>
                    )}

                    {theme.id === "cyber" && (
                      <div className="absolute inset-0">
                        {/* Grid Pattern */}
                        <div className="absolute inset-0 opacity-40">
                          {[...Array(8)].map((_, i) => (
                            <div
                              key={`h-${i}`}
                              className="absolute w-full h-px bg-cyan-400"
                              style={{ top: `${i * 12.5}%` }}
                            />
                          ))}
                          {[...Array(6)].map((_, i) => (
                            <div
                              key={`v-${i}`}
                              className="absolute h-full w-px bg-cyan-400"
                              style={{ left: `${i * 16.67}%` }}
                            />
                          ))}
                        </div>

                        {/* Holographic Effects */}
                        {[...Array(4)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-8 h-8 bg-cyan-400/50 rounded-full"
                            style={{
                              left: `${20 + i * 20}%`,
                              top: `${30 + i * 10}%`,
                            }}
                            animate={{
                              scale: [1, 1.5, 1],
                              opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                              duration: 2,
                              delay: i * 0.5,
                              repeat: Number.POSITIVE_INFINITY,
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Theme Icon */}
                  <div className="absolute top-4 left-4 text-4xl">{theme.icon}</div>

                  {/* Owned Badge */}
                  {theme.owned && (
                    <motion.div
                      className="absolute top-4 right-4 bg-gradient-to-r from-green-400 to-emerald-500 px-3 py-1 rounded-full flex items-center space-x-2"
                      animate={{
                        boxShadow: [
                          "0 0 10px rgba(34, 197, 94, 0.5)",
                          "0 0 20px rgba(34, 197, 94, 0.8)",
                          "0 0 10px rgba(34, 197, 94, 0.5)",
                        ],
                      }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    >
                      <Check className="w-4 h-4 text-white" />
                      <span className="text-white font-bold text-sm">OWNED</span>
                    </motion.div>
                  )}

                  {/* Lock Overlay for Unowned */}
                  {!theme.owned && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Lock className="w-12 h-12 text-white/60" />
                    </div>
                  )}
                </div>

                {/* Theme Info */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-2xl font-bold text-white tracking-wider">{theme.name}</h3>
                    {selectedTheme === theme.id && (
                      <motion.div
                        className="w-3 h-3 rounded-full bg-green-400"
                        animate={{
                          boxShadow: [
                            "0 0 5px rgba(34, 197, 94, 0.5)",
                            "0 0 15px rgba(34, 197, 94, 1)",
                            "0 0 5px rgba(34, 197, 94, 0.5)",
                          ],
                        }}
                        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                      />
                    )}
                  </div>

                  <p className="text-gray-300 text-sm mb-4 leading-relaxed">{theme.description}</p>

                  {/* Cost */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Star className="w-5 h-5 text-yellow-400" />
                      <span className="text-white font-bold">{theme.cost.toLocaleString()}</span>
                    </div>

                    {/* Action Button */}
                    <motion.button
                      className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                        theme.owned
                          ? selectedTheme === theme.id
                            ? "bg-green-500 text-white"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                          : "bg-gray-600 text-gray-300 cursor-not-allowed"
                      }`}
                      whileHover={theme.owned ? { scale: 1.05 } : {}}
                      whileTap={theme.owned ? { scale: 0.95 } : {}}
                      disabled={!theme.owned}
                    >
                      {theme.owned ? (selectedTheme === theme.id ? "ACTIVE" : "SELECT") : "LOCKED"}
                    </motion.button>
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <AnimatePresence>
                  {hoveredTheme === theme.id && (
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: `radial-gradient(circle at center, ${theme.accentColor}20 0%, transparent 70%)`,
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Festival-style Corner Decorations */}
              <div className="absolute -top-2 -left-2 w-6 h-6 border-l-2 border-t-2 border-cyan-400 opacity-60"></div>
              <div className="absolute -top-2 -right-2 w-6 h-6 border-r-2 border-t-2 border-cyan-400 opacity-60"></div>
              <div className="absolute -bottom-2 -left-2 w-6 h-6 border-l-2 border-b-2 border-cyan-400 opacity-60"></div>
              <div className="absolute -bottom-2 -right-2 w-6 h-6 border-r-2 border-b-2 border-cyan-400 opacity-60"></div>
            </motion.div>
          ))}
        </div>

        {/* Selected Theme Preview */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="inline-flex items-center space-x-4 bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl px-8 py-4">
            <span className="text-gray-300">Current Environment:</span>
            <span className="text-2xl font-bold text-white tracking-wider">
              {garageThemes.find((t) => t.id === selectedTheme)?.name}
            </span>
            <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
