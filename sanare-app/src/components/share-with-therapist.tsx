"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Send, HelpCircle } from "lucide-react"

interface ShareWithTherapistProps {
  onShare: (note: string) => void
}

export function ShareWithTherapist({ onShare }: ShareWithTherapistProps) {
  const [note, setNote] = useState("")
  const [showTips, setShowTips] = useState(false)

  const handleSubmit = () => {
    if (note.trim()) {
      onShare(note)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="flex justify-end mb-6">
        <motion.button
          className="p-2 rounded-full bg-white/80 text-[#4CAF50] shadow-md hover:shadow-lg transition-shadow"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowTips(!showTips)}
        >
          <HelpCircle className="h-5 w-5" />
        </motion.button>
      </div>

      <motion.div
        className={`mb-6 bg-white rounded-2xl shadow-md p-5 overflow-hidden`}
        animate={{
          height: showTips ? "auto" : "0",
          opacity: showTips ? 1 : 0,
          marginBottom: showTips ? "1.5rem" : "0",
        }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-lg font-medium mb-2">Sharing Tips</h2>
        <ul className="text-sm space-y-2 text-[#555]">
          <li>• Share thoughts or concerns you'd like to discuss in your next session</li>
          <li>• Note any changes in your symptoms or mood since your last appointment</li>
          <li>• Ask questions you might forget during your session</li>
          <li>• Your therapist will receive this before your next appointment</li>
        </ul>
      </motion.div>

      <div className="bg-white rounded-2xl shadow-md p-5">
        <h2 className="text-lg font-medium mb-3">Write a note for Dr. Emily</h2>
        <textarea
          placeholder="What would you like to share with your therapist?"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full p-3 border rounded-xl h-40 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
        />
        <div className="flex justify-end mt-3">
          <motion.button
            className="px-6 py-2 rounded-xl bg-[#4CAF50] text-white text-sm font-medium flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={!note.trim()}
          >
            <Send className="h-4 w-4" />
            <span>Send to Therapist</span>
          </motion.button>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium mb-3">Previously Shared</h2>
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-md p-5">
            <p className="text-sm mb-3">
              I've been practicing the breathing exercises daily, but I'm still having trouble with the work
              presentations. Could we discuss some specific strategies for public speaking anxiety in our next session?
            </p>
            <p className="text-xs text-[#777]">Sent on Apr 28, 2024</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-5">
            <p className="text-sm mb-3">
              I had a panic attack at the grocery store yesterday. It came out of nowhere and was really scary. I used
              the grounding technique we discussed and it helped me calm down.
            </p>
            <p className="text-xs text-[#777]">Sent on Apr 21, 2024</p>
          </div>
        </div>
      </div>
    </div>
  )
}

