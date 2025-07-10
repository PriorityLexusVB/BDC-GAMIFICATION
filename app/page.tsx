"use client"

import { useState, useEffect, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, PerspectiveCamera } from "@react-three/drei"
import { motion, AnimatePresence } from "framer-motion"
import {
  Trophy,
  Star,
  Zap,
  Users,
  ShoppingCart,
  Share2,
  Settings,
  Crown,
  Award,
  Target,
  Flame,
  Sparkles,
  Palette,
} from "lucide-react"
import type * as THREE from "three"
import GarageEnvironmentSelector from "@/components/garage-environment-selector"

// Types
interface Car {
  id: string
  name: string
  brand: string
  rarity: "common" | "rare" | "legendary"
  cost: number
  image: string
  owned: boolean
}

interface Achievement {
  id: string
  title: string
  description: string
  progress: number
  maxProgress: number
  category: "daily" | "speed" | "team"
  unlocked: boolean
  icon: any
}

interface User {
  name: string
  avatar: string
  points: number
  level: number
  rank: number
}

// 3D Car Component
function Car3D({ rotation = 0 }: { rotation?: number }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = rotation + state.clock.elapsedTime * 0.3
    }
  })

  return (
    <group>
      {/* Car Body */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <boxGeometry args={[4, 1.5, 2]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.9} roughness={0.1} envMapIntensity={1} />
      </mesh>

      {/* Wheels */}
      {[-1.5, 1.5].map((x, i) =>
        [-0.8, 0.8].map((z, j) => (
          <mesh key={`${i}-${j}`} position={[x, -0.5, z]}>
            <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
            <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
          </mesh>
        )),
      )}

      {/* Neon Underglow */}
      <pointLight position={[0, -1, 0]} color="#00ffff" intensity={2} distance={10} />
      <pointLight position={[2, -0.5, 0]} color="#ff00ff" intensity={1.5} distance={8} />
      <pointLight position={[-2, -0.5, 0]} color="#ffff00" intensity={1.5} distance={8} />
    </group>
  )
}

// Particle System
function Particles() {
  const particlesRef = useRef<THREE.Points>(null)

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05
    }
  })

  const particleCount = 100
  const positions = new Float32Array(particleCount * 3)

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20
  }

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#00ffff" transparent opacity={0.6} />
    </points>
  )
}

// Glassmorphic Card Component
function GlassCard({ children, className = "", ...props }: any) {
  return (
    <motion.div
      className={`backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl ${className}`}
      whileHover={{ scale: 1.02, boxShadow: "0 25px 50px -12px rgba(0, 255, 255, 0.25)" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Rolling Number Component
function RollingNumber({ value, duration = 1000 }: { value: number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const startTime = Date.now()
    const startValue = displayValue
    const difference = value - startValue

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeOut = 1 - Math.pow(1 - progress, 3)

      setDisplayValue(Math.floor(startValue + difference * easeOut))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    animate()
  }, [value, duration])

  return <span>{displayValue.toLocaleString()}</span>
}

// Progress Ring Component
function ProgressRing({ progress, size = 80, strokeWidth = 8, color = "#00ffff" }: any) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = `${circumference} ${circumference}`
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          style={{
            filter: `drop-shadow(0 0 10px ${color})`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white font-bold text-sm">{Math.round(progress)}%</span>
      </div>
    </div>
  )
}

export default function LuxuryCarGarage() {
  const [currentScreen, setCurrentScreen] = useState<"garage" | "shop" | "achievements" | "environments">("garage")
  const [selectedCar, setSelectedCar] = useState(0)
  const [cartItems, setCartItems] = useState<string[]>([])

  // Mock data
  const user: User = {
    name: "SpeedDemon",
    avatar: "/placeholder.svg?height=60&width=60",
    points: 125750,
    level: 42,
    rank: 3,
  }

  const cars: Car[] = [
    {
      id: "1",
      name: "Phantom GT",
      brand: "Luxe Motors",
      rarity: "legendary",
      cost: 50000,
      image: "/placeholder.svg?height=300&width=400",
      owned: true,
    },
    {
      id: "2",
      name: "Neon Racer",
      brand: "Speed Co",
      rarity: "rare",
      cost: 25000,
      image: "/placeholder.svg?height=300&width=400",
      owned: false,
    },
    {
      id: "3",
      name: "Street King",
      brand: "Urban Auto",
      rarity: "common",
      cost: 10000,
      image: "/placeholder.svg?height=300&width=400",
      owned: false,
    },
    {
      id: "4",
      name: "Chrome Beast",
      brand: "Metal Works",
      rarity: "legendary",
      cost: 75000,
      image: "/placeholder.svg?height=300&width=400",
      owned: false,
    },
    {
      id: "5",
      name: "Drift Master",
      brand: "Slide Tech",
      rarity: "rare",
      cost: 30000,
      image: "/placeholder.svg?height=300&width=400",
      owned: true,
    },
    {
      id: "6",
      name: "City Cruiser",
      brand: "Metro Motors",
      rarity: "common",
      cost: 8000,
      image: "/placeholder.svg?height=300&width=400",
      owned: false,
    },
  ]

  const achievements: Achievement[] = [
    {
      id: "1",
      title: "Daily Warrior",
      description: "Complete daily challenges",
      progress: 85,
      maxProgress: 100,
      category: "daily",
      unlocked: false,
      icon: Target,
    },
    {
      id: "2",
      title: "Speed Demon",
      description: "Reach max speed 50 times",
      progress: 100,
      maxProgress: 100,
      category: "speed",
      unlocked: true,
      icon: Zap,
    },
    {
      id: "3",
      title: "Team Player",
      description: "Win 25 team races",
      progress: 60,
      maxProgress: 100,
      category: "team",
      unlocked: false,
      icon: Users,
    },
    {
      id: "4",
      title: "Collector",
      description: "Own 10 legendary cars",
      progress: 30,
      maxProgress: 100,
      category: "daily",
      unlocked: false,
      icon: Crown,
    },
    {
      id: "5",
      title: "Perfectionist",
      description: "Get perfect scores",
      progress: 100,
      maxProgress: 100,
      category: "speed",
      unlocked: true,
      icon: Award,
    },
    {
      id: "6",
      title: "Social Racer",
      description: "Race with friends",
      progress: 75,
      maxProgress: 100,
      category: "team",
      unlocked: false,
      icon: Flame,
    },
  ]

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "#3b82f6"
      case "rare":
        return "#8b5cf6"
      case "legendary":
        return "#f59e0b"
      default:
        return "#3b82f6"
    }
  }

  const addToCart = (carId: string) => {
    setCartItems((prev) => [...prev, carId])
  }

  // Main Garage View
  const GarageView = () => (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      {/* 3D Scene */}
      <div className="absolute inset-0">
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[0, 2, 8]} />
          <ambientLight intensity={0.3} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
          <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={2} color="#00ffff" />

          <Car3D />
          <Particles />

          <Environment preset="night" />
          <OrbitControls enablePan={false} enableZoom={false} maxPolarAngle={Math.PI / 2} />
        </Canvas>
      </div>

      {/* Glassmorphic Sidebar */}
      <motion.div
        className="absolute left-6 top-6 bottom-6 w-80 z-10"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <GlassCard className="h-full p-6 flex flex-col">
          {/* User Profile */}
          <div className="flex items-center space-x-4 mb-8">
            <div className="relative">
              <img
                src={user.avatar || "/placeholder.svg"}
                alt="Avatar"
                className="w-16 h-16 rounded-full border-2 border-cyan-400"
              />
              <div className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-1">
                <Crown className="w-4 h-4 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{user.name}</h2>
              <p className="text-cyan-400">
                Level {user.level} • Rank #{user.rank}
              </p>
            </div>
          </div>

          {/* Points Counter */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300">Points</span>
              <Sparkles className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              <RollingNumber value={user.points} />
            </div>
          </div>

          {/* Today's Achievements */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Today's Progress</h3>
            <div className="space-y-4">
              {achievements.slice(0, 3).map((achievement) => (
                <div key={achievement.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">{achievement.title}</span>
                    <span className="text-xs text-cyan-400">{achievement.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-cyan-400 to-purple-400 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${achievement.progress}%` }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Team Leaderboard */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-4">Team Leaderboard</h3>
            <div className="space-y-3">
              {["RaceKing", "SpeedQueen", "NightRider"].map((name, index) => (
                <div key={name} className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : "bg-orange-500"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="text-white flex-1">{name}</span>
                  <span className="text-cyan-400 text-sm">{(150000 - index * 25000).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Floating Car Info */}
      <motion.div
        className="absolute right-6 bottom-6 z-10"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <GlassCard className="p-6 min-w-[300px]">
          <h3 className="text-2xl font-bold text-white mb-2">{cars[selectedCar].name}</h3>
          <p className="text-cyan-400 mb-4">{cars[selectedCar].brand}</p>
          <div className="flex items-center space-x-4">
            <div
              className={`px-3 py-1 rounded-full text-sm font-semibold`}
              style={{
                backgroundColor: getRarityColor(cars[selectedCar].rarity) + "20",
                color: getRarityColor(cars[selectedCar].rarity),
              }}
            >
              {cars[selectedCar].rarity.toUpperCase()}
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-white">{cars[selectedCar].cost.toLocaleString()}</span>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  )

  // Shop View
  const ShopView = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Luxury Garage</h1>
            <p className="text-gray-400">Discover and collect the finest vehicles</p>
          </div>
          <div className="flex items-center space-x-4">
            <GlassCard className="px-4 py-2">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5 text-cyan-400" />
                <span className="text-white font-semibold">{cartItems.length}</span>
              </div>
            </GlassCard>
            <GlassCard className="px-4 py-2">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-semibold">{user.points.toLocaleString()}</span>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Categories */}
        <div className="flex space-x-4 mb-8">
          {["All Cars", "Legendary", "Rare", "Common"].map((category) => (
            <motion.button
              key={category}
              className="px-6 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </div>

        {/* Car Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car, index) => (
            <motion.div
              key={car.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <GlassCard className="overflow-hidden group cursor-pointer">
                <div className="relative">
                  <img
                    src={car.image || "/placeholder.svg"}
                    alt={car.name}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(circle at center, ${getRarityColor(car.rarity)}20 0%, transparent 70%)`,
                      boxShadow: `inset 0 0 50px ${getRarityColor(car.rarity)}40`,
                    }}
                  />
                  {car.owned && (
                    <div className="absolute top-4 right-4 bg-green-500 rounded-full p-2">
                      <Star className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-white">{car.name}</h3>
                    <div
                      className="px-2 py-1 rounded text-xs font-semibold"
                      style={{
                        backgroundColor: getRarityColor(car.rarity) + "20",
                        color: getRarityColor(car.rarity),
                      }}
                    >
                      {car.rarity.toUpperCase()}
                    </div>
                  </div>

                  <p className="text-gray-400 mb-4">{car.brand}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Star className="w-5 h-5 text-yellow-400" />
                      <span className="text-white font-bold">{car.cost.toLocaleString()}</span>
                    </div>

                    <motion.button
                      className={`px-4 py-2 rounded-full font-semibold transition-all ${
                        car.owned
                          ? "bg-green-500/20 text-green-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:shadow-lg hover:shadow-cyan-500/25"
                      }`}
                      whileHover={!car.owned ? { scale: 1.05 } : {}}
                      whileTap={!car.owned ? { scale: 0.95 } : {}}
                      onClick={() => !car.owned && addToCart(car.id)}
                      disabled={car.owned}
                    >
                      {car.owned ? "Owned" : "Add to Cart"}
                    </motion.button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )

  // Achievements View
  const AchievementsView = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-4"
          >
            <Trophy className="w-16 h-16 text-yellow-400 mx-auto" />
          </motion.div>
          <h1 className="text-5xl font-bold text-white mb-4">Trophy Case</h1>
          <p className="text-gray-400 text-lg">Your racing achievements and milestones</p>
        </div>

        {/* Categories */}
        <div className="flex justify-center space-x-8 mb-12">
          {[
            { name: "Daily Warrior", icon: Target, color: "#3b82f6" },
            { name: "Speed Demon", icon: Zap, color: "#f59e0b" },
            { name: "Team Player", icon: Users, color: "#10b981" },
          ].map((category) => (
            <motion.div key={category.name} className="text-center" whileHover={{ scale: 1.1 }}>
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-3 mx-auto"
                style={{ backgroundColor: category.color + "20" }}
              >
                <category.icon className="w-8 h-8" style={{ color: category.color }} />
              </div>
              <span className="text-white font-semibold">{category.name}</span>
            </motion.div>
          ))}
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <GlassCard
                className={`p-6 relative overflow-hidden ${achievement.unlocked ? "border-yellow-400/50" : ""}`}
              >
                {achievement.unlocked && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-orange-500/10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                  />
                )}

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-full ${achievement.unlocked ? "bg-yellow-400/20" : "bg-gray-600/20"}`}>
                      <achievement.icon
                        className={`w-6 h-6 ${achievement.unlocked ? "text-yellow-400" : "text-gray-400"}`}
                      />
                    </div>
                    <ProgressRing
                      progress={achievement.progress}
                      size={60}
                      color={achievement.unlocked ? "#f59e0b" : "#6b7280"}
                    />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{achievement.title}</h3>
                  <p className="text-gray-400 mb-4">{achievement.description}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">
                      {achievement.progress}/{achievement.maxProgress}
                    </span>
                    {achievement.unlocked && (
                      <motion.button
                        className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full text-sm font-semibold text-white"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Share2 className="w-4 h-4" />
                        <span>Share</span>
                      </motion.button>
                    )}
                  </div>
                </div>

                {achievement.unlocked && (
                  <motion.div
                    className="absolute top-4 right-4"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <Star className="w-6 h-6 text-yellow-400 fill-current" />
                  </motion.div>
                )}
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="relative">
      {/* Navigation */}
      <motion.nav
        className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <GlassCard className="px-2 py-2">
          <div className="flex space-x-2">
            {[
              { key: "garage", label: "Garage", icon: Settings },
              { key: "shop", label: "Shop", icon: ShoppingCart },
              { key: "achievements", label: "Achievements", icon: Trophy },
              { key: "environments", label: "Environments", icon: Palette },
            ].map((item) => (
              <motion.button
                key={item.key}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold transition-all ${
                  currentScreen === item.key
                    ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
                onClick={() => setCurrentScreen(item.key as any)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </motion.button>
            ))}
          </div>
        </GlassCard>
      </motion.nav>

      {/* Screen Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
        >
          {currentScreen === "garage" && <GarageView />}
          {currentScreen === "shop" && <ShopView />}
          {currentScreen === "achievements" && <AchievementsView />}
          {currentScreen === "environments" && <GarageEnvironmentSelector />}
        </motion.div>
      </AnimatePresence>

      {/* Ambient Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-60"
            animate={{
              x: [0, Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1920)],
              y: [0, Math.random() * (typeof window !== "undefined" ? window.innerHeight : 1080)],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
            style={{
              left: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1920),
              top: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 1080),
            }}
          />
        ))}
      </div>
    </div>
  )
}
