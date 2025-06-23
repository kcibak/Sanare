"use client"

import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle, X } from "lucide-react"

interface ConfirmationModalProps {
  isOpen: boolean
  title: string
  message: string
  confirmText: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmationModal({ isOpen, title, message, confirmText, onConfirm, onCancel }: ConfirmationModalProps) {
  if (!isOpen) return null

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onCancel}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-lg max-w-md w-full overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-[#D8B4F0]" />
            <h3 className="font-medium">{title}</h3>
          </div>
          <button onClick={onCancel} className="p-1 rounded-full hover:bg-[#f0f0f0]">
            <X className="h-5 w-5 text-[#555]" />
          </button>
        </div>

        <div className="p-4">
          <p className="text-[#555]">{message}</p>
        </div>

        <div className="flex justify-end gap-2 p-4 border-t">
          <motion.button
            className="px-4 py-2 rounded-xl bg-[#f0f0f0] text-[#555]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCancel}
          >
            Cancel
          </motion.button>

          <motion.button
            className="px-4 py-2 rounded-xl bg-[#D8B4F0] text-white"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onConfirm}
          >
            {confirmText}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

