"use client"

import React from "react"

import { useState, useEffect, useRef, Suspense, useCallback } from "react"
import { Canvas, useThree, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, Text } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Clock, Flag, MessageCircle, Smile, Settings, Home, Send, X, AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useQueue } from "@/contexts/queue-context"
import { useIsMobile } from "@/hooks/use-mobile"
import { ConfirmationModal } from "@/components/confirmation-modal"
import {
  getValidMoves,
  makeComputerMove,
  initializeChessBoard,
  isKingInCheck,
  isCheckmate,
  isStalemate,
  findPieceAtPosition,
  positionToNotation,
} from "@/utils/chess-utils"
import { Vector3 } from "three"
import { animated, useSpring } from "@react-spring/three"

// Animated chess piece component
const AnimatedMesh = animated.mesh

// Chess piece component with animations and improved drag-and-drop
function ChessPiece({
  piece,
  isSelected,
  onSelect,
  onMove,
  validMovePositions = [],
  isCheck = false,
  isAnimating = false,
  animateToPosition = null,
}) {
  const { type, color, position } = piece
  const [x, y, z] = position
  const [isDragging, setIsDragging] = useState(false)
  const [dragPosition, setDragPosition] = useState([x, y, z])
  const { camera, raycaster, gl, scene } = useThree()
  const meshRef = useRef()
  const planeRef = useRef()
  const startPositionRef = useRef([x, y, z])
  const [hovered, setHovered] = useState(false)

  // Determine piece color and visual states
  const pieceColor = color === "white" ? "#f0f0f0" : "#333333"
  const selectedColor = color === "white" ? "#90cdf4" : "#4299e1"
  const checkColor = "#ef4444"
  const hoveredColor = color === "white" ? "#e2e8f0" : "#4a5568"

  // Animation spring for piece movement
  const { position: animatedPosition, ...springProps } = useSpring({
    position: isAnimating && animateToPosition ? animateToPosition : [x, isDragging ? 0.5 : 0, z],
    scale: isDragging || isSelected ? 1.2 : hovered ? 1.1 : 1,
    rotation: [0, isDragging || hovered ? Math.PI * 0.1 : 0, 0],
    config: { mass: 1, tension: 170, friction: 26 },
  })

  // Reset position when piece changes
  useEffect(() => {
    if (!isDragging && !isAnimating) {
      setDragPosition([x, y, z])
    }
  }, [x, y, z, isDragging, isAnimating])

  // Handle pointer down (start dragging)
  const handlePointerDown = (e) => {
    e.stopPropagation()
    if (!onSelect || !onMove) return

    onSelect(piece)
    setIsDragging(true)
    startPositionRef.current = [x, y, z]

    // Capture pointer to track movement
    gl.domElement.setPointerCapture(e.pointerId)
  }

  // Handle pointer up (end dragging)
  const handlePointerUp = (e) => {
    if (!isDragging) return

    setIsDragging(false)
    gl.domElement.releasePointerCapture(e.pointerId)

    // Find the closest valid move position
    if (validMovePositions.length > 0) {
      const [dragX, dragY, dragZ] = dragPosition

      // Round to nearest grid position
      const roundedPosition = [Math.round(dragX), 0, Math.round(dragZ)]

      // Check if the position is a valid move
      const isValidMove = validMovePositions.some(
        (move) => Math.round(move[0]) === roundedPosition[0] && Math.round(move[2]) === roundedPosition[2],
      )

      if (isValidMove) {
        // Move the piece
        onMove(roundedPosition)
      } else {
        // Reset to original position
        setDragPosition(startPositionRef.current)
      }
    } else {
      // Reset to original position
      setDragPosition(startPositionRef.current)
    }
  }

  // Handle pointer move (update drag position)
  const handlePointerMove = (e) => {
    if (!isDragging) return

    // Update raycaster with current pointer position
    const rect = gl.domElement.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1

    raycaster.setFromCamera({ x, y }, camera)

    // Cast ray to invisible plane at y=0
    const intersects = raycaster.intersectObject(planeRef.current)

    if (intersects.length > 0) {
      const { point } = intersects[0]
      setDragPosition([point.x, 0.5, point.z])
    }
  }

  // Determine which 3D model to render based on piece type
  const renderPieceModel = () => {
    const currentColor =
      isCheck && type === "king"
        ? checkColor
        : isSelected || isDragging
          ? selectedColor
          : hovered
            ? hoveredColor
            : pieceColor

    switch (type) {
      case "pawn":
        return (
          <AnimatedMesh
            ref={meshRef}
            position={isDragging ? dragPosition : animatedPosition}
            {...springProps}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerMove={handlePointerMove}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
          >
            <cylinderGeometry args={[0.3, 0.3, 0.6, 16]} />
            <meshStandardMaterial color={currentColor} />
          </AnimatedMesh>
        )
      case "rook":
        return (
          <AnimatedMesh
            ref={meshRef}
            position={isDragging ? dragPosition : animatedPosition}
            {...springProps}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerMove={handlePointerMove}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
          >
            <boxGeometry args={[0.6, 0.8, 0.6]} />
            <meshStandardMaterial color={currentColor} />
          </AnimatedMesh>
        )
      case "knight":
        return (
          <AnimatedMesh
            ref={meshRef}
            position={isDragging ? dragPosition : animatedPosition}
            {...springProps}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerMove={handlePointerMove}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
          >
            <coneGeometry args={[0.3, 0.8, 16]} />
            <meshStandardMaterial color={currentColor} />
          </AnimatedMesh>
        )
      case "bishop":
        return (
          <AnimatedMesh
            ref={meshRef}
            position={isDragging ? dragPosition : animatedPosition}
            {...springProps}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerMove={handlePointerMove}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
          >
            <sphereGeometry args={[0.4, 16, 16]} />
            <meshStandardMaterial color={currentColor} />
          </AnimatedMesh>
        )
      case "queen":
        return (
          <AnimatedMesh
            ref={meshRef}
            position={isDragging ? dragPosition : animatedPosition}
            {...springProps}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerMove={handlePointerMove}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
          >
            <dodecahedronGeometry args={[0.4, 0]} />
            <meshStandardMaterial color={currentColor} />
          </AnimatedMesh>
        )
      case "king":
        return (
          <AnimatedMesh
            ref={meshRef}
            position={isDragging ? dragPosition : animatedPosition}
            {...springProps}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerMove={handlePointerMove}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
          >
            <cylinderGeometry args={[0.3, 0.3, 1, 16]} />
            <meshStandardMaterial color={currentColor} />
          </AnimatedMesh>
        )
      default:
        return null
    }
  }

  return (
    <group>
      {/* Invisible plane for raycasting during drag */}
      <mesh ref={planeRef} visible={false} position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* The actual chess piece */}
      {renderPieceModel()}
    </group>
  )
}

// Valid move indicator component with animation
function ValidMoveIndicator({ position, isCapture = false }) {
  const [hovered, setHovered] = useState(false)

  const { scale, opacity } = useSpring({
    scale: hovered ? 1.2 : 1,
    opacity: hovered ? 0.8 : 0.6,
    config: { tension: 300, friction: 10 },
  })

  return (
    <animated.mesh
      position={position}
      scale={scale}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {isCapture ? <ringGeometry args={[0.4, 0.5, 32]} /> : <cylinderGeometry args={[0.2, 0.2, 0.05, 16]} />}
      <animated.meshStandardMaterial color="#4ade80" opacity={opacity} transparent={true} />
    </animated.mesh>
  )
}

// Game status indicator
function GameStatusIndicator({ status, color }) {
  const { camera } = useThree()
  const position = new Vector3(0, 2, 0)

  // Position the text to face the camera
  useFrame(() => {
    position.copy(camera.position)
    position.y = 2
    position.normalize()
    position.multiplyScalar(5)
  })

  if (status === "playing") return null

  let message = ""
  let textColor = ""

  if (status === "checkmate") {
    message = `${color === "white" ? "Black" : "White"} wins by checkmate!`
    textColor = "#ef4444"
  } else if (status === "stalemate") {
    message = "Draw by stalemate!"
    textColor = "#f59e0b"
  }

  return (
    <Text
      position={[0, 2, 0]}
      fontSize={0.5}
      color={textColor}
      anchorX="center"
      anchorY="middle"
      outlineWidth={0.02}
      outlineColor="#000000"
    >
      {message}
    </Text>
  )
}

// Last move indicator with animation
function LastMoveIndicator({ from, to }) {
  const { opacity } = useSpring({
    from: { opacity: 0 },
    to: { opacity: 0.3 },
    config: { duration: 500 },
  })

  if (!from || !to) return null

  return (
    <>
      <animated.mesh position={[from[0], -0.05, from[2]]}>
        <boxGeometry args={[0.9, 0.05, 0.9]} />
        <animated.meshStandardMaterial color="#f59e0b" opacity={opacity} transparent={true} />
      </animated.mesh>
      <animated.mesh position={[to[0], -0.05, to[2]]}>
        <boxGeometry args={[0.9, 0.05, 0.9]} />
        <animated.meshStandardMaterial color="#f59e0b" opacity={opacity} transparent={true} />
      </animated.mesh>
    </>
  )
}

// Chessboard component
function Chessboard({ onGameEnd, onTurnChange, onCheckChange }) {
  const [boardState, setBoardState] = useState(initializeChessBoard())
  const [selectedPiece, setSelectedPiece] = useState(null)
  const [validMoves, setValidMoves] = useState([])
  const [playerColor] = useState("white")
  const [currentTurn, setCurrentTurn] = useState("white")
  const [gameStatus, setGameStatus] = useState("playing") // playing, checkmate, stalemate
  const [lastMove, setLastMove] = useState(null)
  const [isWhiteInCheck, setIsWhiteInCheck] = useState(false)
  const [isBlackInCheck, setIsBlackInCheck] = useState(false)
  const [moveHistory, setMoveHistory] = useState([])
  const [animatingPiece, setAnimatingPiece] = useState(null)
  const [animationTarget, setAnimationTarget] = useState(null)

  // Update check status
  useEffect(() => {
    setIsWhiteInCheck(isKingInCheck("white", boardState))
    setIsBlackInCheck(isKingInCheck("black", boardState))

    // Check for checkmate or stalemate
    if (currentTurn === "white" && (isCheckmate("white", boardState) || isStalemate("white", boardState))) {
      setGameStatus(isCheckmate("white", boardState) ? "checkmate" : "stalemate")
      onGameEnd && onGameEnd(isCheckmate("white", boardState) ? "black" : "draw")
    } else if (currentTurn === "black" && (isCheckmate("black", boardState) || isStalemate("black", boardState))) {
      setGameStatus(isCheckmate("black", boardState) ? "checkmate" : "stalemate")
      onGameEnd && onGameEnd(isCheckmate("black", boardState) ? "white" : "draw")
    }
  }, [boardState, currentTurn, onGameEnd])

  // Notify parent of turn changes
  useEffect(() => {
    onTurnChange && onTurnChange(currentTurn)
  }, [currentTurn, onTurnChange])

  // Handle piece selection
  const handlePieceSelect = useCallback(
    (piece) => {
      if (gameStatus !== "playing") return
      if (currentTurn !== playerColor) return
      if (piece.color !== playerColor) return

      // Play selection sound
      const selectionSound = new Audio("/sounds/select.mp3")
      selectionSound.volume = 0.3
      selectionSound.play().catch((e) => console.log("Audio play failed:", e))

      setSelectedPiece(piece)
      const moves = getValidMoves(piece, boardState)
      setValidMoves(moves)
    },
    [boardState, currentTurn, playerColor, gameStatus],
  )

  // Handle piece movement
  const handlePieceMove = useCallback(
    (targetPosition) => {
      if (!selectedPiece || currentTurn !== playerColor || gameStatus !== "playing") return

      // Check if the position is a valid move
      const isValidMove = validMoves.some(
        (move) =>
          Math.round(move[0]) === Math.round(targetPosition[0]) &&
          Math.round(move[2]) === Math.round(targetPosition[2]),
      )

      if (isValidMove) {
        // Play move sound
        const moveSound = new Audio("/sounds/move.mp3")
        moveSound.volume = 0.3
        moveSound.play().catch((e) => console.log("Audio play failed:", e))

        // Check if there's a piece to capture
        const capturedPiece = boardState.find(
          (p) =>
            p.id !== selectedPiece.id &&
            Math.round(p.position[0]) === Math.round(targetPosition[0]) &&
            Math.round(p.position[2]) === Math.round(targetPosition[2]),
        )

        if (capturedPiece) {
          // Play capture sound
          const captureSound = new Audio("/sounds/capture.mp3")
          captureSound.volume = 0.3
          captureSound.play().catch((e) => console.log("Audio play failed:", e))
        }

        // Create new board state
        let newBoardState = [...boardState]

        // Remove captured piece if any
        if (capturedPiece) {
          newBoardState = newBoardState.filter((p) => p.id !== capturedPiece.id)
        }

        // Check for castling
        let isCastling = false
        let rookToMove = null
        let rookTargetPosition = null

        if (selectedPiece.type === "king" && !selectedPiece.hasMoved) {
          const dx = Math.round(targetPosition[0]) - Math.round(selectedPiece.position[0])

          if (Math.abs(dx) === 2) {
            isCastling = true

            // Find the rook to move
            const rookX = dx > 0 ? 3.5 : -3.5
            const rookZ = selectedPiece.position[2]

            rookToMove = newBoardState.find(
              (p) =>
                p.type === "rook" &&
                p.color === selectedPiece.color &&
                Math.round(p.position[0]) === rookX &&
                Math.round(p.position[2]) === rookZ,
            )

            if (rookToMove) {
              // Calculate rook's new position
              rookTargetPosition = [Math.round(selectedPiece.position[0]) + (dx > 0 ? 1 : -1), 0, rookZ]
            }
          }
        }

        // Update the moved piece
        const pieceIndex = newBoardState.findIndex((p) => p.id === selectedPiece.id)
        if (pieceIndex !== -1) {
          // Start animation
          setAnimatingPiece(selectedPiece.id)
          setAnimationTarget(targetPosition)

          // Update the piece after a short delay to allow animation to play
          setTimeout(() => {
            setBoardState((prevState) => {
              const updatedState = [...prevState]
              const updatedPieceIndex = updatedState.findIndex((p) => p.id === selectedPiece.id)

              if (updatedPieceIndex !== -1) {
                updatedState[updatedPieceIndex] = {
                  ...updatedState[updatedPieceIndex],
                  position: targetPosition,
                  hasMoved: true,
                }
              }

              return updatedState
            })

            setAnimatingPiece(null)
            setAnimationTarget(null)
          }, 300)
        }

        // Move the rook if castling
        if (isCastling && rookToMove && rookTargetPosition) {
          const rookIndex = newBoardState.findIndex((p) => p.id === rookToMove.id)
          if (rookIndex !== -1) {
            newBoardState[rookIndex] = {
              ...newBoardState[rookIndex],
              position: rookTargetPosition,
              hasMoved: true,
            }
          }
        }

        // Check for pawn promotion
        if (selectedPiece.type === "pawn") {
          const promotionRank = selectedPiece.color === "white" ? -3.5 : 3.5

          if (Math.round(targetPosition[2]) === Math.round(promotionRank)) {
            // Promote to queen
            newBoardState[pieceIndex] = {
              ...newBoardState[pieceIndex],
              type: "queen",
              id: `queen-${selectedPiece.color}-${targetPosition[0]}-${targetPosition[2]}`,
            }

            // Play promotion sound
            const promotionSound = new Audio("/sounds/promotion.mp3")
            promotionSound.volume = 0.3
            promotionSound.play().catch((e) => console.log("Audio play failed:", e))
          }
        }

        // Record the move in algebraic notation
        const from = positionToNotation(selectedPiece.position)
        const to = positionToNotation(targetPosition)
        const pieceSymbol = getPieceSymbol(selectedPiece.type)
        const captureSymbol = capturedPiece ? "x" : ""
        const moveNotation = `${pieceSymbol}${from}${captureSymbol}${to}`

        setMoveHistory([...moveHistory, moveNotation])

        // Update board state (except for the animating piece which is updated after animation)
        setBoardState(newBoardState.map((p) => (p.id === selectedPiece.id ? { ...p } : p)))

        setSelectedPiece(null)
        setValidMoves([])
        setCurrentTurn(currentTurn === "white" ? "black" : "white")

        // Record the move
        setLastMove({
          piece: selectedPiece,
          from: selectedPiece.position,
          to: targetPosition,
          capturedPiece,
          isCastling,
        })
      }
    },
    [selectedPiece, validMoves, boardState, currentTurn, playerColor, gameStatus, moveHistory],
  )

  // Handle board click for selecting squares
  const handleBoardClick = useCallback(
    (e) => {
      if (gameStatus !== "playing") return
      if (currentTurn !== playerColor) return

      e.stopPropagation()

      // Convert click position to board position
      const point = e.point
      const clickPosition = [Math.round(point.x), 0, Math.round(point.z)]

      // Check if there's a piece at the clicked position
      const clickedPiece = findPieceAtPosition(clickPosition, boardState)

      if (clickedPiece && clickedPiece.color === playerColor) {
        // Select the piece
        handlePieceSelect(clickedPiece)
      } else if (selectedPiece) {
        // Try to move the selected piece
        handlePieceMove(clickPosition)
      }
    },
    [boardState, selectedPiece, handlePieceSelect, handlePieceMove, currentTurn, playerColor, gameStatus],
  )

  // Computer move
  useEffect(() => {
    if (currentTurn !== playerColor && gameStatus === "playing") {
      const timer = setTimeout(() => {
        const computerMove = makeComputerMove(boardState, currentTurn)

        if (computerMove) {
          // Play move sound
          const moveSound = new Audio("/sounds/move.mp3")
          moveSound.volume = 0.3
          moveSound.play().catch((e) => console.log("Audio play failed:", e))

          // Create new board state
          let newBoardState = [...boardState]

          // Remove captured piece if any
          if (computerMove.capturedPiece) {
            newBoardState = newBoardState.filter((p) => p.id !== computerMove.capturedPiece.id)

            // Play capture sound
            const captureSound = new Audio("/sounds/capture.mp3")
            captureSound.volume = 0.3
            captureSound.play().catch((e) => console.log("Audio play failed:", e))
          }

          // Update the moved piece
          const pieceIndex = newBoardState.findIndex((p) => p.id === computerMove.piece.id)
          if (pieceIndex !== -1) {
            const targetPosition = [computerMove.to[0], 0, computerMove.to[1]]

            // Start animation
            setAnimatingPiece(computerMove.piece.id)
            setAnimationTarget(targetPosition)

            // Update the piece after a short delay to allow animation to play
            setTimeout(() => {
              setBoardState((prevState) => {
                const updatedState = [...prevState]
                const updatedPieceIndex = updatedState.findIndex((p) => p.id === computerMove.piece.id)

                if (updatedPieceIndex !== -1) {
                  updatedState[updatedPieceIndex] = {
                    ...updatedState[updatedPieceIndex],
                    position: targetPosition,
                    hasMoved: true,
                  }
                }

                return updatedState
              })

              setAnimatingPiece(null)
              setAnimationTarget(null)
            }, 300)

            // Check for pawn promotion
            if (computerMove.piece.type === "pawn") {
              const promotionRank = computerMove.piece.color === "white" ? -3.5 : 3.5

              if (Math.round(targetPosition[2]) === Math.round(promotionRank)) {
                // Promote to queen
                newBoardState[pieceIndex] = {
                  ...newBoardState[pieceIndex],
                  type: "queen",
                  id: `queen-${computerMove.piece.color}-${targetPosition[0]}-${targetPosition[2]}`,
                }

                // Play promotion sound
                const promotionSound = new Audio("/sounds/promotion.mp3")
                promotionSound.volume = 0.3
                promotionSound.play().catch((e) => console.log("Audio play failed:", e))
              }
            }
          }

          // Record the move in algebraic notation
          const from = positionToNotation(computerMove.piece.position)
          const to = positionToNotation([computerMove.to[0], 0, computerMove.to[1]])
          const pieceSymbol = getPieceSymbol(computerMove.piece.type)
          const captureSymbol = computerMove.capturedPiece ? "x" : ""
          const moveNotation = `${pieceSymbol}${from}${captureSymbol}${to}`

          setMoveHistory([...moveHistory, moveNotation])

          // Update board state (except for the animating piece which is updated after animation)
          setBoardState(newBoardState.map((p) => (p.id === computerMove.piece.id ? { ...p } : p)))

          setCurrentTurn(currentTurn === "white" ? "black" : "white")

          // Record the move
          setLastMove({
            piece: computerMove.piece,
            from: computerMove.piece.position,
            to: [computerMove.to[0], 0, computerMove.to[1]],
            capturedPiece: computerMove.capturedPiece,
          })
        } else {
          // No valid moves - game over
          setGameStatus(isKingInCheck(currentTurn, boardState) ? "checkmate" : "stalemate")

          // Play appropriate sound
          if (isKingInCheck(currentTurn, boardState)) {
            const checkmateSound = new Audio("/sounds/checkmate.mp3")
            checkmateSound.volume = 0.3
            checkmateSound.play().catch((e) => console.log("Audio play failed:", e))
          } else {
            const stalemateSound = new Audio("/sounds/stalemate.mp3")
            stalemateSound.volume = 0.3
            stalemateSound.play().catch((e) => console.log("Audio play failed:", e))
          }

          onGameEnd &&
            onGameEnd(isKingInCheck(currentTurn, boardState) ? (currentTurn === "white" ? "black" : "white") : "draw")
        }
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [currentTurn, boardState, playerColor, gameStatus, onGameEnd, moveHistory])

  // Play check sound when a king is put in check
  useEffect(() => {
    if (isWhiteInCheck || isBlackInCheck) {
      const checkSound = new Audio("/sounds/check.mp3")
      checkSound.volume = 0.3
      checkSound.play().catch((e) => console.log("Audio play failed:", e))

      // Notify parent of check status
      if (isWhiteInCheck) {
        onCheckChange && onCheckChange("white", true)
      } else {
        onCheckChange && onCheckChange("black", true)
      }
    } else {
      // Notify parent of no check status
      if (isWhiteInCheck) {
        onCheckChange && onCheckChange("white", false)
      } else {
        onCheckChange && onCheckChange("black", false)
      }
    }
  }, [isWhiteInCheck, isBlackInCheck, onCheckChange])

  return (
    <group>
      {/* Create the board squares */}
      {Array.from({ length: 8 }, (_, row) =>
        Array.from({ length: 8 }, (_, col) => {
          const isWhite = (row + col) % 2 === 0
          const x = col - 3.5
          const z = row - 3.5

          // Check if this square is part of the last move
          const isLastMoveFrom =
            lastMove && Math.round(lastMove.from[0]) === Math.round(x) && Math.round(lastMove.from[2]) === Math.round(z)

          const isLastMoveTo =
            lastMove && Math.round(lastMove.to[0]) === Math.round(x) && Math.round(lastMove.to[2]) === Math.round(z)

          // Check if this square is a valid move
          const isValidMove = validMoves.some(
            (move) => Math.round(move[0]) === Math.round(x) && Math.round(move[2]) === Math.round(z),
          )

          return (
            <mesh key={`${row}-${col}`} position={[x, -0.1, z]} onClick={handleBoardClick}>
              <boxGeometry args={[1, 0.1, 1]} />
              <meshStandardMaterial
                color={
                  isLastMoveFrom || isLastMoveTo
                    ? "#f59e0b"
                    : isValidMove
                      ? isWhite
                        ? "#d1fae5"
                        : "#065f46"
                      : isWhite
                        ? "#e9d8b6"
                        : "#8b4513"
                }
                opacity={isLastMoveFrom || isLastMoveTo ? 0.8 : 1}
                transparent={isLastMoveFrom || isLastMoveTo}
              />
            </mesh>
          )
        }),
      )}

      {/* Last move indicator */}
      {lastMove && <LastMoveIndicator from={lastMove.from} to={lastMove.to} />}

      {/* Show valid move indicators */}
      {selectedPiece &&
        validMoves.map((position, index) => {
          // Check if there's a piece to capture at this position
          const pieceAtPosition = findPieceAtPosition(position, boardState)
          const isCapture = pieceAtPosition && pieceAtPosition.color !== selectedPiece.color

          return <ValidMoveIndicator key={`move-${index}`} position={position} isCapture={isCapture} />
        })}

      {/* Add the chess pieces */}
      {boardState.map((piece) => (
        <ChessPiece
          key={piece.id}
          piece={piece}
          isSelected={selectedPiece && selectedPiece.id === piece.id}
          onSelect={handlePieceSelect}
          onMove={handlePieceMove}
          validMovePositions={selectedPiece && selectedPiece.id === piece.id ? validMoves : []}
          isCheck={
            piece.type === "king" &&
            ((piece.color === "white" && isWhiteInCheck) || (piece.color === "black" && isBlackInCheck))
          }
          isAnimating={animatingPiece === piece.id}
          animateToPosition={animatingPiece === piece.id ? animationTarget : null}
        />
      ))}

      {/* Board border */}
      <mesh position={[0, -0.2, 0]}>
        <boxGeometry args={[9, 0.1, 9]} />
        <meshStandardMaterial color="#5d4037" />
      </mesh>

      {/* Game status indicator */}
      <GameStatusIndicator status={gameStatus} color={currentTurn} />

      {/* Board coordinates */}
      {Array.from({ length: 8 }, (_, i) => (
        <group key={`coords-${i}`}>
          {/* File labels (a-h) */}
          <Text
            position={[i - 3.5, -0.05, 4.2]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.3}
            color="#5d4037"
            anchorX="center"
            anchorY="middle"
          >
            {String.fromCharCode(97 + i)}
          </Text>

          {/* Rank labels (1-8) */}
          <Text
            position={[-4.2, -0.05, i - 3.5]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.3}
            color="#5d4037"
            anchorX="center"
            anchorY="middle"
          >
            {8 - i}
          </Text>
        </group>
      ))}
    </group>
  )
}

// Helper function to get piece symbol for notation
function getPieceSymbol(pieceType) {
  switch (pieceType) {
    case "knight":
      return "N"
    case "bishop":
      return "B"
    case "rook":
      return "R"
    case "queen":
      return "Q"
    case "king":
      return "K"
    default:
      return "" // Pawn has no symbol
  }
}

// Player info component
function PlayerInfo({
  position = "top",
  name = "Opponent",
  rating = 1250,
  timeLeft = 300,
  isCurrentTurn = false,
  isInCheck = false,
}) {
  const isTop = position === "top"
  const isMobile = useIsMobile()

  return (
    <div
      className={`absolute ${isTop ? "top-4" : "bottom-4"} ${
        isMobile ? (isTop ? "left-4" : "left-4") : "left-1/2 transform -translate-x-1/2"
      } z-10`}
    >
      <Card
        className={`${isCurrentTurn ? "ring-2 ring-everchess-cyan" : ""} bg-background-800/90 backdrop-blur-sm border-gray-700 p-2 flex items-center gap-2 ${
          isMobile ? "w-auto max-w-[160px]" : "w-64"
        }`}
      >
        <div className="w-8 h-8 rounded-full bg-background-700 flex items-center justify-center text-sm">
          {isTop ? "B" : "W"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center">
            <div className="font-medium text-white text-sm truncate">{name}</div>
            <div className="text-xs text-muted-foreground">{rating}</div>
          </div>
          <div className="flex justify-between items-center mt-0.5">
            <Badge variant="outline" className="bg-background-700 text-white text-xs px-1 py-0">
              {isTop ? "Black" : "White"}
            </Badge>
            <div className="flex items-center gap-1">
              {isInCheck && (
                <Badge variant="outline" className="bg-red-900/50 text-red-400 text-xs px-1 py-0 flex items-center">
                  <AlertTriangle className="h-3 w-3 mr-0.5" />
                  Check
                </Badge>
              )}
              <div className="bg-background-700 text-white text-xs px-1.5 py-0.5 rounded flex items-center">
                <Clock className="h-3 w-3 mr-0.5" />
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

// Move history component
function MoveHistory({ moves = [] }) {
  const isMobile = useIsMobile()

  if (moves.length === 0) return null

  return (
    <div className={`absolute ${isMobile ? "bottom-20 right-4" : "top-4 right-4"} z-10`}>
      <Card className="bg-background-800/90 backdrop-blur-sm border-gray-700 p-2 max-h-40 overflow-y-auto w-40">
        <h3 className="text-xs font-medium text-white mb-1">Move History</h3>
        <div className="grid grid-cols-2 gap-x-2 gap-y-1">
          {Array.from({ length: Math.ceil(moves.length / 2) }).map((_, i) => (
            <React.Fragment key={i}>
              <div className="text-xs text-white">
                {i + 1}. {moves[i * 2]}
              </div>
              {moves[i * 2 + 1] && <div className="text-xs text-white">{moves[i * 2 + 1]}</div>}
            </React.Fragment>
          ))}
        </div>
      </Card>
    </div>
  )
}

// Chat component
function ChatBox({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    { sender: "opponent", text: "Good luck!", time: "2:30" },
    { sender: "you", text: "Thanks, you too!", time: "2:28" },
  ])
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef(null)

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return

    // Add user message
    setMessages([
      ...messages,
      {
        sender: "you",
        text: newMessage,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ])
    setNewMessage("")

    // Simulate opponent response after a delay
    setTimeout(() => {
      const responses = [
        "Interesting move!",
        "Hmm, let me think...",
        "Nice strategy!",
        "I didn't see that coming!",
        "Good game so far!",
      ]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "opponent",
          text: randomResponse,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ])
    }, 1500)
  }

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="bg-background-800 border-gray-700 w-full max-w-md mx-4 h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-3 border-b border-gray-700">
          <h3 className="font-medium text-white">Chat with GrandMaster99</h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.sender === "you" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg px-3 py-2 ${
                  message.sender === "you" ? "bg-everchess-cyan/20 text-white" : "bg-background-700 text-white"
                }`}
              >
                <div className="text-sm">{message.text}</div>
                <div className="text-xs text-gray-400 mt-1 text-right">{message.time}</div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-3 border-t border-gray-700 flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="bg-background-700 border-gray-600 text-white"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage()
              }
            }}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={handleSendMessage}
            className="bg-everchess-cyan/20 border-everchess-cyan/30 hover:bg-everchess-cyan/30"
          >
            <Send className="h-4 w-4 text-everchess-cyan" />
          </Button>
        </div>
      </Card>
    </div>
  )
}

// Game controls component for mobile
function MobileGameControls() {
  const [showEmotes, setShowEmotes] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [showResignModal, setShowResignModal] = useState(false)
  const [showExitModal, setShowExitModal] = useState(false)
  const router = useRouter()
  const { cancelQueue } = useQueue()
  const controlsRef = useRef(null)
  const [displayedEmoji, setDisplayedEmoji] = useState("")

  const emotes = ["👋", "👍", "👏", "🤔", "😊", "😂", "🎉", "🙏", "🤝", "♟️"]

  const handleResign = () => {
    setShowResignModal(true)
  }

  const handleExit = () => {
    setShowExitModal(true)
  }

  const confirmResign = () => {
    cancelQueue()
    router.push("/play")
  }

  const confirmExit = () => {
    cancelQueue()
    router.push("/play")
  }

  return (
    <>
      <ChatBox isOpen={showChat} onClose={() => setShowChat(false)} />

      <ConfirmationModal
        isOpen={showResignModal}
        title="Resign Game"
        message="Are you sure you want to resign this game? This will count as a loss."
        confirmText="Resign"
        cancelText="Cancel"
        onConfirm={confirmResign}
        onCancel={() => setShowResignModal(false)}
        isDanger={true}
      />

      <ConfirmationModal
        isOpen={showExitModal}
        title="Exit Game"
        message="Are you sure you want to leave this game? Your progress will be lost."
        confirmText="Exit"
        cancelText="Stay"
        onConfirm={confirmExit}
        onCancel={() => setShowExitModal(false)}
        isDanger={false}
      />

      <div className="absolute bottom-4 right-4 z-10" ref={controlsRef}>
        {showEmotes && (
          <div className="absolute bottom-full right-0 mb-2">
            <Card className="bg-background-800/90 backdrop-blur-sm border-gray-700 p-1.5 grid grid-cols-5 gap-1 w-40 animate-in fade-in zoom-in duration-200">
              {emotes.map((emote, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="h-7 w-7 p-0 text-base hover:bg-background-700"
                  onClick={() => {
                    setDisplayedEmoji(emote)
                    setShowEmotes(false)
                    // Hide emoji after 3 seconds
                    setTimeout(() => setDisplayedEmoji(""), 3000)
                  }}
                >
                  {emote}
                </Button>
              ))}
            </Card>
          </div>
        )}

        <div className="grid grid-cols-2 gap-1.5">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-background-800/90 backdrop-blur-sm border-gray-700 hover:bg-background-700 p-0"
            onClick={() => setShowEmotes(!showEmotes)}
          >
            <Smile className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-background-800/90 backdrop-blur-sm border-gray-700 hover:bg-background-700 p-0"
            onClick={() => setShowChat(true)}
          >
            <MessageCircle className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-background-800/90 backdrop-blur-sm border-gray-700 hover:bg-background-700 p-0"
            onClick={handleExit}
          >
            <Home className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-background-800/90 backdrop-blur-sm border-red-900/50 hover:bg-red-900/30 text-red-500 p-0"
            onClick={handleResign}
          >
            <Flag className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {displayedEmoji && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-30">
          <div className="text-7xl animate-in fade-in zoom-in duration-200 animate-out fade-out zoom-out duration-500">
            {displayedEmoji}
          </div>
        </div>
      )}
    </>
  )
}

// Game controls component for desktop
function DesktopGameControls() {
  const [showEmotes, setShowEmotes] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [showResignModal, setShowResignModal] = useState(false)
  const [showExitModal, setShowExitModal] = useState(false)
  const router = useRouter()
  const { cancelQueue } = useQueue()
  const [displayedEmoji, setDisplayedEmoji] = useState("")

  const emotes = ["👋", "👍", "👏", "🤔", "😊", "😂", "🎉", "🙏", "🤝", "♟️"]

  const handleResign = () => {
    setShowResignModal(true)
  }

  const handleExit = () => {
    setShowExitModal(true)
  }

  const confirmResign = () => {
    cancelQueue()
    router.push("/play")
  }

  const confirmExit = () => {
    cancelQueue()
    router.push("/play")
  }

  return (
    <>
      <ChatBox isOpen={showChat} onClose={() => setShowChat(false)} />

      <ConfirmationModal
        isOpen={showResignModal}
        title="Resign Game"
        message="Are you sure you want to resign this game? This will count as a loss."
        confirmText="Resign"
        cancelText="Cancel"
        onConfirm={confirmResign}
        onCancel={() => setShowResignModal(false)}
        isDanger={true}
      />

      <ConfirmationModal
        isOpen={showExitModal}
        title="Exit Game"
        message="Are you sure you want to leave this game? Your progress will be lost."
        confirmText="Exit"
        cancelText="Stay"
        onConfirm={confirmExit}
        onCancel={() => setShowExitModal(false)}
        isDanger={false}
      />

      <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
        {showEmotes && (
          <Card className="bg-background-800/90 backdrop-blur-sm border-gray-700 p-2 grid grid-cols-5 gap-1 w-48 animate-in fade-in zoom-in duration-200">
            {emotes.map((emote, index) => (
              <Button
                key={index}
                variant="ghost"
                className="h-8 w-8 p-0 text-lg hover:bg-background-700"
                onClick={() => {
                  setDisplayedEmoji(emote)
                  setShowEmotes(false)
                  // Hide emoji after 3 seconds
                  setTimeout(() => setDisplayedEmoji(""), 3000)
                }}
              >
                {emote}
              </Button>
            ))}
          </Card>
        )}

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="bg-background-800/90 backdrop-blur-sm border-gray-700 hover:bg-background-700"
            onClick={() => setShowEmotes(!showEmotes)}
          >
            <Smile className="h-5 w-5" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="bg-background-800/90 backdrop-blur-sm border-gray-700 hover:bg-background-700"
            onClick={() => setShowChat(true)}
          >
            <MessageCircle className="h-5 w-5" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="bg-background-800/90 backdrop-blur-sm border-gray-700 hover:bg-background-700"
          >
            <Settings className="h-5 w-5" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="bg-background-800/90 backdrop-blur-sm border-red-900/50 hover:bg-red-900/30 text-red-500"
            onClick={handleResign}
          >
            <Flag className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="absolute top-4 left-4 z-10">
        <Button
          variant="outline"
          className="bg-background-800/90 backdrop-blur-sm border-gray-700 hover:bg-background-700"
          onClick={handleExit}
        >
          <Home className="h-5 w-5 mr-1" />
          Exit
        </Button>
      </div>
      {displayedEmoji && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-30">
          <div className="text-8xl animate-in fade-in zoom-in duration-200 animate-out fade-out zoom-out duration-500">
            {displayedEmoji}
          </div>
        </div>
      )}
    </>
  )
}

// Main game page component
export default function GamePage() {
  const [whiteTime, setWhiteTime] = useState(300) // 5 minutes in seconds
  const [blackTime, setBlackTime] = useState(300)
  const [currentTurn, setCurrentTurn] = useState("white")
  const [isWhiteInCheck, setIsWhiteInCheck] = useState(false)
  const [isBlackInCheck, setIsBlackInCheck] = useState(false)
  const [gameStatus, setGameStatus] = useState("playing") // playing, checkmate, stalemate
  const [moveHistory, setMoveHistory] = useState([])
  const { cancelQueue } = useQueue()
  const router = useRouter()
  const isMobile = useIsMobile()
  const [onCheckChange, setOnCheckChange] = useState(null)

  // Handle game end
  const handleGameEnd = (winner) => {
    setGameStatus(winner === "draw" ? "stalemate" : "checkmate")
    // You could show a modal or other UI here
  }

  // Handle turn change
  const handleTurnChange = (turn) => {
    setCurrentTurn(turn)
  }

  // Timer effect
  useEffect(() => {
    if (gameStatus !== "playing") return

    const interval = setInterval(() => {
      if (currentTurn === "white") {
        setWhiteTime((prev) => {
          if (prev <= 0) {
            clearInterval(interval)
            handleGameEnd("black")
            return 0
          }
          return prev - 1
        })
      } else {
        setBlackTime((prev) => {
          if (prev <= 0) {
            clearInterval(interval)
            handleGameEnd("white")
            return 0
          }
          return prev - 1
        })
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [currentTurn, gameStatus])

  // Clean up queue state when leaving the game
  useEffect(() => {
    return () => {
      cancelQueue()
    }
  }, [cancelQueue])

  // Handle touch events for mobile
  useEffect(() => {
    if (isMobile) {
      // Add touch event handling for mobile chess piece movement
      const handleTouchStart = (e) => {
        // Prevent default to avoid scrolling while trying to move pieces
        if (e.target.tagName === "CANVAS") {
          e.preventDefault()
        }
      }

      document.addEventListener("touchstart", handleTouchStart, { passive: false })
      return () => {
        document.removeEventListener("touchstart", handleTouchStart)
      }
    }
  }, [isMobile])

  return (
    <div className="w-full h-screen bg-gradient-to-b from-background-900 to-background-800 relative overflow-hidden">
      <PlayerInfo
        position="top"
        name="GrandMaster99"
        rating={1450}
        timeLeft={blackTime}
        isCurrentTurn={currentTurn === "black"}
        isInCheck={isBlackInCheck}
      />
      <PlayerInfo
        position="bottom"
        name="You"
        rating={1250}
        timeLeft={whiteTime}
        isCurrentTurn={currentTurn === "white"}
        isInCheck={isWhiteInCheck}
      />

      <MoveHistory moves={moveHistory} />

      {isMobile ? <MobileGameControls /> : <DesktopGameControls />}

      <div className="absolute inset-0">
        <Canvas camera={{ position: isMobile ? [0, 15, 15] : [0, 8, 8], fov: isMobile ? 35 : 45 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={0.8} />
          <Suspense fallback={null}>
            <Chessboard onGameEnd={handleGameEnd} onTurnChange={handleTurnChange} onCheckChange={setOnCheckChange} />
            <OrbitControls
              enablePan={false}
              minPolarAngle={Math.PI / 6}
              maxPolarAngle={Math.PI / 2.5}
              minDistance={isMobile ? 10 : 6}
              maxDistance={isMobile ? 20 : 12}
              enableDamping={true}
              dampingFactor={0.1}
              rotateSpeed={isMobile ? 0.5 : 1}
              touchAction="none"
              // Start zoomed out on mobile
              target={[0, 0, 0]}
              // Set initial zoom level
              initialPosition={isMobile ? [0, 15, 15] : [0, 8, 8]}
            />
            <Environment preset="apartment" />
          </Suspense>
        </Canvas>
      </div>
    </div>
  )
}
