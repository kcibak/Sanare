"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

export function PatientTimeline() {
  const [isExpanded, setIsExpanded] = useState(false)

  const timelineItems = [
    {
      date: "Apr 28",
      title: "Session",
      description: "Weekly therapy session",
      badge: { text: "Completed", variant: "primary" },
    },
    {
      date: "Apr 21",
      title: "Session",
      description: "Weekly therapy session",
      badge: { text: "Completed", variant: "primary" },
    },
    {
      date: "Apr 18",
      title: "Journal",
      description: "Increased anxiety at work",
      badge: { text: "Important", variant: "secondary" },
    },
    {
      date: "Apr 14",
      title: "Session",
      description: "Weekly therapy session",
      badge: { text: "Completed", variant: "primary" },
    },
    {
      date: "Apr 10",
      title: "Medication",
      description: "Increased Sertraline to 50mg",
      badge: { text: "Medical", variant: "accent" },
    },
    {
      date: "Apr 7",
      title: "Session",
      description: "Weekly therapy session",
      badge: { text: "Completed", variant: "primary" },
    },
  ]

  // Only show first 3 items when collapsed
  const visibleItems = isExpanded ? timelineItems : timelineItems.slice(0, 3)

  return (
    <Card className="shadow-md border-0 transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-serif">Timeline</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <ScrollArea className={isExpanded ? "h-[300px]" : "h-auto max-h-[180px]"}>
            <div className="relative pl-6 pr-4 py-4">
              {/* Timeline line */}
              <div className="absolute top-0 bottom-0 left-[22px] w-[2px] bg-border"></div>

              <div className="space-y-4">
                {visibleItems.map((item, index) => (
                  <div key={index} className="relative">
                    {/* Timeline dot */}
                    <div
                      className={`absolute left-[-14px] top-1 h-3 w-3 rounded-full border-2 border-background transition-colors duration-300 ${
                        item.badge.variant === "primary"
                          ? "bg-primary"
                          : item.badge.variant === "secondary"
                            ? "bg-secondary"
                            : "bg-accent"
                      }`}
                    ></div>

                    <div className="mb-1 text-xs text-muted-foreground">{item.date}</div>
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-medium">{item.title}</h4>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                      <Badge
                        className={`
                        ${
                          item.badge.variant === "primary"
                            ? "bg-primary hover:bg-primary/90"
                            : item.badge.variant === "secondary"
                              ? "bg-secondary hover:bg-secondary/90"
                              : "bg-accent hover:bg-accent/90"
                        }
                      `}
                      >
                        {item.badge.text}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>

          <CollapsibleContent className="animate-accordion-down">
            {/* This is just a spacer when expanded */}
          </CollapsibleContent>

          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-full flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
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
    </Card>
  )
}

