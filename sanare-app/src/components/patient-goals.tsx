"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { CheckCircle, Circle, PlusCircle, Target, Pencil, Trash2 } from "lucide-react"
import { createGoal, updateGoal, deleteTask, getGoals, toggleGoalComplete, toggleTaskComplete } from "@/lib/api"
import { usePatient } from "@/lib/context/patient-context"

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

interface Goal {
  id: number;
  title: string;
  description?: string;
  progress: number;
  tasks: Task[];
  iscomplete: boolean;
}

export function PatientGoals() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [showNewGoal, setShowNewGoal] = useState(false)
  const [newGoalTitle, setNewGoalTitle] = useState("")
  const [newGoalDescription, setNewGoalDescription] = useState("")
  const [newGoalTasks, setNewGoalTasks] = useState<Task[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [editGoalId, setEditGoalId] = useState<number | null>(null)
  const [editGoalTitle, setEditGoalTitle] = useState("")
  const [editGoalDescription, setEditGoalDescription] = useState("")
  const [editGoalTasks, setEditGoalTasks] = useState<Task[]>([])
  const [editTaskTitle, setEditTaskTitle] = useState("")
  const [error, setError] = useState("")
  const { patient } = usePatient();
  const patientid = patient?.id;

  useEffect(() => {
    if (!patientid) return;
    getGoals(patientid)
      .then((fetchedGoals) => {
        setGoals(
          (fetchedGoals || []).map((g: any, idx: number) => ({
            id: g.goalid || idx + 1,
            title: g.title,
            description: g.description,
            progress: g.progress || 0,
            tasks: (g.tasks || []).map((t: any, tIdx: number) => ({
              id: t.taskid || tIdx + 1,
              title: t.title,
              completed: t.iscompleted || false,
            })),
            iscomplete: !!g.iscomplete,
          }))
        );
      })
      .catch((e) => setError(e.message || "Failed to fetch goals"));
  }, [patientid]);

  const toggleTask = async (goalId: number, taskId: number) => {
    setGoals((prevGoals) => prevGoals.map((goal) => {
      if (goal.id === goalId) {
        const updatedTasks = goal.tasks.map((task) => {
          if (task.id === taskId) {
            toggleTaskComplete(task.id.toString(), !task.completed);
            return { ...task, completed: !task.completed };
          }
          return task;
        });
        // Calculate new progress
        const completedCount = updatedTasks.filter((t) => t.completed).length;
        const progress = updatedTasks.length === 0 ? 0 : Math.round((completedCount / updatedTasks.length) * 100);
        // If all tasks complete, mark goal as complete in backend
        if (updatedTasks.length > 0 && completedCount === updatedTasks.length) {
          toggleGoalComplete(goal.id.toString(), true);
        } else if (updatedTasks.length > 0) {
          toggleGoalComplete(goal.id.toString(), false);
        }
        // UI: always update iscomplete to match progress
        return { ...goal, tasks: updatedTasks, progress, iscomplete: updatedTasks.length > 0 && completedCount === updatedTasks.length };
      }
      return goal;
    }));
  };

  const toggleGoalNoTasks = async (goalId: number, iscomplete: boolean) => {
    await toggleGoalComplete(goalId.toString(), iscomplete);
    setGoals((prevGoals) => prevGoals.map((goal) =>
      goal.id === goalId ? { ...goal, iscomplete } : goal
    ));
  };

  const addNewGoal = async () => {
    if (!patientid) {
      setError("No patient selected or logged in.")
      return
    }
    if (newGoalTitle.trim()) {
      try {
        const created = await createGoal({
          patientid,
          title: newGoalTitle,
          description: newGoalDescription || undefined,
          tasks: newGoalTasks.map(t => ({ ...t, id: t.id?.toString() })),
        })
        setGoals([...goals, created])
        setNewGoalTitle("")
        setNewGoalDescription("")
        setNewGoalTasks([])
        setShowNewGoal(false)
        setError("")
      } catch (e: any) {
        setError(e.message || "Failed to create goal")
      }
    }
  }

  const saveEditGoal = async () => {
    try {
      if (!editGoalId) return
      const updated = await updateGoal(editGoalId.toString(), {
        title: editGoalTitle,
        description: editGoalDescription,
        tasks: editGoalTasks.map(t => ({ ...t, id: t.id?.toString() })),
      })
      setGoals(goals.map((g) => (g.id === editGoalId ? updated : g)))
      setEditGoalId(null)
      setEditGoalTitle("")
      setEditGoalDescription("")
      setEditGoalTasks([])
      setError("")
    } catch (e: any) {
      setError(e.message || "Failed to update goal")
    }
  }

  const addTaskToNewGoal = () => {
    if (newTaskTitle.trim()) {
      setNewGoalTasks([
        ...newGoalTasks,
        { id: Date.now(), title: newTaskTitle, completed: false },
      ])
      setNewTaskTitle("")
    }
  }

  const removeTaskFromNewGoal = (taskId: number) => {
    setNewGoalTasks(newGoalTasks.filter((t) => t.id !== taskId))
  }

  // Edit goal logic
  const startEditGoal = (goal: Goal) => {
    setEditGoalId(goal.id)
    setEditGoalTitle(goal.title)
    setEditGoalDescription(goal.description || "")
    setEditGoalTasks(goal.tasks)
    setEditTaskTitle("")
  }

  const addTaskToEditGoal = () => {
    if (editTaskTitle.trim()) {
      setEditGoalTasks([
        ...editGoalTasks,
        { id: Date.now(), title: editTaskTitle, completed: false },
      ])
      setEditTaskTitle("")
    }
  }

  const removeTaskFromEditGoal = (taskId: number) => {
    setEditGoalTasks(editGoalTasks.filter((t) => t.id !== taskId))
  }

  const toggleEditTask = (taskId: number) => {
    setEditGoalTasks(editGoalTasks.map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    ))
  }

  return (
    <div className="flex flex-col h-full overflow-x-hidden">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">My Goals</h2>
        <div className="relative group">
          <motion.button
            className="p-3 rounded-full bg-[#9C27B0] text-white shadow-md flex items-center justify-center"
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowNewGoal(!showNewGoal)}
            aria-label="Create Goal"
          >
            <PlusCircle className="h-8 w-8" />
          </motion.button>
          <span className="absolute left-1/2 -translate-x-1/2 mt-2 px-3 py-1 rounded bg-[#9C27B0] text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
            Create Goal
          </span>
        </div>
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
            className="w-full p-3 border rounded-lg text-2xl font-bold mb-3 mt-6 focus:outline-none focus:ring-2 focus:ring-[#9C27B0] bg-white"
          />
          <textarea
            placeholder="Goal description"
            value={newGoalDescription}
            onChange={(e) => setNewGoalDescription(e.target.value)}
            className="w-full p-3 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-[#9C27B0] bg-white mb-3 resize-none"
            rows={3}
            style={{ minHeight: 60 }}
          />
          <div className="mt-4">
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Task title"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="flex-1 p-2 border rounded-lg text-sm"
              />
              <button
                className="px-3 py-2 rounded-lg bg-[#9C27B0] text-white text-sm"
                onClick={addTaskToNewGoal}
                type="button"
              >
                Add Task
              </button>
            </div>
            <div className="space-y-1">
              {newGoalTasks.map((task) => (
                <div key={task.id} className="flex items-center gap-2">
                  <Circle className="h-4 w-4 text-[#9C27B0]/50" />
                  <span className="text-sm">{task.title}</span>
                  <button className="ml-2 p-1 rounded-full hover:bg-red-100" onClick={() => removeTaskFromNewGoal(task.id)}>
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>
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

      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}

      <div className="space-y-6 overflow-auto">
        {goals.length === 0 ? (
          <div className="text-center text-gray-400 mt-8">
            <p>No goals yet.</p>
            <p>Set your first goal using the + button above!</p>
          </div>
        ) : (
          goals.map((goal) => {
            const hasTasks = goal.tasks && goal.tasks.length > 0;
            const completedCount = hasTasks ? goal.tasks.filter((t) => t.completed).length : 0;
            const progress = hasTasks ? Math.round((completedCount / goal.tasks.length) * 100) : (goal.iscomplete ? 100 : 0);
            return (
              <div key={goal.id} className={`bg-white rounded-2xl shadow-md overflow-hidden relative ${goal.iscomplete ? 'opacity-60' : ''}`}> 
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Target className="h-6 w-6 text-[#9C27B0]" />
                      </div>
                      {editGoalId === goal.id ? (
                        <>
                          <input
                            type="text"
                            value={editGoalTitle}
                            onChange={e => setEditGoalTitle(e.target.value)}
                            className="w-full p-3 border rounded-lg text-2xl font-bold mb-3 mt-6 focus:outline-none focus:ring-2 focus:ring-[#9C27B0] bg-white"
                            placeholder="Goal title"
                          />
                          <textarea
                            value={editGoalDescription}
                            onChange={e => setEditGoalDescription(e.target.value)}
                            className="w-full p-3 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-[#9C27B0] bg-white mb-3 resize-none"
                            placeholder="Describe your goal..."
                            rows={3}
                            style={{ minHeight: 60 }}
                          />
                        </>
                      ) : (
                        <h3 className={`font-bold text-2xl mb-2 ${goal.iscomplete ? 'line-through text-[#777]' : ''}`}>{goal.title}</h3>
                      )}
                      {!hasTasks && (
                        <input
                          type="checkbox"
                          checked={!!goal.iscomplete}
                          onChange={e => toggleGoalNoTasks(goal.id, e.target.checked)}
                          className="ml-2"
                        />
                      )}
                    </div>
                    <div className="bg-[#9C27B0]/10 px-2 py-1 rounded-full">
                      <span className="text-xs font-medium text-[#9C27B0]">{progress}% Complete</span>
                    </div>
                  </div>
                  <div className="h-2 bg-[#E0E0E0] rounded-full overflow-hidden mb-4">
                    <motion.div
                      className="h-full bg-[#9C27B0] rounded-full"
                      initial={{ width: `${progress}%` }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>

                  <div className="space-y-2">
                    {editGoalId === goal.id
                      ? editGoalTasks.map((task) => (
                          <div key={task.id} className="flex items-center gap-3">
                            <input
                              type="text"
                              value={task.title}
                              onChange={e => setEditGoalTasks(editGoalTasks.map(t => t.id === task.id ? { ...t, title: e.target.value } : t))}
                              className="text-lg border-b border-[#9C27B0] focus:outline-none w-full p-2"
                            />
                            <button className="ml-2 p-1 rounded-full hover:bg-red-100" onClick={() => removeTaskFromEditGoal(task.id)}>
                              <Trash2 className="h-5 w-5 text-red-400" />
                            </button>
                          </div>
                        ))
                      : goal.tasks.map((task) => (
                          <div key={task.id} className="flex items-center gap-3">
                            <button className="flex-shrink-0 focus:outline-none" onClick={() => toggleTask(goal.id, task.id)}>
                              {task.completed ? (
                                <CheckCircle className="h-6 w-6 text-[#9C27B0]" />
                              ) : (
                                <Circle className="h-6 w-6 text-[#9C27B0]/50" />
                              )}
                            </button>
                            <span className={`text-lg ${task.completed ? "line-through text-[#777]" : ""}`}>{task.title}</span>
                          </div>
                        ))}
                  </div>

                  {editGoalId === goal.id ? (
                    <div className="mt-4">
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          placeholder="Task title"
                          value={editTaskTitle}
                          onChange={e => setEditTaskTitle(e.target.value)}
                          className="flex-1 p-2 border rounded-lg text-sm"
                        />
                        <button
                          className="px-3 py-2 rounded-lg bg-[#9C27B0] text-white text-sm"
                          onClick={addTaskToEditGoal}
                          type="button"
                        >
                          Add Task
                        </button>
                      </div>
                      <div className="flex justify-end gap-2 mt-2">
                        <button
                          className="px-4 py-2 rounded-xl bg-[#E0E0E0] text-[#333] text-sm"
                          onClick={() => setEditGoalId(null)}
                          type="button"
                        >
                          Cancel
                        </button>
                        <button
                          className="px-4 py-2 rounded-xl bg-[#9C27B0] text-white text-sm"
                          onClick={saveEditGoal}
                          type="button"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
                {editGoalId === goal.id ? null : (
                  <button className="absolute bottom-4 right-4 p-2 rounded-full bg-[#F3E8FF] hover:bg-[#E1CFFF] shadow transition-colors" onClick={() => startEditGoal(goal)}>
                    <Pencil className="h-6 w-6 text-[#9C27B0]" />
                  </button>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
