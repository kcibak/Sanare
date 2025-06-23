"use client"

import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
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
      const response = await fetch(`/api/patients/${patientId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update patient name")
      }

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
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 