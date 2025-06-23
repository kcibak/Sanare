"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, Plus, Edit, Trash2 } from "lucide-react"

export function MyJournal() {
  const [entries, setEntries] = useState([
    {
      id: 1,
      date: "May 2, 2024",
      title: "Feeling better today",
      content:
        "I tried the breathing exercise when I felt anxious during the meeting, and it actually helped. I was able to calm down and contribute to the discussion.",
    },
    {
      id: 2,
      date: "May 1, 2024",
      title: "Difficult day",
      content:
        "Work was really stressful today. I had a panic attack in the bathroom and had to take a break. I'm worried about the presentation tomorrow.",
    },
    {
      id: 3,
      date: "Apr 29, 2024",
      title: "Weekend reflection",
      content:
        "Had a good weekend with family. Felt relaxed for the first time in weeks. Practiced mindfulness for 10 minutes each morning.",
    },
  ])

  const [newEntry, setNewEntry] = useState(false)
  const [entryTitle, setEntryTitle] = useState("")
  const [entryContent, setEntryContent] = useState("")

  const addNewEntry = () => {
    if (entryTitle.trim() && entryContent.trim()) {
      const today = new Date()
      const formattedDate = today.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

      setEntries([
        {
          id: Date.now(),
          date: formattedDate,
          title: entryTitle,
          content: entryContent,
        },
        ...entries,
      ])

      setNewEntry(false)
      setEntryTitle("")
      setEntryContent("")
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="flex justify-end mb-6">
        <motion.button
          className="p-2 rounded-full bg-[#2196F3] text-white shadow-md hover:shadow-lg transition-shadow"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setNewEntry(true)}
        >
          <Plus className="h-5 w-5" />
        </motion.button>
      </div>

      <AnimatePresence>
        {newEntry && (
          <motion.div
            className="mb-6 bg-white rounded-2xl shadow-md p-5"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <h2 className="text-lg font-medium mb-3">New Entry</h2>
            <input
              type="text"
              placeholder="Title"
              value={entryTitle}
              onChange={(e) => setEntryTitle(e.target.value)}
              className="w-full p-3 mb-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2196F3]"
            />
            <textarea
              placeholder="How are you feeling today?"
              value={entryContent}
              onChange={(e) => setEntryContent(e.target.value)}
              className="w-full p-3 border rounded-xl h-32 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#2196F3]"
            />
            <div className="flex justify-end gap-2 mt-3">
              <motion.button
                className="px-4 py-2 rounded-xl bg-[#E0E0E0] text-[#333] text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setNewEntry(false)}
              >
                Cancel
              </motion.button>
              <motion.button
                className="px-4 py-2 rounded-xl bg-[#2196F3] text-white text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={addNewEntry}
              >
                Save
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-6">
        <div className="bg-white rounded-2xl shadow-md p-5">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-[#2196F3]" />
            <h2 className="text-lg font-medium">Journal Calendar</h2>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
              <div key={i} className="text-xs text-[#777]">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {/* Empty spaces for previous month */}
            {[...Array(3)].map((_, i) => (
              <div key={`empty-${i}`} className="h-8 rounded-full"></div>
            ))}

            {/* Days of current month */}
            {[...Array(30)].map((_, i) => {
              const day = i + 1
              const hasEntry = entries.some((entry) => {
                const entryDate = new Date(entry.date)
                return entryDate.getDate() === day && entryDate.getMonth() === 4 // May is month 4 (0-indexed)
              })

              return (
                <div
                  key={`day-${day}`}
                  className={`h-8 flex items-center justify-center rounded-full text-xs ${
                    hasEntry
                      ? "bg-[#2196F3] text-white"
                      : day === 2
                        ? "bg-[#E3F2FD] border border-[#2196F3] text-[#2196F3]"
                        : "text-[#333]"
                  }`}
                >
                  {day}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {entries.map((entry) => (
          <motion.div
            key={entry.id}
            className="bg-white rounded-2xl shadow-md p-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium">{entry.title}</h3>
              <div className="flex gap-1">
                <button className="p-1 rounded-full hover:bg-[#E3F2FD]">
                  <Edit className="h-4 w-4 text-[#2196F3]" />
                </button>
                <button className="p-1 rounded-full hover:bg-[#FFEBEE]">
                  <Trash2 className="h-4 w-4 text-[#F44336]" />
                </button>
              </div>
            </div>
            <p className="text-sm mb-3">{entry.content}</p>
            <p className="text-xs text-[#777]">{entry.date}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

