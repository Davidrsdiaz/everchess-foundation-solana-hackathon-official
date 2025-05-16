"use client"

import { useState, useEffect } from "react"
import { X, Moon, Sun, Bell, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { useStatus } from "@/contexts/status-context"

interface SettingsModalProps {
  onClose: () => void
}

export function SettingsModal({ onClose }: SettingsModalProps) {
  const [darkMode, setDarkMode] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [sound, setSound] = useState(true)
  const [volume, setVolume] = useState(80)
  const [musicVolume, setMusicVolume] = useState(60)
  const { status, setStatus } = useStatus()

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative w-full max-w-md rounded-lg bg-background-800 p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Settings</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        <div className="space-y-6">
          {/* Appearance Section */}
          <div>
            <h3 className="text-sm font-medium text-white mb-4">Appearance</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {darkMode ? <Moon className="h-5 w-5 text-blue-400" /> : <Sun className="h-5 w-5 text-yellow-400" />}
                  <span className="text-sm text-white">Dark Mode</span>
                </div>
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              </div>
            </div>
          </div>

          {/* Status Section */}
          <div>
            <h3 className="text-sm font-medium text-white mb-4">Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-white">Online</span>
                </div>
                <Switch
                  checked={status === "online"}
                  onCheckedChange={(checked) => {
                    if (checked) setStatus("online")
                    else setStatus("away")
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                  <span className="text-sm text-white">Away</span>
                </div>
                <Switch
                  checked={status === "away"}
                  onCheckedChange={(checked) => {
                    if (checked) setStatus("away")
                    else setStatus("online")
                  }}
                />
              </div>
            </div>
          </div>

          {/* Notifications Section */}
          <div>
            <h3 className="text-sm font-medium text-white mb-4">Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-blue-400" />
                  <span className="text-sm text-white">Enable Notifications</span>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>
            </div>
          </div>

          {/* Sound Section */}
          <div>
            <h3 className="text-sm font-medium text-white mb-4">Sound</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {sound ? (
                    <Volume2 className="h-5 w-5 text-blue-400" />
                  ) : (
                    <VolumeX className="h-5 w-5 text-gray-400" />
                  )}
                  <span className="text-sm text-white">Sound Effects</span>
                </div>
                <Switch checked={sound} onCheckedChange={setSound} />
              </div>

              {sound && (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Effects Volume</span>
                      <span className="text-xs text-gray-400">{volume}%</span>
                    </div>
                    <Slider
                      value={[volume]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(value) => setVolume(value[0])}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Music Volume</span>
                      <span className="text-xs text-gray-400">{musicVolume}%</span>
                    </div>
                    <Slider
                      value={[musicVolume]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(value) => setMusicVolume(value[0])}
                      className="w-full"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button
            onClick={onClose}
            className="bg-gradient-to-r from-red-600 to-red-700 text-white hover:shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:scale-105 active:scale-95 transition-all duration-300"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}
