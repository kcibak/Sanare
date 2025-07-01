import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme-provider"
import AuthProvider from "./AuthProvider"
import { PatientProvider } from "@/lib/context/patient-context"
import { TherapistProvider } from "@/lib/context/therapist-context"

// Import pages
import HomePage from "@/app/page"
import Layout from "@/app/layout"
import TherapistLogin from "@/app/therapist/login/page"
import PatientLogin from "@/app/patient/login/page"
import Dashboard from "@/app/dashboard/page"
import PatientPage from "@/app/patient/page"

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="sanare-ui-theme">
      <BrowserRouter>
        <TherapistProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/therapist/login" element={<TherapistLogin />} />
              <Route path="/patient/login" element={<PatientLogin />} />
              {/* Protected patient route */}
              <Route path="/patient" element={
                <AuthProvider>
                  <PatientProvider>
                    <PatientPage />
                  </PatientProvider>
                </AuthProvider>
              } />
              {/* Protected therapist route */}
              <Route path="/dashboard" element={
                <AuthProvider>
                  <Dashboard />
                </AuthProvider>
              } />
            </Routes>
          </Layout>
          <Toaster />
        </TherapistProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
