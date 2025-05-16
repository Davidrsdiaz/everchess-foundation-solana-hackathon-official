# Chess Sets Page - Backend Integration Guide

This document outlines the backend integration requirements for the Everchess Chess Sets page. It covers API endpoints, data models, state management, and other important considerations for implementing the backend services that power the chess sets experience.

## Table of Contents

1. [Overview](#overview)
2. [Data Requirements](#data-requirements)
3. [API Endpoints](#api-endpoints)
4. [Data Models](#data-models)
5. [State Management](#state-management)
6. [Real-time Updates](#real-time-updates)
7. [Error Handling](#error-handling)
8. [Performance Considerations](#performance-considerations)

## Overview

The Chess Sets page allows users to:
- View their collection of chess sets
- Preview chess sets in detail
- Select a chess set as their active set
- See locked chess sets and how to obtain them
- Purchase chess sets from the market

## Data Requirements

The Chess Sets page requires the following data:

### User's Chess Sets
- Owned chess sets
- Currently selected chess set
- Acquisition date
- Rarity information

### Available Chess Sets
- All chess sets in the game
- Rarity and availability
- Acquisition methods (purchase, battlepass, etc.)
- Preview images

## API Endpoints

### User's Chess Sets Endpoint
\`\`\`
GET /api/inventory/chess-sets
\`\`\`

**Response:**
\`\`\`json
{
  "selected_set": "classic-wood",
  "owned_sets": [
    {
      "id": "classic-wood",
      "name": "Classic Wood",
      "description": "A traditional wooden chess set with hand-carved pieces.",
      "rarity": "Common",
      "acquired_at": "2023-01-15T12:30:45Z",
      "preview_image": "/chess-sets/classic-wood-preview.png",
      "icon_image": "/chess-sets/classic-wood-icon.png"
    },
    {
      "id": "crystal-set",
      "name": "Crystal Set",
      "description": "Elegant chess pieces made of clear and frosted crystal.",
      "rarity": "Rare",
      "acquired_at": "2023-02-20T18:15:30Z",
      "preview_image": "/chess-sets/crystal-set-preview.png",
      "icon_image": "/chess-sets/crystal-set-icon.png"
    },
    // Additional owned sets...
  ]
}
\`\`\`

### All Chess Sets Endpoint
\`\`\`
GET /api/chess-sets
\`\`\`

**Response:**
\`\`\`json
{
  "sets": [
    {
      "id": "classic-wood",
      "name": "Classic Wood",
      "description": "A traditional wooden chess set with hand-carved pieces.",
      "rarity": "Common",
      "acquisition": "starter",
      "price": null,
      "preview_image": "/chess-sets/classic-wood-preview.png",
      "icon_image": "/chess-sets/classic-wood-icon.png"
    },
    {
      "id": "crystal-set",
      "name": "Crystal Set",
      "description": "Elegant chess pieces made of clear and frosted crystal.",
      "rarity": "Rare",
      "acquisition": "purchase",
      "price": 500,
      "preview_image": "/chess-sets/crystal-set-preview.png",
      "icon_image": "/chess-sets/crystal-set-icon.png"
    },
    {
      "id": "dragon-kingdom",
      "name": "Dragon Kingdom",
      "description": "Mythical chess set featuring dragons as the powerful pieces.",
      "rarity": "Epic",
      "acquisition": "battlepass",
      "season": 1,
      "tier": 50,
      "preview_image": "/chess-sets/dragon-kingdom-preview.png",
      "icon_image": "/chess-sets/dragon-kingdom-icon.png"
    },
    // Additional sets...
  ]
}
\`\`\`

### Chess Set Details Endpoint
\`\`\`
GET /api/chess-sets/:setId
\`\`\`

**Response:**
\`\`\`json
{
  "id": "golden-dynasty",
  "name": "Golden Dynasty",
  "description": "Opulent chess set inspired by ancient Chinese imperial designs.",
  "rarity": "Legendary",
  "acquisition": "purchase",
  "price": 1200,
  "preview_image": "/chess-sets/golden-dynasty-preview.png",
  "icon_image": "/chess-sets/golden-dynasty-icon.png",
  "piece_images": {
    "white_pawn": "/chess-sets/golden-dynasty/white-pawn.png",
    "white_knight": "/chess-sets/golden-dynasty/white-knight.png",
    "white_bishop": "/chess-sets/golden-dynasty/white-bishop.png",
    "white_rook": "/chess-sets/golden-dynasty/white-rook.png",
    "white_queen": "/chess-sets/golden-dynasty/white-queen.png",
    "white_king": "/chess-sets/golden-dynasty/white-king.png",
    "black_pawn": "/chess-sets/golden-dynasty/black-pawn.png",
    "black_knight": "/chess-sets/golden-dynasty/black-knight.png",
    "black_bishop": "/chess-sets/golden-dynasty/black-bishop.png",
    "black_rook": "/chess-sets/golden-dynasty/black-rook.png",
    "black_queen": "/chess-sets/golden-dynasty/black-queen.png",
    "black_king": "/chess-sets/golden-dynasty/black-king.png"
  },
  "board_image": "/chess-sets/golden-dynasty/board.png",
  "special_effects": {
    "move": "golden-trail",
    "capture": "golden-explosion"
  }
}
\`\`\`

### Select Chess Set Endpoint
\`\`\`
POST /api/inventory/chess-sets/select/:setId
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "selected_set": "crystal-set"
}
\`\`\`

### Purchase Chess Set Endpoint
\`\`\`
POST /api/market/purchase/chess-set/:setId
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "purchased_set": {
    "id": "inferno-set",
    "name": "Inferno Set",
    "description": "Fiery chess set with pieces that appear to be made of living flame.",
    "rarity": "Epic",
    "acquired_at": "2023-06-15T14:22:10Z",
    "preview_image": "/chess-sets/inferno-set-preview.png",
    "icon_image": "/chess-sets/inferno-set-icon.png"
  },
  "remaining_gold": 2500
}
\`\`\`

## Data Models

### Chess Sets Model

\`\`\`sql
CREATE TABLE chess_sets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  rarity TEXT NOT NULL,
  acquisition_type TEXT NOT NULL, -- 'starter', 'purchase', 'battlepass', 'achievement', etc.
  price INTEGER,
  battlepass_season INTEGER,
  battlepass_tier INTEGER,
  preview_image TEXT NOT NULL,
  icon_image TEXT NOT NULL,
  piece_images JSONB NOT NULL,
  board_image TEXT NOT NULL,
  special_effects JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
\`\`\`

### User Chess Sets Model

\`\`\`sql
CREATE TABLE user_chess_sets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) NOT NULL,
  chess_set_id TEXT REFERENCES chess_sets(id) NOT NULL,
  acquired_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id, chess_set_id)
);
\`\`\`

### User Selected Chess Set Model

\`\`\`sql
CREATE TABLE user_selected_chess_set (
  user_id UUID REFERENCES users(id) PRIMARY KEY,
  chess_set_id TEXT REFERENCES chess_sets(id) NOT NULL,
  selected_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
\`\`\`

## State Management

### React Context Structure

The Chess Sets page uses several React contexts to manage state:

1. **ChessSetsContext**: Manages chess sets data and selection

### Example Context Implementation

\`\`\`typescript
// contexts/ChessSetsContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';

type ChessSet = {
  id: string;
  name: string;
  description: string;
  rarity: string;
  previewImage: string;
  iconImage: string;
  acquiredAt?: string;
};

type ChessSetDetails = ChessSet & {
  pieceImages: Record<string, string>;
  boardImage: string;
  specialEffects?: {
    move?: string;
    capture?: string;
  };
};

type ChessSetsContextType = {
  ownedSets: ChessSet[];
  allSets: ChessSet[];
  selectedSetId: string;
  setDetails: Record<string, ChessSetDetails>;
  loading: boolean;
  error: string | null;
  refreshChessSets: () => Promise<void>;
  selectChessSet: (setId: string) => Promise<void>;
  getChessSetDetails: (setId: string) => Promise<ChessSetDetails>;
};

const ChessSetsContext = createContext<ChessSetsContextType | undefined>(undefined);

export function ChessSetsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  
  const [ownedSets, setOwnedSets] = useState<ChessSet[]>([]);
  const [allSets, setAllSets] = useState<ChessSet[]>([]);
  const [selectedSetId, setSelectedSetId] = useState<string>('classic-wood');
  const [setDetails, setSetDetails] = useState<Record<string, ChessSetDetails>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchOwnedChessSets = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${process.env.API_URL}/api/inventory/chess-sets`, {
        headers: {
          Authorization: `Bearer ${user?.token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch owned chess sets');
      
      const data = await response.json();
      
      setOwnedSets(data.owned_sets.map((set: any) => ({
        id: set.id,
        name: set.name,
        description: set.description,
        rarity: set.rarity,
        previewImage: set.preview_image,
        iconImage: set.icon_image,
        acquiredAt: set.acquired_at
      })));
      
      setSelectedSetId(data.selected_set);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchAllChessSets = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${process.env.API_URL}/api/chess-sets`);
      
      if (!response.ok) throw new Error('Failed to fetch all chess sets');
      
      const data = await response.json();
      
      setAllSets(data.sets.map((set: any) => ({
        id: set.id,
        name: set.name,
        description: set.description,
        rarity: set.rarity,
        previewImage: set.preview_image,
        iconImage: set.icon_image
      })));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const refreshChessSets = async () => {
    await Promise.all([fetchOwnedChessSets(), fetchAllChessSets()]);
  };
  
  const selectChessSet = async (setId: string) => {
    try {
      setError(null);
      
      const response = await fetch(`${process.env.API_URL}/api/inventory/chess-sets/select/${setId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user?.token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to select chess set');
      
      const data = await response.json();
      
      setSelectedSetId(data.selected_set);
      
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };
  
  const getChessSetDetails = async (setId: string): Promise<ChessSetDetails> => {
    // Check if we already have the details cached
    if (setDetails[setId]) {
      return setDetails[setId];
    }
    
    try {
      setError(null);
      
      const response = await fetch(`${process.env.API_URL}/api/chess-sets/${setId}`);
      
      if (!response.ok) throw new Error('Failed to fetch chess set details');
      
      const data = await response.json();
      
      const details: ChessSetDetails = {
        id: data.id,
        name: data.name,
        description: data.description,
        rarity: data.rarity,
        previewImage: data.preview_image,
        iconImage: data.icon_image,
        pieceImages: data.piece_images,
        boardImage: data.board_image,
        specialEffects: data.special_effects
      };
      
      // Cache the details
      setSetDetails(prev => ({
        ...prev,
        [setId]: details
      }));
      
      return details;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };
  
  useEffect(() => {
    if (user) {
      refreshChessSets();
    }
  }, [user]);
  
  return (
    <ChessSetsContext.Provider value={{
      ownedSets,
      allSets,
      selectedSetId,
      setDetails,
      loading,
      error,
      refreshChessSets,
      selectChessSet,
      getChessSetDetails
    }}>
      {children}
    </ChessSetsContext.Provider>
  );
}

export function useChessSets() {
  const context = useContext(ChessSetsContext);
  if (context === undefined) {
    throw new Error('useChessSets must be used within a ChessSetsProvider');
  }
  return context;
}
\`\`\`

## Real-time Updates

The Chess Sets page benefits from real-time updates for:

1. **New Acquisitions**: When a user acquires a new chess set
2. **Set Selection**: When a user changes their selected set from another device

### WebSocket Events

The server should emit the following events:

1. `chess_set_acquired`: When a user acquires a new chess set
2. `chess_set_selected`: When a user selects a different chess set

### WebSocket Implementation

\`\`\`typescript
// server/websocket/ChessSetsHandler.ts
export class ChessSetsHandler {
  constructor(io: Server) {
    this.setupEventHandlers(io);
  }
  
  private setupEventHandlers(io: Server) {
    // Listen for chess set acquisitions
    events.on('chess_set_acquired', async (data: { userId: string, chessSetId: string }) => {
      try {
        const { userId, chessSetId } = data;
        
        // Get chess set details
        const chessSet = await db.chessSets.findUnique({
          where: { id: chessSetId }
        });
        
        if (!chessSet) return;
        
        // Emit update to user
        io.to(userId).emit('chess_set_acquired', {
          id: chessSet.id,
          name: chessSet.name,
          description: chessSet.description,
          rarity: chessSet.rarity,
          preview_image: chessSet.preview_image,
          icon_image: chessSet.icon_image,
          acquired_at: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error handling chess set acquisition:', error);
      }
    });
    
    // Listen for chess set selections
    events.on('chess_set_selected', async (data: { userId: string, chessSetId: string }) => {
      try {
        const { userId, chessSetId } = data;
        
        // Emit update to user
        io.to(userId).emit('chess_set_selected', {
          selected_set: chessSetId
        });
      } catch (error) {
        console.error('Error handling chess set selection:', error);
      }
    });
  }
}
\`\`\`

## Error Handling

### API Error Handling

\`\`\`typescript
// services/api.ts
import { captureError } from './error-handler';

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export const fetchWithErrorHandling = async (
  url: string,
  options?: RequestInit
) => {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: response.statusText };
      }
      
      const error = new ApiError(
        response.status,
        errorData.message || 'An error occurred',
        errorData
      );
      
      throw error;
    }
    
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      // Log API errors
      captureError(error, {
        url,
        status: error.status,
        data: error.data
      });
    } else {
      // Log network or other errors
      captureError(error as Error, { url });
    }
    
    throw error;
  }
};
\`\`\`

### UI Error States

The Chess Sets page should handle the following error states:

1. **Loading Error**: Display a retry button when data fails to load
2. **Selection Error**: Show toast notifications for failed set selection
3. **Purchase Error**: Display error messages when set purchase fails

## Performance Considerations

### Data Fetching Optimization

1. **Parallel Requests**: Fetch owned and all chess sets in parallel
2. **Caching**: Cache chess set details to avoid repeated requests
3. **Lazy Loading**: Load detailed chess set information only when needed
4. **Image Optimization**: Use optimized images for previews and thumbnails

### React Optimization

1. **Memoization**: Use `useMemo` and `useCallback` for expensive calculations
2. **Virtualization**: Use virtualized lists for displaying many chess sets
3. **Image Loading**: Implement progressive image loading for chess set previews

### Example Implementation

\`\`\`typescript
// hooks/useChessSetDetails.ts
import { useState, useEffect } from 'react';
import { fetchWithErrorHandling } from '../services/api';
import { useChessSets } from '../contexts/ChessSetsContext';

export function useChessSetDetails(setId: string) {
  const { setDetails, getChessSetDetails } = useChessSets();
  const [loading, setLoading] = useState(!setDetails[setId]);
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState(setDetails[setId] || null);

  useEffect(() => {
    if (setDetails[setId]) {
      setDetails(setDetails[setId]);
      setLoading(false);
      return;
    }
    
    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const details = await getChessSetDetails(setId);
        setDetails(details);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDetails();
  }, [setId, setDetails]);

  return {
    details,
    loading,
    error
  };
}
\`\`\`

By following these guidelines, the Chess Sets page will provide a responsive experience that efficiently communicates with the backend services.
