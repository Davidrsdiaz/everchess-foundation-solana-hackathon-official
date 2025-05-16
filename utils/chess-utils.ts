// Chess piece types
export type PieceType = "pawn" | "rook" | "knight" | "bishop" | "queen" | "king"
export type PieceColor = "white" | "black"

export interface ChessPiece {
  type: PieceType
  color: PieceColor
  position: [number, number, number] // 3D position [x, y, z]
  hasMoved?: boolean
  id: string
}

export interface ChessMove {
  from: [number, number]
  to: [number, number]
  piece: ChessPiece
  capturedPiece?: ChessPiece
  isPromotion?: boolean
  promotionPiece?: PieceType
  isCastling?: boolean
  isEnPassant?: boolean
}

// Convert 3D position to chess notation (e.g. [0.5, 0, 3.5] -> e1)
export function positionToNotation(position: [number, number, number]): string {
  const x = position[0] + 3.5
  const z = 3.5 - position[2]

  if (x < 0 || x >= 8 || z < 0 || z >= 8) {
    return ""
  }

  const file = String.fromCharCode(97 + Math.round(x)) // 'a' through 'h'
  const rank = Math.round(z) + 1 // 1 through 8
  return `${file}${rank}`
}

// Convert chess notation to 3D position (e.g. e1 -> [0.5, 0, 3.5])
export function notationToPosition(notation: string): [number, number, number] {
  const file = notation.charCodeAt(0) - 97 // 'a' is 97 in ASCII
  const rank = Number.parseInt(notation[1], 10)

  const x = file - 3.5
  const z = 3.5 - (rank - 1)

  return [x, 0, z]
}

// Convert board coordinates to 3D position
export function boardToPosition(x: number, z: number): [number, number, number] {
  return [x - 3.5, 0, z - 3.5]
}

// Convert 3D position to board coordinates
export function positionToBoard(position: [number, number, number]): [number, number] {
  return [Math.round(position[0] + 3.5), Math.round(position[2] + 3.5)]
}

// Check if a position is valid on the board
export function isValidPosition(position: [number, number, number]): boolean {
  const [x, _, z] = position
  const boardX = Math.round(x + 3.5)
  const boardZ = Math.round(z + 3.5)
  return boardX >= 0 && boardX < 8 && boardZ >= 0 && boardZ < 8
}

// Find a piece at a specific position
export function findPieceAtPosition(
  position: [number, number, number],
  boardState: ChessPiece[],
): ChessPiece | undefined {
  const [targetX, _, targetZ] = position
  return boardState.find((piece) => {
    const [pieceX, __, pieceZ] = piece.position
    return Math.round(pieceX) === Math.round(targetX) && Math.round(pieceZ) === Math.round(targetZ)
  })
}

// Get basic moves without checking for check
export function getBasicMoves(piece: ChessPiece, boardState: ChessPiece[]): [number, number, number][] {
  const [x, y, z] = piece.position
  const validMoves: [number, number, number][] = []
  const [boardX, boardZ] = positionToBoard(piece.position)

  // Helper to check if a position is occupied
  const isOccupied = (pos: [number, number, number]): ChessPiece | undefined => {
    const [bx, _, bz] = pos
    return boardState.find((p) => {
      const [px, __, pz] = p.position
      return Math.round(px) === Math.round(bx) && Math.round(pz) === Math.round(bz)
    })
  }

  // Helper to check if a position is occupied by an enemy
  const isOccupiedByEnemy = (pos: [number, number, number]): boolean => {
    const occupyingPiece = isOccupied(pos)
    return !!occupyingPiece && occupyingPiece.color !== piece.color
  }

  // Helper to check if a position is valid and not occupied by a friendly piece
  const isValidMove = (pos: [number, number, number]): boolean => {
    if (!isValidPosition(pos)) return false
    const occupyingPiece = isOccupied(pos)
    return !occupyingPiece || occupyingPiece.color !== piece.color
  }

  // Pawn movement
  if (piece.type === "pawn") {
    const direction = piece.color === "white" ? -1 : 1
    const forwardPos: [number, number, number] = [x, y, z + direction]

    // Forward move
    if (isValidPosition(forwardPos) && !isOccupied(forwardPos)) {
      validMoves.push(forwardPos)

      // Double move from starting position
      if ((piece.color === "white" && boardZ === 6) || (piece.color === "black" && boardZ === 1)) {
        const doubleForwardPos: [number, number, number] = [x, y, z + 2 * direction]
        if (!isOccupied(doubleForwardPos)) {
          validMoves.push(doubleForwardPos)
        }
      }
    }

    // Capture moves
    const captureLeft: [number, number, number] = [x - 1, y, z + direction]
    const captureRight: [number, number, number] = [x + 1, y, z + direction]

    if (isValidPosition(captureLeft) && isOccupiedByEnemy(captureLeft)) {
      validMoves.push(captureLeft)
    }

    if (isValidPosition(captureRight) && isOccupiedByEnemy(captureRight)) {
      validMoves.push(captureRight)
    }

    // En passant would be implemented here in a full chess engine
  }

  // Rook movement
  if (piece.type === "rook" || piece.type === "queen") {
    // Horizontal and vertical directions
    const directions = [
      [1, 0, 0],
      [-1, 0, 0], // right, left
      [0, 0, 1],
      [0, 0, -1], // down, up
    ]

    for (const [dx, dy, dz] of directions) {
      let newPos: [number, number, number] = [x + dx, y + dy, z + dz]

      while (isValidPosition(newPos)) {
        const occupyingPiece = isOccupied(newPos)

        if (!occupyingPiece) {
          validMoves.push(newPos)
          newPos = [newPos[0] + dx, newPos[1] + dy, newPos[2] + dz]
        } else {
          if (occupyingPiece.color !== piece.color) {
            validMoves.push(newPos)
          }
          break
        }
      }
    }
  }

  // Bishop movement
  if (piece.type === "bishop" || piece.type === "queen") {
    // Diagonal directions
    const directions = [
      [1, 0, 1],
      [1, 0, -1], // down-right, up-right
      [-1, 0, 1],
      [-1, 0, -1], // down-left, up-left
    ]

    for (const [dx, dy, dz] of directions) {
      let newPos: [number, number, number] = [x + dx, y + dy, z + dz]

      while (isValidPosition(newPos)) {
        const occupyingPiece = isOccupied(newPos)

        if (!occupyingPiece) {
          validMoves.push(newPos)
          newPos = [newPos[0] + dx, newPos[1] + dy, newPos[2] + dz]
        } else {
          if (occupyingPiece.color !== piece.color) {
            validMoves.push(newPos)
          }
          break
        }
      }
    }
  }

  // Knight movement
  if (piece.type === "knight") {
    const knightMoves = [
      [1, 0, 2],
      [2, 0, 1], // down-right
      [1, 0, -2],
      [2, 0, -1], // up-right
      [-1, 0, 2],
      [-2, 0, 1], // down-left
      [-1, 0, -2],
      [-2, 0, -1], // up-left
    ]

    for (const [dx, dy, dz] of knightMoves) {
      const newPos: [number, number, number] = [x + dx, y + dy, z + dz]
      if (isValidMove(newPos)) {
        validMoves.push(newPos)
      }
    }
  }

  // King movement
  if (piece.type === "king") {
    const kingMoves = [
      [1, 0, 0],
      [1, 0, 1],
      [0, 0, 1],
      [-1, 0, 1],
      [-1, 0, 0],
      [-1, 0, -1],
      [0, 0, -1],
      [1, 0, -1],
    ]

    for (const [dx, dy, dz] of kingMoves) {
      const newPos: [number, number, number] = [x + dx, y + dy, z + dz]
      if (isValidMove(newPos)) {
        validMoves.push(newPos)
      }
    }

    // Castling is handled separately to avoid recursion
  }

  return validMoves
}

// Check if the king is in check
export function isKingInCheck(color: PieceColor, boardState: ChessPiece[]): boolean {
  // Find the king
  const king = boardState.find((piece) => piece.type === "king" && piece.color === color)
  if (!king) return false

  // Check if any opponent piece can capture the king
  return boardState.some((piece) => {
    if (piece.color === color) return false

    // Use getBasicMoves instead of getValidMoves to avoid recursion
    const basicMoves = getBasicMoves(piece, boardState)

    return basicMoves.some((move) => {
      const [moveX, _, moveZ] = move
      const [kingX, __, kingZ] = king.position
      return Math.round(moveX) === Math.round(kingX) && Math.round(moveZ) === Math.round(kingZ)
    })
  })
}

// Get all valid moves for a piece
export function getValidMoves(
  piece: ChessPiece,
  boardState: ChessPiece[],
  checkForCheck = true,
): [number, number, number][] {
  // Get basic moves without considering check
  const validMoves = getBasicMoves(piece, boardState)

  // Add castling moves for king
  if (piece.type === "king" && !piece.hasMoved && !isKingInCheck(piece.color, boardState)) {
    const [x, y, z] = piece.position

    // Helper to check if a position is occupied
    const isOccupied = (pos: [number, number, number]): ChessPiece | undefined => {
      const [bx, _, bz] = pos
      return boardState.find((p) => {
        const [px, __, pz] = p.position
        return Math.round(px) === Math.round(bx) && Math.round(pz) === Math.round(bz)
      })
    }

    // Kingside castling
    const kingsideRook = boardState.find(
      (p) => p.type === "rook" && p.color === piece.color && p.position[0] > piece.position[0] && !p.hasMoved,
    )

    if (kingsideRook) {
      const path = [
        [x + 1, y, z],
        [x + 2, y, z],
      ]

      const pathClear = path.every((pos) => !isOccupied(pos))

      // Check if the path is under attack
      const pathSafe =
        pathClear &&
        !path.some((pos) => {
          // Create a temporary board with the king at this position
          const tempBoard = boardState.map((p) => ({ ...p }))
          const kingIndex = tempBoard.findIndex((p) => p.id === piece.id)
          if (kingIndex !== -1) {
            tempBoard[kingIndex] = { ...tempBoard[kingIndex], position: pos }
          }

          // Check if this position would be in check
          return isKingInCheck(piece.color, tempBoard)
        })

      if (pathClear && pathSafe) {
        validMoves.push([x + 2, y, z])
      }
    }

    // Queenside castling
    const queensideRook = boardState.find(
      (p) => p.type === "rook" && p.color === piece.color && p.position[0] < piece.position[0] && !p.hasMoved,
    )

    if (queensideRook) {
      const path = [
        [x - 1, y, z],
        [x - 2, y, z],
        [x - 3, y, z],
      ]

      const pathClear = path.every((pos) => !isOccupied(pos))

      // Check if the path is under attack (only the squares the king moves through)
      const pathSafe =
        pathClear &&
        !path.slice(0, 2).some((pos) => {
          // Create a temporary board with the king at this position
          const tempBoard = boardState.map((p) => ({ ...p }))
          const kingIndex = tempBoard.findIndex((p) => p.id === piece.id)
          if (kingIndex !== -1) {
            tempBoard[kingIndex] = { ...tempBoard[kingIndex], position: pos }
          }

          // Check if this position would be in check
          return isKingInCheck(piece.color, tempBoard)
        })

      if (pathClear && pathSafe) {
        validMoves.push([x - 2, y, z])
      }
    }
  }

  // Filter moves that would leave the king in check
  if (checkForCheck) {
    return validMoves.filter((move) => {
      // Create a temporary board with the move applied
      const tempBoard = boardState.map((p) => ({ ...p }))

      // Find and update the moved piece
      const pieceIndex = tempBoard.findIndex((p) => p.id === piece.id)
      if (pieceIndex !== -1) {
        tempBoard[pieceIndex] = { ...tempBoard[pieceIndex], position: move, hasMoved: true }
      }

      // Remove captured piece if any
      const capturedPieceIndex = tempBoard.findIndex(
        (p) =>
          p.id !== piece.id &&
          Math.round(p.position[0]) === Math.round(move[0]) &&
          Math.round(p.position[2]) === Math.round(move[2]),
      )

      if (capturedPieceIndex !== -1) {
        tempBoard.splice(capturedPieceIndex, 1)
      }

      // Check if the king is in check after the move
      return !isKingInCheck(piece.color, tempBoard)
    })
  }

  return validMoves
}

// Check if a player is in checkmate
export function isCheckmate(color: PieceColor, boardState: ChessPiece[]): boolean {
  // If the king is not in check, it's not checkmate
  if (!isKingInCheck(color, boardState)) return false

  // Check if any piece can make a move that gets out of check
  return !boardState
    .filter((piece) => piece.color === color)
    .some((piece) => getValidMoves(piece, boardState).length > 0)
}

// Check if the game is in stalemate
export function isStalemate(color: PieceColor, boardState: ChessPiece[]): boolean {
  // If the king is in check, it's not stalemate
  if (isKingInCheck(color, boardState)) return false

  // Check if any piece can make a valid move
  return !boardState
    .filter((piece) => piece.color === color)
    .some((piece) => getValidMoves(piece, boardState).length > 0)
}

// Simple AI to make a smarter move
export function makeComputerMove(boardState: ChessPiece[], color: PieceColor): ChessMove | null {
  const pieces = boardState.filter((piece) => piece.color === color)
  let bestMove: ChessMove | null = null
  let bestScore = Number.NEGATIVE_INFINITY

  // Check for checkmate moves first
  for (const piece of pieces) {
    const validMoves = getValidMoves(piece, boardState)

    for (const move of validMoves) {
      // Create a temporary board with the move applied
      const tempBoard = boardState.map((p) => ({ ...p }))

      // Find and update the moved piece
      const pieceIndex = tempBoard.findIndex((p) => p.id === piece.id)
      if (pieceIndex !== -1) {
        tempBoard[pieceIndex] = { ...tempBoard[pieceIndex], position: move, hasMoved: true }
      }

      // Remove captured piece if any
      const capturedPiece = tempBoard.find(
        (p) =>
          p.id !== piece.id &&
          p.color !== color &&
          Math.round(p.position[0]) === Math.round(move[0]) &&
          Math.round(p.position[2]) === Math.round(move[2]),
      )

      if (capturedPiece) {
        const capturedIndex = tempBoard.findIndex((p) => p.id === capturedPiece.id)
        if (capturedIndex !== -1) {
          tempBoard.splice(capturedIndex, 1)
        }
      }

      // Check if this move results in checkmate
      const opponentColor = color === "white" ? "black" : "white"
      if (isCheckmate(opponentColor, tempBoard)) {
        return {
          from: [piece.position[0], piece.position[2]],
          to: [move[0], move[2]],
          piece,
          capturedPiece,
        }
      }

      // Evaluate the move
      let score = 0

      // Prefer captures
      if (capturedPiece) {
        score += getPieceValue(capturedPiece.type)
      }

      // Prefer moves that put the opponent in check
      if (isKingInCheck(opponentColor, tempBoard)) {
        score += 50
      }

      // Prefer central control for knights and bishops
      if ((piece.type === "knight" || piece.type === "bishop") && Math.abs(move[0]) < 2 && Math.abs(move[2]) < 2) {
        score += 10
      }

      // Prefer pawn advancement
      if (piece.type === "pawn") {
        const advancement = color === "white" ? 3.5 - move[2] : move[2] - 3.5
        score += advancement * 5
      }

      if (score > bestScore) {
        bestScore = score
        bestMove = {
          from: [piece.position[0], piece.position[2]],
          to: [move[0], move[2]],
          piece,
          capturedPiece,
        }
      }
    }
  }

  // If no good move was found, just make a random valid move
  if (!bestMove) {
    // Shuffle pieces to add randomness
    const shuffledPieces = [...pieces].sort(() => Math.random() - 0.5)

    for (const piece of shuffledPieces) {
      const validMoves = getValidMoves(piece, boardState)

      if (validMoves.length > 0) {
        // Choose a random valid move
        const targetPosition = validMoves[Math.floor(Math.random() * validMoves.length)]

        // Check if there's a piece to capture
        const capturedPiece = boardState.find(
          (p) =>
            p.color !== color &&
            Math.round(p.position[0]) === Math.round(targetPosition[0]) &&
            Math.round(p.position[2]) === Math.round(targetPosition[2]),
        )

        return {
          from: [piece.position[0], piece.position[2]],
          to: [targetPosition[0], targetPosition[2]],
          piece,
          capturedPiece,
        }
      }
    }
  }

  return bestMove
}

// Get the value of a piece for evaluation
function getPieceValue(pieceType: PieceType): number {
  switch (pieceType) {
    case "pawn":
      return 10
    case "knight":
      return 30
    case "bishop":
      return 30
    case "rook":
      return 50
    case "queen":
      return 90
    case "king":
      return 900
    default:
      return 0
  }
}

// Initialize the chess board with all pieces
export function initializeChessBoard(): ChessPiece[] {
  const pieces: ChessPiece[] = []

  // Helper function to create a piece
  const createPiece = (type: PieceType, color: PieceColor, position: [number, number, number]): ChessPiece => ({
    type,
    color,
    position,
    hasMoved: false,
    id: `${type}-${color}-${position[0]}-${position[2]}`,
  })

  // Add pawns
  for (let i = -3.5; i <= 3.5; i += 1) {
    pieces.push(createPiece("pawn", "black", [i, 0, -2.5]))
    pieces.push(createPiece("pawn", "white", [i, 0, 2.5]))
  }

  // Add rooks
  pieces.push(createPiece("rook", "black", [-3.5, 0, -3.5]))
  pieces.push(createPiece("rook", "black", [3.5, 0, -3.5]))
  pieces.push(createPiece("rook", "white", [-3.5, 0, 3.5]))
  pieces.push(createPiece("rook", "white", [3.5, 0, 3.5]))

  // Add knights
  pieces.push(createPiece("knight", "black", [-2.5, 0, -3.5]))
  pieces.push(createPiece("knight", "black", [2.5, 0, -3.5]))
  pieces.push(createPiece("knight", "white", [-2.5, 0, 3.5]))
  pieces.push(createPiece("knight", "white", [2.5, 0, 3.5]))

  // Add bishops
  pieces.push(createPiece("bishop", "black", [-1.5, 0, -3.5]))
  pieces.push(createPiece("bishop", "black", [1.5, 0, -3.5]))
  pieces.push(createPiece("bishop", "white", [-1.5, 0, 3.5]))
  pieces.push(createPiece("bishop", "white", [1.5, 0, 3.5]))

  // Add queens
  pieces.push(createPiece("queen", "black", [-0.5, 0, -3.5]))
  pieces.push(createPiece("queen", "white", [-0.5, 0, 3.5]))

  // Add kings
  pieces.push(createPiece("king", "black", [0.5, 0, -3.5]))
  pieces.push(createPiece("king", "white", [0.5, 0, 3.5]))

  return pieces
}
