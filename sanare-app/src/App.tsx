import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme-provider"

// Import pages
import HomePage from "@/app/page"
import Layout from "@/app/layout"
import TherapistLogin from "@/app/therapist/login/page"
import PatientLogin from "@/app/patient/login/page"
import Dashboard from "@/app/dashboard/page"
import TherapistPage from "@/app/therapist/page"
import PatientPage from "@/app/patient/page"

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="sanare-ui-theme">
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/therapist/login" element={<TherapistLogin />} />
            <Route path="/therapist" element={<TherapistPage />} />
            <Route path="/patient/login" element={<PatientLogin />} />
            <Route path="/patient" element={<PatientPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </Layout>
        <Toaster />
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
