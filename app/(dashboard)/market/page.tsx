"use client"

import { useState, useCallback } from "react"
import { Gift, Star, ShoppingCart, Smile, Frown, Meh } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { GoldCoinIcon } from "@/components/icons/gold-coin-icon"
import { ChessPawn3DIcon } from "@/components/icons/chess-pawn-3d-icon"
import { PurchaseAnimation, type PurchaseItem } from "@/components/purchase-animation"

// Mock data for marketplace items
const chessSetItems = [
  {
    id: 1,
    name: "Dragon Kingdom",
    description: "Fantasy-themed chess set featuring dragons, knights, and magical creatures.",
    price: 1500,
    currency: "gold",
    rarity: "Epic",
    rarityColor: "bg-purple-600",
    usePawnIcon: true,
    backgroundColor: "bg-purple-950",
  },
  {
    id: 2,
    name: "Inferno Set",
    description: "Fiery chess pieces that burn with the intensity of molten lava.",
    price: 1500,
    currency: "gold",
    rarity: "Epic",
    rarityColor: "bg-red-600",
    image: "/chess-sets/inferno-set-icon.png",
    backgroundColor: "bg-red-950",
  },
  {
    id: 3,
    name: "Golden Dynasty",
    description: "Luxurious gold-plated chess pieces fit for royalty.",
    price: 3000,
    currency: "gold",
    rarity: "Legendary",
    rarityColor: "bg-amber-600",
    image: "/chess-sets/golden-dynasty-icon.png",
    backgroundColor: "bg-amber-950",
  },
]

const emoteItems = [
  {
    id: 1,
    name: "Happy",
    icon: Smile,
    price: 200,
    currency: "gold",
    rarity: "Common",
    rarityColor: "bg-gray-600",
    backgroundColor: "bg-black",
    iconColor: "#FFD700", // Yellow
  },
  {
    id: 2,
    name: "Sad",
    icon: Frown,
    price: 200,
    currency: "gold",
    rarity: "Common",
    rarityColor: "bg-gray-600",
    backgroundColor: "bg-black",
    iconColor: "#FF4D4D", // Red
  },
  {
    id: 3,
    name: "Neutral",
    icon: Meh,
    price: 200,
    currency: "gold",
    rarity: "Common",
    rarityColor: "bg-gray-600",
    backgroundColor: "bg-black",
    iconColor: "#A855F7", // Purple
  },
  {
    id: 4,
    name: "Lion Emote",
    customIcon: true,
    price: 500,
    currency: "gold",
    rarity: "Epic",
    rarityColor: "bg-amber-600",
    backgroundColor: "bg-amber-950",
    iconColor: "#E8A317", // Amber
  },
]

const specialItems = [
  {
    id: 1,
    name: "Mystery Box",
    description: "Contains a random chess piece, emote, or gold coins. Chance for rare items!",
    price: 800,
    currency: "gold",
    rarity: "Special",
    rarityColor: "bg-amber-600",
    icon: Gift,
    iconColor: "#FFD700", // Yellow
    backgroundColor: "bg-amber-950",
  },
  {
    id: 2,
    name: "Premium Pass",
    description: "Upgrade to Premium Battlepass and unlock exclusive rewards.",
    price: 2000,
    currency: "gold",
    rarity: "Special",
    rarityColor: "bg-red-600",
    icon: Star,
    iconColor: "#FF4D4D", // Red
    backgroundColor: "bg-red-950",
  },
  {
    id: 3,
    name: "Gold Coins Bundle",
    description: "Get 1,000 gold coins at a discounted price. Limited time offer!",
    price: 9.99,
    currency: "usd",
    rarity: "Special",
    rarityColor: "bg-everchess-cyan",
    icon: ShoppingCart,
    iconColor: "#0FCBE9", // Bright everchess cyan
    backgroundColor: "bg-gradient-to-br from-cyan-900 to-cyan-800",
  },
]

const featuredItems = [
  {
    id: 1,
    name: "Weekend Special: 3 Mystery Boxes",
    description: "Get 3 mystery boxes for the price of 2!",
    originalPrice: 2400,
    price: 1600,
    currency: "gold",
    rarity: "Special",
    rarityColor: "bg-red-600",
    icon: Gift,
    iconColor: "#FF4D4D",
    backgroundColor: "bg-gradient-to-r from-red-900 to-purple-900",
  },
]

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [userGold, setUserGold] = useState(3500)
  const [showPurchaseAnimation, setShowPurchaseAnimation] = useState(false)
  const [purchasedItem, setPurchasedItem] = useState<PurchaseItem | null>(null)
  const [previousGold, setPreviousGold] = useState(userGold)

  const handlePurchase = useCallback(
    (item: PurchaseItem) => {
      if (item.currency === "gold" && userGold < item.price) return

      // Store previous gold amount for animation
      setPreviousGold(userGold)

      // Update gold balance
      if (item.currency === "gold") {
        setUserGold((prev) => prev - item.price)
      }

      // Set the purchased item and show animation
      setPurchasedItem(item)
      setShowPurchaseAnimation(true)

      // Play purchase sound (if we had audio capabilities)
      // playPurchaseSound()
    },
    [userGold],
  )

  const handleCloseAnimation = useCallback(() => {
    setShowPurchaseAnimation(false)
    setPurchasedItem(null)
  }, [])

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Marketplace</h1>
        <Button variant="outline" className="bg-background-800 border-amber-600/30 text-white h-10 gap-2">
          <GoldCoinIcon size={18} />
          <span className="text-everchess-yellow">{userGold.toLocaleString()}</span>
        </Button>
      </div>

      <Tabs defaultValue="chess-sets" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-background-700 rounded-lg h-12 border border-gray-700/50">
          <TabsTrigger
            value="chess-sets"
            className="text-base data-[state=active]:bg-red-600 data-[state=active]:text-white"
          >
            Chess Sets
          </TabsTrigger>
          <TabsTrigger
            value="emotes"
            className="text-base data-[state=active]:bg-red-600 data-[state=active]:text-white"
          >
            Emotes
          </TabsTrigger>
          <TabsTrigger
            value="special-items"
            className="text-base data-[state=active]:bg-red-600 data-[state=active]:text-white"
          >
            Special
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chess-sets" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chessSetItems.map((item) => (
              <div
                key={item.id}
                className={`rounded-lg p-6 ${item.backgroundColor} flex flex-col h-full border border-gray-700/50 hover:border-gray-600/70 transition-all`}
              >
                <div className="flex justify-center mb-6">
                  <div className="w-24 h-24 relative flex items-center justify-center">
                    {item.usePawnIcon ? (
                      <ChessPawn3DIcon size={96} color="#9333EA" />
                    ) : (
                      <Image
                        src={item.image || "/placeholder.svg?height=96&width=96&query=chess piece"}
                        alt={item.name}
                        width={96}
                        height={96}
                        className="object-contain"
                      />
                    )}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white text-center mb-2">{item.name}</h3>

                <div className="flex justify-center mb-4">
                  <Badge className={`${item.rarityColor} text-white`}>{item.rarity}</Badge>
                </div>

                <p className="text-muted-foreground text-center text-sm mb-6 flex-grow">{item.description}</p>

                <div className="flex items-center justify-center mb-4">
                  <div className="flex items-center gap-1 text-everchess-yellow font-bold">
                    <GoldCoinIcon size={20} />
                    <span>{item.price.toLocaleString()}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-auto">
                  <Button variant="outline" className="border-white text-white hover:bg-background-800/50">
                    Preview
                  </Button>
                  <Button
                    variant="default"
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold"
                    disabled={userGold < item.price}
                    onClick={() => handlePurchase(item)}
                  >
                    Purchase
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="emotes" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {emoteItems.map((item) => (
              <div
                key={item.id}
                className={`rounded-lg p-6 bg-background-700 flex flex-col h-full border border-gray-700/50 hover:border-gray-600/70 transition-all`}
              >
                <div className="flex justify-center mb-6">
                  <div className="w-24 h-24 relative flex items-center justify-center">
                    {item.customIcon ? (
                      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="9" fill="#E8A317" />
                        <path d="M7 9.5C7.5 8.5 9 8 10 8.5" stroke="#8B4513" strokeWidth="1.5" strokeLinecap="round" />
                        <path
                          d="M17 9.5C16.5 8.5 15 8 14 8.5"
                          stroke="#8B4513"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <circle cx="9" cy="10" r="1" fill="#000" />
                        <circle cx="15" cy="10" r="1" fill="#000" />
                        <path d="M8 14C9 15.5 15 15.5 16 14" stroke="#8B4513" strokeWidth="1.5" strokeLinecap="round" />
                        <path
                          d="M12 3C10 3 9 4 9 5C7 5 5 6 5 9"
                          stroke="#E8A317"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M12 3C14 3 15 4 15 5C17 5 19 6 19 9"
                          stroke="#E8A317"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <path d="M7.5 7C6.5 6 5.5 6.5 5 7.5" stroke="#E8A317" strokeWidth="1.5" strokeLinecap="round" />
                        <path
                          d="M16.5 7C17.5 6 18.5 6.5 19 7.5"
                          stroke="#E8A317"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    ) : (
                      <item.icon size={64} color={item.iconColor} />
                    )}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white text-center mb-2">{item.name}</h3>

                <div className="flex justify-center mb-4">
                  <Badge className={`${item.rarityColor} text-white`}>{item.rarity}</Badge>
                </div>

                <div className="flex items-center justify-center mb-6 mt-auto">
                  <div className="flex items-center gap-1 text-everchess-yellow font-bold">
                    <GoldCoinIcon size={20} />
                    <span>{item.price}</span>
                  </div>
                </div>

                <Button
                  variant="default"
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold"
                  disabled={userGold < item.price}
                  onClick={() => handlePurchase(item)}
                >
                  Purchase
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="special-items" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {specialItems.map((item) => (
              <div
                key={item.id}
                className={`rounded-lg p-6 ${item.backgroundColor} flex flex-col h-full border border-gray-700/50 hover:border-gray-600/70 transition-all`}
              >
                <div className="flex justify-center mb-6">
                  <div className="w-24 h-24 flex items-center justify-center">
                    {item.icon && <item.icon size={64} color={item.iconColor} className="opacity-90" />}
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white text-center mb-2">{item.name}</h3>

                <div className="flex justify-center mb-4">
                  <Badge className={`${item.rarityColor} text-white px-3 py-1 text-sm`}>{item.rarity}</Badge>
                </div>

                <p className="text-gray-300 text-center text-base mb-6 flex-grow">{item.description}</p>

                <div className="flex items-center justify-center mb-4">
                  {item.currency === "gold" ? (
                    <div className="flex items-center gap-2 text-everchess-yellow font-bold text-xl">
                      <GoldCoinIcon size={24} />
                      <span>{item.price.toLocaleString()}</span>
                    </div>
                  ) : (
                    <div className="text-white font-bold text-xl">${item.price}</div>
                  )}
                </div>

                <Button
                  variant="default"
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold"
                  disabled={item.currency === "gold" && userGold < item.price}
                  onClick={() => handlePurchase(item)}
                >
                  Purchase
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="bg-background-700 rounded-lg p-6 border border-gray-700/50">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">Featured Items</h2>
          <p className="text-muted-foreground">Special limited time offers</p>
        </div>

        {featuredItems.map((item) => (
          <div
            key={item.id}
            className={`rounded-lg p-6 bg-red-950 flex flex-col md:flex-row items-center justify-between gap-6 border border-gray-700/50`}
          >
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 flex items-center justify-center bg-black/20 rounded-full">
                {item.icon && <item.icon className="w-10 h-10 text-red-400" />}
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-1">{item.name}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-everchess-yellow font-bold">
                  <GoldCoinIcon size={20} />
                  <span>{item.price.toLocaleString()}</span>
                </div>
                {item.originalPrice && (
                  <div className="text-muted-foreground line-through text-sm">
                    {item.originalPrice.toLocaleString()}
                  </div>
                )}
              </div>

              <Button
                variant="default"
                className="bg-red-600 hover:bg-red-700 text-white font-semibold"
                disabled={userGold < item.price}
                onClick={() => handlePurchase(item)}
              >
                Purchase
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Purchase Animation */}
      <PurchaseAnimation
        isVisible={showPurchaseAnimation}
        item={purchasedItem}
        previousGold={previousGold}
        currentGold={userGold}
        onClose={handleCloseAnimation}
      />
    </div>
  )
}
