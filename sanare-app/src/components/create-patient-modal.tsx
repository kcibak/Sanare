"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { createPatient } from "@/lib/api"

interface CreatePatientModalProps {
  isOpen: boolean
  onClose: () => void
  onPatientCreated: (patientId: string) => void
  therapistId: string
}

export function CreatePatientModal({ isOpen, onClose, onPatientCreated, therapistId }: CreatePatientModalProps) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [firstNameError, setFirstNameError] = useState("")
  const [lastNameError, setLastNameError] = useState("")

  const validateName = (name: string, field: "firstName" | "lastName") => {
    const trimmedName = name.trim()
    
    if (!trimmedName) {
      return "This field is required"
    }
    
    if (trimmedName.length < 2) {
      return "Name must be at least 2 characters long"
    }
    
    if (!/^[a-zA-Z\s-']+$/.test(trimmedName)) {
      return "Name can only contain letters, spaces, hyphens, and apostrophes"
    }
    
    if (trimmedName.length > 50) {
      return "Name cannot exceed 50 characters"
    }
    
    return ""
  }

  const validateInputs = () => {
    const firstNameValidation = validateName(firstName, "firstName")
    const lastNameValidation = validateName(lastName, "lastName")
    
    setFirstNameError(firstNameValidation)
    setLastNameError(lastNameValidation)
    
    return !firstNameValidation && !lastNameValidation
  }

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFirstName(value)
    setFirstNameError(validateName(value, "firstName"))
  }

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLastName(value)
    setLastNameError(validateName(value, "lastName"))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (!validateInputs()) return

    setIsSubmitting(true)
    try {
      const { patientId } = await createPatient(firstName.trim(), lastName.trim(), therapistId)
      onPatientCreated(patientId)
      onClose()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create patient. Please try again."
      setError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = !firstNameError && !lastNameError && firstName.trim().length >= 2 && lastName.trim().length >= 2 && !isSubmitting

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-2xl font-medium mb-6">Create New Patient</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium mb-1">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={handleFirstNameChange}
                  className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    firstNameError ? "border-red-500 focus:ring-red-500" : "focus:ring-[#D8B4F0]"
                  }`}
                  disabled={isSubmitting}
                />
                {firstNameError && (
                  <div className="text-red-500 text-sm mt-1">{firstNameError}</div>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium mb-1">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={handleLastNameChange}
                  className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    lastNameError ? "border-red-500 focus:ring-red-500" : "focus:ring-[#D8B4F0]"
                  }`}
                  disabled={isSubmitting}
                />
                {lastNameError && (
                  <div className="text-red-500 text-sm mt-1">{lastNameError}</div>
                )}
              </div>

              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}

              <button
                type="submit"
                disabled={!isFormValid}
                className={`w-full py-2.5 px-4 rounded-lg transition-all duration-200 ${
                  isFormValid
                    ? "bg-[#D8B4F0] text-white hover:bg-[#C8A4E0] shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] font-extrabold text-lg border-2 border-transparent hover:border-[#B89AD0]"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                }`}
              >
                {isSubmitting ? "Creating..." : "Create Patient"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 