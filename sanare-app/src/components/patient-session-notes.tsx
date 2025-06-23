"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, ThumbsUp, Calendar, ChevronDown, ChevronUp, FileText } from "lucide-react"

export function PatientSessionNotes() {
  const [notes, setNotes] = useState([
    {
      id: 1,
      date: "May 2, 2024",
      title: "Weekly Session",
      content:
        "Today we focused on developing mindfulness techniques to manage anxiety in workplace situations. We practiced breathing exercises and discussed strategies for setting boundaries with colleagues. You reported feeling more confident in your ability to handle stressful meetings.",
      acknowledged: true,
      comments: [],
      expanded: false,
    },
    {
      id: 2,
      date: "April 25, 2024",
      title: "Weekly Session",
      content:
        "We explored cognitive distortions related to work performance. You identified 'catastrophizing' and 'black-and-white thinking' as patterns that emerge during high-stress periods. We began working on cognitive restructuring techniques to challenge these thoughts.",
      acknowledged: true,
      comments: [
        {
          id: 1,
          text: "I've been practicing the cognitive restructuring and it's helping me recognize when I start catastrophizing.",
          date: "April 26, 2024",
        },
      ],
      expanded: false,
    },
    {
      id: 3,
      date: "April 18, 2024",
      title: "Weekly Session",
      content:
        "You reported increased anxiety following a difficult conversation with your manager. We discussed assertive communication strategies and role-played potential future interactions. Your homework includes journaling about workplace interactions and practicing self-validation.",
      acknowledged: false,
      comments: [],
      expanded: false,
    },
  ])

  const [newComments, setNewComments] = useState<{ [key: number]: string }>({})

  const acknowledgeNote = (noteId: number) => {
    setNotes(notes.map((note) => (note.id === noteId ? { ...note, acknowledged: true } : note)))
  }

  const addComment = (noteId: number) => {
    if (newComments[noteId]?.trim()) {
      setNotes(
        notes.map((note) => {
          if (note.id === noteId) {
            return {
              ...note,
              comments: [
                ...note.comments,
                {
                  id: Date.now(),
                  text: newComments[noteId],
                  date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
                },
              ],
            }
          }
          return note
        }),
      )

      // Clear the comment input
      setNewComments({ ...newComments, [noteId]: "" })
    }
  }

  const toggleExpand = (noteId: number) => {
    setNotes(
      notes.map((note) => {
        if (note.id === noteId) {
          return { ...note, expanded: !note.expanded }
        }
        // Close other notes when opening a new one
        return { ...note, expanded: false }
      }),
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-[#FFC107] flex items-center justify-center shadow-md">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-xl font-medium">Session Notes from Dr. Emily</h2>
        </div>
        <div className="flex items-center text-xs bg-[#FFC107]/20 px-3 py-1.5 rounded-full">
          <Calendar className="h-3.5 w-3.5 mr-1 text-[#FFC107]" />
          <span className="font-medium text-[#FFC107]">Next session: May 9, 2024</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-auto">
        {notes.map((note) => (
          <div key={note.id} className="relative">
            <motion.div
              className={`bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg ${
                note.expanded ? "md:col-span-2" : ""
              }`}
              layoutId={`note-card-${note.id}`}
            >
              {/* Colorful top border */}
              <div className="h-1.5 w-full bg-gradient-to-r from-[#FFC107] via-[#FFD54F] to-[#FFECB3]"></div>

              <div
                className={`p-4 cursor-pointer ${note.expanded ? "border-b border-[#FFC107]/20" : ""}`}
                onClick={() => toggleExpand(note.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-[#FFC107]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Calendar className="h-4 w-4 text-[#FFC107]" />
                    </div>
                    <div>
                      <h3 className="font-medium">{note.title}</h3>
                      <p className="text-xs text-[#777]">{note.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!note.acknowledged && (
                      <motion.button
                        className="px-3 py-1 rounded-full bg-[#FFC107]/20 text-[#FFC107] text-xs font-medium flex items-center gap-1"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          acknowledgeNote(note.id)
                        }}
                      >
                        <ThumbsUp className="h-3 w-3" />
                        <span>Acknowledge</span>
                      </motion.button>
                    )}
                    <div className="h-6 w-6 rounded-full bg-[#FFC107]/10 flex items-center justify-center">
                      {note.expanded ? (
                        <ChevronUp className="h-4 w-4 text-[#FFC107]" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-[#FFC107]" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {note.expanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="p-4 bg-[#B4F0E0]/30">
                      <p className="text-sm leading-relaxed">{note.content}</p>
                    </div>

                    {note.comments.length > 0 && (
                      <div className="p-4 border-t border-[#FFC107]/10 bg-white/50">
                        <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-[#FFC107]" />
                          Your Comments
                        </h4>
                        <div className="space-y-2">
                          {note.comments.map((comment) => (
                            <div key={comment.id} className="bg-[#FFF8E1] rounded-lg p-3 border-l-2 border-[#FFC107]">
                              <p className="text-sm">{comment.text}</p>
                              <p className="text-xs text-[#777] mt-1">{comment.date}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="p-4 border-t border-[#FFC107]/10 flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        value={newComments[note.id] || ""}
                        onChange={(e) => setNewComments({ ...newComments, [note.id]: e.target.value })}
                        className="flex-1 p-2 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#B4F0E0]"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            addComment(note.id)
                          }
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <motion.button
                        className="p-2 rounded-full bg-[#B4F0E0] text-white shadow-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          addComment(note.id)
                        }}
                        disabled={!newComments[note.id]?.trim()}
                      >
                        <MessageSquare className="h-4 w-4 text-[#333]" />
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Visual indicator for unacknowledged notes */}
            {!note.acknowledged && (
              <div className="absolute top-0 right-0 w-3 h-3 bg-[#FFC107] rounded-full transform translate-x-1/2 -translate-y-1/2 shadow-md"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
