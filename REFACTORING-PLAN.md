# 🔨 BDC Dream Garage - Detailed Refactoring Plan

## Overview
This document provides a step-by-step plan to clean up and improve the BDC Dream Garage application based on the diagnostic analysis.

---

## Phase 1: Critical Fixes & Cleanup (Priority 1)

### 1.1 Fix Security Vulnerabilities
**Time Estimate:** 5 minutes

```bash
npm audit fix
npm update next@latest
```

**Verification:**
```bash
npm audit
```

### 1.2 Fix Font Loading Issue
**Time Estimate:** 10 minutes

**Current Issue:**
```typescript
// app/layout.tsx
import { Inter } from "next/font/google"
const inter = Inter({ subsets: ["latin"] })
```

**Solution Option A - Use System Fonts:**
```typescript
// Remove the import, use Tailwind's default font stack
// Update globals.css
body {
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
```

**Solution Option B - Use next/font with local fonts:**
```typescript
import localFont from 'next/font/local'
 
const inter = localFont({
  src: './fonts/Inter-Variable.ttf',
  variable: '--font-inter',
})
```

### 1.3 Fix ESLint Errors
**Time Estimate:** 15 minutes

**Error 1: Unescaped entities**
```typescript
// Before
<p>Don't worry</p>

// After
<p>Don&apos;t worry</p>
// OR
<p>{"Don't worry"}</p>
```

**Error 2: Missing display names**
```typescript
// Before
const Button = React.forwardRef<...>(({ ... }, ref) => ...)

// After
Button.displayName = "Button"
```

**Error 3: Image optimization**
```typescript
// Before
<img src={car.image} alt={car.name} />

// After
import Image from 'next/image'
<Image src={car.image} alt={car.name} width={800} height={400} />
```

### 1.4 Remove Code Duplication
**Time Estimate:** 30 minutes

**Step 1: Delete duplicate file**
```bash
rm components/bdc-dream-garage.tsx
```

**Step 2: Remove inline component definitions from app/page.tsx**

Delete lines 142-158 and replace with imports:
```typescript
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
```

### 1.5 Fix Public Assets Directory
**Time Estimate:** 10 minutes

```bash
# Move files from nested public/public/ to public/
mv public/public/cars public/
mv public/public/backgrounds public/
rm -rf public/public/
```

**Update image paths in code:**
```typescript
// Before
image: "/cars/lexus-is-350.png"

// After (verify this path exists)
image: "/cars/lexus-is-350.png"
```

---

## Phase 2: Remove Unused Code (Priority 2)

### 2.1 Identify Used Components
**Time Estimate:** 15 minutes

Run analysis:
```bash
# Find all imports from components/ui
grep -r "from '@/components/ui" app/ components/ --include="*.tsx" | sort | uniq
```

**Currently Used:**
- button (error.tsx, not-found.tsx)
- toast/toaster/sonner (layout.tsx)

**Needed for app/page.tsx after refactor:**
- button
- card
- badge
- progress
- tabs (if used in features)

### 2.2 Remove Unused UI Components
**Time Estimate:** 10 minutes

**Keep these files:**
```
components/ui/
  button.tsx
  card.tsx
  badge.tsx
  progress.tsx
  tabs.tsx
  toast.tsx
  toaster.tsx
  sonner.tsx
```

**Delete these files:**
```bash
cd components/ui
rm accordion.tsx alert.tsx alert-dialog.tsx aspect-ratio.tsx avatar.tsx \
   breadcrumb.tsx calendar.tsx carousel.tsx chart.tsx checkbox.tsx \
   collapsible.tsx command.tsx context-menu.tsx dialog.tsx drawer.tsx \
   dropdown-menu.tsx form.tsx hover-card.tsx input.tsx input-otp.tsx \
   label.tsx menubar.tsx navigation-menu.tsx pagination.tsx popover.tsx \
   radio-group.tsx resizable.tsx scroll-area.tsx select.tsx separator.tsx \
   sheet.tsx sidebar.tsx skeleton.tsx slider.tsx switch.tsx table.tsx \
   textarea.tsx toggle.tsx toggle-group.tsx tooltip.tsx use-mobile.tsx
```

### 2.3 Clean Up Unused Dependencies
**Time Estimate:** 20 minutes

**Analyze dependencies:**
```bash
npx depcheck
```

**Potentially unused Radix UI components:**
```json
"@radix-ui/react-accordion": "^1.2.0",  // Remove if accordion.tsx deleted
"@radix-ui/react-avatar": "^1.1.0",     // Remove if avatar.tsx deleted
"@radix-ui/react-dialog": "^1.1.1",     // Remove if dialog.tsx deleted
```

**Update package.json after confirming:**
```bash
npm uninstall @radix-ui/react-accordion @radix-ui/react-avatar @radix-ui/react-dialog
npm install  # Regenerate package-lock.json
```

### 2.4 Remove Unused Hooks
**Time Estimate:** 5 minutes

Check if these are used:
```bash
grep -r "use-mobile" app/ components/ --include="*.tsx"
grep -r "use-toast" app/ components/ --include="*.tsx"
```

If not used:
```bash
rm hooks/use-mobile.tsx
# Keep hooks/use-toast.ts if toast/sonner needs it
```

---

## Phase 3: Code Organization (Priority 3)

### 3.1 Create Feature Components Directory
**Time Estimate:** 45 minutes

**Create new structure:**
```bash
mkdir -p components/features
mkdir -p lib/context
mkdir -p lib/types
mkdir -p lib/data
```

**Extract components from app/page.tsx:**

1. **Dashboard Component** (lines ~162-212)
   - Create `components/features/Dashboard.tsx`
   - Export default function Dashboard

2. **Garage Component** (lines ~214-268)
   - Create `components/features/Garage.tsx`
   - Export default function Garage

3. **Achievements Component** (lines ~270-305)
   - Create `components/features/Achievements.tsx`
   - Export default function Achievements

4. **Leaderboard Component** (lines ~307-330)
   - Create `components/features/Leaderboard.tsx`
   - Export default function Leaderboard

5. **Shop Component** (lines ~332-359)
   - Create `components/features/Shop.tsx`
   - Export default function Shop

6. **Header Component** (lines ~425-459)
   - Create `components/features/Header.tsx`
   - Export default function Header

7. **BottomNav Component** (lines ~461-487)
   - Create `components/features/BottomNav.tsx`
   - Export default function BottomNav

8. **AdminPanel Component** (lines ~489-508)
   - Create `components/features/AdminPanel.tsx`
   - Export default function AdminPanel

### 3.2 Extract Context and State
**Time Estimate:** 30 minutes

**Create `lib/context/GameContext.tsx`:**
```typescript
// Move lines 38-139 from app/page.tsx
export { GameContext, GameStateProvider, useGameState }
export type { GameState, GameContextType, User }
```

**Create `lib/types/game.types.ts`:**
```typescript
export interface User {
  name: string;
  points: number;
  calls: number;
  appointments: number;
  streak: number;
}

export interface Car {
  id: string;
  name: string;
  image: string;
  price: number;
  owned: boolean;
  stats: {
    style?: number;
    speed?: number;
    luxury?: number;
  };
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

export interface GarageTheme {
  id: string;
  name: string;
  preview: string;
  owned: boolean;
  cost: number;
}
```

### 3.3 Extract Data Constants
**Time Estimate:** 15 minutes

**Create `lib/data/cars.ts`:**
```typescript
import { Car } from '@/lib/types/game.types'

export const CARS_DATA: Car[] = [
  // Move CARS_DATA from app/page.tsx
]
```

**Create `lib/data/achievements.ts`:**
```typescript
import { Achievement } from '@/lib/types/game.types'

export const ACHIEVEMENTS_DATA: Achievement[] = [
  // Move ACHIEVEMENTS_DATA from app/page.tsx
]
```

**Create `lib/data/themes.ts`:**
```typescript
import { GarageTheme } from '@/lib/types/game.types'

export const GARAGE_THEMES_DATA: GarageTheme[] = [
  // Move GARAGE_THEMES_DATA from app/page.tsx
]
```

### 3.4 Simplify app/page.tsx
**Time Estimate:** 20 minutes

**New app/page.tsx (should be ~50 lines):**
```typescript
"use client"

import { GameStateProvider } from '@/lib/context/GameContext'
import { Header } from '@/components/features/Header'
import { BottomNav } from '@/components/features/BottomNav'
import { Dashboard } from '@/components/features/Dashboard'
import { Garage } from '@/components/features/Garage'
import { Achievements } from '@/components/features/Achievements'
import { Leaderboard } from '@/components/features/Leaderboard'
import { Shop } from '@/components/features/Shop'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameState } from '@/lib/context/GameContext'

function PageContent() {
  const { activeSection } = useGameState()
  
  const sections = {
    dashboard: Dashboard,
    garage: Garage,
    achievements: Achievements,
    leaderboard: Leaderboard,
    shop: Shop,
  }
  
  const Component = sections[activeSection as keyof typeof sections] || Dashboard
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Component />
      </motion.div>
    </AnimatePresence>
  )
}

export default function Home() {
  return (
    <GameStateProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        {/* Background grid effect */}
        <div className="fixed inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(120,71,234,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(120,71,234,0.1)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />
        </div>
        
        <Header />
        
        <main className="relative z-10 pb-20">
          <PageContent />
        </main>
        
        <BottomNav />
      </div>
    </GameStateProvider>
  )
}
```

---

## Phase 4: Quality Improvements (Priority 4)

### 4.1 Add TypeScript Strict Mode Compliance
**Time Estimate:** 30 minutes

**Update tsconfig.json:**
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true
  }
}
```

**Fix any new errors:**
- Add explicit types to function parameters
- Handle null/undefined cases
- Add proper return types

### 4.2 Add Error Boundaries
**Time Estimate:** 20 minutes

**Create `components/ErrorBoundary.tsx`:**
```typescript
'use client'

import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 text-center">
          <h2>Something went wrong</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
```

### 4.3 Add Loading States
**Time Estimate:** 15 minutes

**Wrap expensive components:**
```typescript
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

<Suspense fallback={<LoadingSkeleton />}>
  <Garage />
</Suspense>
```

### 4.4 Optimize Images
**Time Estimate:** 25 minutes

**Add Next.js Image Loader:**
```typescript
// next.config.js
const nextConfig = {
  images: {
    domains: ['placehold.co', 'images.unsplash.com'],
    formats: ['image/avif', 'image/webp'],
  },
}
```

**Replace all `<img>` with `<Image>`:**
```typescript
import Image from 'next/image'

<Image 
  src={car.image}
  alt={car.name}
  width={800}
  height={400}
  className="object-contain"
  priority={isFirstCar}
/>
```

---

## Phase 5: Testing Infrastructure (Priority 5)

### 5.1 Install Testing Dependencies
**Time Estimate:** 10 minutes

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @vitejs/plugin-react jsdom
```

### 5.2 Configure Vitest
**Time Estimate:** 15 minutes

**Create `vitest.config.ts`:**
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
})
```

**Create `vitest.setup.ts`:**
```typescript
import '@testing-library/jest-dom'
```

### 5.3 Write Basic Tests
**Time Estimate:** 45 minutes

**Create `__tests__/Dashboard.test.tsx`:**
```typescript
import { render, screen } from '@testing-library/react'
import { Dashboard } from '@/components/features/Dashboard'
import { GameStateProvider } from '@/lib/context/GameContext'
import { describe, it, expect } from 'vitest'

describe('Dashboard', () => {
  it('renders dashboard stats', () => {
    render(
      <GameStateProvider>
        <Dashboard />
      </GameStateProvider>
    )
    
    expect(screen.getByText(/Today's Calls/i)).toBeInTheDocument()
  })
})
```

**Add test script to package.json:**
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

---

## Phase 6: Data Persistence (Future Enhancement)

### 6.1 Choose Storage Solution
**Options:**
1. **LocalStorage** (Simplest, client-only)
2. **Supabase** (Backend as a Service, recommended)
3. **Next.js API Routes + Database** (Full control)

### 6.2 Implement LocalStorage (Quick Win)
**Time Estimate:** 30 minutes

**Create `lib/hooks/useLocalStorage.ts`:**
```typescript
import { useState, useEffect } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        setStoredValue(JSON.parse(item))
      }
    } catch (error) {
      console.error(error)
    }
  }, [key])

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue] as const
}
```

**Update GameContext to use localStorage:**
```typescript
const [gameState, setGameState] = useLocalStorage<GameState>('bdc-game-state', {
  // initial values
})
```

---

## Summary Timeline

| Phase | Tasks | Time Estimate | Priority |
|-------|-------|--------------|----------|
| 1 | Critical Fixes | 1-2 hours | P1 |
| 2 | Remove Unused Code | 1 hour | P2 |
| 3 | Code Organization | 2-3 hours | P3 |
| 4 | Quality Improvements | 1.5 hours | P4 |
| 5 | Testing Infrastructure | 1.5 hours | P5 |
| 6 | Data Persistence | 2-3 hours | P6 |

**Total Estimated Time:** 9-13 hours

---

## Checklist

### Phase 1: Critical Fixes
- [ ] Run `npm audit fix`
- [ ] Fix font loading
- [ ] Fix ESLint errors (entities, display names, images)
- [ ] Delete `components/bdc-dream-garage.tsx`
- [ ] Remove inline component definitions
- [ ] Fix public assets directory structure

### Phase 2: Remove Unused Code
- [ ] Identify used UI components
- [ ] Delete unused UI components (40+ files)
- [ ] Remove unused dependencies
- [ ] Remove unused hooks

### Phase 3: Code Organization
- [ ] Create feature components directory
- [ ] Extract Dashboard component
- [ ] Extract Garage component
- [ ] Extract Achievements component
- [ ] Extract Leaderboard component
- [ ] Extract Shop component
- [ ] Extract Header component
- [ ] Extract BottomNav component
- [ ] Extract AdminPanel component
- [ ] Extract GameContext
- [ ] Create type definitions
- [ ] Extract data constants
- [ ] Simplify app/page.tsx

### Phase 4: Quality Improvements
- [ ] Enable TypeScript strict mode
- [ ] Add error boundaries
- [ ] Add loading states
- [ ] Optimize images with Next.js Image

### Phase 5: Testing
- [ ] Install testing dependencies
- [ ] Configure Vitest
- [ ] Write basic component tests
- [ ] Add test scripts

### Phase 6: Data Persistence
- [ ] Choose storage solution
- [ ] Implement localStorage hook
- [ ] Update GameContext

---

## Verification Steps

After each phase, verify:

1. **Build succeeds:**
   ```bash
   npm run build
   ```

2. **Linting passes:**
   ```bash
   npm run lint
   ```

3. **App runs:**
   ```bash
   npm run dev
   ```

4. **Tests pass (after Phase 5):**
   ```bash
   npm test
   ```

---

## Risk Mitigation

### Before Starting:
1. ✅ Create a backup branch
2. ✅ Document current state (this report)
3. ✅ Commit all pending changes

### During Refactoring:
1. Work in small commits
2. Test after each major change
3. Keep old code commented initially (don't delete immediately)
4. Take screenshots of working features before refactoring

### After Completion:
1. Full regression testing
2. Performance benchmarking
3. Bundle size comparison
4. Deploy to staging first

---

**End of Refactoring Plan**
