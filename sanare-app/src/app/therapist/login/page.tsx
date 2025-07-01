"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { ArrowLeft, X } from "lucide-react"
import { z } from "zod"
import { createTherapist, createProvider, loginProvider } from "@/lib/api"
import { useTherapist } from '@/lib/context/therapist-context';

// Add registration schema
const baseRegistrationSchema = z.object({
  firstname: z.string().min(2, "First name must be at least 2 characters"),
  lastname: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string()
});

const registrationSchema = baseRegistrationSchema.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export default function TherapistLogin() {
  const navigate = useNavigate()
  const { setTherapist } = useTherapist();
  const [therapistId, setTherapistId] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  // Add registration state
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [registrationErrors, setRegistrationErrors] = useState<Record<string, string>>({})
  const [isRegistering, setIsRegistering] = useState(false)
  const [showProviderIdModal, setShowProviderIdModal] = useState(false);
  const [newProviderId, setNewProviderId] = useState("");
  const [newProviderName, setNewProviderName] = useState("");
  const [pendingProvider, setPendingProvider] = useState<{ id: string, password: string } | null>(null);
  const providerIdInputRef = useRef<HTMLInputElement>(null);

  // Redirect if already authenticated
  useEffect(() => {
    // TODO: Check therapist authentication status
  }, [])

  // Add registration handlers
  const validateField = (field: string, value: string) => {
    try {
      if (field === 'password') {
        // For password field, validate all password requirements
        const passwordSchema = baseRegistrationSchema.shape.password;
        passwordSchema.parse(value);
        
        // Clear password error if validation passes
        setRegistrationErrors(prev => ({ ...prev, password: "" }));
        
        // If there's a confirmPassword, validate the match
        if (formData.confirmPassword) {
          if (value === formData.confirmPassword) {
            setRegistrationErrors(prev => ({ ...prev, confirmPassword: "" }));
          } else {
            setRegistrationErrors(prev => ({ 
              ...prev, 
              confirmPassword: "Passwords don't match" 
            }));
          }
        }
      } else if (field === 'confirmPassword') {
        // For confirmPassword, just check if it matches password
        if (value === formData.password) {
          setRegistrationErrors(prev => ({ ...prev, confirmPassword: "" }));
        } else {
          setRegistrationErrors(prev => ({ 
            ...prev, 
            confirmPassword: "Passwords don't match" 
          }));
        }      } else {
        // For other fields, validate individual field
        if (field === 'firstname') {
          baseRegistrationSchema.shape.firstname.parse(value);
        } else if (field === 'lastname') {
          baseRegistrationSchema.shape.lastname.parse(value);
        } else if (field === 'email') {
          baseRegistrationSchema.shape.email.parse(value);
        }
        setRegistrationErrors(prev => ({ ...prev, [field]: "" }));
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setRegistrationErrors(prev => ({ 
          ...prev, 
          [field]: error.errors[0].message 
        }));
      }
    }
  }

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    validateField(field, value);
  }

  // Add a reset function for the registration form
  const resetRegistrationForm = () => {
    setFormData({
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      confirmPassword: ""
    });
    setRegistrationErrors({});
    setIsRegistering(false);
  }

  // Modify the modal close handler to reset the form
  const handleCloseModal = () => {
    resetRegistrationForm();
    setShowCreateModal(false);
  }

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistering(true);
    try {
      // First validate the form data
      const validatedData = registrationSchema.parse(formData);
      // Call backend API to create provider
      const result = await createProvider(
        validatedData.firstname,
        validatedData.lastname,
        validatedData.email,
        validatedData.password
      );
      const provider = result.provider;
      setNewProviderId(provider.providerid);
      setNewProviderName(`${provider.firstname} ${provider.lastname}`);
      setPendingProvider({ id: provider.providerid, password: validatedData.password });
      setShowProviderIdModal(true);
      setShowCreateModal(false);
      resetRegistrationForm();
    } catch (error: any) {
      setRegistrationErrors({ general: error.message || 'Registration failed' });
    } finally {
      setIsRegistering(false);
    }
  };

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

      <div className="w-full max-w-md relative" style={{zIndex: 10}}>        <Link 
          to="/" 
          className="inline-flex items-center text-[#333] hover:text-[#555] transition-colors mb-8"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 max-w-md w-full"
        >
          <h1 className="text-3xl font-handwritten text-center mb-6 text-[#333]">Provider Login</h1>
          <div className="w-full flex flex-col items-center mb-6">
            <div className="bg-[#D8B4F0] text-white rounded-xl px-4 py-2 mb-2 text-center text-base font-semibold shadow-md">
              <span>Demo Provider</span><br />
              <span>ID: <span className="font-mono">28279240</span></span><br />
              <span>Password: <span className="font-mono">Test123!</span></span>
            </div>
          </div>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setIsLoading(true);
              setError("");
              try {
                const provider = await loginProvider(therapistId, password);
                setTherapist(provider);
                navigate('/dashboard');
              } catch (err: any) {
                setError(err.message || 'Login failed');
              } finally {
                setIsLoading(false);
              }
            }}
            className="space-y-4"
          >
            <div>
              <label htmlFor="therapistId" className="block text-sm font-medium text-gray-700 mb-1">
                Provider ID
              </label>
              <Input
                id="therapistId"
                value={therapistId}
                onChange={e => setTherapistId(e.target.value)}
                required
                className="w-full bg-white/70 backdrop-blur-sm border-0 focus:ring-2 focus:ring-[#D8B4F0]"
                placeholder="Enter your provider ID"
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
                className="w-full bg-white/70 backdrop-blur-sm border-0 focus:ring-2 focus:ring-[#D8B4F0]"
                placeholder="Enter your password"
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
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setShowCreateModal(true)}
                  className="text-[#D8B4F0] hover:underline"
                >
                  Create one here
                </button>
              </p>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Registration Modal */}
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

              <h2 className="text-2xl font-handwritten mb-6 text-center">Create Provider Account</h2>

              <form onSubmit={handleRegistration} className="space-y-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <Input
                    id="firstName"
                    type="text"
                    value={formData.firstname}
                    onChange={handleInputChange("firstname")}
                    placeholder="Enter your first name"
                    className={registrationErrors.firstName ? "border-red-500 w-full bg-white/70 backdrop-blur-sm border-0 focus:ring-2 focus:ring-[#D8B4F0]" : "w-full bg-white/70 backdrop-blur-sm border-0 focus:ring-2 focus:ring-[#D8B4F0]"}
                  />
                  {registrationErrors.firstName && (
                    <p className="mt-1 text-sm text-red-500">{registrationErrors.firstName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <Input
                    id="lastName"
                    type="text"
                    value={formData.lastname}
                    onChange={handleInputChange("lastname")}
                    placeholder="Enter your last name"
                    className={registrationErrors.lastName ? "border-red-500 w-full bg-white/70 backdrop-blur-sm border-0 focus:ring-2 focus:ring-[#D8B4F0]" : "w-full bg-white/70 backdrop-blur-sm border-0 focus:ring-2 focus:ring-[#D8B4F0]"}
                  />
                  {registrationErrors.lastName && (
                    <p className="mt-1 text-sm text-red-500">{registrationErrors.lastName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="regEmail" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <Input
                    id="regEmail"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange("email")}
                    placeholder="Enter your email address"
                    className={registrationErrors.email ? "border-red-500 w-full bg-white/70 backdrop-blur-sm border-0 focus:ring-2 focus:ring-[#D8B4F0]" : "w-full bg-white/70 backdrop-blur-sm border-0 focus:ring-2 focus:ring-[#D8B4F0]"}
                  />
                  {registrationErrors.email && (
                    <p className="mt-1 text-sm text-red-500">{registrationErrors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="regPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <Input
                    id="regPassword"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange("password")}
                    placeholder="Enter your password"
                    className={registrationErrors.password ? "border-red-500 w-full bg-white/70 backdrop-blur-sm border-0 focus:ring-2 focus:ring-[#D8B4F0]" : "w-full bg-white/70 backdrop-blur-sm border-0 focus:ring-2 focus:ring-[#D8B4F0]"}
                  />
                  <div className="mt-1 text-xs text-gray-500">
                    Password must contain:
                    <ul className="list-disc list-inside">
                      <li className={formData.password.length >= 8 ? "text-green-500" : ""}>
                        At least 8 characters
                      </li>
                      <li className={/[A-Z]/.test(formData.password) ? "text-green-500" : ""}>
                        One uppercase letter
                      </li>
                      <li className={/[a-z]/.test(formData.password) ? "text-green-500" : ""}>
                        One lowercase letter
                      </li>
                      <li className={/[0-9]/.test(formData.password) ? "text-green-500" : ""}>
                        One number
                      </li>
                      <li className={/[^A-Za-z0-9]/.test(formData.password) ? "text-green-500" : ""}>
                        One special character
                      </li>
                    </ul>
                  </div>
                  {registrationErrors.password && (
                    <p className="mt-1 text-sm text-red-500">{registrationErrors.password}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange("confirmPassword")}
                    placeholder="Confirm your password"
                    className={registrationErrors.confirmPassword ? "border-red-500 w-full bg-white/70 backdrop-blur-sm border-0 focus:ring-2 focus:ring-[#D8B4F0]" : "w-full bg-white/70 backdrop-blur-sm border-0 focus:ring-2 focus:ring-[#D8B4F0]"}
                  />
                  {registrationErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500">{registrationErrors.confirmPassword}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#D8B4F0] hover:bg-[#D8B4F0]/90 text-white"
                  disabled={isRegistering || Object.keys(registrationErrors).some(key => registrationErrors[key])}
                >
                  {isRegistering ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Provider ID Modal */}
      <AnimatePresence>
        {showProviderIdModal && (
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
                onClick={() => setShowProviderIdModal(false)}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
              <h2 className="text-2xl font-handwritten mb-4 text-center">Account Created!</h2>
              <p className="mb-2 text-center">Welcome, <span className="font-bold">{newProviderName}</span>!</p>
              <p className="mb-2 text-center">Your Provider ID:</p>
              <div className="flex items-center justify-center mb-4">
                <input
                  ref={providerIdInputRef}
                  value={newProviderId}
                  readOnly
                  className="border rounded px-2 py-1 text-center font-mono w-40 mr-2"
                  onFocus={e => e.target.select()}
                />
                <Button
                  type="button"
                  onClick={() => {
                    if (providerIdInputRef.current) {
                      providerIdInputRef.current.select();
                      document.execCommand('copy');
                    }
                  }}
                  className="ml-2"
                >
                  Copy
                </Button>
              </div>
              <p className="text-xs text-gray-500 text-center mb-2">(You will be logged in and redirected to your dashboard.)</p>
              <Button className="w-full mt-2" onClick={async () => {
                if (pendingProvider) {
                  try {
                    const loggedIn = await loginProvider(pendingProvider.id, pendingProvider.password);
                    setTherapist(loggedIn);
                    setShowProviderIdModal(false);
                    setPendingProvider(null);
                    navigate('/dashboard');
                  } catch (err) {
                    setShowProviderIdModal(false);
                    setPendingProvider(null);
                    alert('Auto-login failed. Please log in manually.');
                  }
                }
              }}>
                Go to Dashboard
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
