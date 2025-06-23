"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle, Circle, PlusCircle, Target } from "lucide-react"

export function PatientGoals() {
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

  const [showNewGoal, setShowNewGoal] = useState(false)
  const [newGoalTitle, setNewGoalTitle] = useState("")
  const [newGoalDescription, setNewGoalDescription] = useState("")

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

  const addNewGoal = () => {
    if (newGoalTitle.trim() && newGoalDescription.trim()) {
      setGoals([
        ...goals,
        {
          id: Date.now(),
          title: newGoalTitle,
          description: newGoalDescription,
          progress: 0,
          tasks: [],
        },
      ])

      setNewGoalTitle("")
      setNewGoalDescription("")
      setShowNewGoal(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium">My Goals</h2>
        <motion.button
          className="p-2 rounded-full bg-[#9C27B0] text-white shadow-md"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowNewGoal(!showNewGoal)}
        >
          <PlusCircle className="h-5 w-5" />
        </motion.button>
      </div>

      {showNewGoal && (
        <motion.div
          className="bg-white rounded-2xl shadow-md p-4 mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <h3 className="text-lg font-medium mb-3">New Goal</h3>
          <input
            type="text"
            placeholder="Goal title"
            value={newGoalTitle}
            onChange={(e) => setNewGoalTitle(e.target.value)}
            className="w-full p-3 mb-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#9C27B0]"
          />
          <textarea
            placeholder="Goal description"
            value={newGoalDescription}
            onChange={(e) => setNewGoalDescription(e.target.value)}
            className="w-full p-3 border rounded-xl h-20 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#9C27B0]"
          />
          <div className="flex justify-end gap-2 mt-3">
            <motion.button
              className="px-4 py-2 rounded-xl bg-[#E0E0E0] text-[#333] text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNewGoal(false)}
            >
              Cancel
            </motion.button>
            <motion.button
              className="px-4 py-2 rounded-xl bg-[#9C27B0] text-white text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={addNewGoal}
            >
              Add Goal
            </motion.button>
          </div>
        </motion.div>
      )}

      <div className="space-y-6 overflow-auto">
        {goals.map((goal) => (
          <div key={goal.id} className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-[#9C27B0]" />
                    <h3 className="font-medium">{goal.title}</h3>
                  </div>
                  <p className="text-sm text-[#555] mt-1">{goal.description}</p>
                </div>
                <div className="bg-[#9C27B0]/10 px-2 py-1 rounded-full">
                  <span className="text-xs font-medium text-[#9C27B0]">{goal.progress}% Complete</span>
                </div>
              </div>

              <div className="h-2 bg-[#E0E0E0] rounded-full overflow-hidden mb-4">
                <motion.div
                  className="h-full bg-[#9C27B0] rounded-full"
                  initial={{ width: `${goal.progress}%` }}
                  animate={{ width: `${goal.progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              <div className="space-y-2">
                {goal.tasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-2">
                    <button className="flex-shrink-0 focus:outline-none" onClick={() => toggleTask(goal.id, task.id)}>
                      {task.completed ? (
                        <CheckCircle className="h-5 w-5 text-[#9C27B0]" />
                      ) : (
                        <Circle className="h-5 w-5 text-[#9C27B0]/50" />
                      )}
                    </button>
                    <span className={`text-sm ${task.completed ? "line-through text-[#777]" : ""}`}>{task.title}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <button className="text-sm text-[#9C27B0] hover:underline">+ Add new task</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
