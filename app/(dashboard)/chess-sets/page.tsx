"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { CastleIcon } from "lucide-react"

// Chess set types and data
type Rarity = "Common" | "Rare" | "Epic" | "Legendary"

interface ChessSet {
  id: string
  name: string
  description: string
  rarity: Rarity
  owned: boolean
  selected: boolean
  image: string
  previewImage?: string
  color: string
  bgColor: string
  borderColor: string
}

const chessSets: ChessSet[] = [
  {
    id: "classic-wood",
    name: "Classic Wood",
    description: "A traditional wooden chess set with classic design and craftsmanship.",
    rarity: "Common",
    owned: true,
    selected: true,
    image: "/chess-pawn-blue.png", // Using blue pawn as base and applying filter
    previewImage: "/chess-sets/classic-wood-preview.png",
    color: "amber",
    bgColor: "bg-amber-950",
    borderColor: "border-amber-900",
  },
  {
    id: "crystal-set",
    name: "Crystal Set",
    description: "Elegant crystal chess pieces that shimmer with a magical blue glow.",
    rarity: "Rare",
    owned: true,
    selected: false,
    image: "/chess-pawn-blue.png",
    previewImage: "/chess-sets/crystal-set-preview.png",
    color: "everchess-cyan",
    bgColor: "bg-[#071a2c]",
    borderColor: "border-[#0a2d4a]",
  },
  {
    id: "dragon-kingdom",
    name: "Dragon Kingdom",
    description: "Fantasy-themed chess set featuring dragons, knights, and magical creatures.",
    rarity: "Epic",
    owned: true,
    selected: false,
    image: "/chess-pawn-purple.png",
    previewImage: "/chess-sets/dragon-kingdom-preview.png",
    color: "purple",
    bgColor: "bg-purple-950",
    borderColor: "border-purple-900",
  },
  {
    id: "inferno-set",
    name: "Inferno Set",
    description: "Fiery chess pieces that burn with the intensity of molten lava.",
    rarity: "Epic",
    owned: false,
    selected: false,
    image: "/chess-pawn-red.png",
    previewImage: "/chess-sets/inferno-set-preview.png",
    color: "red",
    bgColor: "bg-red-950",
    borderColor: "border-red-900",
  },
  {
    id: "golden-dynasty",
    name: "Golden Dynasty",
    description: "Luxurious gold-plated chess pieces fit for royalty.",
    rarity: "Legendary",
    owned: false,
    selected: false,
    image: "/chess-pawn-yellow.png",
    previewImage: "/chess-sets/golden-dynasty-preview.png",
    color: "yellow",
    bgColor: "bg-yellow-600/30",
    borderColor: "border-yellow-600/50",
  },
]

// Rarity badge colors
const rarityColors: Record<Rarity, string> = {
  Common: "bg-amber-800 text-amber-100",
  Rare: "bg-everchess-cyan text-cyan-100",
  Epic: "bg-purple-900 text-purple-100",
  Legendary: "bg-yellow-600 text-yellow-100",
}

// Chess set card component
const ChessSetCard = ({
  chessSet,
  onSelect,
  onPreview,
  onPurchase,
}: {
  chessSet: ChessSet
  onSelect: (id: string) => void
  onPreview: (id: string) => void
  onPurchase: (id: string) => void
}) => {
  const isComingSoon = chessSet.id === "coming-soon"

  // Determine button colors based on chess set color
  const getButtonColors = () => {
    // Preview buttons always have white outline and text
    const previewStyle = "border-white text-white hover:bg-gray-800 hover:text-white"

    switch (chessSet.color) {
      case "gray":
        return {
          preview: previewStyle,
          select: "bg-gray-700 hover:bg-gray-600",
        }
      case "everchess-cyan":
        return {
          preview: previewStyle,
          select: "bg-everchess-cyan hover:bg-everchess-cyan/80",
        }
      case "purple":
        return {
          preview: previewStyle,
          select: "bg-purple-700 hover:bg-purple-600",
        }
      case "red":
        return {
          preview: previewStyle,
          select: "bg-red-700 hover:bg-red-600",
        }
      case "amber":
        return {
          preview: previewStyle,
          select: "bg-amber-700 hover:bg-amber-600",
        }
      case "yellow":
        return {
          preview: previewStyle,
          select: "bg-yellow-600 hover:bg-yellow-500",
        }
      default:
        return {
          preview: previewStyle,
          select: "bg-gray-700 hover:bg-gray-600",
        }
    }
  }

  const buttonColors = getButtonColors()

  // Custom styling for the Classic Wood pawn to make it brown
  const getImageStyle = () => {
    if (chessSet.id === "classic-wood") {
      return {
        filter: "sepia(100%) brightness(60%) saturate(400%) hue-rotate(320deg)",
      }
    }
    return {}
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-lg border p-6 transition-all",
        isComingSoon ? "bg-background-700 border-gray-700" : `${chessSet.bgColor} ${chessSet.borderColor}`,
      )}
    >
      <div className="mb-4 h-24 w-24 flex items-center justify-center">
        {isComingSoon ? (
          <div className="text-gray-500">
            <CastleIcon size={64} />
          </div>
        ) : (
          <Image
            src={chessSet.image || "/placeholder.svg"}
            alt={chessSet.name}
            width={80}
            height={80}
            className="object-contain drop-shadow-lg"
            style={getImageStyle()}
          />
        )}
      </div>

      <h3 className="text-2xl font-bold text-white mb-2">{chessSet.name}</h3>

      {!isComingSoon && <Badge className={cn("mb-3", rarityColors[chessSet.rarity])}>{chessSet.rarity}</Badge>}

      <p className="text-gray-400 text-center mb-6">{chessSet.description}</p>

      {isComingSoon ? (
        <div className="flex gap-3 w-full">
          <Link href="/battlepass" className="flex-1">
            <Button variant="outline" className="w-full hover:bg-gray-800 hover:text-white">
              View Battlepass
            </Button>
          </Link>
          <Link href="/market" className="flex-1">
            <Button className="w-full bg-everchess-cyan hover:bg-everchess-cyan/80 text-white">View Market</Button>
          </Link>
        </div>
      ) : (
        <div className="flex gap-3 w-full">
          <Button
            variant="outline"
            className={cn("flex-1 rounded-md", buttonColors.preview)}
            onClick={() => onPreview(chessSet.id)}
          >
            Preview
          </Button>

          {chessSet.owned ? (
            <Button
              variant="default"
              className={cn(
                "flex-1 rounded-md",
                chessSet.selected
                  ? "bg-black text-white border border-gray-600 hover:bg-gray-800"
                  : buttonColors.select,
              )}
              onClick={() => onSelect(chessSet.id)}
              disabled={chessSet.selected}
            >
              {chessSet.selected ? "Selected" : "Select"}
            </Button>
          ) : (
            <Link href="/market" className="flex-1">
              <Button
                variant="default"
                className="w-full bg-red-600 hover:bg-red-700 text-white shadow-md rounded-md"
                onClick={() => onPurchase(chessSet.id)}
              >
                Purchase
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

// Preview dialog component
const ChessSetPreview = ({
  chessSet,
  isOpen,
  onClose,
  onSelect,
  onPurchase,
}: {
  chessSet: ChessSet | null
  isOpen: boolean
  onClose: () => void
  onSelect: (id: string) => void
  onPurchase: (id: string) => void
}) => {
  if (!chessSet) return null

  // Determine button colors based on chess set color
  const getButtonColors = () => {
    if (!chessSet) return { select: "" }

    switch (chessSet.color) {
      case "gray":
        return { select: "bg-gray-700 hover:bg-gray-600" }
      case "everchess-cyan":
        return { select: "bg-everchess-cyan hover:bg-everchess-cyan/80" }
      case "purple":
        return { select: "bg-purple-700 hover:bg-purple-600" }
      case "red":
        return { select: "bg-red-700 hover:bg-red-600" }
      case "amber":
        return { select: "bg-amber-700 hover:bg-amber-600" }
      case "yellow":
        return { select: "bg-yellow-600 hover:bg-yellow-500" }
      default:
        return { select: "bg-gray-700 hover:bg-gray-600" }
    }
  }

  // Custom styling for the Classic Wood pawn to make it brown
  const getImageStyle = () => {
    if (chessSet.id === "classic-wood") {
      return {
        filter: "sepia(100%) brightness(60%) saturate(400%) hue-rotate(320deg)",
      }
    }
    return {}
  }

  const buttonColors = getButtonColors()

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">{chessSet.name}</DialogTitle>
          <DialogDescription>
            <Badge className={cn("mt-2", rarityColors[chessSet.rarity])}>{chessSet.rarity}</Badge>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center p-4">
          <div className="relative w-full h-[400px] bg-black rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src={chessSet.image || "/placeholder.svg"}
                alt={chessSet.name}
                width={180}
                height={180}
                className="object-contain drop-shadow-lg"
                style={getImageStyle()}
              />
            </div>
            <div className="absolute bottom-4 left-4 right-4 p-4 bg-black/70 rounded">
              <p className="text-white">{chessSet.description}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" className="hover:bg-gray-800 hover:text-white" onClick={onClose}>
            Close
          </Button>

          {chessSet.owned ? (
            <Button
              className={
                chessSet.selected ? "bg-black text-white border border-gray-600 hover:bg-gray-800" : buttonColors.select
              }
              onClick={() => {
                onSelect(chessSet.id)
                onClose()
              }}
              disabled={chessSet.selected}
            >
              {chessSet.selected ? "Selected" : "Select"}
            </Button>
          ) : (
            <Link href="/market">
              <Button
                variant="default"
                className="bg-red-600 hover:bg-red-700 text-white shadow-md"
                onClick={() => {
                  onPurchase(chessSet.id)
                  onClose()
                }}
              >
                Purchase
              </Button>
            </Link>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function ChessSetsPage() {
  const [selectedTab, setSelectedTab] = useState("all")
  const [chessSetsList, setChessSetsList] = useState(chessSets)
  const [previewSet, setPreviewSet] = useState<string | null>(null)

  // Filter chess sets based on selected tab
  const filteredSets = chessSetsList.filter((set) => {
    if (selectedTab === "all") return true
    if (selectedTab === "owned") return set.owned
    return !set.owned // market tab
  })

  // Handle selecting a chess set
  const handleSelect = (id: string) => {
    setChessSetsList((prev) =>
      prev.map((set) => ({
        ...set,
        selected: set.id === id,
      })),
    )
    // In a real app, you would save this selection to the user's profile
  }

  // Handle previewing a chess set
  const handlePreview = (id: string) => {
    setPreviewSet(id)
  }

  // Handle purchasing a chess set
  const handlePurchase = (id: string) => {
    // Switch to the market tab
    setSelectedTab("market")

    // In a real app, you would navigate to a purchase flow or show a purchase modal
    console.log(`Purchasing chess set: ${id}`)
  }

  // Get the chess set being previewed
  const previewChessSet = previewSet ? chessSetsList.find((set) => set.id === previewSet) || null : null

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold text-white mb-4">Chess Sets</h1>

      <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-3 bg-background-700">
          <TabsTrigger value="all" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            All Sets
          </TabsTrigger>
          <TabsTrigger value="owned" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            Owned
          </TabsTrigger>
          <TabsTrigger value="market" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            Market
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSets.map((chessSet) => (
          <ChessSetCard
            key={chessSet.id}
            chessSet={chessSet}
            onSelect={handleSelect}
            onPreview={handlePreview}
            onPurchase={handlePurchase}
          />
        ))}

        {/* Coming Soon Card */}
        <div className="flex flex-col items-center rounded-lg border border-gray-700 p-6 bg-background-700">
          <div className="mb-4 h-24 w-24 flex items-center justify-center text-gray-500">
            <CastleIcon size={64} />
          </div>

          <h3 className="text-2xl font-bold text-white mb-2">More Coming Soon</h3>

          <p className="text-gray-400 text-center mb-6">
            New chess sets are added regularly. Check back soon or unlock them through the battlepass.
          </p>

          <div className="flex gap-3 w-full">
            <Link href="/battlepass" className="flex-1">
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white">View Battlepass</Button>
            </Link>
            <Link href="/market" className="flex-1">
              <Button className="w-full bg-everchess-cyan hover:bg-everchess-cyan/80 text-white">View Market</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Chess Set Preview Dialog */}
      <ChessSetPreview
        chessSet={previewChessSet}
        isOpen={previewSet !== null}
        onClose={() => setPreviewSet(null)}
        onSelect={handleSelect}
        onPurchase={handlePurchase}
      />
    </div>
  )
}
