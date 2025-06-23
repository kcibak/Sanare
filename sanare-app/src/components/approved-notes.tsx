"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export function ApprovedNotes() {
  const notes = [
    {
      date: "April 28, 2024",
      title: "Session Summary",
      content:
        "Today we focused on developing mindfulness techniques to manage anxiety in workplace situations. We practiced breathing exercises and discussed strategies for setting boundaries with colleagues. Client reported feeling more confident in their ability to handle stressful meetings.",
    },
    {
      date: "April 21, 2024",
      title: "Session Summary",
      content:
        "We explored cognitive distortions related to work performance. Client identified 'catastrophizing' and 'black-and-white thinking' as patterns that emerge during high-stress periods. We began working on cognitive restructuring techniques to challenge these thoughts.",
    },
    {
      date: "April 14, 2024",
      title: "Session Summary",
      content:
        "Client reported increased anxiety following a difficult conversation with their manager. We discussed assertive communication strategies and role-played potential future interactions. Client homework includes journaling about workplace interactions and practicing self-validation.",
    },
  ]

  return (
    <Card className="shadow-md border-0">
      <CardHeader>
        <CardTitle className="text-xl font-serif text-secondary">Approved Session Notes</CardTitle>
        <CardDescription>Notes shared by your therapist</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-6">
            {notes.map((note, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-medium">{note.title}</h3>
                  <Badge variant="outline" className="text-xs">
                    {note.date}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{note.content}</p>
                {index < notes.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

