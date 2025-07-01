"use client"

import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, Bell, Mic, MicOff, LogOut } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"

interface TherapistHeaderProps {
  therapist: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
  }
}

export function TherapistHeader({ therapist }: TherapistHeaderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    navigate('/')
  }

  const getInitials = () => {
    const first = therapist.firstName && therapist.firstName.length > 0 ? therapist.firstName[0] : '';
    const last = therapist.lastName && therapist.lastName.length > 0 ? therapist.lastName[0] : '';
    return `${first}${last}`.toUpperCase() || '??';
  }

  return (
    <header className="bg-white shadow w-full">
      <div className="flex flex-row items-center justify-between w-full px-6 py-4">
        <div className="flex flex-col items-start">
          <Link to="/">
            <span className="text-4xl font-handwritten text-[#333] leading-tight">Sanare</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">
            Welcome, <span className="text-3xl font-bold">{therapist.firstName} {therapist.lastName}</span>
          </h1>
          <p className="text-sm text-gray-500">
            Provider ID: {therapist.id}
          </p>
        </div>
        <Button
          variant="ghost"
          className="ml-auto p-6 flex items-center justify-center"
          onClick={() => navigate('/')}
          title="Sign out"
          style={{ minWidth: 96, minHeight: 96 }}
        >
          <span className="sr-only">Sign out</span>
          <LogOut style={{ width: '100%', height: '100%' }} className="text-[#D8B4F0] hover:text-[#B983D8] transition-colors drop-shadow-lg" />
        </Button>
      </div>
    </header>
  )
}