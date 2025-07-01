"use client";

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PatientSidebar } from "@/components/patient-sidebar"
import { PatientJournal } from "@/components/patient-journal"
import { PatientSessionNotes } from "@/components/patient-session-notes"
import { PatientGoals } from "@/components/patient-goals"
import { ConfirmationModal } from "@/components/confirmation-modal"
import { usePatient } from "@/lib/context/patient-context"
import { PatientHeader } from "@/components/patient-header"

export default function PatientView() {
  const { patient } = usePatient();
  const [activeSection, setActiveSection] = useState<"journal" | "notes" | "goals">("notes")
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [messageToShare, setMessageToShare] = useState("")

  // Get background color based on active section
  const getBackgroundColor = () => {
    switch (activeSection) {
      case "journal":
        return "#E3F2FD" // Light blue
      case "notes":
        return "#FFF8E1" // Light yellow
      case "goals":
        return "#F3E5F5" // Light purple
      default:
        return "#E3F2FD" // Default light blue
    }
  }

  // Get sidebar background color based on active section
  const getSidebarColor = () => {
    switch (activeSection) {
      case "journal":
        return "#2196F3" // Blue
      case "notes":
        return "#FFC107" // Yellow/Amber
      case "goals":
        return "#9C27B0" // Purple
      default:
        return "#2196F3" // Default blue
    }
  }

  const handleShare = (message: string) => {
    setMessageToShare(message)
    setShowConfirmation(true)
  }

  const confirmShare = () => {
    // Logic to share message with therapist would go here
    setShowConfirmation(false)
    // Show success message or animation
  }

  return (
    <>
      <PatientHeader patient={patient ?? undefined} />
      <main
        className="min-h-screen flex relative overflow-hidden transition-colors duration-500"
        style={{ backgroundColor: getBackgroundColor() }}
      >
        {/* Background shapes */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div
            className="absolute top-[20%] right-[10%] w-[25vw] h-[25vw] organic-shape floating-slow opacity-20"
            style={{
              backgroundColor: getSidebarColor(),
            }}
          ></div>
          <div
            className="absolute bottom-[30%] left-[5%] w-[20vw] h-[20vw] organic-shape-2 floating opacity-20"
            style={{
              backgroundColor: getSidebarColor(),
            }}
          ></div>
        </div>

        {/* Left sidebar for navigation */}
        {/* Removed empty left sidebar container for more space */}

        {/* Section sidebar */}
        <PatientSidebar activeSection={activeSection} onChangeSection={setActiveSection} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col transition-all duration-500">
          {/* Removed persistent patient info bar */}

          {/* Content Area */}
          <div className="flex-1 p-4 overflow-auto">
            <AnimatePresence mode="wait">
              {activeSection === "journal" && (
                <motion.div
                  key="journal"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  <PatientJournal />
                </motion.div>
              )}

              {activeSection === "notes" && (
                <motion.div
                  key="notes"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  <PatientSessionNotes />
                </motion.div>
              )}

              {activeSection === "goals" && (
                <motion.div
                  key="goals"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  <PatientGoals />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Status Bar */}
          <div
            className="p-2 backdrop-blur-sm text-center text-xs transition-colors duration-500"
            style={{
              backgroundColor: `${getSidebarColor()}10`, // 10% opacity of the theme color
              color: getSidebarColor(),
            }}
          >
            <p>Last updated: Today at 2:45 PM</p>
          </div>
        </div>

        {/* Confirmation Modal */}
        <AnimatePresence>
          {showConfirmation && (          <ConfirmationModal
              isOpen={showConfirmation}
              title="Send Message to Therapist"
              message="Are you sure you want to send this message to your therapist? They will be notified immediately."
              confirmText="Yes, send message"
              onConfirm={confirmShare}
              onCancel={() => setShowConfirmation(false)}
            />
          )}
        </AnimatePresence>
      </main>
    </>
  )
}
