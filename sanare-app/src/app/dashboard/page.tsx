"use client";

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { TherapistHeader } from "@/components/therapist-header"
import { PatientInfo } from "@/components/patient-info"
import { PatientTimeline } from "@/components/patient-timeline"
import { NoteTakingInterface } from "@/components/note-taking-interface"
import { Clock } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { PatientSelection } from "@/components/patient-selection";
import { TherapistInterface } from "@/components/therapist-interface";
import { useTherapist } from '@/lib/context/therapist-context';

export default function Dashboard() {
  const [sessionTime, setSessionTime] = useState(24)
  const navigate = useNavigate()
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null)

  // Add a state to force PatientSelection reload
  const [patientListKey, setPatientListKey] = useState(0);

  // Update session time
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime((prev) => prev + 1)
    }, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [])

  const { therapist } = useTherapist();
  useEffect(() => {
    if (!therapist || !therapist.providerid) {
      navigate('/therapist/login');
    }
  }, [therapist, navigate]);

  // Map therapist context fields to TherapistHeader props
  const therapistHeaderProps = therapist && therapist.providerid
    ? {
        id: therapist.providerid,
        firstName: therapist.firstname || '',
        lastName: therapist.lastname || '',
        email: therapist.email || '',
      }
    : { id: '', firstName: '', lastName: '', email: '' }

  // Create animated background shapes
  const shapes = [
    { top: "15%", left: "5%", size: "w-32 h-32", delay: "0s" },
    { top: "60%", right: "8%", size: "w-24 h-24", delay: "0.5s" },
    { top: "80%", left: "15%", size: "w-20 h-20", delay: "1s" },
  ]

  const handlePatientDeleted = () => {
    setSelectedPatientId(null);
    setPatientListKey((k) => k + 1); // force PatientSelection to reload
  };

  // Listen for the custom deselectPatient event
  useEffect(() => {
    const handleDeselect = () => setSelectedPatientId(null);
    window.addEventListener('deselectPatient', handleDeselect);
    return () => window.removeEventListener('deselectPatient', handleDeselect);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFB5D0] relative overflow-hidden">
      {/* Animated background shapes */}
      {shapes.map((shape, index) => (
        <div
          key={index}
          className={`absolute organic-shape bg-primary/5 -z-10 animate-float ${shape.size}`}
          style={{
            top: shape.top,
            left: shape.left,
            right: shape.right,
            animationDelay: shape.delay,
          }}
        />
      ))}

      <TherapistHeader therapist={therapistHeaderProps} />

      <div className="flex-1 flex flex-col lg:flex-row p-4 gap-4 overflow-hidden">
        {/* Left panel: Patient list */}
        <div className="w-full lg:w-[350px] flex flex-col gap-4">
          {therapist && therapist.providerid ? (
            <PatientSelection
              key={patientListKey}
              onSelectPatient={setSelectedPatientId}
              providerid={therapist.providerid}
            />
          ) : null}
        </div>

        {/* Center panel: Main content */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          {selectedPatientId ? (
            <TherapistInterface
              patientid={selectedPatientId}
              onPatientDeleted={handlePatientDeleted}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-[#555]">
              <h2 className="text-2xl font-semibold mb-2">Welcome!</h2>
              <p className="text-lg">Select a patient from the list to view or manage their information.</p>
            </div>
          )}
        </div>

        {/* Right panel: Quick actions/stats (optional, can be filled in later) */}
        {/* <div className="w-full lg:w-[350px] flex flex-col gap-4">
          // Quick actions or stats
        </div> */}
      </div>
    </div>
  )
}

