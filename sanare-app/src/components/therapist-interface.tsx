// // components/therapist-interface.tsx

// "use client"

// import { useState, useEffect } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import { ArrowLeft, Mic, MicOff, Bold, Italic, Lock, Share2, Plus, Pencil, Trash2, Save } from "lucide-react"
// import { ConfirmationModal } from "./confirmation-modal"
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"
// import { Input } from "./ui/input"
// import { Button } from "./ui/button"
// import { getPatient, getPatientNotes } from "@/lib/api"

// interface TherapistInterfaceProps {
//   patientid: string
//   onBack: () => void
// }

// interface PatientData {
//   patientid: string
//   firstname: string
//   lastname: string
//   age: number
//   pronouns: string
//   therapistid: string
//   createdat?: string
// }

// interface Session {
//   id: string
//   date: string
//   title: string
//   notes?: Note[]
// }

// interface Note {
//   id: string
//   content: string
//   noteType: "private" | "shared"
//   sessionId: string
//   createdat: string
// }

// export function TherapistInterface({ patientid, onBack }: TherapistInterfaceProps) {
//   const [note, setNote] = useState("")
//   const [isRecording, setIsRecording] = useState(false)
//   const [noteType, setNoteType] = useState<"private" | "shared">("private")
//   const [showConfirmation, setShowConfirmation] = useState(false)
//   const [pendingNoteType, setPendingNoteType] = useState<"private" | "shared">("private")
//   const [activeSessionId, setActiveSessionId] = useState("s1")
//   const [patientData, setPatientData] = useState<PatientData | null>(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false)
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
//   const [sessions, setSessions] = useState<Session[]>([])
//   const [isCreateSessionModalOpen, setIsCreateSessionModalOpen] = useState(false)
//   const [isRenameSessionModalOpen, setIsRenameSessionModalOpen] = useState(false)
//   const [sessionTitle, setSessionTitle] = useState("")
//   const [sessionToRename, setSessionToRename] = useState<Session | null>(null)
//   const [notes, setNotes] = useState<Note[]>([])

//   useEffect(() => {
//     if (!patientid) return;
//     setIsLoading(true);
//     // Fetch patient data
//     getPatient(patientid).then((data) => {
//       setPatientData(data);
//       setIsLoading(false);
//     });
//     // Fetch notes for this patient
//     getPatientNotes(patientid).then((notes) => {
//       setNotes(notes);
//     });
//   }, [patientid]);

//   const handleRecording = () => {
//     setIsRecording(!isRecording)
//     if (!isRecording) {
//       // Simulate voice recording
//       setTimeout(() => {
//         setNote(note + " The client expressed feeling overwhelmed with work responsibilities.")
//         setIsRecording(false)
//       }, 3000)
//     }
//   }

//   const handleNoteTypeChange = (type: "private" | "shared") => {
//     if (type !== noteType) {
//       setPendingNoteType(type)
//       setShowConfirmation(true)
//     }
//   }

//   const confirmNoteTypeChange = () => {
//     setNoteType(pendingNoteType)
//     setShowConfirmation(false)
//   }

//   // Get background color based on note type
//   const getBackgroundColor = () => {
//     return noteType === "private" ? "#FFB5D0" : "#B4F0E0"
//   }

//   const handleNameUpdated = (newFirstname: string, newLastname: string) => {
//     if (patientData) {
//       setPatientData({
//         ...patientData,
//         firstname: newFirstname,
//         lastname: newLastname,
//       })
//     }
//   }

//   const handleDelete = () => {
//     // For demo purposes, just go back without actually deleting
//     onBack();
//   }

//   const saveNote = () => {
//     if (!note.trim()) return;

//     // Create a simple mock note with UUID-like ID
//     const newNote: Note = {
//       id: `note-${Date.now()}`,
//       content: note,
//       noteType: noteType,
//       sessionId: activeSessionId,
//       createdat: new Date().toISOString()
//     };
    
//     // Update the sessions list with the new note
//     setSessions(prevSessions => 
//       prevSessions.map(session => {
//         if (session.id === activeSessionId) {
//           return {
//             ...session,
//             notes: [...(session.notes || []), newNote]
//           };
//         }
//         return session;
//       })
//     );
    
//     setNote(""); // Clear the note input
//     console.log("Note saved:", newNote);
//   }

//   // Get active session's notes
//   const activeSession = sessions.find(session => session.id === activeSessionId);
//   const activeNotes = activeSession?.notes || [];

//   // Add this new function to handle note deletion
//   const deleteNote = (noteId: string) => {
//     // Update the sessions state to remove the deleted note
//     setSessions(prevSessions =>
//       prevSessions.map(session => ({
//         ...session,
//         notes: session.notes?.filter(note => note.id !== noteId) || []
//       }))
//     );
//     console.log("Note deleted:", noteId);
//   }

//   const handleCreateSession = () => {
//     if (!sessionTitle.trim()) return;

//     const today = new Date();
//     const formattedDate = today.toLocaleDateString('en-US', { 
//       month: 'short', 
//       day: 'numeric', 
//       year: 'numeric'
//     });
    
//     const newSession: Session = {
//       id: `s${Date.now()}`,
//       date: formattedDate,
//       title: sessionTitle.trim(),
//       notes: []
//     };

//     setSessions(prevSessions => [newSession, ...prevSessions]);
//     setActiveSessionId(newSession.id);
//     setSessionTitle("");
//     setIsCreateSessionModalOpen(false);
//   }

//   const handleRenameSession = () => {
//     if (!sessionTitle.trim() || !sessionToRename) return;

//     setSessions(prevSessions =>
//       prevSessions.map(session =>
//         session.id === sessionToRename.id
//           ? { ...session, title: sessionTitle.trim() }
//           : session
//       )
//     );

//     setSessionTitle("");
//     setSessionToRename(null);
//     setIsRenameSessionModalOpen(false);
//   }

//   const handleDeleteSession = (sessionId: string) => {
//     if (window.confirm("Are you sure you want to delete this session? This action cannot be undone.")) {
//       setSessions(prevSessions => prevSessions.filter(session => session.id !== sessionId));
      
//       // If the deleted session was active, set the first available session as active
//       if (sessionId === activeSessionId) {
//         const remainingSessions = sessions.filter(session => session.id !== sessionId);
//         if (remainingSessions.length > 0) {
//           setActiveSessionId(remainingSessions[0].id);
//         }
//       }
//     }
//   }

//   if (isLoading) {
//     return (
//       <div className="flex h-screen items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D8B4F0]"></div>
//       </div>
//     );
//   }

//   if (!patientData) {
//     return (
//       <div className="flex h-screen items-center justify-center flex-col gap-4">
//         <p className="text-[#555]">Failed to load patient data</p>
//         <Button onClick={onBack}>Go Back</Button>
//       </div>
//     );
//   }

//   return (
//     <TooltipProvider>
//       <div className="flex h-screen">
//         <div className="w-16 bg-white/20 backdrop-blur-sm flex flex-col items-center py-6">
//           <button
//             onClick={onBack}
//             className="p-3 rounded-full bg-white/80 text-[#333] shadow-md hover:shadow-lg transition-shadow"
//           >
//             <ArrowLeft className="h-5 w-5" />
//           </button>
//         </div>

//         {/* Session Sidebar */}
//         <div className="w-64 bg-white/20 backdrop-blur-sm border-r border-white/30 p-4">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="font-medium">Sessions</h2>
//             <motion.button
//               className="p-1.5 rounded-full bg-[#D8B4F0] text-white shadow-sm"
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//               onClick={() => setIsCreateSessionModalOpen(true)}
//             >
//               <Plus className="h-4 w-4" />
//             </motion.button>
//           </div>

//           <div className="space-y-2">
//             {sessions.map((session) => (
//               <motion.div
//                 key={session.id}
//                 className={`p-3 rounded-xl cursor-pointer transition-colors ${
//                   activeSessionId === session.id
//                     ? "bg-[#D8B4F0]/30 border-l-4 border-[#D8B4F0]"
//                     : "bg-white/50 hover:bg-white/70"
//                 }`}
//                 whileHover={{ x: 5 }}
//               >
//                 <div className="flex items-center justify-between">
//                   <div className="flex-1" onClick={() => setActiveSessionId(session.id)}>
//                     <p className="text-sm font-medium">{session.title}</p>
//                     <p className="text-xs text-[#555]">{session.date}</p>
//                     {session.notes && session.notes.length > 0 && (
//                       <div className="mt-1">
//                         <span className="text-xs text-[#D8B4F0]">
//                           {session.notes.length} note{session.notes.length !== 1 ? 's' : ''}
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <motion.button
//                       className="p-1 rounded-full hover:bg-white/50"
//                       whileHover={{ scale: 1.1 }}
//                       whileTap={{ scale: 0.9 }}
//                       onClick={() => {
//                         setSessionToRename(session);
//                         setSessionTitle(session.title);
//                         setIsRenameSessionModalOpen(true);
//                       }}
//                     >
//                       <Pencil className="h-3.5 w-3.5 text-[#555]" />
//                     </motion.button>
//                     <motion.button
//                       className="p-1 rounded-full hover:bg-white/50"
//                       whileHover={{ scale: 1.1 }}
//                       whileTap={{ scale: 0.9 }}
//                       onClick={() => handleDeleteSession(session.id)}
//                     >
//                       <Trash2 className="h-3.5 w-3.5 text-[#555]" />
//                     </motion.button>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </div>

//         {/* Main Content */}
//         <div
//           className="flex-1 flex flex-col transition-colors duration-500"
//           style={{ backgroundColor: getBackgroundColor() }}
//         >
//           {/* Patient Info */}
//           <div className="flex justify-between items-center p-4 bg-white/20 backdrop-blur-sm">
//             <div className="flex items-center gap-2">
//               <div className="h-8 w-8 rounded-full bg-[#D8B4F0] flex items-center justify-center">
//                 <span className="text-white font-medium">
//                   {`${patientData.firstname[0]}${patientData.lastname[0]}`}
//                 </span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="font-medium">
//                   {`${patientData.firstname} ${patientData.lastname}`}
//                 </span>
//                 <button
//                   onClick={() => setIsEditModalOpen(true)}
//                   className="p-1 rounded-full hover:bg-[#D8B4F0]/80 hover:text-white transition-colors"
//                 >
//                   <Pencil className="h-4 w-4" />
//                 </button>
//                 <button
//                   onClick={() => setIsDeleteModalOpen(true)}
//                   className="p-1 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
//                 >
//                   <Trash2 className="h-4 w-4" />
//                 </button>
//               </div>
//             </div>

//             <div className="flex items-center gap-3">
//               <div className="flex bg-white/50 rounded-full p-1">
//                 <button
//                   className={`px-3 py-1.5 rounded-full flex items-center gap-1 text-sm transition-colors ${
//                     noteType === "private" ? "bg-[#FFB5D0] text-[#333]" : "text-[#555]"
//                   }`}
//                   onClick={() => handleNoteTypeChange("private")}
//                 >
//                   <Lock className="h-3.5 w-3.5" />
//                   <span>Private</span>
//                 </button>
//                 <button
//                   className={`px-3 py-1.5 rounded-full flex items-center gap-1 text-sm transition-colors ${
//                     noteType === "shared" ? "bg-[#B4F0E0] text-[#333]" : "text-[#555]"
//                   }`}
//                   onClick={() => handleNoteTypeChange("shared")}
//                 >
//                   <Share2 className="h-3.5 w-3.5" />
//                   <span>Shared</span>
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Notes Editor and Display */}
//           <div className="flex-1 flex flex-col p-4">
//             {/* Note Editor */}
//             <div className="mb-4">
//               <div className="flex items-center gap-2 mb-4">
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <button
//                       className={`p-2 rounded-full transition-colors ${
//                         isRecording ? "bg-red-500 text-white" : "hover:bg-white/50"
//                       }`}
//                       onClick={handleRecording}
//                     >
//                       {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
//                     </button>
//                   </TooltipTrigger>
//                   <TooltipContent>
//                     {isRecording ? "Stop Recording" : "Start Recording"}
//                   </TooltipContent>
//                 </Tooltip>

//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <button className="p-2 rounded-full hover:bg-white/50">
//                       <Bold className="h-5 w-5" />
//                     </button>
//                   </TooltipTrigger>
//                   <TooltipContent>Bold</TooltipContent>
//                 </Tooltip>

//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <button className="p-2 rounded-full hover:bg-white/50">
//                       <Italic className="h-5 w-5" />
//                     </button>
//                   </TooltipTrigger>
//                   <TooltipContent>Italic</TooltipContent>
//                 </Tooltip>

//                 <button
//                   onClick={saveNote}
//                   disabled={!note.trim()}
//                   className="ml-auto px-4 py-2 bg-[#D8B4F0] text-white rounded-lg flex items-center gap-2 disabled:opacity-50 hover:bg-[#D8B4F0]/90 transition-colors"
//                 >
//                   <Save className="h-4 w-4" />
//                   Save Note
//                 </button>
//               </div>

//               <textarea
//                 value={note}
//                 onChange={(e) => setNote(e.target.value)}
//                 className="w-full h-[200px] p-4 rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-[#D8B4F0]"
//                 placeholder="Enter your session notes here..."
//               />
//             </div>

//             {/* Saved Notes */}
//             <div className="flex-1 overflow-y-auto">
//               <div className="space-y-3">
//                 {activeNotes.length === 0 ? (
//                   <div className="text-center text-gray-500 py-8">
//                     No notes for this session yet
//                   </div>
//                 ) : (
//                   activeNotes.map((savedNote) => (
//                     <div
//                       key={savedNote.id}
//                       className={`p-4 rounded-lg ${
//                         savedNote.noteType === "private" 
//                           ? "bg-[#FFB5D0]/10 border-l-4 border-[#FFB5D0]" 
//                           : "bg-[#B4F0E0]/10 border-l-4 border-[#B4F0E0]"
//                       }`}
//                     >
//                       <div className="flex justify-between items-start mb-2">
//                         <div className="flex items-center gap-2">
//                           <span className="text-xs text-gray-500">
//                             {new Date(savedNote.createdat).toLocaleString()}
//                           </span>
//                           <span className={`text-xs px-2 py-1 rounded-full ${
//                             savedNote.noteType === "private" 
//                               ? "bg-[#FFB5D0]/20 text-[#FFB5D0]" 
//                               : "bg-[#B4F0E0]/20 text-[#B4F0E0]"
//                           }`}>
//                             {savedNote.noteType === "private" ? "Private" : "Shared"}
//                           </span>
//                         </div>
//                         <motion.button
//                           className="p-1.5 rounded-full hover:bg-red-100 group"
//                           whileHover={{ scale: 1.1 }}
//                           whileTap={{ scale: 0.9 }}
//                           onClick={() => {
//                             if (window.confirm('Are you sure you want to delete this note?')) {
//                               deleteNote(savedNote.id);
//                             }
//                           }}
//                         >
//                           <Trash2 className="h-4 w-4 text-gray-400 group-hover:text-red-500 transition-colors" />
//                         </motion.button>
//                       </div>
//                       <p className="text-sm whitespace-pre-wrap">{savedNote.content}</p>
//                     </div>
//                   ))
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//         <AnimatePresence>
//           {showConfirmation && (
//             <ConfirmationModal
//               isOpen={showConfirmation}
//               title="Change Note Type"
//               message={`Are you sure you want to change this note to ${pendingNoteType === "private" ? "private" : "shared with patient"}?`}
//               confirmText={`Yes, make it ${pendingNoteType}`}
//               onConfirm={confirmNoteTypeChange}
//               onCancel={() => setShowConfirmation(false)}
//             />
//           )}
//         </AnimatePresence>
//         <ConfirmationModal
//           isOpen={isDeleteModalOpen}
//           title="Delete Patient"
//           message={`Are you sure you want to delete ${patientData.firstname} ${patientData.lastname}? This action cannot be undone.`}
//           confirmText="Delete"
//           onConfirm={handleDelete}
//           onCancel={() => setIsDeleteModalOpen(false)}
//         />

//         {/* Create Session Modal */}
//         <Dialog open={isCreateSessionModalOpen} onOpenChange={setIsCreateSessionModalOpen}>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Create New Session</DialogTitle>
//             </DialogHeader>
//             <div className="py-4">
//               <Input
//                 placeholder="Enter session title"
//                 value={sessionTitle}
//                 onChange={(e) => setSessionTitle(e.target.value)}
//                 onKeyDown={(e) => {
//                   if (e.key === 'Enter') {
//                     handleCreateSession();
//                   }
//                 }}
//               />
//             </div>
//             <DialogFooter>
//               <Button variant="outline" onClick={() => {
//                 setSessionTitle("");
//                 setIsCreateSessionModalOpen(false);
//               }}>
//                 Cancel
//               </Button>
//               <Button onClick={handleCreateSession} disabled={!sessionTitle.trim()}>
//                 Create
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>

//         {/* Rename Session Modal */}
//         <Dialog open={isRenameSessionModalOpen} onOpenChange={setIsRenameSessionModalOpen}>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Rename Session</DialogTitle>
//             </DialogHeader>
//             <div className="py-4">
//               <Input
//                 placeholder="Enter new session title"
//                 value={sessionTitle}
//                 onChange={(e) => setSessionTitle(e.target.value)}
//                 onKeyDown={(e) => {
//                   if (e.key === 'Enter') {
//                     handleRenameSession();
//                   }
//                 }}
//               />
//             </div>
//             <DialogFooter>
//               <Button variant="outline" onClick={() => {
//                 setSessionTitle("");
//                 setSessionToRename(null);
//                 setIsRenameSessionModalOpen(false);
//               }}>
//                 Cancel
//               </Button>
//               <Button onClick={handleRenameSession} disabled={!sessionTitle.trim()}>
//                 Rename
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </div>
//     </TooltipProvider>
//   );
// }

"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Mic, MicOff, Bold, Italic, Lock, Share2, Plus, Pencil, Trash2, Save } from "lucide-react"
import { ConfirmationModal } from "./confirmation-modal"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { getPatient, getPatientNotes } from "@/lib/api"

interface TherapistInterfaceProps {
  patientid: string
  onBack: () => void
}

interface PatientData {
  patientid: string
  firstname: string
  lastname: string
  age: number
  pronouns: string
  therapistid: string
  createdat?: string
}

interface Session {
  id: string
  date: string
  title: string
  notes?: Note[]
}

interface Note {
  id: string
  content: string
  noteType: "private" | "shared"
  sessionId: string
  createdat: string
}

export function TherapistInterface({ patientid, onBack }: TherapistInterfaceProps) {
  const [note, setNote] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [noteType, setNoteType] = useState<"private" | "shared">("private")
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [pendingNoteType, setPendingNoteType] = useState<"private" | "shared">("private")
  const [activeSessionId, setActiveSessionId] = useState("s1")
  const [patientData, setPatientData] = useState<PatientData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [sessions, setSessions] = useState<Session[]>([])
  const [isCreateSessionModalOpen, setIsCreateSessionModalOpen] = useState(false)
  const [isRenameSessionModalOpen, setIsRenameSessionModalOpen] = useState(false)
  const [sessionTitle, setSessionTitle] = useState("")
  const [sessionToRename, setSessionToRename] = useState<Session | null>(null)
  const [notes, setNotes] = useState<Note[]>([])

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
    });
  }, [patientid]);

  const handleRecording = () => {
    setIsRecording(!isRecording)
    if (!isRecording) {
      // Simulate voice recording
      setTimeout(() => {
        setNote(note + " The client expressed feeling overwhelmed with work responsibilities.")
        setIsRecording(false)
      }, 3000)
    }
  }

  const handleNoteTypeChange = (type: "private" | "shared") => {
    if (type !== noteType) {
      setPendingNoteType(type)
      setShowConfirmation(true)
    }
  }

  const confirmNoteTypeChange = () => {
    setNoteType(pendingNoteType)
    setShowConfirmation(false)
  }

  // Get background color based on note type
  const getBackgroundColor = () => {
    return noteType === "private" ? "#FFB5D0" : "#B4F0E0"
  }

  const handleNameUpdated = (newFirstname: string, newLastname: string) => {
    if (patientData) {
      setPatientData({
        ...patientData,
        firstname: newFirstname,
        lastname: newLastname,
      })
    }
  }

  const handleDelete = () => {
    // For demo purposes, just go back without actually deleting
    onBack();
  }

  const saveNote = () => {
    if (!note.trim()) return;

    // Create a simple mock note with UUID-like ID
    const newNote: Note = {
      id: `note-${Date.now()}`,
      content: note,
      noteType: noteType,
      sessionId: activeSessionId,
      createdat: new Date().toISOString()
    };
    
    // Update the sessions list with the new note
    setSessions(prevSessions => 
      prevSessions.map(session => {
        if (session.id === activeSessionId) {
          return {
            ...session,
            notes: [...(session.notes || []), newNote]
          };
        }
        return session;
      })
    );
    
    setNote(""); // Clear the note input
    console.log("Note saved:", newNote);
  }

  // Get active session's notes
  const activeSession = sessions.find(session => session.id === activeSessionId);
  const activeNotes = activeSession?.notes || [];

  // Add this new function to handle note deletion
  const deleteNote = (noteId: string) => {
    // Update the sessions state to remove the deleted note
    setSessions(prevSessions =>
      prevSessions.map(session => ({
        ...session,
        notes: session.notes?.filter(note => note.id !== noteId) || []
      }))
    );
    console.log("Note deleted:", noteId);
  }

  const handleCreateSession = () => {
    if (!sessionTitle.trim()) return;

    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric'
    });
    
    const newSession: Session = {
      id: `s${Date.now()}`,
      date: formattedDate,
      title: sessionTitle.trim(),
      notes: []
    };

    setSessions(prevSessions => [newSession, ...prevSessions]);
    setActiveSessionId(newSession.id);
    setSessionTitle("");
    setIsCreateSessionModalOpen(false);
  }

  const handleRenameSession = () => {
    if (!sessionTitle.trim() || !sessionToRename) return;

    setSessions(prevSessions =>
      prevSessions.map(session =>
        session.id === sessionToRename.id
          ? { ...session, title: sessionTitle.trim() }
          : session
      )
    );

    setSessionTitle("");
    setSessionToRename(null);
    setIsRenameSessionModalOpen(false);
  }

  const handleDeleteSession = (sessionId: string) => {
    if (window.confirm("Are you sure you want to delete this session? This action cannot be undone.")) {
      setSessions(prevSessions => prevSessions.filter(session => session.id !== sessionId));
      
      // If the deleted session was active, set the first available session as active
      if (sessionId === activeSessionId) {
        const remainingSessions = sessions.filter(session => session.id !== sessionId);
        if (remainingSessions.length > 0) {
          setActiveSessionId(remainingSessions[0].id);
        }
      }
    }
  }

  // Add debug logs in the render function
  console.log('TherapistInterface patientid:', patientid);
  console.log('TherapistInterface patientData:', patientData);
  console.log('TherapistInterface notes:', notes);
  console.log('TherapistInterface isLoading:', isLoading);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D8B4F0]"></div>
      </div>
    );
  }

  if (!patientData) {
    return (
      <div className="flex h-screen items-center justify-center flex-col gap-4">
        <p className="text-[#555]">Failed to load patient data</p>
        <Button onClick={onBack}>Go Back</Button>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="flex h-screen">
        <div className="w-16 bg-white/20 backdrop-blur-sm flex flex-col items-center py-6">
          <button
            onClick={onBack}
            className="p-3 rounded-full bg-white/80 text-[#333] shadow-md hover:shadow-lg transition-shadow"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        </div>

        {/* Session Sidebar */}
        <div className="w-64 bg-white/20 backdrop-blur-sm border-r border-white/30 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium">Sessions</h2>
            <motion.button
              className="p-1.5 rounded-full bg-[#D8B4F0] text-white shadow-sm"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsCreateSessionModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
            </motion.button>
          </div>

          <div className="space-y-2">
            {sessions.map((session) => (
              <motion.div
                key={session.id}
                className={`p-3 rounded-xl cursor-pointer transition-colors ${
                  activeSessionId === session.id
                    ? "bg-[#D8B4F0]/30 border-l-4 border-[#D8B4F0]"
                    : "bg-white/50 hover:bg-white/70"
                }`}
                whileHover={{ x: 5 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1" onClick={() => setActiveSessionId(session.id)}>
                    <p className="text-sm font-medium">{session.title}</p>
                    <p className="text-xs text-[#555]">{session.date}</p>
                    {session.notes && session.notes.length > 0 && (
                      <div className="mt-1">
                        <span className="text-xs text-[#D8B4F0]">
                          {session.notes.length} note{session.notes.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <motion.button
                      className="p-1 rounded-full hover:bg-white/50"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setSessionToRename(session);
                        setSessionTitle(session.title);
                        setIsRenameSessionModalOpen(true);
                      }}
                    >
                      <Pencil className="h-3.5 w-3.5 text-[#555]" />
                    </motion.button>
                    <motion.button
                      className="p-1 rounded-full hover:bg-white/50"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteSession(session.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-[#555]" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div
          className="flex-1 flex flex-col transition-colors duration-500"
          style={{ backgroundColor: getBackgroundColor() }}
        >
          {/* Patient Info */}
          <div className="flex justify-between items-center p-4 bg-white/20 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-[#D8B4F0] flex items-center justify-center">
                <span className="text-white font-medium">
                  {`${patientData.firstname[0]}${patientData.lastname[0]}`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {`${patientData.firstname} ${patientData.lastname}`}
                </span>
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="p-1 rounded-full hover:bg-[#D8B4F0]/80 hover:text-white transition-colors"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="p-1 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex bg-white/50 rounded-full p-1">
                <button
                  className={`px-3 py-1.5 rounded-full flex items-center gap-1 text-sm transition-colors ${
                    noteType === "private" ? "bg-[#FFB5D0] text-[#333]" : "text-[#555]"
                  }`}
                  onClick={() => handleNoteTypeChange("private")}
                >
                  <Lock className="h-3.5 w-3.5" />
                  <span>Private</span>
                </button>
                <button
                  className={`px-3 py-1.5 rounded-full flex items-center gap-1 text-sm transition-colors ${
                    noteType === "shared" ? "bg-[#B4F0E0] text-[#333]" : "text-[#555]"
                  }`}
                  onClick={() => handleNoteTypeChange("shared")}
                >
                  <Share2 className="h-3.5 w-3.5" />
                  <span>Shared</span>
                </button>
              </div>
            </div>
          </div>

          {/* Notes Editor and Display */}
          <div className="flex-1 flex flex-col p-4">
            {/* Note Editor */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className={`p-2 rounded-full transition-colors ${
                        isRecording ? "bg-red-500 text-white" : "hover:bg-white/50"
                      }`}
                      onClick={handleRecording}
                    >
                      {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isRecording ? "Stop Recording" : "Start Recording"}
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="p-2 rounded-full hover:bg-white/50">
                      <Bold className="h-5 w-5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Bold</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="p-2 rounded-full hover:bg-white/50">
                      <Italic className="h-5 w-5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Italic</TooltipContent>
                </Tooltip>

                <button
                  onClick={saveNote}
                  disabled={!note.trim()}
                  className="ml-auto px-4 py-2 bg-[#D8B4F0] text-white rounded-lg flex items-center gap-2 disabled:opacity-50 hover:bg-[#D8B4F0]/90 transition-colors"
                >
                  <Save className="h-4 w-4" />
                  Save Note
                </button>
              </div>

              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full h-[200px] p-4 rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-[#D8B4F0]"
                placeholder="Enter your session notes here..."
              />
            </div>

            {/* Saved Notes */}
            <div className="flex-1 overflow-y-auto">
              <div className="space-y-3">
                {activeNotes.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    No notes for this session yet
                  </div>
                ) : (
                  activeNotes.map((savedNote) => (
                    <div
                      key={savedNote.id}
                      className={`p-4 rounded-lg ${
                        savedNote.noteType === "private" 
                          ? "bg-[#FFB5D0]/10 border-l-4 border-[#FFB5D0]" 
                          : "bg-[#B4F0E0]/10 border-l-4 border-[#B4F0E0]"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            {new Date(savedNote.createdat).toLocaleString()}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            savedNote.noteType === "private" 
                              ? "bg-[#FFB5D0]/20 text-[#FFB5D0]" 
                              : "bg-[#B4F0E0]/20 text-[#B4F0E0]"
                          }`}>
                            {savedNote.noteType === "private" ? "Private" : "Shared"}
                          </span>
                        </div>
                        <motion.button
                          className="p-1.5 rounded-full hover:bg-red-100 group"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this note?')) {
                              deleteNote(savedNote.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-gray-400 group-hover:text-red-500 transition-colors" />
                        </motion.button>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{savedNote.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {showConfirmation && (
            <ConfirmationModal
              isOpen={showConfirmation}
              title="Change Note Type"
              message={`Are you sure you want to change this note to ${pendingNoteType === "private" ? "private" : "shared with patient"}?`}
              confirmText={`Yes, make it ${pendingNoteType}`}
              onConfirm={confirmNoteTypeChange}
              onCancel={() => setShowConfirmation(false)}
            />
          )}
        </AnimatePresence>
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          title="Delete Patient"
          message={`Are you sure you want to delete ${patientData.firstname} ${patientData.lastname}? This action cannot be undone.`}
          confirmText="Delete"
          onConfirm={handleDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
        />

        {/* Create Session Modal */}
        <Dialog open={isCreateSessionModalOpen} onOpenChange={setIsCreateSessionModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Session</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Input
                placeholder="Enter session title"
                value={sessionTitle}
                onChange={(e) => setSessionTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateSession();
                  }
                }}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setSessionTitle("");
                setIsCreateSessionModalOpen(false);
              }}>
                Cancel
              </Button>
              <Button onClick={handleCreateSession} disabled={!sessionTitle.trim()}>
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Rename Session Modal */}
        <Dialog open={isRenameSessionModalOpen} onOpenChange={setIsRenameSessionModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rename Session</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Input
                placeholder="Enter new session title"
                value={sessionTitle}
                onChange={(e) => setSessionTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleRenameSession();
                  }
                }}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setSessionTitle("");
                setSessionToRename(null);
                setIsRenameSessionModalOpen(false);
              }}>
                Cancel
              </Button>
              <Button onClick={handleRenameSession} disabled={!sessionTitle.trim()}>
                Rename
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}