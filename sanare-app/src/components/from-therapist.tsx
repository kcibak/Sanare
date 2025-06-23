"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, Clock } from "lucide-react"
import { EmotionTracker } from "./emotion-tracker"

export function FromTherapist() {
  const [practices, setPractices] = useState([
    {
      id: 1,
      text: "Practice the breathing exercise: 4 counts in, hold for 7, out for 8",
      completed: false,
      total: 5,
      done: 2,
    },
    { id: 2, text: "Write down 3 positive experiences each day", completed: false, total: 7, done: 5 },
    { id: 3, text: "Try the progressive muscle relaxation before bed", completed: true, total: 3, done: 3 },
  ])

  const [showCelebration, setShowCelebration] = useState<number | null>(null)

  const markAsCompleted = (id: number) => {
    setPractices(
      practices.map((practice) => {
        if (practice.id === id) {
          const newDone = practice.done + 1
          const isCompleted = newDone >= practice.total

          if (isCompleted) {
            setShowCelebration(id)
            setTimeout(() => setShowCelebration(null), 3000)
          }

          return {
            ...practice,
            done: newDone,
            completed: isCompleted,
          }
        }
        return practice
      }),
    )
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-6"></div>

      <EmotionTracker />

      <div className="mt-8">
        <h2 className="text-lg font-medium mb-3">Practice Tasks</h2>
        <div className="space-y-4">
          {practices.map((practice) => (
            <div key={practice.id} className="relative">
              <div className="bg-white rounded-2xl shadow-md p-5">
                <div className="flex justify-between items-start">
                  <p className={`text-sm ${practice.completed ? "line-through text-[#777]" : ""}`}>{practice.text}</p>
                  <div className="flex flex-col items-end">
                    <div className="text-xs text-[#777] mb-1 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>
                        {practice.done}/{practice.total}
                      </span>
                    </div>
                    <motion.button
                      className={`py-2 px-4 rounded-xl text-sm font-medium ${
                        practice.completed ? "bg-[#4CAF50] text-white" : "bg-[#FFC107] text-[#333]"
                      }`}
                      whileHover={{ scale: practice.completed ? 1 : 1.05 }}
                      whileTap={{ scale: practice.completed ? 1 : 0.95 }}
                      disabled={practice.completed}
                      onClick={() => !practice.completed && markAsCompleted(practice.id)}
                    >
                      {practice.completed ? (
                        <span className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Completed
                        </span>
                      ) : (
                        "I've practiced this"
                      )}
                    </motion.button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3 h-1.5 bg-[#E0E0E0] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-[#FFC107] rounded-full"
                    initial={{ width: `${(practice.done / practice.total) * 100}%` }}
                    animate={{ width: `${(practice.done / practice.total) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Celebration animation */}
              <AnimatePresence>
                {showCelebration === practice.id && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="absolute top-0 left-1/4 text-2xl animate-float">🎉</div>
                    <div className="absolute top-0 right-1/4 text-2xl animate-float-slow">✨</div>
                    <div className="absolute bottom-0 left-1/3 text-2xl animate-float-fast">🎊</div>
                    <div className="absolute top-1/2 right-1/3 text-2xl animate-float">⭐</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium mb-3">Notes from Last Session</h2>
        <div className="bg-white rounded-2xl shadow-md p-5">
          <p className="text-sm mb-3">
            We discussed how your anxiety tends to peak in social situations at work. Remember to practice the breathing
            technique we discussed when you feel overwhelmed. Also, try to identify specific triggers that cause your
            anxiety to increase.
          </p>
          <p className="text-xs text-[#777]">Dr. Emily Chen • 3 days ago</p>
        </div>
      </div>
    </div>
  )
}

