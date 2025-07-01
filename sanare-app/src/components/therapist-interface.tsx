"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Lock, Share2, Plus, Pencil, Trash2, Save, MessageSquare, ThumbsUp } from "lucide-react"
import { ConfirmationModal } from "./confirmation-modal"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { getPatient, getPatientNotes, createNote, updateNote, deleteNote, deletePatient, updateNoteSharedStatus, getNoteComments, addNoteComment, deleteNoteComment } from "@/lib/api"
import { EditPatientNameModal } from "./edit-patient-name-modal"
import type { Note } from "@/types/notes"
import { useToast } from "@/hooks/use-toast"

interface TherapistInterfaceProps {
  patientid: string
  onPatientDeleted?: () => void
}

interface PatientData {
  patientid: string
  firstname: string
  lastname: string
  age: number
  pronouns: string
  therapistid: string
  createdat?: string
  dob?: string
  email?: string
}

export function TherapistInterface({ patientid, onPatientDeleted }: TherapistInterfaceProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)
  const [notetitle, setNoteTitle] = useState("")
  const [noteContent, setNoteContent] = useState("")
  const [sessionDate, setSessionDate] = useState<string>(new Date().toISOString().slice(0, 10))
  const [isLoading, setIsLoading] = useState(true)
  const [patientData, setPatientData] = useState<PatientData | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [pendingNoteType, setPendingNoteType] = useState<"private" | "shared">("private")
  const [noteType, setNoteType] = useState<"private" | "shared">("private")
  const [isRecording, setIsRecording] = useState(false)
  const [loadingNote, setLoadingNote] = useState(false)
  const [isDeleteNoteModalOpen, setIsDeleteNoteModalOpen] = useState(false);
  const [noteIdToDelete, setNoteIdToDelete] = useState<string | null>(null);
  const [showSavedPopup, setShowSavedPopup] = useState(false);
  const [showSharedConfirm, setShowSharedConfirm] = useState(false);
  const [pendingSharedValue, setPendingSharedValue] = useState<null | boolean>(null);
  const [isDeletePatientModalOpen, setIsDeletePatientModalOpen] = useState(false);
  const [isDeletingPatient, setIsDeletingPatient] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const saveButtonRef = useRef<HTMLButtonElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!patientid) return;
    setIsLoading(true);
    // Fetch patient data
    getPatient(patientid).then((data) => {
      setPatientData(data);
      setIsLoading(false);
    });
    // Fetch notes for this patient
    getPatientNotes(patientid).then((notes) => {
      setNotes(notes);
      setSelectedNoteId(null); // Do not auto-select a note
      setNoteContent("");
    });
  }, [patientid])

  // When a note is selected, update the editor and noteType
  useEffect(() => {
    if (!selectedNoteId) {
      setNoteTitle("");
      setNoteContent("");
      setNoteType("private");
      return;
    }
    const note = notes.find((n) => n.noteid === selectedNoteId)
    setNoteTitle(note?.notetitle || "");
    setNoteContent(note?.notecontent || "");
    setNoteType(note?.isshared ? "shared" : "private")
  }, [selectedNoteId, notes])

  useEffect(() => {
    if (!selectedNoteId) {
      setComments([]);
      return;
    }
    // Fetch comments for the selected note
    getNoteComments(selectedNoteId).then(setComments);
  }, [selectedNoteId]);

  const handleCreateSession = async () => {
    const today = new Date().toISOString().slice(0, 10);
    setLoadingNote(true)
    try {
      const newNote = await createNote({
        patientid,
        sessiondate: today,
        notecontent: undefined,
      })
      setNotes([newNote, ...notes])
      setSelectedNoteId(newNote.noteid)
      // setIsCreateSessionModalOpen(false)
    } catch (e) {
      // handle error
    } finally {
      setLoadingNote(false)
    }
  }

  const handleSaveNote = async () => {
    if (!selectedNoteId) return;
    setLoadingNote(true)
    try {
      const updated = await updateNote(selectedNoteId, notetitle, noteContent);
      setNotes((prev) => prev.map((n) => n.noteid === updated.noteid ? updated : n))
      setShowSavedPopup(true);
      setTimeout(() => setShowSavedPopup(false), 3000);
    } catch (e) {
      // Optionally show error
    } finally {
      setLoadingNote(false)
    }
  }

  const requestDeleteNote = (noteid: string) => {
    setNoteIdToDelete(noteid);
    setIsDeleteNoteModalOpen(true);
  }

  const confirmDeleteNote = async () => {
    if (!noteIdToDelete) return;
    setLoadingNote(true)
    try {
      const deleted = await deleteNote(noteIdToDelete)
      if (deleted) {
        setNotes((prev) => prev.filter((n) => n.noteid !== noteIdToDelete))
        if (selectedNoteId === noteIdToDelete) {
          const remaining = notes.filter((n) => n.noteid !== noteIdToDelete)
          setSelectedNoteId(remaining.length > 0 ? remaining[0].noteid : null)
        }
      } else {
        alert('Failed to delete note. Please try again.')
      }
    } catch (e) {
      alert('Failed to delete note. Please try again.')
    } finally {
      setIsDeleteNoteModalOpen(false);
      setNoteIdToDelete(null);
      setLoadingNote(false)
    }
  }

  // Always show confirmation and always call backend for toggle
  const handleNoteTypeChange = (type: "private" | "shared") => {
    if (!selectedNoteId) return;
    const note = notes.find((n) => n.noteid === selectedNoteId);
    const isCurrentlyShared = note?.isshared ?? false;
    const willBeShared = type === "shared";
    if (isCurrentlyShared !== willBeShared) {
      setPendingSharedValue(willBeShared);
      setShowSharedConfirm(true);
    }
  };

  const confirmSharedChange = async () => {
    if (!selectedNoteId || pendingSharedValue === null) return;
    try {
      const updated = await updateNoteSharedStatus(selectedNoteId, pendingSharedValue);
      setNotes((prev) => prev.map((n) => n.noteid === updated.noteid ? updated : n));
    } finally {
      setShowSharedConfirm(false);
      setPendingSharedValue(null);
    }
  };

  const handleDeletePatient = async () => {
    if (!patientData) return;
    setIsDeletingPatient(true);
    try {
      await deletePatient(patientData.patientid);
      setIsDeletePatientModalOpen(false);
      if (typeof onPatientDeleted === 'function') onPatientDeleted();
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete patient. Please try again.", variant: "destructive" });
    } finally {
      setIsDeletingPatient(false);
    }
  };

  const handleAddComment = async () => {
    if (!selectedNoteId || !newComment.trim()) return;
    try {
      const comment = await addNoteComment(selectedNoteId, newComment, "provider");
      setComments([...comments, comment]);
      setNewComment("");
    } catch (e) {
      // Optionally show error
    }
  };

  const deleteComment = async (commentIndex: number) => {
    if (!selectedNoteId) return;
    try {
      await deleteNoteComment(selectedNoteId, commentIndex, 'provider');
      setComments(comments => comments.filter((_, i) => i !== commentIndex));
    } catch (e) {
      // Optionally show error
    }
  }

  // Helper to format dates
  const formatDate = (date: string | Date | undefined) => {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const handleBack = () => {
    // Custom event or callback to parent
    const event = new CustomEvent('deselectPatient');
    window.dispatchEvent(event);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D8B4F0]"></div>
      </div>
    )
  }

  if (!patientData) {
    return (
      <div className="flex h-screen items-center justify-center flex-col gap-4">
        <p className="text-[#555]">Failed to load patient data</p>
        {/* Removed Go Back button, sign out is now in header */}
      </div>
    )
  }

  return (
    <TooltipProvider>
      {/* Patient Info Bar - full width, above sidebar and main content */}
      <div
        className="w-full flex items-center gap-4 px-6 py-2"
        style={{
          background: '#FFB5D0',
          color: noteType === 'private' ? '#7A2250' : '#4B2C5E',
          borderRadius: 0,
          boxShadow: 'none',
          minHeight: '48px',
          position: 'relative',
          zIndex: 20,
        }}
      >
        <div className="h-12 w-12 rounded-full bg-[#D8B4F0] flex items-center justify-center">
          <span className="text-white font-bold text-2xl">{`${patientData.firstname[0]}${patientData.lastname[0]}`}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-lg leading-tight">{`${patientData.firstname} ${patientData.lastname}`}</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button onClick={() => setIsEditModalOpen(true)} className="p-2 rounded-full hover:bg-[#D8B4F0]/80 hover:text-white transition-colors">
                  <Pencil className="h-5 w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Edit patient</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button onClick={() => setIsDeletePatientModalOpen(true)} className="p-2 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors">
                  <Trash2 className="h-5 w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Delete patient</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <div className="flex h-screen">
        <div className="w-16 bg-white/20 backdrop-blur-sm flex flex-col items-center py-6">
          <Button
            variant="ghost"
            className="p-3 mt-2 flex items-center justify-center"
            onClick={handleBack}
            title="Back to patient list"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48" strokeWidth={2.5} stroke="currentColor" className="w-12 h-12 text-[#D86FD8] hover:text-[#FFB5D0] transition-colors drop-shadow-lg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M32 40L16 24l16-16" />
            </svg>
          </Button>
        </div>
        {/* Session Sidebar */}
        <div className="w-64 bg-white/20 backdrop-blur-sm border-r border-white/30 p-2 pl-2">
          <div className="flex items-center mb-4">
            <h2 className="font-medium text-left flex-1">Session Notes</h2>
            <motion.button
              className="p-1.5 rounded-full bg-[#D8B4F0] text-white shadow-md hover:bg-[#B4F0E0] hover:text-[#D86FD8] transition-colors focus:outline-none focus:ring-2 focus:ring-[#D8B4F0]"
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreateSession}
              title="Create new note"
            >
              <Plus className="h-5 w-5" />
            </motion.button>
          </div>
          <div className="space-y-2">
            {notes.map((note) => (
              <motion.div
                key={note.noteid}
                className={`w-full p-2 rounded-xl cursor-pointer transition-colors flex-1 
                  ${selectedNoteId === note.noteid
                    ? (note.isshared
                        ? "bg-[#B4F0E0]/70 border-l-4 border-[#1CC6B7] shadow-md"
                        : "bg-[#D8B4F0]/70 border-l-4 border-[#D86FD8] shadow-md")
                    : (note.isshared
                        ? "bg-[#B4F0E0]/40 hover:bg-[#B4F0E0]/60"
                        : "bg-white/50 hover:bg-white/70")
                  }`}
                whileHover={{ x: 5 }}
                onClick={() => setSelectedNoteId(note.noteid)}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex-1 flex items-center gap-2">
                    <p className="text-sm font-bold">{note.notetitle || "Untitled Session Note"}</p>
                  </div>
                  {/* Removed date from session note selection component as requested */}
                  <div className="relative group">
                    <motion.button
                      className="p-1 rounded-full hover:bg-white/50"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => { e.stopPropagation(); requestDeleteNote(note.noteid) }}
                      title="Delete note"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-[#555]" />
                    </motion.button>
                    <span className="absolute left-1/2 -translate-x-1/2 mt-8 px-2 py-1 rounded bg-[#D8B4F0] text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                      Delete note
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        {/* Main Content */}
        <div className="flex-1 flex flex-col transition-colors duration-500" style={{ backgroundColor: noteType === "private" ? "#FFB5D0" : "#B4F0E0" }}>
          {/* Notes Editor and Display */}
          <div className="flex-1 flex flex-col p-4">
            {(!selectedNoteId) ? (
              <div className="flex flex-col h-full p-8">
                {patientData ? (
                  <>
                    <div className="mb-2 text-3xl font-bold">{patientData.firstname} {patientData.lastname}</div>
                    <div className="flex flex-col gap-1 text-base font-medium">
                      {patientData.patientid && <div><span className="font-semibold">Patient ID:</span> {patientData.patientid}</div>}
                      {patientData.age && <div><span className="font-semibold">Age:</span> {patientData.age}</div>}
                      {patientData.pronouns && <div><span className="font-semibold">Pronouns:</span> {patientData.pronouns}</div>}
                      {patientData.dob && <div><span className="font-semibold">DOB:</span> {new Date(patientData.dob).toLocaleDateString()}</div>}
                      {patientData.email && <div><span className="font-semibold">Email:</span> {patientData.email}</div>}
                      {patientData.createdat && <div><span className="font-semibold">Created:</span> {new Date(patientData.createdat).toLocaleDateString()}</div>}
                    </div>
                    {/* Removed select a session note caption as requested */}
                  </>
                ) : (
                  <div className="text-gray-500">Select a patient to view their info.</div>
                )}
                {notes.length === 0 && (
                  <Button onClick={handleCreateSession} className="mt-6">Create your first session note</Button>
                )}
              </div>
            ) : (
              <>
                {/* ...existing code for selected note display... */}
                <div className="mb-4 bg-white/70 rounded-xl p-6 shadow-md relative flex flex-col pb-4">
                  <input
                    type="text"
                    className="w-full mb-3 p-3 rounded-lg border text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[#D8B4F0]"
                    placeholder="Session Note Title"
                    value={notetitle}
                    onChange={e => setNoteTitle(e.target.value)}
                    disabled={!selectedNoteId || loadingNote}
                  />
                  <textarea
                    value={noteContent}
                    onChange={e => setNoteContent(e.target.value)}
                    className="w-full h-[200px] p-4 rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-[#D8B4F0]"
                    placeholder="Enter your session notes here..."
                    disabled={!selectedNoteId || loadingNote}
                  />
                  {/* Private/Shared buttons inside note-taking div */}
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex bg-white/50 rounded-full p-1">
                      <button
                        className={`px-3 py-1.5 rounded-full flex items-center gap-1 text-sm transition-colors ${noteType === "private" ? "bg-[#FFB5D0] text-[#333]" : "text-[#555]"}`}
                        onClick={() => handleNoteTypeChange("private")}
                        disabled={notes.find(n => n.noteid === selectedNoteId)?.isshared}
                      >
                        <Lock className="h-3.5 w-3.5" /> <span>Private</span>
                      </button>
                      <button
                        className={`px-3 py-1.5 rounded-full flex items-center gap-1 text-sm transition-colors ${noteType === "shared" ? "bg-[#B4F0E0] text-[#333]" : "text-[#555]"}`}
                        onClick={() => handleNoteTypeChange("shared")}
                        disabled={noteType === "shared"}
                      >
                        <Share2 className="h-3.5 w-3.5" /> <span>Shared</span>
                      </button>
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4 flex items-center gap-3">
                    {showSavedPopup && (
                      <div
                        className="bg-green-400/80 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-2 min-w-[90px] justify-center pointer-events-none animate-fade-in-out"
                        style={{ height: 36 }}
                      >
                        <span className="text-lg font-bold text-green-200">✔️</span> Note saved
                      </div>
                    )}
                    <button
                      ref={saveButtonRef}
                      onClick={handleSaveNote}
                      disabled={!(notetitle.trim() || noteContent.trim()) || loadingNote}
                      className="px-4 py-2 bg-[#D8B4F0] text-white rounded-lg flex items-center gap-2 disabled:opacity-50 hover:bg-[#D8B4F0]/90 transition-colors shadow-md"
                    >
                      <Save className="h-4 w-4" /> Save Note
                    </button>
                  </div>
                </div>
                {/* Note Metadata */}
                <div className="mb-2 text-xs text-gray-500 flex items-center gap-4">
                  {(() => {
                    const note = notes.find((n) => n.noteid === selectedNoteId)
                    if (!note) return null
                    return (
                      <>
                        <span>Created: {formatDate(note.createdat)}</span>
                        {note.updatedat && <span className="ml-4">Last updated: {formatDate(note.updatedat)}</span>}
                      </>
                    )
                  })()}
                </div>
                {/* Comments Section */}
                {selectedNoteId && notes.find(n => n.noteid === selectedNoteId)?.isshared && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold flex items-center gap-2">Comments</h4>
                      {(() => {
                        const note = notes.find((n) => n.noteid === selectedNoteId)
                        if (note?.ack) {
                          return (
                            <span className="flex items-center gap-1 text-green-600 font-semibold">
                              <ThumbsUp className="h-4 w-4 text-green-500" /> Patient acknowledged this note
                            </span>
                          )
                        }
                        return null;
                      })()}
                    </div>
                    <div className="space-y-2 mb-4">
                      {comments.length === 0 && <div className="text-gray-400 text-sm">No comments yet.</div>}
                      {comments.map((c, i) => (
                        <div key={i} className={`rounded-lg p-3 border-l-4 relative ${c.author === 'provider' ? 'border-[#B4F0E0] bg-[#F8F8FF]' : 'border-[#FFC107] bg-[#FFF8E1]'}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-bold ${c.author === 'provider' ? 'text-[#B4F0E0]' : 'text-[#FFC107]'}`}>{c.author === 'provider' ? 'Provider' : 'Patient'}</span>
                            <span className="text-xs text-gray-500">{formatDate(c.createdAt)}</span>
                            {c.author === 'provider' && (
                              <button
                                className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500"
                                onClick={() => deleteComment(i)}
                                title="Delete comment"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                          <div className="text-sm">{c.content}</div>
                        </div>
                      ))}
                    </div>
                    <div
                      className={`rounded-lg p-3 border-l-4 relative flex items-center gap-2 mt-2 ${noteType === 'shared' ? 'border-[#B4F0E0] bg-[#F8F8FF]' : 'border-[#FFC107] bg-[#FFF8E1]'}`}
                    >
                      <input
                        type="text"
                        className="flex-1 p-2 text-sm bg-transparent border-none focus:outline-none"
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') handleAddComment(); }}
                      />
                      <motion.button
                        className="p-2 rounded-full bg-[#D8B4F0] text-white shadow-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                        title="Add comment"
                      >
                        <MessageSquare className="h-4 w-4 text-white" />
                      </motion.button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        {/* Edit Patient Name Modal */}
        {isEditModalOpen && patientData && (
          <EditPatientNameModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            patientId={patientData.patientid}
            currentFirstName={patientData.firstname}
            currentLastName={patientData.lastname}
            onNameUpdated={(firstName, lastName) => {
              setPatientData({ ...patientData, firstname: firstName, lastname: lastName });
              setIsEditModalOpen(false);
            }}
          />
        )}
        {/* Delete Note Confirmation Modal */}
        <ConfirmationModal
          isOpen={isDeleteNoteModalOpen}
          title="Delete Session"
          message="Are you sure you want to delete this session? This action cannot be undone."
          confirmText="Delete"
          onConfirm={confirmDeleteNote}
          onCancel={() => { setIsDeleteNoteModalOpen(false); setNoteIdToDelete(null); }}
        />
        {/* Share Note Confirmation Modal */}
        <ConfirmationModal
          isOpen={showSharedConfirm}
          title={pendingSharedValue ? "Share Note with Patient" : "Make Note Private"}
          message={pendingSharedValue ? "Are you sure you want to share this note with the patient? This action is permanent and cannot be undone. Once shared, the note cannot be made private again." : "Are you sure you want to make this note private? This will remove access for the patient."}
          confirmText={pendingSharedValue ? "Share" : "Make Private"}
          onConfirm={confirmSharedChange}
          onCancel={() => { setShowSharedConfirm(false); setPendingSharedValue(null); }}
        />
        {/* Delete Patient Confirmation Modal */}
        <ConfirmationModal
          isOpen={isDeletePatientModalOpen}
          title="Delete Patient"
          message={`Are you sure you want to delete ${patientData?.firstname} ${patientData?.lastname}? This action cannot be undone.`}
          confirmText={isDeletingPatient ? "Deleting..." : "Delete"}
          onConfirm={handleDeletePatient}
          onCancel={() => setIsDeletePatientModalOpen(false)}
        />
      </div>
    </TooltipProvider>
  )
}