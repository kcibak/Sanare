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
import { useTherapist } from "@/lib/context/therapist-context"
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
  const { logout } = useTherapist()

  const handleLogout = () => {
    logout()
    navigate('/therapist/login')
  }

  const getInitials = () => {
    return `${therapist.firstName[0]}${therapist.lastName[0]}`.toUpperCase()
  }

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="mr-6">
              <h2 className="text-2xl font-handwritten text-[#D8B4F0]">Sanare</h2>
            </Link>
            <div>
              <h1 className="text-xl font-medium text-gray-900">
                Welcome, {therapist.firstName} {therapist.lastName}
              </h1>
              <p className="text-sm text-gray-500">
                Therapist ID: {therapist.id}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Development mode - TODO: fix for Vite */}
            {true && (
              <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                Demo Mode
              </div>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-10 w-10 cursor-pointer">
                  <AvatarFallback className="bg-[#D8B4F0] text-white">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}