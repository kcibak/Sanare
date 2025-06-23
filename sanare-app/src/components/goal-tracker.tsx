"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export function GoalTracker() {
  const [goals, setGoals] = useState([
    {
      id: 1,
      title: "Practice mindfulness meditation",
      description: "5 minutes daily, gradually increasing to 15 minutes",
      progress: 70,
      tasks: [
        { id: 1, title: "Download meditation app", completed: true },
        { id: 2, title: "Complete 5-minute session 3x this week", completed: true },
        { id: 3, title: "Complete 10-minute session 3x this week", completed: true },
        { id: 4, title: "Complete 15-minute session 3x this week", completed: false },
      ],
    },
    {
      id: 2,
      title: "Improve work-life boundaries",
      description: "Establish clear separation between work and personal time",
      progress: 40,
      tasks: [
        { id: 1, title: "Turn off work notifications after 6pm", completed: true },
        { id: 2, title: "Take full lunch break away from desk", completed: false },
        { id: 3, title: "Schedule specific times to check email", completed: true },
        { id: 4, title: "Have conversation with manager about workload", completed: false },
      ],
    },
    {
      id: 3,
      title: "Develop positive self-talk habits",
      description: "Replace negative thoughts with balanced perspectives",
      progress: 55,
      tasks: [
        { id: 1, title: "Journal negative thoughts for one week", completed: true },
        { id: 2, title: "Identify 3 common cognitive distortions", completed: true },
        { id: 3, title: "Practice reframing negative thoughts daily", completed: false },
        { id: 4, title: "Create list of personal strengths and achievements", completed: true },
      ],
    },
  ])

  const toggleTask = (goalId: number, taskId: number) => {
    setGoals(
      goals.map((goal) => {
        if (goal.id === goalId) {
          const updatedTasks = goal.tasks.map((task) => {
            if (task.id === taskId) {
              return { ...task, completed: !task.completed }
            }
            return task
          })

          // Calculate new progress
          const completedCount = updatedTasks.filter((t) => t.completed).length
          const progress = Math.round((completedCount / updatedTasks.length) * 100)

          return { ...goal, tasks: updatedTasks, progress }
        }
        return goal
      }),
    )
  }

  return (
    <div className="space-y-6">
      {goals.map((goal) => (
        <Card key={goal.id} className="shadow-md border-0 floating-card overflow-hidden">
          <div
            className="h-1 w-full bg-gradient-to-r from-primary via-accent to-sage"
            style={{ clipPath: `inset(0 ${100 - goal.progress}% 0 0)` }}
          ></div>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl font-serif text-secondary">{goal.title}</CardTitle>
                <CardDescription>{goal.description}</CardDescription>
              </div>
              <Badge
                className={`
                ${
                  goal.progress < 50
                    ? "bg-accent hover:bg-accent/90"
                    : goal.progress < 100
                      ? "bg-primary hover:bg-primary/90"
                      : "bg-sage hover:bg-sage/90"
                }
              `}
              >
                {goal.progress}% Complete
              </Badge>
            </div>
          </CardHeader>
          <CardContent>            <Progress
              value={goal.progress}
              className="h-2"
            />

            <div className="mt-4 space-y-2">
              {goal.tasks.map((task) => (
                <div key={task.id} className="flex items-start space-x-2">
                  <Checkbox
                    id={`task-${goal.id}-${task.id}`}
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(goal.id, task.id)}
                    className="mt-1"
                  />
                  <Label
                    htmlFor={`task-${goal.id}-${task.id}`}
                    className={`text-sm ${task.completed ? "line-through text-muted-foreground" : ""}`}
                  >
                    {task.title}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between pt-0">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1"
              >
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
              Edit Goal
            </Button>
            <Button variant="outline" size="sm" className="button-expand">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1"
              >
                <path d="M12 5v14"></path>
                <path d="M5 12h14"></path>
              </svg>
              Add Task
            </Button>
          </CardFooter>
        </Card>
      ))}

      <Button className="w-full button-expand bg-sage hover:bg-sage/90 text-sage-foreground">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2"
        >
          <path d="M12 5v14"></path>
          <path d="M5 12h14"></path>
        </svg>
        Create New Goal
      </Button>
    </div>
  )
}

