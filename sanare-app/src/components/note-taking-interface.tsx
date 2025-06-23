"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { FileText, Mic, Sparkles, ListChecks, Lightbulb, AlertCircle, PlusCircle, Wand2 } from "lucide-react"

export function NoteTakingInterface() {
  const [notes, setNotes] = useState([
    {
      type: "therapist",
      content:
        "Client arrived on time, appeared slightly anxious. Mentioned trouble sleeping this past week due to work stress.",
    },
    {
      type: "client",
      content:
        "I've been having a hard time at work. My new manager has been putting a lot of pressure on me, and I feel like I can't meet his expectations.",
    },
    {
      type: "therapist",
      content: "We discussed workplace boundaries and strategies for communicating with manager about workload.",
    },
  ])

  const [newNote, setNewNote] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when new notes are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [notes])

  const addNote = (type: string) => {
    if (newNote.trim()) {
      setNotes([...notes, { type, content: newNote }])
      setNewNote("")
    }
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    if (!isRecording) {
      // Simulate voice recording
      const timer = setTimeout(() => {
        setNewNote(newNote + " Client expressed concerns about upcoming performance review.")
        setIsRecording(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea ref={scrollAreaRef} className="flex-1 pr-4 mb-4">
        <div className="space-y-4">
          {notes.map((note, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg flex gap-3 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${
                note.type === "therapist" ? "bg-secondary/5 ml-0 mr-12" : "bg-primary/5 ml-12 mr-0"
              }`}
            >
              {note.type === "therapist" ? (
                <Avatar className="h-6 w-6 mt-0.5 flex-shrink-0">
                  <AvatarImage src="/placeholder.svg?height=24&width=24" alt="Dr. Emily Chen" />
                  <AvatarFallback className="text-[10px]">EC</AvatarFallback>
                </Avatar>
              ) : (
                <Avatar className="h-6 w-6 mt-0.5 flex-shrink-0 ml-auto order-2">
                  <AvatarImage src="/placeholder.svg?height=24&width=24" alt="Sarah Johnson" />
                  <AvatarFallback className="text-[10px]">SJ</AvatarFallback>
                </Avatar>
              )}
              <p className={`text-sm ${note.type === "client" ? "order-1" : ""}`}>{note.content}</p>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="border rounded-lg p-2 bg-card transition-all duration-300 hover:shadow-md">
        <Tabs defaultValue="therapist">
          <TabsList className="grid w-full grid-cols-2 mb-2">
            <TabsTrigger value="therapist" className="transition-all duration-200">
              Therapist Note
            </TabsTrigger>
            <TabsTrigger value="client" className="transition-all duration-200">
              Client Statement
            </TabsTrigger>
          </TabsList>

          <div className="space-y-2 relative">
            <Textarea
              placeholder="Type your notes here..."
              className="min-h-[100px] resize-none focus-visible:ring-primary transition-all duration-200"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
            />

            <div className="flex justify-between">
              <div className="flex gap-1">
                <TooltipProvider delayDuration={300}>
                  <div className="flex items-center gap-1 border rounded-md p-1 bg-card">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-sm transition-all duration-200 hover:bg-secondary/10"
                        >
                          <ListChecks className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Interventions</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-sm transition-all duration-200 hover:bg-secondary/10"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Templates</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-sm transition-all duration-200 hover:bg-secondary/10"
                        >
                          <AlertCircle className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Assessment</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-sm transition-all duration-200 hover:bg-secondary/10"
                        >
                          <Lightbulb className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Insights</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`h-7 w-7 rounded-sm transition-all duration-200 ${isRecording ? "bg-primary/10 text-primary animate-pulse" : "hover:bg-secondary/10"}`}
                          onClick={toggleRecording}
                        >
                          <Mic className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{isRecording ? "Stop recording" : "Voice to text"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TooltipProvider>

                <Button variant="outline" size="sm" className="h-9 transition-all duration-200 hover:bg-sage/10">
                  <Wand2 className="h-3.5 w-3.5 mr-1" />
                  <span className="text-xs">Quick Insights</span>
                </Button>
              </div>

              <TabsContent value="therapist" className="m-0">
                <Button
                  className="button-expand bg-secondary hover:bg-secondary/90 transition-all duration-200"
                  onClick={() => addNote("therapist")}
                >
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Add Note
                </Button>
              </TabsContent>

              <TabsContent value="client" className="m-0">
                <Button
                  className="button-expand bg-primary hover:bg-primary/90 transition-all duration-200"
                  onClick={() => addNote("client")}
                >
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Add Statement
                </Button>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  )
}

