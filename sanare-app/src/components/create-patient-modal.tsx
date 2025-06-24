"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { createPatient } from "@/lib/api"

interface CreatePatientModalProps {
  isOpen: boolean
  onClose: () => void
  onPatientCreated: (patientId: string) => void
  providerid: string
}

export function CreatePatientModal({ isOpen, onClose, onPatientCreated, providerid }: CreatePatientModalProps) {
  const [firstname, setFirstname] = useState("")
  const [lastname, setLastname] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [firstnameError, setFirstnameError] = useState("")
  const [lastnameError, setLastnameError] = useState("")
  const [phoneError, setPhoneError] = useState("")
  const [emailError, setEmailError] = useState("")

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

  const validatePhone = (value: string) => {
    const trimmed = value.trim()
    if (!trimmed) return "This field is required"
    if (!/^\+?[0-9\-\s()]{7,20}$/.test(trimmed)) return "Invalid phone number format"
    return ""
  }

  const validateEmail = (value: string) => {
    const trimmed = value.trim()
    if (!trimmed) return "This field is required"
    // Simple email regex
    if (!/^\S+@\S+\.\S+$/.test(trimmed)) return "Invalid email address"
    return ""
  }

  const validateInputs = () => {
    const firstnameValidation = validateName(firstname, "firstName")
    const lastnameValidation = validateName(lastname, "lastName")
    const phoneValidation = validatePhone(phone)
    const emailValidation = validateEmail(email)
    setFirstnameError(firstnameValidation)
    setLastnameError(lastnameValidation)
    setPhoneError(phoneValidation)
    setEmailError(emailValidation)
    return !firstnameValidation && !lastnameValidation && !phoneValidation && !emailValidation
  }

  const handleFirstnameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFirstname(value)
    setFirstnameError(validateName(value, "firstName"))
  }

  const handleLastnameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLastname(value)
    setLastnameError(validateName(value, "lastName"))
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPhone(value)
    setPhoneError(validatePhone(value))
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    setEmailError(validateEmail(value))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (!validateInputs()) return

    setIsSubmitting(true)
    try {
      console.log('Submitting patient with providerid:', providerid);
      const { patientid } = await createPatient(firstname.trim(), lastname.trim(), providerid, phone.trim(), email.trim())
      onPatientCreated(patientid)
      onClose()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create patient. Please try again."
      setError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = !firstnameError && !lastnameError && !phoneError && !emailError && firstname.trim().length >= 2 && lastname.trim().length >= 2 && phone.trim().length > 0 && email.trim().length > 0 && !isSubmitting

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
                <label htmlFor="firstname" className="block text-sm font-medium mb-1">
                  First Name
                </label>
                <input
                  id="firstname"
                  type="text"
                  value={firstname}
                  onChange={handleFirstnameChange}
                  className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    firstnameError ? "border-red-500 focus:ring-red-500" : "focus:ring-[#D8B4F0]"
                  }`}
                  disabled={isSubmitting}
                />
                {firstnameError && (
                  <div className="text-red-500 text-sm mt-1">{firstnameError}</div>
                )}
              </div>

              <div>
                <label htmlFor="lastname" className="block text-sm font-medium mb-1">
                  Last Name
                </label>
                <input
                  id="lastname"
                  type="text"
                  value={lastname}
                  onChange={handleLastnameChange}
                  className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    lastnameError ? "border-red-500 focus:ring-red-500" : "focus:ring-[#D8B4F0]"
                  }`}
                  disabled={isSubmitting}
                />
                {lastnameError && (
                  <div className="text-red-500 text-sm mt-1">{lastnameError}</div>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-1">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    phoneError ? "border-red-500 focus:ring-red-500" : "focus:ring-[#D8B4F0]"
                  }`}
                  disabled={isSubmitting}
                  placeholder="e.g. +1 555-123-4567"
                />
                {phoneError && (
                  <div className="text-red-500 text-sm mt-1">{phoneError}</div>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    emailError ? "border-red-500 focus:ring-red-500" : "focus:ring-[#D8B4F0]"
                  }`}
                  disabled={isSubmitting}
                  placeholder="e.g. patient@email.com"
                />
                {emailError && (
                  <div className="text-red-500 text-sm mt-1">{emailError}</div>
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