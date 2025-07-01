"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { ArrowLeft, X } from "lucide-react"
import { z } from "zod"
import { getPatient, setPatientPassword, loginPatient } from "@/lib/api"

export default function PatientLogin() {
  const navigate = useNavigate()
  const [patientId, setPatientId] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [registerPatientId, setRegisterPatientId] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");

  // Patient registration schema (same as provider password requirements)
  const patientRegistrationSchema = z.object({
    patientId: z.string().min(1, "Patient ID is required"),
    password: z.string().min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string()
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
  });

  // Registration handler
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError("");
    setRegisterSuccess("");
    // Validate with zod
    const result = patientRegistrationSchema.safeParse({
      patientId: registerPatientId,
      password: registerPassword,
      confirmPassword: registerConfirmPassword,
    });
    if (!result.success) {
      setRegisterError(result.error.errors[0].message);
      return;
    }
    // Fetch patient from backend
    let patient;
    try {
      patient = await getPatient(registerPatientId);
    } catch (err: any) {
      setRegisterError("Patient ID not found. Please check with your provider.");
      return;
    }
    if (!patient) {
      setRegisterError("Patient ID not found. Please check with your provider.");
      return;
    }
    // Check if already registered
    if (patient.password) {
      setRegisterError("Account already exists. Please sign in.");
      return;
    }
    // Save password to backend
    try {
      await setPatientPassword(registerPatientId, registerPassword);
      setRegisterSuccess("Account created! Redirecting to your dashboard...");
      setTimeout(() => {
        localStorage.setItem("currentPatientId", registerPatientId);
        navigate('/patient');
      }, 1200);
    } catch (err: any) {
      setRegisterError("Could not create account. Please try again.");
    }
  };

  // Reset registration form
  const resetRegistrationForm = () => {
    setRegisterPatientId("");
    setRegisterPassword("");
    setRegisterConfirmPassword("");
    setRegisterError("");
    setRegisterSuccess("");
  };

  // Modal close handler
  const handleCloseModal = () => {
    resetRegistrationForm();
    setShowCreateModal(false);
  };

  // Live password match error
  const passwordsDontMatch = registerPassword && registerConfirmPassword && registerPassword !== registerConfirmPassword;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background shapes - Fixed visibility */}
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
          <div className="w-full flex flex-col items-center mb-6">
            <div className="bg-[#B4F0E0] text-[#333] rounded-xl px-4 py-2 mb-2 text-center text-base font-semibold shadow-md">
              <span>Demo Patient</span><br />
              <span>ID: <span className="font-mono">65774788</span></span><br />
              <span>Password: <span className="font-mono">Test321!</span></span>
            </div>
          </div>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setIsLoading(true);
              setError("");
              try {
                const patient = await loginPatient(patientId, password);
                localStorage.setItem('currentPatientId', patient.patientid);
                navigate('/patient');
              } catch (err: any) {
                setError(err.message || 'Login failed');
              } finally {
                setIsLoading(false);
              }
            }}
            className="space-y-4"
          >
            <div>
              <label htmlFor="patientId" className="block text-sm font-medium text-gray-700 mb-1">
                Patient ID
              </label>
              <Input
                id="patientId"
                value={patientId}
                onChange={e => setPatientId(e.target.value)}
                required
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
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <Button
              type="submit"
              className="w-full bg-[#B4F0E0] hover:bg-[#B4F0E0]/90 text-[#333] transition-all duration-200 transform hover:scale-[1.02]"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setShowCreateModal(true)}
                className="text-[#B4F0E0] hover:underline font-semibold"
              >
                Create one here
              </button>
            </p>
          </div>
        </motion.div>
        <AnimatePresence>
          {showCreateModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md relative"
              >
                <button
                  onClick={handleCloseModal}
                  className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
                <h2 className="text-2xl font-handwritten mb-6 text-center">Create Patient Account</h2>
                <form className="space-y-4" onSubmit={handleRegister}>
                  <div>
                    <label htmlFor="registerPatientId" className="block text-sm font-medium text-gray-700 mb-1">
                      Patient ID
                    </label>
                    <Input
                      id="registerPatientId"
                      type="text"
                      value={registerPatientId}
                      onChange={(e) => setRegisterPatientId(e.target.value)}
                      placeholder="Enter your patient ID"
                      className={registerError && registerError.toLowerCase().includes('patient id') ? "border-red-500" : ""}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="registerPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <Input
                      id="registerPassword"
                      type="password"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      placeholder="Enter your password"
                      className={registerError && registerError.toLowerCase().includes('password') ? "border-red-500" : ""}
                      required
                    />
                    <div className="mt-1 text-xs text-gray-500">
                      Password must contain:
                      <ul className="list-disc list-inside">
                        <li className={registerPassword.length >= 8 ? "text-green-500" : ""}>
                          At least 8 characters
                        </li>
                        <li className={/[A-Z]/.test(registerPassword) ? "text-green-500" : ""}>
                          One uppercase letter
                        </li>
                        <li className={/[a-z]/.test(registerPassword) ? "text-green-500" : ""}>
                          One lowercase letter
                        </li>
                        <li className={/[0-9]/.test(registerPassword) ? "text-green-500" : ""}>
                          One number
                        </li>
                        <li className={/[^A-Za-z0-9]/.test(registerPassword) ? "text-green-500" : ""}>
                          One special character
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="registerConfirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <Input
                      id="registerConfirmPassword"
                      type="password"
                      value={registerConfirmPassword}
                      onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className={passwordsDontMatch ? "border-red-500" : ""}
                      required
                    />
                    {passwordsDontMatch && (
                      <p className="mt-1 text-sm text-red-500">Passwords don't match</p>
                    )}
                  </div>
                  {registerError && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg"
                    >
                      {registerError}
                    </motion.div>
                  )}
                  {registerSuccess && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-green-600 text-sm text-center bg-green-50 p-2 rounded-lg"
                    >
                      {registerSuccess}
                    </motion.div>
                  )}
                  <Button
                    type="submit"
                    className="w-full bg-[#B4F0E0] hover:bg-[#B4F0E0]/90 text-[#333]"
                    disabled={isLoading || passwordsDontMatch || !!registerError}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}