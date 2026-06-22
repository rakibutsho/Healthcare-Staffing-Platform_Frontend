"use client"

import { useEffect, useState } from "react"

export default function LoadingPage() {
  const [progress, setProgress] = useState(0)
  const [loadingText, setLoadingText] = useState("Loading...")

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadingMessages = [
    "Loading...",
    "Connecting Healthcare Professionals...",
    "Preparing Your Dashboard...",
    "Setting Up Your Profile...",
    "Almost Ready...",
    "Welcome to AnestheLink!",
  ]

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 2
      })
    }, 100)

    const textInterval = setInterval(() => {
      setLoadingText((prev) => {
        const currentIndex = loadingMessages.indexOf(prev)
        const nextIndex = (currentIndex + 1) % loadingMessages.length
        return loadingMessages[nextIndex]
      })
    }, 1500)

    return () => {
      clearInterval(progressInterval)
      clearInterval(textInterval)
    }
  }, [loadingMessages])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white relative overflow-hidden flex items-center justify-center">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%2300BCD4' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Loading Content */}
      <div className="relative z-10 text-center max-w-md mx-auto px-6">
        {/* Logo and Brand */}
        <div className="mb-8">
          {/* Logo with heartbeat animation */}
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              {/* Heartbeat line animation */}
              <svg width="120" height="40" viewBox="0 0 120 40" className="text-teal-500 mb-2">
                <path
                  d="M0,20 L20,20 L25,10 L30,30 L35,5 L40,35 L45,20 L120,20"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  className="animate-pulse"
                />
                <circle cx="60" cy="20" r="3" fill="currentColor" className="animate-ping" />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-2">AnestheLink</h1>
          <p className="text-gray-600 text-sm">Healthcare Professional Platform</p>
        </div>

        {/* Loading Spinner */}
        <div className="mb-8">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-teal-500 rounded-full animate-spin"></div>
            <div
              className="absolute inset-2 border-2 border-transparent border-t-teal-300 rounded-full animate-spin"
              style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
            ></div>

            {/* Medical cross in center */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 relative">
                <div className="absolute inset-x-0 top-1/2 h-1 bg-teal-500 transform -translate-y-1/2"></div>
                <div className="absolute inset-y-0 left-1/2 w-1 bg-teal-500 transform -translate-x-1/2"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="mb-8">
          <p className="text-gray-700 text-lg font-medium animate-pulse">{loadingText}</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-sm mx-auto mb-8">
          <div className="bg-gray-200 rounded-full p-1">
            <div className="flex items-center justify-between text-gray-600 text-sm mb-2 px-2">
              <span className="font-medium">Loading Progress</span>
              <span className="font-semibold">{progress}%</span>
            </div>
            <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-teal-400 to-teal-600 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Loading Dots */}
        <div className="flex justify-center space-x-2 mb-8">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: "1s",
              }}
            />
          ))}
        </div>

        {/* Healthcare Stats Preview */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-center mb-4">
            <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">
            <strong className="text-teal-600">Connecting 10,000+</strong> Healthcare Professionals with{" "}
            <strong className="text-teal-600">2,000+</strong> Medical Facilities
          </p>
        </div>
      </div>
    </div>
  )
}
