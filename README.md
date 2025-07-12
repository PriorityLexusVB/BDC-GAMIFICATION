# BDC Dream Garage 🏎️

A luxury automotive gamification app for BDC (Business Development Center) teams, featuring Need for Speed Heat-inspired aesthetics with real car images and modern UI components.

![BDC Dream Garage](https://images.unsplash.com/photo-1570824104453-508955ab713e?w=1200&h=400&fit=crop)

## 🚀 Features

### Core Gamification
- **Points System** - Earn points for calls, appointments, and achievements
- **Combo Multipliers** - Chain actions for bonus points (2x, 3x, up to 10x)
- **Power Hour Mode** - Double points for one hour
- **Team Bonus** - 1.5x points when activated

### Main Sections
- **Dashboard** - Real-time stats, live call tracking, daily challenges
- **Leaderboard** - Team rankings with daily/weekly/monthly views
- **Trophy Room** - Achievements with rarity tiers (common, rare, epic, legendary)
- **Dream Garage** - Collect luxury cars with real images and customization
- **Shop System** - Purchase cars, themes, and power-ups

### Special Features
- **Admin Panel** - Hidden controls (triple-click logo to access)
- **Live Call Widget** - Timer and response tracking
- **Real Car Images** - High-quality photos from Unsplash
- **Glass Morphism UI** - Modern, sleek interface
- **Smooth Animations** - Powered by Framer Motion
- **Fully Responsive** - Works on all devices

## 🛠️ Tech Stack

- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling
- **[Framer Motion](https://www.framer.com/motion/)** - Smooth animations
- **[shadcn/ui](https://ui.shadcn.com/)** - High-quality UI components
- **[Sonner](https://sonner.emilkowal.ski/)** - Beautiful toast notifications
- **[Lucide React](https://lucide.dev/)** - Modern icon library

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/YOUR-USERNAME/bdc-dream-garage.git

# Navigate to project directory
cd bdc-dream-garage

# Install dependencies
npm install
# or
yarn install
# or
pnpm install

# Run development server
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app running.

## 📁 Project Structure

```
bdc-dream-garage/
├── app/
│   ├── globals.css      # Global styles and animations
│   ├── layout.tsx       # Root layout with metadata
│   └── page.tsx         # Home page
├── components/
│   ├── ui/              # shadcn/ui components
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── progress.tsx
│   │   ├── select.tsx
│   │   └── tabs.tsx
│   └── bdc-dream-garage.tsx  # Main app component
├── lib/
│   └── utils.ts         # Utility functions
├── public/              # Static assets
├── .gitignore          # Git ignore file
├── components.json      # shadcn/ui config
├── next.config.js       # Next.js config
├── package.json         # Dependencies
├── tailwind.config.ts   # Tailwind config
└── tsconfig.json        # TypeScript config
```

## 🎮 How to Use

### For BDC Team Members

1. **Dashboard** - View your stats, challenges, and start call simulations
2. **Earn Points**:
   - Call connected: 15 points (30 in Power Hour)
   - Fast response (<30s): 25 bonus points
   - Appointment set: 50 points (100 in Power Hour)
   - Appointment showed: 100 points (200 in Power Hour)
3. **Track Progress** - Check leaderboard rankings and unlock achievements
4. **Customize Garage** - Select themes and underglow colors
5. **Shop** - Spend points on new cars and power-ups

### Admin Features

Triple-click the "BDC DREAM GARAGE" logo to access:
- Switch between users
- Add bonus points
- Simulate calls and appointments
- Activate Power Hour or Team Bonus
- Unlock all content

## 🎨 Customization

### Changing Car Images
Edit the `CARS` array in `components/bdc-dream-garage.tsx`:
```typescript
const CARS: Car[] = [
  {
    id: 'lexus-is',
    name: 'Lexus IS 350 F Sport',
    price: 0,
    image: 'YOUR_IMAGE_URL_HERE',
    // ...
  }
]
```

### Modifying Colors
Update CSS variables in `app/globals.css`:
```css
:root {
  --primary: 263 90% 51%;  /* Purple */
  --secondary: 240 4.8% 95.9%;
  /* Add your custom colors */
}
```

### Adding Achievements
Add new achievements to the `achievements` array in the component.

## 🚀 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR-USERNAME/bdc-dream-garage)

1. Click the button above
2. Connect your GitHub account
3. Deploy with one click

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🔧 Environment Variables

Create a `.env.local` file for any environment variables:
```env
# Add any API keys or configuration here
NEXT_PUBLIC_API_URL=your_api_url
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Car images from [Unsplash](https://unsplash.com)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)

## 📞 Support

For support, email support@bdcdreamgarage.com or open an issue in this repository.

---

Built with ❤️ for BDC teams everywhere. Let's make those calls count! 🚀