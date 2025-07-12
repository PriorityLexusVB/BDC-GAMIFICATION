"use client"

import React, { useState, useEffect, createContext, useContext, ReactNode, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Calendar, Trophy, Car, ShoppingCart, Home, Award, Zap, Target, Star, X, Lock, Check, Sparkles } from 'lucide-react';

// UTILITY FUNCTIONS (from lib/utils.ts)
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// DATA (from page.tsx)
const CARS_DATA = [
  { id: "lexus-is", name: "Lexus IS 350 F Sport", image: "/cars/lexus-is-350.png", price: 0, owned: true, stats: { style: 4, speed: 5 } },
  { id: "lexus-rx", name: "Lexus RX 450h", image: "/cars/lexus-rx-450h.png", price: 0, owned: true, stats: { style: 5, luxury: 5 } },
  { id: "lexus-lc", name: "Lexus LC 500", image: "/cars/lexus-lc-500.png", price: 8000, owned: false, stats: { style: 5, luxury: 5 } },
  { id: "lamborghini", name: "Lamborghini Aventador", image: "/cars/lamborghini-aventador.png", price: 10000, owned: false, stats: { style: 5, speed: 5 } },
  { id: "ferrari", name: "Ferrari 488 GTB", image: "/cars/ferrari-488.png", price: 15000, owned: false, stats: { style: 5, speed: 5 } },
  { id: "porsche", name: "Porsche 911 Turbo S", image: "/cars/porsche-911.png", price: 12500, owned: false, stats: { style: 5, speed: 5 } },
];

const ACHIEVEMENTS_DATA = [
  { id: "lightning-response", name: "Lightning Response", description: "Answered 10 calls < 30s", icon: "⚡", rarity: "epic", category: "speed", unlocked: true, progress: 10, maxProgress: 10 },
  { id: "appointment-master", name: "Appointment Master", description: "10 appointments in one day", icon: "📅", rarity: "legendary", category: "closer", unlocked: true, progress: 10, maxProgress: 10 },
  { id: "team-catalyst", name: "Team Catalyst", description: "Help team hit daily goal 5x", icon: "🤝", rarity: "rare", category: "team", unlocked: false, progress: 3, maxProgress: 5 },
  { id: "early-bird", name: "Early Bird", description: "First call before 8 AM", icon: "☀️", rarity: "common", category: "speed", unlocked: false, progress: 0, maxProgress: 1 },
];

const GARAGE_THEMES_DATA = [
  { id: "underground", name: "Underground", preview: "/backgrounds/underground-garage.png", owned: true, cost: 0 },
  { id: "penthouse", name: "Penthouse", preview: "/backgrounds/penthouse-garage.png", owned: false, cost: 20000 },
  { id: "cyber", name: "Cyber Grid", preview: "https://placehold.co/400x200/003333/fff?text=Cyber+Grid", owned: false, cost: 35000 },
];

// --- STATE MANAGEMENT (Context API) ---
interface User {
  name: string;
  points: number;
  calls: number;
  appointments: number;
  streak: number;
}

interface GameState {
  currentUser: string;
  users: { [key: string]: User };
  powerHour: boolean;
  currentGarageTheme: string;
  currentUnderglow: string;
  currentCar: string;
  ownedItems: string[];
  activeCall: boolean;
  callStartTime: number | null;
}

interface GameContextType {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  addPoints: (points: number, user?: string) => void;
  purchaseItem: (itemId: string, cost: number) => boolean;
  isItemOwned: (itemId: string) => boolean;
  setActiveSection: (section: string) => void;
  activeSection: string;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const useGameState = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGameState must be used within a GameStateProvider");
  return context;
};

const GameStateProvider = ({ children }: { children: ReactNode }) => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [gameState, setGameState] = useState<GameState>({
    currentUser: "sarah",
    users: {
      sarah: { name: "Sarah M.", points: 12345, calls: 15, appointments: 8, streak: 3 },
      jessica: { name: "Jessica L.", points: 11875, calls: 12, appointments: 6, streak: 1 },
      emily: { name: "Emily R.", points: 10650, calls: 10, appointments: 5, streak: 0 },
    },
    powerHour: false,
    currentGarageTheme: "underground",
    currentUnderglow: "#7847ea",
    currentCar: "lexus-is",
    ownedItems: ["lexus-is", "lexus-rx", "underground"],
    activeCall: false,
    callStartTime: null,
  });

  const addPoints = (points: number, user: string = gameState.currentUser) => {
    setGameState(prev => ({
      ...prev,
      users: {
        ...prev.users,
        [user]: {
          ...prev.users[user],
          points: prev.users[user].points + points,
        },
      },
    }));
  };
  
  const purchaseItem = (itemId: string, cost: number): boolean => {
    if (gameState.users[gameState.currentUser].points >= cost && !gameState.ownedItems.includes(itemId)) {
      setGameState(prev => ({
        ...prev,
        ownedItems: [...prev.ownedItems, itemId],
        users: {
          ...prev.users,
          [prev.currentUser]: {
            ...prev.users[prev.currentUser],
            points: prev.users[prev.currentUser].points - cost,
          },
        },
      }));
      return true;
    }
    return false;
  };

  const isItemOwned = (itemId: string) => gameState.ownedItems.includes(itemId);

  const value = {
    gameState,
    setGameState,
    addPoints,
    purchaseItem,
    isItemOwned,
    activeSection,
    setActiveSection,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

// --- UI COMPONENTS (from components/ui) ---
const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & {variant?: string, size?: string}>(({ className, ...props }, ref) => (
  <button ref={ref} className={cn("inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50", className)} {...props} />
));
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...props} />
));
const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-6", className)} {...props} />
));
const Badge = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & {variant?: string}>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors", className)} {...props} />
));
const Progress = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { value: number }>(({ className, value, ...props }, ref) => (
    <div ref={ref} className={cn("relative h-2 w-full overflow-hidden rounded-full bg-secondary", className)} {...props}>
        <motion.div className="h-full w-full flex-1 bg-primary transition-all" style={{ width: `${value}%` }} />
    </div>
));

// --- PAGE COMPONENTS ---

const Dashboard = () => {
  const { gameState, setGameState, addPoints } = useGameState();
  const [callTimer, setCallTimer] = useState("00:00");
  const currentUser = gameState.users[gameState.currentUser];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState.activeCall && gameState.callStartTime) {
      interval = setInterval(() => {
        const elapsed = Date.now() - gameState.callStartTime!;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        setCallTimer(`${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState.activeCall, gameState.callStartTime]);

  const startCall = () => setGameState(prev => ({ ...prev, activeCall: true, callStartTime: Date.now() }));
  const endCall = () => setGameState(prev => ({ ...prev, activeCall: false, callStartTime: null }));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-black/20 border-purple-500/30">
          <CardContent className="p-4 text-center">
            <Phone className="w-8 h-8 mx-auto mb-2 text-purple-400" />
            <div className="text-2xl font-bold">{currentUser.calls}</div>
            <div className="text-sm text-muted-foreground">Today's Calls</div>
          </CardContent>
        </Card>
        {/* ... other stat cards */}
      </div>
      {gameState.activeCall && (
        <Card className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-500/50">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-bold mb-4">🔴 LIVE CALL</h3>
            <div className="text-4xl font-mono mb-2">{callTimer}</div>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => addPoints(50)} className="bg-green-600 hover:bg-green-700">Set Appt.</Button>
              <Button onClick={endCall} variant="outline">End Call</Button>
            </div>
          </CardContent>
        </Card>
      )}
      <div className="flex gap-4">
        <Button onClick={startCall} className="flex-1 bg-purple-600 hover:bg-purple-700">Start Call</Button>
      </div>
    </motion.div>
  );
};

const Garage = () => {
    const { gameState, setGameState, isItemOwned, purchaseItem } = useGameState();
    const currentCar = useMemo(() => CARS_DATA.find(c => c.id === gameState.currentCar) || CARS_DATA[0], [gameState.currentCar]);

    const CarDisplay = ({ car, underglow }: { car: any; underglow: string }) => (
        <div className="relative w-full h-64 flex items-center justify-center">
            <motion.div
                key={car.id}
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="relative"
            >
                <img
                    src={car.image}
                    alt={car.name}
                    className="object-contain filter drop-shadow-2xl max-h-52"
                    onError={(e) => { e.currentTarget.src = 'https://placehold.co/800x400/101010/FFF?text=Image+Error'; }}
                />
                <div
                    className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-80 h-8 rounded-full blur-xl opacity-70"
                    style={{
                        background: underglow,
                        animation: 'underglow-pulse 2s infinite ease-in-out'
                    }}
                />
            </motion.div>
        </div>
    );

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 space-y-6">
            <Card className="bg-black/20 border-purple-500/30 overflow-hidden">
                <div className="relative h-80">
                    <AnimatePresence>
                        <motion.img
                            key={gameState.currentGarageTheme}
                            src={GARAGE_THEMES_DATA.find(t => t.id === gameState.currentGarageTheme)?.preview}
                            alt="Garage background"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    </AnimatePresence>
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="relative z-10 h-full flex items-center justify-center">
                        <CarDisplay car={currentCar} underglow={gameState.currentUnderglow} />
                    </div>
                </div>
            </Card>
            {/* ... other garage controls */}
        </motion.div>
    );
};

const Achievements = () => {
  const [filter, setFilter] = useState("all");

  const AchievementBadge = ({ achievement }: { achievement: typeof ACHIEVEMENTS_DATA[0] }) => {
    const rarityColors = {
      common: "from-gray-400 to-gray-600",
      rare: "from-purple-400 to-purple-600",
      epic: "from-yellow-400 to-yellow-600",
      legendary: "from-pink-400 via-purple-500 to-cyan-500",
    };
    return (
      <Card className={`relative overflow-hidden transition-all duration-300 hover:scale-105 ${achievement.unlocked ? "opacity-100" : "opacity-50"}`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${rarityColors[achievement.rarity]} opacity-20`} />
        <CardContent className="p-6 text-center relative">
          <div className="text-4xl mb-3 filter drop-shadow-lg">{achievement.icon}</div>
          <h3 className="font-bold text-sm mb-2">{achievement.name}</h3>
          <p className="text-xs text-muted-foreground mb-3">{achievement.description}</p>
          <Progress value={(achievement.progress / achievement.maxProgress) * 100} />
          {achievement.unlocked && <Badge variant="secondary" className="absolute top-2 right-2 text-xs">✓</Badge>}
        </CardContent>
      </Card>
    );
  };
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">🏆 TROPHY ROOM</h2>
        {/* ... filter buttons */}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {ACHIEVEMENTS_DATA.filter(a => filter === 'all' || a.category === filter).map(ach => <AchievementBadge key={ach.id} achievement={ach} />)}
      </div>
    </motion.div>
  );
};

const Leaderboard = () => {
    const { gameState } = useGameState();
    const sortedUsers = useMemo(() => Object.values(gameState.users).sort((a, b) => b.points - a.points), [gameState.users]);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 space-y-6">
            <div className="text-center"><h2 className="text-2xl font-bold mb-4">🏆 LEADERBOARD</h2></div>
            <div className="space-y-4">
                {sortedUsers.map((user, index) => (
                    <Card key={user.name} className="bg-black/20 border-purple-500/30">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className={`text-2xl font-bold ${index === 0 ? "text-yellow-400" : index === 1 ? "text-gray-300" : index === 2 ? "text-amber-600" : ""}`}>#{index + 1}</div>
                            <div className="flex-1">
                                <div className="font-bold">{user.name}</div>
                                <div className="text-sm text-muted-foreground">{user.calls} Calls • {user.appointments} Appts</div>
                            </div>
                            <div className="text-xl font-bold text-purple-400">{user.points.toLocaleString()}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </motion.div>
    );
};

const Shop = () => {
    const { gameState, purchaseItem, isItemOwned } = useGameState();
    const currentUser = gameState.users[gameState.currentUser];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 space-y-6">
            <div className="text-center"><h2 className="text-2xl font-bold mb-4">🛒 SHOP</h2></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CARS_DATA.map(car => {
                    const owned = isItemOwned(car.id);
                    if (owned) return null;
                    return (
                        <Card key={car.id} className="bg-black/20 border-purple-500/30">
                            <div className="relative h-40">
                                <img src={car.image} alt={car.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = 'https://placehold.co/800x400/101010/FFF?text=Image+Error'; }} />
                            </div>
                            <CardContent className="p-4">
                                <h3 className="font-bold mb-2">{car.name}</h3>
                                <div className="text-lg font-bold text-purple-400 mb-4">{car.price.toLocaleString()} pts</div>
                                <Button onClick={() => purchaseItem(car.id, car.price)} disabled={currentUser.points < car.price} className="w-full bg-purple-600 hover:bg-purple-700">Purchase</Button>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </motion.div>
    );
};


// --- APP CONTAINER ---

const PageContent = () => {
  const { activeSection } = useGameState();

  switch (activeSection) {
    case 'dashboard': return <Dashboard />;
    case 'garage': return <Garage />;
    case 'achievements': return <Achievements />;
    case 'leaderboard': return <Leaderboard />;
    case 'shop': return <Shop />;
    default: return <Dashboard />;
  }
};

const AppLayout = () => {
  const { activeSection } = useGameState();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white font-sans">
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(120,71,234,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(120,71,234,0.1)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />
      </div>
      
      <Header />
      
      <main className="relative z-10 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <PageContent />
          </motion.div>
        </AnimatePresence>
      </main>
      
      <BottomNav />

      {/* Custom Global Styles */}
      <style>{`
          @keyframes underglow-pulse {
            0%, 100% { opacity: 0.7; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.05); }
          }
          body {
              font-family: 'Inter', sans-serif;
          }
      `}</style>
    </div>
  );
};

const App = () => {
  return (
    <GameStateProvider>
      <AppLayout />
    </GameStateProvider>
  );
};

const Header = () => {
  const { gameState } = useGameState();
  const [clickCount, setClickCount] = useState(0);
  const [showAdmin, setShowAdmin] = useState(false);
  const currentUser = gameState.users[gameState.currentUser];

  const handleLogoClick = () => {
    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);
    if (newClickCount >= 3) {
      setShowAdmin(true);
      setClickCount(0);
    }
    setTimeout(() => setClickCount(0), 1000);
  };

  return (
    <>
      <header className="relative z-20 p-4 border-b border-purple-500/30 bg-slate-900/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent cursor-pointer" onClick={handleLogoClick}>
            BDC DREAM GARAGE
          </h1>
          <div className="flex items-center gap-4">
            <Badge className="text-lg px-4 py-2 border-purple-500 bg-black/20">
              <Star className="w-4 h-4 mr-2 text-yellow-400" />
              {currentUser.points.toLocaleString()}
            </Badge>
          </div>
        </div>
      </header>
      {showAdmin && <AdminPanel_Modal onClose={() => setShowAdmin(false)} />}
    </>
  );
};

const BottomNav = () => {
  const { activeSection, setActiveSection } = useGameState();
  const navItems = [
    { id: "dashboard", icon: Home, label: "Home" },
    { id: "leaderboard", icon: Trophy, label: "Ranks" },
    { id: "achievements", icon: Award, label: "Awards" },
    { id: "garage", icon: Car, label: "Garage" },
    { id: "shop", icon: ShoppingCart, label: "Shop" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/80 border-t border-purple-500/30 backdrop-blur-sm z-50">
      <div className="flex justify-around py-2">
        {navItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveSection(id)}
            className={`flex flex-col items-center py-1 px-2 transition-colors w-1/5 ${activeSection === id ? "text-purple-400" : "text-gray-400 hover:text-white"}`}
          >
            <Icon className="w-6 h-6 mb-1" />
            <span className="text-xs">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

const AdminPanel_Modal = ({ onClose }: { onClose: () => void }) => {
    const { addPoints, setGameState } = useGameState();
    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <Card className="w-full max-w-md bg-slate-900/90 border-purple-500">
                <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold">Admin Panel</h3>
                        <Button variant="ghost" size="sm" onClick={onClose}><X className="w-4 h-4" /></Button>
                    </div>
                    <div className="space-y-4">
                        <Button onClick={() => addPoints(1000)} className="w-full bg-green-600 hover:bg-green-700">Add 1000 Points</Button>
                        <Button onClick={() => setGameState(p => ({ ...p, powerHour: !p.powerHour }))} className="w-full bg-yellow-600 hover:bg-yellow-700">Toggle Power Hour</Button>
                        <Button onClick={() => setGameState(p => ({ ...p, ownedItems: CARS_DATA.map(c => c.id) }))} className="w-full bg-purple-600 hover:bg-purple-700">Unlock All Cars</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default App;
