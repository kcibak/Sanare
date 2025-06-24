"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Search, ArrowLeft, Plus } from "lucide-react"
import { CreatePatientModal } from "./create-patient-modal"
import { getPatients } from "@/lib/api"
import { useNavigate } from "react-router-dom"

interface PatientSelectionProps {
  onSelectPatient: (patientid: string) => void
  providerid: string
}

interface Patient {
  patientid: string
  firstname: string
  lastname: string
  age?: number
  pronouns?: string
  providerid: string
  createdat?: string
}

export function PatientSelection({ onSelectPatient, providerid }: PatientSelectionProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [patients, setPatients] = useState<Patient[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    loadPatients()
  }, [providerid])

  const loadPatients = async () => {
    try {
      setError(null)
      setIsLoading(true)
      console.log('Loading patients for provider:', providerid)
      // Fetch patients from backend API
      const patientData = await getPatients(providerid)
      console.log('Received patient data from API:', patientData)
      // Sort patients by last name, handling null/undefined cases
      const sortedPatients = patientData.sort((a: any, b: any) => {
        const aName = (a.lastname || '').toLowerCase()
        const bName = (b.lastname || '').toLowerCase()
        return aName.localeCompare(bName)
      })
      setPatients(sortedPatients)
    } catch (error) {
      console.error('Error loading patients:', error)
      setPatients([])
    } finally {
      setIsLoading(false)
    }
  }

  const handlePatientCreated = (patientid: string) => {
    console.log('Patient created, reloading patients...')
    loadPatients()
    onSelectPatient(patientid)
  }

  const handlePatientDeleted = () => {
    console.log('Patient deleted, reloading patients...')
    loadPatients()
    navigate('/')
  }

  const filteredPatients = patients
    .filter((patient) => {
      const fullName = `${patient.firstname || ''} ${patient.lastname || ''}`.toLowerCase()
      return fullName.includes(searchQuery.toLowerCase())
    })
    .filter((patient) => !!patient.patientid)

  const getInitials = (patient: Patient) => {
    const first = patient.firstname?.[0]?.toUpperCase() || ''
    const last = patient.lastname?.[0]?.toUpperCase() || ''
    return `${first}${last}` || '?'
  }

  const getDisplayName = (patient: Patient) => {
    const firstname = patient.firstname?.trim() || 'Unknown'
    const lastname = patient.lastname?.trim() || ''
    return `${firstname} ${lastname}`.trim()
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <Link to="/" className="text-[#333] hover:text-[#555] transition-colors">
          <ArrowLeft className="h-6 w-6" />
        </Link>

        <h1 className="text-2xl font-medium">Your Patients</h1>

        <motion.button
          className="p-2 rounded-full bg-[#D8B4F0] text-white shadow-md hover:shadow-lg transition-shadow"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="h-5 w-5" />
        </motion.button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#777]" size={18} />
        <input
          type="text"
          placeholder="Search patients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full py-3 pl-10 pr-4 rounded-xl bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-[#D8B4F0]"
        />
      </div>

      {error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : isLoading ? (
        <div className="text-center py-8">Loading patients...</div>
      ) : filteredPatients.length === 0 ? (
        <div className="text-center py-8">
          {searchQuery ? "No patients found matching your search" : "No patients yet. Create your first patient!"}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPatients.map((patient) => (
            <motion.div
              key={patient.patientid}
              className="bg-white rounded-2xl shadow-md p-5 cursor-pointer"
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
              onClick={() => onSelectPatient(patient.patientid)}
            >
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-[#D8B4F0] flex items-center justify-center text-white font-medium">
                  {getInitials(patient)}
                </div>

                <div className="flex-1">
                  <h2 className="text-lg font-medium">
                    {getDisplayName(patient)}
                  </h2>
                  <p className="text-sm text-[#777]">
                    {patient.age ? `${patient.age} years` : ''} 
                    {patient.age && patient.pronouns ? ' • ' : ''}
                    {patient.pronouns ? patient.pronouns : ''}
                  </p>
                  <p className="text-xs text-[#999]">Patient ID: {patient.patientid}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Keep your existing CreatePatientModal */}
      <CreatePatientModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onPatientCreated={handlePatientCreated}
        providerid={providerid}
      />
    </div>
  )
}