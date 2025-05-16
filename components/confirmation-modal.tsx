"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

interface ConfirmationModalProps {
  isOpen: boolean
  title: string
  message: string
  confirmText: string
  cancelText: string
  onConfirm: () => void
  onCancel: () => void
  isDanger?: boolean
}

export function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  isDanger = false,
}: ConfirmationModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <Card className="bg-background-800 border-gray-700 w-full max-w-sm mx-4 p-4">
        <div className="flex flex-col items-center text-center">
          <div className={`p-3 rounded-full ${isDanger ? "bg-red-500/20" : "bg-amber-500/20"} mb-3`}>
            <AlertTriangle className={`h-6 w-6 ${isDanger ? "text-red-500" : "text-amber-500"}`} />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
          <p className="text-sm text-gray-300 mb-4">{message}</p>

          <div className="flex gap-3 w-full">
            <Button
              variant="outline"
              className="flex-1 border-gray-700 hover:bg-background-700 hover:text-white"
              onClick={onCancel}
            >
              {cancelText}
            </Button>
            <Button
              className={`flex-1 ${
                isDanger
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-everchess-cyan/20 hover:bg-everchess-cyan/30 text-everchess-cyan"
              }`}
              onClick={onConfirm}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
