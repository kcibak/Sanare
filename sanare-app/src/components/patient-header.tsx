"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useNavigate, Link } from "react-router-dom"

interface PatientHeaderProps {
  patient?: {
    id?: string;
    firstname?: string;
    lastname?: string;
  };
}

export function PatientHeader({ patient }: PatientHeaderProps) {
  const navigate = useNavigate();
  return (
    <header className="bg-white shadow w-full">
      <div className="flex flex-row items-center justify-between w-full px-6 py-4">
        <div className="flex flex-col items-start">
          <Link to="/">
            <span className="text-4xl font-handwritten text-[#333] leading-tight">Sanare</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">
            Welcome, <span className="text-3xl font-bold">{patient?.firstname} {patient?.lastname}</span>
          </h1>
          <p className="text-sm text-gray-500">
            Patient ID: {patient?.id || 'N/A'}
          </p>
        </div>
        <Button
          variant="ghost"
          className="ml-auto p-6 flex items-center justify-center"
          onClick={() => { localStorage.removeItem('currentPatientId'); navigate('/'); }}
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

