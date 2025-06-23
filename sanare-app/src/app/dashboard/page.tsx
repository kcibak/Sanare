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
import { useTherapist } from "@/lib/context/therapist-context"
import { useNavigate } from "react-router-dom"

export default function Dashboard() {
  const [sessionTime, setSessionTime] = useState(24)
  const { therapist, isLoading } = useTherapist()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && !therapist) {
      navigate('/therapist/login')
    }
  }, [isLoading, therapist, navigate])

  // Update session time
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime((prev) => prev + 1)
    }, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [])

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!therapist) {
    return <div className="min-h-screen flex items-center justify-center">No therapist found</div>
  }

  // Create animated background shapes
  const shapes = [
    { top: "15%", left: "5%", size: "w-32 h-32", delay: "0s" },
    { top: "60%", right: "8%", size: "w-24 h-24", delay: "0.5s" },
    { top: "80%", left: "15%", size: "w-20 h-20", delay: "1s" },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F1DE] relative overflow-hidden">
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

      <TherapistHeader therapist={therapist} />

      <div className="flex-1 flex flex-col lg:flex-row p-4 gap-4 overflow-hidden">
        {/* Left side - Notes area */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <Card className="flex-1 shadow-md overflow-hidden border-0 transition-all duration-300 hover:shadow-lg">
            <CardContent className="p-0 h-full flex flex-col">
              <Tabs defaultValue="session" className="flex flex-col h-full">
                <div className="px-6 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-serif font-semibold text-secondary">Session Notes</h2>
                    <TabsList className="grid grid-cols-3 w-[400px]">
                      <TabsTrigger value="session" className="transition-all duration-200">
                        Current
                      </TabsTrigger>
                      <TabsTrigger value="previous" className="transition-all duration-200">
                        Previous
                      </TabsTrigger>
                      <TabsTrigger value="templates" className="transition-all duration-200">
                        Templates
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className="bg-primary hover:bg-primary/90">In Progress</Badge>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {sessionTime} min
                    </span>
                  </div>
                </div>

                <TabsContent value="session" className="flex-1 px-6 pb-6 overflow-hidden flex flex-col">
                  <NoteTakingInterface />
                </TabsContent>

                <TabsContent value="previous" className="flex-1 px-6 pb-6 overflow-auto">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Previous Session Notes</h3>
                    <p>Previous session notes will appear here.</p>
                  </div>
                </TabsContent>

                <TabsContent value="templates" className="flex-1 px-6 pb-6 overflow-auto">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Note Templates</h3>
                    <p>Your saved templates will appear here.</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Right side - Patient info */}
        <div className="w-full lg:w-[350px] flex flex-col gap-4">
          <PatientInfo 
            patientId="1744937295964"
            firstName="Sarah"
            lastName="Johnson"
            age={28}
            pronouns="She/Her"
          />
          <PatientTimeline />
        </div>
      </div>
    </div>
  )
}

