"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { DevStorage } from "@/lib/dev-storage"

export default function PatientLogin() {
  const navigate = useNavigate()
  const [patientId, setPatientId] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Initialize storage with demo data on page load
  useEffect(() => {
    DevStorage.initializeStorage();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    console.log('Patient Login - Attempting with:', { patientId, password });

    try {
      // Get the patient from our DevStorage
      const patient = DevStorage.getPatient(patientId);
      
      // For demo purposes, we'll use a fixed password
      if (patient && password === 'Patient123!') {
        console.log('Patient login successful:', patient);
        
        // Save current patient ID for session persistence
        localStorage.setItem("currentPatientId", patientId);
        navigate('/patient')
      } else {
        console.log('Patient login failed - Invalid credentials');
        setError("Invalid credentials. Please try again.")
      }
    } catch (error) {
      console.error('Login error:', error);
      setError("An error occurred during login. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">      {/* Background shapes - Fixed visibility */}
      <div className="absolute inset-0 overflow-hidden" style={{zIndex: 1}}>
        <div 
          className="absolute top-[10%] left-[15%] w-[40vw] h-[40vw] organic-shape-2 floating-slow opacity-70"
          style={{backgroundColor: '#FFB5D0'}}
        ></div>
        <div 
          className="absolute bottom-[20%] right-[10%] w-[35vw] h-[35vw] organic-shape floating opacity-70"
          style={{backgroundColor: '#B4F0E0'}}
        ></div>
        <div 
          className="absolute top-[40%] right-[20%] w-[25vw] h-[25vw] organic-shape-3 floating-fast opacity-70"
          style={{backgroundColor: '#D8B4F0'}}
        ></div>
        <div 
          className="absolute bottom-[10%] left-[25%] w-[30vw] h-[30vw] organic-shape floating opacity-70"
          style={{backgroundColor: '#F0B4D8'}}
        ></div>
      </div>

      <div className="w-full max-w-md relative" style={{zIndex: 10}}>
        <Link 
          to="/" 
          className="inline-flex items-center text-[#333] hover:text-[#555] transition-colors mb-8"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8"
        >
          <h1 className="text-3xl font-handwritten text-center mb-6 text-[#333]">Patient Login</h1>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="patientId" className="block text-sm font-medium text-gray-700 mb-1">
                Patient ID
              </label>
              <Input
                id="patientId"
                type="text"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                placeholder="Enter your patient ID"
                required
                className="w-full bg-white/70 backdrop-blur-sm border-0 focus:ring-2 focus:ring-[#D8B4F0]"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full bg-white/70 backdrop-blur-sm border-0 focus:ring-2 focus:ring-[#D8B4F0]"
              />
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg"
              >
                {error}
              </motion.div>
            )}

            <Button
              type="submit"
              className="w-full bg-[#D8B4F0] hover:bg-[#D8B4F0]/90 text-white transition-all duration-200 transform hover:scale-[1.02]"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* Development mode - TODO: fix for Vite */}
          {true && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 p-4 bg-yellow-50/80 backdrop-blur-sm rounded-lg"
            >
              <p className="text-yellow-800 text-sm">
                Demo Credentials:<br />
                ID: 1745013352290 (Sarah Johnson)<br />
                Password: Patient123!
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </main>
  )
}