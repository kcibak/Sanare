"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronDown, ChevronUp, MessageSquare, Calendar, Edit, Trash2 } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { EditPatientNameModal } from "@/components/edit-patient-name-modal"
import { ConfirmationModal } from "@/components/confirmation-modal"
import { deletePatient } from "@/lib/api"
import { useNavigate } from "react-router-dom"

interface PatientInfoProps {
  patientid: string
  firstname: string
  lastname: string
  age?: number
  pronouns?: string
  email?: string
  phone?: string
  onPatientDeleted?: () => void
}

export function PatientInfo({ patientid, firstname, lastname, age, pronouns, email, phone, onPatientDeleted }: PatientInfoProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [currentFirstname, setCurrentFirstname] = useState(firstname)
  const [currentLastname, setCurrentLastname] = useState(lastname)
  const navigate = useNavigate()

  const handleNameUpdated = (newFirstname: string, newLastname: string) => {
    setCurrentFirstname(newFirstname)
    setCurrentLastname(newLastname)
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await deletePatient(patientid)
      setIsDeleteModalOpen(false)
      if (onPatientDeleted) {
        onPatientDeleted()
      }
      navigate('/')
    } catch (error) {
      console.error('Error deleting patient:', error)
      // You might want to show an error toast here
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <Card className="shadow-md border-0 transition-all duration-300 hover:shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src="/placeholder.svg?height=48&width=48" alt={`${currentFirstname} ${currentLastname}`} />
                <AvatarFallback>{`${currentFirstname[0]}${currentLastname[0]}`}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl font-serif">{`${currentFirstname} ${currentLastname}`}</CardTitle>
                <CardDescription>
                  {age && pronouns ? `${age} • ${pronouns}` : age ? `${age}` : pronouns ? pronouns : ""}
                </CardDescription>
                <div className="text-xs text-[#999] mt-1">Patient ID: {patientid}</div>
                {email && <div className="text-xs text-[#999]">Email: {email}</div>}
                {phone && <div className="text-xs text-[#999]">Phone: {phone}</div>}
              </div>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full transition-all duration-200 hover:bg-secondary/10 hover:text-secondary"
                onClick={() => setIsEditModalOpen(true)}
              >
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full transition-all duration-200 hover:bg-destructive/10 hover:text-destructive"
                onClick={() => setIsDeleteModalOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge className="bg-primary hover:bg-primary/90">Anxiety</Badge>
              <Badge className="bg-secondary hover:bg-secondary/90">Depression</Badge>
              <Badge variant="outline">Work Stress</Badge>
            </div>

            <CollapsibleContent className="space-y-4 animate-accordion-down">
              <Tabs defaultValue="overview">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                  <TabsTrigger value="goals">Goals</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4 pt-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Treatment</h4>
                    <p className="text-sm text-muted-foreground">CBT, Mindfulness, Weekly Sessions</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-1">Medication</h4>
                    <p className="text-sm text-muted-foreground">Sertraline 50mg daily (Dr. Roberts)</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-1">Emergency Contact</h4>
                    <p className="text-sm text-muted-foreground">Michael Johnson (Brother) - (555) 123-4567</p>
                  </div>
                </TabsContent>

                <TabsContent value="history" className="pt-4">
                  <ScrollArea className="h-[150px] pr-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium">Initial Assessment (Jan 15, 2024)</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Anxiety and depression following job loss. Difficulty sleeping, reduced appetite.
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Previous Therapy</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Brief counseling in 2021 (6 sessions). Discontinued due to insurance changes.
                        </p>
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="goals" className="pt-4">
                  <ScrollArea className="h-[150px] pr-4">
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">Develop coping strategies</h4>
                          <Badge className="bg-sage hover:bg-sage/90">70%</Badge>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">Improve work-life boundaries</h4>
                          <Badge className="bg-accent hover:bg-accent/90">40%</Badge>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">Reduce negative self-talk</h4>
                          <Badge className="bg-sage hover:bg-sage/90">55%</Badge>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CollapsibleContent>

            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-2 flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="h-3 w-3" />
                    <span>Show less</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3 w-3" />
                    <span>Show more</span>
                  </>
                )}
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
        </CardContent>
        <CardFooter className="flex justify-between pt-0">
          <Button variant="outline" size="sm" className="button-expand transition-all duration-200 hover:bg-primary/5">
            <MessageSquare className="h-4 w-4 mr-1" />
            Message
          </Button>
          <Button variant="outline" size="sm" className="button-expand transition-all duration-200 hover:bg-primary/5">
            <Calendar className="h-4 w-4 mr-1" />
            Schedule
          </Button>
        </CardFooter>
      </Card>

      <EditPatientNameModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        patientId={patientid}
        currentFirstName={currentFirstname}
        currentLastName={currentLastname}
        onNameUpdated={handleNameUpdated}
      />      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete Patient"
        message={`Are you sure you want to delete ${currentFirstname} ${currentLastname}? This action cannot be undone.`}
        confirmText={isDeleting ? "Deleting..." : "Delete"}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </>
  )
}

