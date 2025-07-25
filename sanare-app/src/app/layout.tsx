import type React from "react"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className={cn("min-h-screen bg-background font-sans antialiased")}>
      <div className="fixed bottom-2 right-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full z-50 shadow-lg border border-yellow-300">
        <span className="font-bold">Demo Mode</span>: No data is saved. All data is loaded from static files.
      </div>
      {children}
      <Toaster />
    </div>
  )
}