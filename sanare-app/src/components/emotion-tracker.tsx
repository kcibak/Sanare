"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar } from "lucide-react"

export function EmotionTracker() {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null)
  const [emotionNote, setEmotionNote] = useState("")
  const [showHistory, setShowHistory] = useState(false)

  const emotions = [
    { name: "Happy", color: "#FFD166", emoji: "😊" },
    { name: "Calm", color: "#06D6A0", emoji: "😌" },
    { name: "Sad", color: "#118AB2", emoji: "😔" },
    { name: "Anxious", color: "#EF476F", emoji: "😰" },
    { name: "Angry", color: "#E63946", emoji: "😠" },
  ]

  // Mock emotion history data
  const emotionHistory = [
    { date: "May 2", emotion: "Happy", note: "Felt good after therapy session" },
    { date: "May 1", emotion: "Anxious", note: "Work presentation" },
    { date: "Apr 30", emotion: "Calm", note: "Practiced meditation" },
    { date: "Apr 29", emotion: "Sad", note: "Missing family" },
    { date: "Apr 28", emotion: "Anxious", note: "Work stress" },
    { date: "Apr 27", emotion: "Happy", note: "Weekend plans" },
    { date: "Apr 26", emotion: "Calm", note: "Good sleep" },
  ]

  const saveEmotion = () => {
    // Logic to save emotion would go here
    setSelectedEmotion(null)
    setEmotionNote("")
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">How are you feeling today?</h2>
        <motion.button
          className="p-1.5 rounded-full hover:bg-[#f0f0f0] transition-colors"
          onClick={() => setShowHistory(!showHistory)}
        >
          <Calendar className="h-4 w-4 text-[#777]" />
        </motion.button>
      </div>

      <div className="grid grid-cols-5 gap-2 mb-4">
        {emotions.map((emotion) => (
          <motion.button
            key={emotion.name}
            className={`flex flex-col items-center p-2 rounded-xl transition-colors ${
              selectedEmotion === emotion.name ? "ring-2 ring-offset-2" : ""
            }`}            style={{
              backgroundColor: `${emotion.color}20`,
            }}
            onClick={() => setSelectedEmotion(emotion.name)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-2xl">{emotion.emoji}</span>
            <span className="text-xs mt-1">{emotion.name}</span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {selectedEmotion && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <textarea
              placeholder={`Tell us more about why you're feeling ${selectedEmotion.toLowerCase()}...`}
              value={emotionNote}
              onChange={(e) => setEmotionNote(e.target.value)}
              className="w-full p-3 border rounded-xl h-20 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
            />
            <motion.button
              className="mt-2 w-full py-2 rounded-xl bg-[#FFC107] text-[#333] font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={saveEmotion}
            >
              Save
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showHistory && (
          <motion.div
            className="mt-4 pt-4 border-t"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-sm font-medium mb-2">Emotion History</h3>
            <div className="max-h-40 overflow-y-auto pr-2">
              <div className="space-y-2">
                {emotionHistory.map((entry, index) => {
                  const emotion = emotions.find((e) => e.name === entry.emotion)
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 rounded-lg"
                      style={{ backgroundColor: emotion ? `${emotion.color}10` : undefined }}
                    >
                      <div className="flex-shrink-0">
                        <span className="text-lg">{emotion?.emoji}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-medium">{entry.emotion}</span>
                          <span className="text-xs text-[#777]">{entry.date}</span>
                        </div>
                        <p className="text-xs text-[#555] truncate">{entry.note}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

