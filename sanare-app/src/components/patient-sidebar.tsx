"use client"
import { Book, FileText, Target } from "lucide-react"

interface PatientSidebarProps {
  activeSection: "journal" | "notes" | "goals"
  onChangeSection: (section: "journal" | "notes" | "goals") => void
}

export function PatientSidebar({ activeSection, onChangeSection }: PatientSidebarProps) {
  // Get sidebar background color based on active section
  const getSidebarColor = () => {
    switch (activeSection) {
      case "journal":
        return "#2196F3" // Blue
      case "notes":
        return "#FFC107" // Yellow/Amber
      case "goals":
        return "#9C27B0" // Purple
      default:
        return "#2196F3" // Default blue
    }
  }

  // Get text color for active section
  const getTextColor = (section: string) => {
    return section === activeSection ? "text-white" : "text-gray-800"
  }

  return (
    <div
      className="w-64 p-4 transition-colors duration-500"
      style={{ backgroundColor: `${getSidebarColor()}20` }} // 20% opacity of the theme color
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-medium text-gray-800">My Therapy</h2>
      </div>

      <div className="space-y-2">
        <div
          className={`p-3 rounded-xl cursor-pointer transition-colors flex items-center gap-3 ${
            activeSection === "journal" ? "bg-[#2196F3] text-white" : "bg-white/50 hover:bg-white/70"
          }`}
          onClick={() => onChangeSection("journal")}
        >
          <div
            className={`h-8 w-8 rounded-full flex items-center justify-center ${
              activeSection === "journal" ? "bg-white/20 text-white" : "bg-[#2196F3]/20 text-[#2196F3]"
            }`}
          >
            <Book className="h-4 w-4" />
          </div>
          <div>
            <p className={`text-sm font-medium ${getTextColor("journal")}`}>My Journal</p>
            <p className={`text-xs ${activeSection === "journal" ? "text-white/70" : "text-gray-600"}`}>
              Private thoughts & reflections
            </p>
          </div>
        </div>

        <div
          className={`p-3 rounded-xl cursor-pointer transition-colors flex items-center gap-3 ${
            activeSection === "notes" ? "bg-[#FFC107] text-white" : "bg-white/50 hover:bg-white/70"
          }`}
          onClick={() => onChangeSection("notes")}
        >
          <div
            className={`h-8 w-8 rounded-full flex items-center justify-center ${
              activeSection === "notes" ? "bg-white/20 text-white" : "bg-[#FFC107]/20 text-[#FFC107]"
            }`}
          >
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <p className={`text-sm font-medium ${getTextColor("notes")}`}>Session Notes</p>
            <p className={`text-xs ${activeSection === "notes" ? "text-white/70" : "text-gray-600"}`}>
              Notes shared by therapist
            </p>
          </div>
        </div>

        <div
          className={`p-3 rounded-xl cursor-pointer transition-colors flex items-center gap-3 ${
            activeSection === "goals" ? "bg-[#9C27B0] text-white" : "bg-white/50 hover:bg-white/70"
          }`}
          onClick={() => onChangeSection("goals")}
        >
          <div
            className={`h-8 w-8 rounded-full flex items-center justify-center ${
              activeSection === "goals" ? "bg-white/20 text-white" : "bg-[#9C27B0]/20 text-[#9C27B0]"
            }`}
          >
            <Target className="h-4 w-4" />
          </div>
          <div>
            <p className={`text-sm font-medium ${getTextColor("goals")}`}>My Goals</p>
            <p className={`text-xs ${activeSection === "goals" ? "text-white/70" : "text-gray-600"}`}>
              Track progress & achievements
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 p-3 bg-white/50 rounded-xl border border-white/20 shadow-sm">
        <p className="text-xs text-gray-600 mb-2">Next Session</p>
        <p className="text-sm font-medium text-gray-800">Thursday, May 9</p>
        <p className="text-xs text-gray-600">2:00 PM with Dr. Emily Chen</p>
      </div>
    </div>
  )
}
