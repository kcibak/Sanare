"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function ProgressVisualization() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="shadow-md border-0 floating-card">
        <CardHeader>
          <CardTitle className="text-xl font-serif text-secondary">Emotional Well-being</CardTitle>
          <CardDescription>Tracking your emotional state over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-end justify-between gap-2">
            {[30, 45, 35, 50, 65, 75, 70, 85].map((value, index) => (
              <div key={index} className="relative flex-1">
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-primary/80 to-primary transition-all duration-500 ease-in-out"
                  style={{ height: `${value}%` }}
                ></div>
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
                  W{index + 1}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>Your emotional well-being has improved by 55% since starting therapy</p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md border-0 floating-card">
        <CardHeader>
          <CardTitle className="text-xl font-serif text-secondary">Anxiety Levels</CardTitle>
          <CardDescription>Weekly anxiety level measurements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-end justify-between gap-2">
            {[80, 75, 85, 70, 60, 50, 55, 40].map((value, index) => (
              <div key={index} className="relative flex-1">
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-secondary/80 to-secondary transition-all duration-500 ease-in-out"
                  style={{ height: `${value}%` }}
                ></div>
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
                  W{index + 1}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>Your anxiety levels have decreased by 40% since starting therapy</p>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 shadow-md border-0 floating-card">
        <CardHeader>
          <CardTitle className="text-xl font-serif text-secondary">Coping Skills Progress</CardTitle>
          <CardDescription>Development of therapeutic techniques over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="relative pt-2">
              <div className="text-center mb-2 text-sm font-medium">Mindfulness</div>
              <div className="h-4 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-sage rounded-full" style={{ width: "85%" }}></div>
              </div>
              <div className="mt-1 text-xs text-right text-muted-foreground">85%</div>
            </div>

            <div className="relative pt-2">
              <div className="text-center mb-2 text-sm font-medium">Cognitive Restructuring</div>
              <div className="h-4 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: "70%" }}></div>
              </div>
              <div className="mt-1 text-xs text-right text-muted-foreground">70%</div>
            </div>

            <div className="relative pt-2">
              <div className="text-center mb-2 text-sm font-medium">Boundary Setting</div>
              <div className="h-4 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-accent rounded-full" style={{ width: "60%" }}></div>
              </div>
              <div className="mt-1 text-xs text-right text-muted-foreground">60%</div>
            </div>

            <div className="relative pt-2">
              <div className="text-center mb-2 text-sm font-medium">Self-Compassion</div>
              <div className="h-4 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-secondary rounded-full" style={{ width: "75%" }}></div>
              </div>
              <div className="mt-1 text-xs text-right text-muted-foreground">75%</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

