import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BDC Dream Garage",
  description: "Gamification app for automotive BDC teams",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        {children}
        <Toaster 
          theme="dark" 
          position="top-center"
          toastOptions={{
            style: {
              background: 'rgb(23 23 23)',
              color: 'rgb(229 231 235)',
              border: '1px solid rgb(75 85 99)',
            },
          }}
        />
      </body>
    </html>
  )
}
