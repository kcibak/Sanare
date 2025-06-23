"use client"

import { motion } from "framer-motion"

export function CelebrationAnimation() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <motion.div
        className="absolute top-1/4 left-1/4 text-2xl"
        animate={{
          y: [0, -20, 0],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 2,
          times: [0, 0.5, 1],
          repeat: Number.POSITIVE_INFINITY,
          repeatDelay: 0.5,
        }}
      >
        🎉
      </motion.div>

      <motion.div
        className="absolute top-1/3 right-1/3 text-2xl"
        animate={{
          y: [0, -30, 0],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 2.5,
          times: [0, 0.5, 1],
          repeat: Number.POSITIVE_INFINITY,
          repeatDelay: 0.3,
          delay: 0.2,
        }}
      >
        ✨
      </motion.div>

      <motion.div
        className="absolute bottom-1/3 left-1/3 text-2xl"
        animate={{
          y: [0, -25, 0],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 1.8,
          times: [0, 0.5, 1],
          repeat: Number.POSITIVE_INFINITY,
          repeatDelay: 0.7,
          delay: 0.5,
        }}
      >
        🎊
      </motion.div>

      <motion.div
        className="absolute bottom-1/4 right-1/4 text-2xl"
        animate={{
          y: [0, -15, 0],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 2.2,
          times: [0, 0.5, 1],
          repeat: Number.POSITIVE_INFINITY,
          repeatDelay: 0.4,
          delay: 0.7,
        }}
      >
        ⭐
      </motion.div>
    </div>
  )
}

