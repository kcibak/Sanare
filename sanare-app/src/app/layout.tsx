import type React from "react"
import { cn } from "@/lib/utils"
import { TherapistProvider } from "@/lib/context/therapist-context"

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className={cn("min-h-screen bg-background font-sans antialiased")}>
      <TherapistProvider>
        <div className="fixed bottom-2 right-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full z-50">
          Demo Mode
        </div>
        {children}
      </TherapistProvider>
    </div>
  )
}