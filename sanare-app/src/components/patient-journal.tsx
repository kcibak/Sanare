"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Save, Trash2 } from "lucide-react"
import { getPatientJournalEntries, createJournalEntry, deleteJournalEntry } from "@/lib/api"

interface JournalEntry {
  entryid: string;
  date: string;
  title: string;
  content: string;
}

export function PatientJournal() {
  const [journalEntry, setJournalEntry] = useState("")
  const [entryTitle, setEntryTitle] = useState("")
  const [savedEntries, setSavedEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null)

  // Get patientid from localStorage or context
  const patientid = localStorage.getItem("currentPatientId") || ""

  useEffect(() => {
    if (!patientid) return
    setLoading(true)
    getPatientJournalEntries(patientid)
      .then((entries) => setSavedEntries(entries))
      .finally(() => setLoading(false))
  }, [patientid])

  const handleDeleteEntry = async (entryid: string) => {
    setLoading(true)
    try {
      await deleteJournalEntry(entryid)
      setSavedEntries((prev) => prev.filter((e) => e.entryid !== entryid))
    } catch (e) {
      // handle error
    } finally {
      setLoading(false)
    }
  }

  const saveEntry = async () => {
    if (journalEntry.trim() && entryTitle.trim() && patientid) {
      setLoading(true)
      try {
        const entry = await createJournalEntry({ patientid, title: entryTitle, content: journalEntry })
        setSavedEntries([{ ...entry, date: new Date(entry.createdat).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) }, ...savedEntries])
        setJournalEntry("")
        setEntryTitle("")
      } catch (e) {
        // handle error
      } finally {
        setLoading(false)
      }
    }
  }

  // Helper to format dates
  const formatDate = (date: string | Date) => {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium">My Journal</h2>
      </div>

      <div className="bg-white rounded-2xl shadow-md overflow-hidden flex-1 flex flex-col mb-4">
        <div className="flex flex-col gap-2 p-4 border-b">
          <input
            type="text"
            placeholder="Entry title..."
            value={entryTitle}
            onChange={(e) => setEntryTitle(e.target.value)}
            className="w-full p-4 text-base rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2196F3] font-medium"
            style={{ minHeight: 48 }}
          />
        </div>
        <textarea
          value={journalEntry}
          onChange={(e) => setJournalEntry(e.target.value)}
          placeholder="Write your thoughts here..."
          className="w-full flex-1 p-4 outline-none resize-none text-base rounded-xl border-none"
          style={{ minHeight: 120 }}
        ></textarea>
        <div className="p-2 border-t flex justify-end">
          <motion.button
            className="px-4 py-2 rounded-xl bg-[#2196F3] text-white text-sm font-medium flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={saveEntry}
            disabled={!journalEntry.trim() || !entryTitle.trim() || loading}
          >
            <Save className="h-4 w-4" />
            <span>Save Entry</span>
          </motion.button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <h3 className="text-lg font-medium mb-3">Recent Entries</h3>
        {loading ? (
          <div className="text-center text-gray-400 mt-8">Loading...</div>
        ) : savedEntries.length === 0 ? (
          <div className="text-center text-gray-400 mt-8">
            <p>No journal entries yet.</p>
            <p>Start your first entry above!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {savedEntries.map((entry) => (
              <div
                key={entry.entryid}
                className="bg-white rounded-xl shadow-sm p-4 cursor-pointer hover:bg-[#E3F2FD]/60 transition"
                onClick={() => setSelectedEntry(entry)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-2xl mb-2">{entry.title}</h4>
                  <span className="text-xs text-[#777]">{formatDate(entry.date)}</span>
                  <button
                    className="ml-2 p-1 rounded-full hover:bg-[#FFEBEE]"
                    onClick={e => { e.stopPropagation(); handleDeleteEntry(entry.entryid); }}
                    disabled={loading}
                    aria-label="Delete entry"
                  >
                    <Trash2 className="h-4 w-4 text-[#F44336]" />
                  </button>
                </div>
                <p className="text-sm text-[#555] line-clamp-2">{entry.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Entry Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full relative">
            <button
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100"
              onClick={() => setSelectedEntry(null)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h3 className="font-bold text-2xl mb-2">{selectedEntry.title}</h3>
            <div className="text-xs text-[#2196F3] mb-2">{formatDate(selectedEntry.date)}</div>
            <div className="text-gray-700 whitespace-pre-line mb-2">{selectedEntry.content}</div>
          </div>
        </div>
      )}
    </div>
  )
}
