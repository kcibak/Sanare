"use client"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { updatePatientName } from "@/lib/api"

interface EditPatientNameModalProps {
  isOpen: boolean
  onClose: () => void
  patientId: string
  currentFirstName: string
  currentLastName: string
  onNameUpdated: (firstName: string, lastName: string) => void
}

export function EditPatientNameModal({
  isOpen,
  onClose,
  patientId,
  currentFirstName,
  currentLastName,
  onNameUpdated,
}: EditPatientNameModalProps) {
  const { toast } = useToast()
  const [firstName, setFirstName] = useState(currentFirstName)
  const [lastName, setLastName] = useState(currentLastName)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate input
    if (!firstName.trim() || !lastName.trim()) {
      toast({
        title: "Error",
        description: "Please enter both first and last name",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Update patient name in database
      await updatePatientName(patientId, firstName.trim(), lastName.trim())

      // Update UI
      onNameUpdated(firstName.trim(), lastName.trim())
      
      toast({
        title: "Success",
        description: "Patient name updated successfully",
      })
      
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update patient name. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Patient Name</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter first name"
                disabled={isSubmitting}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter last name"
                disabled={isSubmitting}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={onClose} disabled={isSubmitting} className="bg-transparent hover:bg-gray-100 text-gray-700 transition-colors shadow-none border-none">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-[#D8B4F0] text-white hover:bg-[#a06fd8] transition-colors">
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}