"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, ThumbsUp, Calendar, ChevronDown, ChevronUp, FileText, Trash2 } from "lucide-react"
import { usePatient } from "@/lib/context/patient-context"
import { getSharedNotesForPatient, toggleNoteAcknowledged, addNoteComment, getNoteComments, deleteNoteComment } from "@/lib/api"

interface SessionComment {
  id: number;
  text: string;
  date: string;
  author: string;
}

interface SessionNote {
  id: number;
  date: string;
  title: string;
  content: string;
  ack: boolean;
  comments: SessionComment[];
  expanded: boolean;
  backendId?: string;
}

// Helper to format dates
const formatDate = (date: string | Date | undefined) => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

export function PatientSessionNotes() {
  const { patient } = usePatient();
  const [notes, setNotes] = useState<SessionNote[]>([])
  const [newComments, setNewComments] = useState<{ [key: number]: string }>({})

  useEffect(() => {
    async function fetchNotes() {
      if (!patient?.id) return;
      const sharedNotes = await getSharedNotesForPatient(patient.id);
      setNotes(
        sharedNotes.map((note: any, idx: number) => ({
          id: idx + 1, // Use index as id for now
          date: formatDate(note.sessiondate),
          title: note.notetitle,
          content: note.notecontent || "",
          ack: note.ack || false,
          comments: [],
          expanded: false,
          backendId: note.noteid,
        }))
      );
    }
    fetchNotes();
  }, [patient?.id])

  const acknowledgeNote = async (noteId: number, noteBackendId?: string) => {
    // Find the note in state
    const note = notes.find((n) => n.id === noteId);
    if (!note) return;
    // Call backend to toggle ack
    if (noteBackendId) {
      try {
        const updated = await toggleNoteAcknowledged(noteBackendId);
        setNotes(notes.map((n) => n.id === noteId ? { ...n, ack: updated.ack } : n));
      } catch (e) {
        // Optionally show error
      }
    } else {
      // fallback: just toggle in UI
      setNotes(notes.map((n) => n.id === noteId ? { ...n, ack: !n.ack } : n));
    }
  }

  const addComment = async (noteId: number) => {
    const note = notes.find((n) => n.id === noteId);
    if (!note || !note.backendId) return;
    const content = newComments[noteId]?.trim();
    if (!content) return;
    try {
      const newComment = await addNoteComment(note.backendId, content, 'patient');
      setNotes(
        notes.map((n) =>
          n.id === noteId
            ? {
                ...n,
                comments: [...n.comments, {
                  id: Date.now(),
                  text: newComment.content,
                  date: formatDate(newComment.createdAt),
                  author: newComment.author,
                }],
              }
            : n
        )
      );
      setNewComments({ ...newComments, [noteId]: "" });
    } catch (e) {
      // Optionally show error
    }
  }

  const fetchAndSetComments = async (noteId: number, backendId: string) => {
    const comments = await getNoteComments(backendId);
    setNotes(notes => notes.map(n => n.id === noteId ? { ...n, comments: comments.map((c: any) => ({
      id: Date.now() + Math.random(),
      text: c.content,
      date: formatDate(c.createdAt),
      author: c.author,
    })) } : n));
  }

  const toggleExpand = (noteId: number) => {
    setNotes(
      notes.map((note) => {
        if (note.id === noteId) {
          if (!note.expanded && note.backendId) {
            fetchAndSetComments(noteId, note.backendId);
          }
          return { ...note, expanded: !note.expanded }
        }
        // Close other notes when opening a new one
        return { ...note, expanded: false }
      }),
    )
  }

  const deleteComment = async (noteId: number, commentIndex: number) => {
    const note = notes.find((n) => n.id === noteId);
    if (!note || !note.backendId) return;
    try {
      await deleteNoteComment(note.backendId, commentIndex, 'patient');
      setNotes(notes => notes.map(n => n.id === noteId ? {
        ...n,
        comments: n.comments.filter((_, i) => i !== commentIndex)
      } : n));
    } catch (e) {
      // Optionally show error
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-[#FFC107] flex items-center justify-center shadow-md">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-xl font-medium">Session Notes</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent" style={{ scrollbarWidth: 'thin', scrollbarColor: 'transparent transparent' }}>
        {notes.length === 0 ? (
          <div className="text-center text-gray-400 mt-8 w-full col-span-2">
            <p>No session notes yet.</p>
            <p>Your session notes will appear here after your first session.</p>
          </div>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="relative">
              <motion.div
                className={`bg-white rounded-2xl overflow-hidden ${note.expanded ? "md:col-span-2 border border-[#FFC107]/30" : ""}`}
                whileHover={!note.expanded ? { backgroundColor: "#FFF3CD", transition: { duration: 0 } } : {}}
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
                        <div className="mb-1">
                        </div>
                        <h3 className="font-bold text-2xl mb-2">{note.title}</h3>
                        <p className="text-xs text-[#777]">{note.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.button
                        className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${note.ack ? "bg-[#FFC107] text-white" : "bg-[#FFC107]/20 text-[#FFC107]"}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={async (e) => {
                          e.stopPropagation();
                          await acknowledgeNote(note.id, note.backendId);
                        }}
                      >
                        <ThumbsUp className="h-3 w-3" />
                        <span>{note.ack ? "Acknowledged" : "Acknowledge"}</span>
                      </motion.button>
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
                        <span className="text-xs font-bold text-[#B4F0E0] mb-1 block">Provider</span>
                        <p className="text-sm leading-relaxed">{note.content}</p>
                      </div>

                      {note.comments.length > 0 && (
                        <div className="p-4 border-t border-[#FFC107]/10 bg-white/50">
                          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-[#FFC107]" />
                            Comments
                          </h4>
                          <div className="space-y-2">
                            {note.comments.map((comment, idx) => (
                              <div
                                key={comment.id}
                                className={`rounded-lg p-3 border-l-2 flex flex-col max-w-[80%] relative ${comment.author === 'provider' ? 'bg-[#B4F0E0]/30 border-[#B4F0E0]' : 'mr-auto bg-[#FFF8E1] border-[#FFC107]'}`}
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`text-xs font-bold ${comment.author === 'provider' ? 'text-[#B4F0E0]' : 'text-[#FFC107]'}`}>{comment.author === 'provider' ? 'Provider' : 'You'}</span>
                                  <span className="text-xs text-gray-500">{comment.date}</span>
                                  {comment.author === 'patient' && (
                                    <button
                                      className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500"
                                      onClick={() => deleteComment(note.id, idx)}
                                      title="Delete comment"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  )}
                                </div>
                                <p className="text-sm">{comment.text}</p>
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
              {!note.ack && (
                <div className="absolute top-0 right-0 w-3 h-3 bg-[#FFC107] rounded-full transform translate-x-1/2 -translate-y-1/2 shadow-md"></div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
