"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Bold, Italic, Mic, MicOff, Calendar, Save } from "lucide-react"

export function PatientJournal() {
  const [journalEntry, setJournalEntry] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [entryTitle, setEntryTitle] = useState("")
  const [savedEntries, setSavedEntries] = useState([
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
  ])

  const handleRecording = () => {
    setIsRecording(!isRecording)
    if (!isRecording) {
      // Simulate voice recording
      setTimeout(() => {
        setJournalEntry(journalEntry + " I'm feeling more confident about managing my anxiety at work.")
        setIsRecording(false)
      }, 3000)
    }
  }

  const saveEntry = () => {
    if (journalEntry.trim() && entryTitle.trim()) {
      const today = new Date()
      const formattedDate = today.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

      setSavedEntries([
        {
          id: Date.now(),
          date: formattedDate,
          title: entryTitle,
          content: journalEntry,
        },
        ...savedEntries,
      ])

      setJournalEntry("")
      setEntryTitle("")
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium">My Journal</h2>
        <div className="flex gap-2">
          <motion.button
            className="p-2 rounded-full bg-[#2196F3] text-white shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Calendar className="h-5 w-5" />
          </motion.button>
          <motion.button
            className="p-2 rounded-full bg-[#2196F3] text-white shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="h-5 w-5" />
          </motion.button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md overflow-hidden flex-1 flex flex-col mb-4">
        <div className="flex items-center gap-2 p-2 border-b">
          <input
            type="text"
            placeholder="Entry title..."
            value={entryTitle}
            onChange={(e) => setEntryTitle(e.target.value)}
            className="flex-1 p-2 text-sm focus:outline-none"
          />
          <button className="p-1.5 rounded-md hover:bg-[#f0f0f0] transition-colors">
            <Bold className="h-4 w-4 text-[#555]" />
          </button>
          <button className="p-1.5 rounded-md hover:bg-[#f0f0f0] transition-colors">
            <Italic className="h-4 w-4 text-[#555]" />
          </button>
          <div className="h-4 w-px bg-[#ddd]"></div>
          <motion.button
            onClick={handleRecording}
            className={`p-1.5 rounded-md transition-colors ${isRecording ? "bg-[#2196F3]/30" : "hover:bg-[#f0f0f0]"}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isRecording ? <MicOff className="h-4 w-4 text-[#2196F3]" /> : <Mic className="h-4 w-4 text-[#555]" />}
          </motion.button>
        </div>

        <textarea
          value={journalEntry}
          onChange={(e) => setJournalEntry(e.target.value)}
          placeholder="Write your thoughts here..."
          className="w-full flex-1 p-4 outline-none resize-none"
        ></textarea>

        <div className="p-2 border-t flex justify-end">
          <motion.button
            className="px-4 py-2 rounded-xl bg-[#2196F3] text-white text-sm font-medium flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={saveEntry}
            disabled={!journalEntry.trim() || !entryTitle.trim()}
          >
            <Save className="h-4 w-4" />
            <span>Save Entry</span>
          </motion.button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <h3 className="text-lg font-medium mb-3">Recent Entries</h3>
        <div className="space-y-3">
          {savedEntries.map((entry) => (
            <div key={entry.id} className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">{entry.title}</h4>
                <span className="text-xs text-[#777]">{entry.date}</span>
              </div>
              <p className="text-sm text-[#555]">{entry.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
