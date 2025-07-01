import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

export default function HomePage() {
  const [hoverTherapist, setHoverTherapist] = useState(false)
  const [hoverPatient, setHoverPatient] = useState(false)

  // Ensure CSS animations are loaded
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .floating {
        animation: floating 6s ease-in-out infinite !important;
      }
      .floating-slow {
        animation: floating 8s ease-in-out infinite !important;
      }
      .floating-fast {
        animation: floating 4s ease-in-out infinite !important;
      }
      @keyframes floating {
        0% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-15px) rotate(5deg); }
        100% { transform: translateY(0px) rotate(0deg); }
      }
    `;
    document.head.appendChild(style);
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return (    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">      {/* Original floating background shapes - Fixed visibility */}
      <div className="absolute inset-0 overflow-hidden" style={{zIndex: 1}}>
        {/* Large Pink bubble - Top Left */}
        <div 
          className="absolute top-[10%] left-[15%] w-[40vw] h-[40vw] organic-shape-2 floating-slow opacity-70"
          style={{
            backgroundColor: '#FFB5D0',
            borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%'
          }}
        ></div>
        
        {/* Large Teal bubble - Bottom Right */}
        <div 
          className="absolute bottom-[20%] right-[10%] w-[35vw] h-[35vw] organic-shape floating opacity-70"
          style={{
            backgroundColor: '#B4F0E0',
            borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%'
          }}
        ></div>
        
        {/* Medium Purple bubble - Top Right */}
        <div 
          className="absolute top-[40%] right-[20%] w-[25vw] h-[25vw] organic-shape-3 floating-fast opacity-70"
          style={{
            backgroundColor: '#D8B4F0',
            borderRadius: '40% 60% 70% 30% / 40% 40% 60% 50%'
          }}
        ></div>
        
        {/* Medium Light Pink bubble - Bottom Left */}
        <div 
          className="absolute bottom-[10%] left-[25%] w-[30vw] h-[30vw] organic-shape floating opacity-70"
          style={{
            backgroundColor: '#F0B4D8',
            borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%'
          }}
        ></div>
      </div>

      <div className="w-full max-w-md relative" style={{zIndex: 10}}>        <div className="mb-12 text-center relative">
          {/* Title background shape */}
          <div className="absolute top-[-30px] left-[50%] transform -translate-x-1/2 w-[200px] h-[80px] bg-[#B4F0E0] organic-shape-2 -z-10"></div>
          <h1 className="text-5xl font-handwritten text-[#333] relative z-10">Sanare</h1>
          <p className="mt-2 text-[#555]">Simple. Supportive. Secure.</p>
        </div>        <div className="flex flex-col gap-6 items-center">
          <Link
            to="/therapist/login"
            className="block w-full p-6 rounded-2xl bg-[#D8B4F0] text-center font-medium text-lg shadow-md hover:shadow-lg transition-shadow"
            onMouseEnter={() => setHoverTherapist(true)}
            onMouseLeave={() => setHoverTherapist(false)}
          >
            <span className="text-white">I'm a Provider</span>
            {hoverTherapist && <p className="mt-2 text-sm text-white/80">Access notes and sessions</p>}
          </Link>

          <Link
            to="/patient/login"
            className="block w-full p-6 rounded-2xl bg-[#B4F0E0] text-center font-medium text-lg shadow-md hover:shadow-lg transition-shadow"
            onMouseEnter={() => setHoverPatient(true)}
            onMouseLeave={() => setHoverPatient(false)}
          >
            <span className="text-[#333]">I'm a Patient</span>
            {hoverPatient && <p className="mt-2 text-sm text-[#333]/80">Track progress and feelings</p>}
          </Link>
        </div>
      </div>
      {/* Removed demo mode indicator if present */}
      <div className="absolute bottom-4 text-center text-sm text-[#555]">
        <p>A safe space for your mental health journey</p>
      </div>
    </main>
  )
}

