# Dashboard Home - Backend Integration Guide

This document outlines the backend integration requirements for the Everchess Dashboard Home page. It covers API endpoints, data models, state management, and other important considerations for implementing the backend services that power the dashboard home experience.

## Table of Contents

1. [Overview](#overview)
2. [Data Requirements](#data-requirements)
3. [API Endpoints](#api-endpoints)
4. [State Management](#state-management)
5. [Real-time Updates](#real-time-updates)
6. [Error Handling](#error-handling)
7. [Performance Considerations](#performance-considerations)

## Overview

The Dashboard Home serves as the central hub for users, displaying:
- Game mode selection options
- Battlepass progress and rewards
- Daily and weekly missions
- Chess set collection preview
- Leaderboard preview

## Data Requirements

The Dashboard Home requires the following data:

### User Profile Data
- Username
- Avatar
- Current rating
- XP level

### Battlepass Data
- Current tier
- XP progress
- XP required for next tier
- Next reward details

### Missions Data
- Daily missions (with progress)
- Weekly missions (with progress)
- Completion status
- XP rewards

### Chess Sets Data
- Owned sets preview (limited to 4)
- Selected/active set

### Leaderboard Data
- Top 5 players
- Current user's rank

## API Endpoints

### User Profile Endpoint
\`\`\`
GET /api/users/profile
\`\`\`

**Response:**
\`\`\`json
{
  "id": "user_id",
  "username": "Einstein",
  "avatar_url": "/profile-avatar.svg",
  "rating": 1250,
  "xp": 4250,
  "level": 24
}
\`\`\`

### Battlepass Endpoint
\`\`\`
GET /api/battlepass/current
\`\`\`

**Response:**
\`\`\`json
{
  "season": 1,
  "tier": 24,
  "max_tier": 100,
  "xp": 210,
  "xp_required": 250,
  "next_reward": {
    "tier": 25,
    "type": "mystery_box",
    "name": "Mystery Box",
    "image_url": "/gift-box-icon.png"
  }
}
\`\`\`

### Missions Endpoint
\`\`\`
GET /api/missions
\`\`\`

**Response:**
\`\`\`json
{
  "daily": [
    {
      "id": "win_games_daily",
      "title": "Win Games",
      "steps": [
        {"target": 1, "progress": 1, "completed": true, "xp": 25},
        {"target": 2, "progress": 2, "completed": true, "xp": 50},
        {"target": 3, "progress": 2, "completed": false, "xp": 75}
      ]
    },
    {
      "id": "play_games_daily",
      "title": "Play Games",
      "steps": [
        {"target": 1, "progress": 1, "completed": true, "xp": 25},
        {"target": 3, "progress": 3, "completed": true, "xp": 50},
        {"target": 5, "progress": 3, "completed": false, "xp": 75}
      ]
    },
    {
      "id": "tournament_daily",
      "title": "Tournaments",
      "steps": [
        {"target": 1, "progress": 0, "completed": false, "xp": 50},
        {"target": 2, "progress": 0, "completed": false, "xp": 100},
        {"target": 1, "progress": 0, "completed": false, "xp": 150, "special": "Place Top 3"}
      ]
    }
  ],
  "weekly": [
    {
      "id": "win_games_weekly",
      "title": "Win Games",
      "steps": [
        {"target": 5, "progress": 4, "completed": false, "xp": 100},
        {"target": 10, "progress": 4, "completed": false, "xp": 150},
        {"target": 15, "progress": 4, "completed": false, "xp": 200}
      ]
    },
    // Additional weekly missions...
  ]
}
\`\`\`

### Chess Sets Preview Endpoint
\`\`\`
GET /api/inventory/chess-sets/preview
\`\`\`

**Response:**
\`\`\`json
{
  "selected_set": "classic-wood",
  "sets": [
    {
      "id": "classic-wood",
      "name": "Classic Wood",
      "rarity": "Common",
      "image_url": "/chess-sets/classic-wood-icon.png"
    },
    {
      "id": "crystal-set",
      "name": "Crystal Set",
      "rarity": "Rare",
      "image_url": "/chess-sets/crystal-set-icon.png"
    },
    // Additional sets...
  ]
}
\`\`\`

### Leaderboard Preview Endpoint
\`\`\`
GET /api/leaderboard/preview
\`\`\`

**Response:**
\`\`\`json
{
  "top_players": [
    {
      "rank": 1,
      "username": "ChessMaster99",
      "rating": 2450,
      "wins": 12
    },
    // Additional players...
  ],
  "user_rank": 42
}
\`\`\`

### Mission Completion Endpoint
\`\`\`
POST /api/missions/progress/:missionId
\`\`\`

**Request Body:**
\`\`\`json
{
  "step_index": 0,
  "completed": true
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "xp_earned": 25,
  "updated_mission": {
    // Updated mission data
  }
}
\`\`\`

### Claim XP Endpoint
\`\`\`
POST /api/missions/claim-xp
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "total_xp_claimed": 150,
  "new_xp_total": 4400,
  "level_up": false
}
\`\`\`

### Claim Battlepass Reward Endpoint
\`\`\`
POST /api/battlepass/claim/:tier
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "reward": {
    "type": "chess_set",
    "id": "inferno-set",
    "name": "Inferno Set",
    "rarity": "Epic",
    "image_url": "/chess-sets/inferno-set-icon.png"
  }
}
\`\`\`

## State Management

### React Context Structure

The Dashboard Home uses several React contexts to manage state:

1. **UserContext**: Manages user profile data
2. **BattlepassContext**: Manages battlepass progress and rewards
3. **MissionsContext**: Manages daily and weekly missions
4. **InventoryContext**: Manages chess sets and other inventory items
5. **LeaderboardContext**: Manages leaderboard data

### Example Context Implementation

\`\`\`typescript
// contexts/MissionsContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';

type Mission = {
  id: string;
  title: string;
  steps: {
    target: number;
    progress: number;
    completed: boolean;
    xp: number;
    special?: string;
  }[];
};

type MissionsContextType = {
  dailyMissions: Mission[];
  weeklyMissions: Mission[];
  loading: boolean;
  error: string | null;
  refreshMissions: () => Promise<void>;
  updateMissionProgress: (missionId: string, stepIndex: number, completed: boolean) => Promise<void>;
  claimXp: () => Promise<number>;
};

const MissionsContext = createContext<MissionsContextType | undefined>(undefined);

export function MissionsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [dailyMissions, setDailyMissions] = useState<Mission[]>([]);
  const [weeklyMissions, setWeeklyMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMissions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${process.env.API_URL}/api/missions`, {
        headers: {
          Authorization: `Bearer ${user?.token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch missions');
      
      const data = await response.json();
      setDailyMissions(data.daily);
      setWeeklyMissions(data.weekly);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshMissions = async () => {
    await fetchMissions();
  };

  const updateMissionProgress = async (missionId: string, stepIndex: number, completed: boolean) => {
    try {
      setError(null);
      
      const response = await fetch(`${process.env.API_URL}/api/missions/progress/${missionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`
        },
        body: JSON.stringify({ step_index: stepIndex, completed })
      });
      
      if (!response.ok) throw new Error('Failed to update mission progress');
      
      const data = await response.json();
      
      // Update local state with the updated mission
      // This would need to determine if it's a daily or weekly mission and update accordingly
      
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const claimXp = async () => {
    try {
      setError(null);
      
      const response = await fetch(`${process.env.API_URL}/api/missions/claim-xp`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user?.token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to claim XP');
      
      const data = await response.json();
      
      // Refresh missions after claiming XP
      await refreshMissions();
      
      return data.total_xp_claimed;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    if (user) {
      fetchMissions();
    }
  }, [user]);

  return (
    <MissionsContext.Provider value={{
      dailyMissions,
      weeklyMissions,
      loading,
      error,
      refreshMissions,
      updateMissionProgress,
      claimXp
    }}>
      {children}
    </MissionsContext.Provider>
  );
}

export function useMissions() {
  const context = useContext(MissionsContext);
  if (context === undefined) {
    throw new Error('useMissions must be used within a MissionsProvider');
  }
  return context;
}
\`\`\`

## Real-time Updates

The Dashboard Home benefits from real-time updates for:

1. **Mission Progress**: When a user completes a game, mission progress should update in real-time
2. **Battlepass Progress**: XP gains should reflect immediately
3. **Leaderboard Changes**: Top player changes should update dynamically

### WebSocket Implementation

\`\`\`typescript
// services/websocket.ts
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initializeSocket = (token: string) => {
  if (socket) {
    socket.disconnect();
  }
  
  socket = io(process.env.WEBSOCKET_URL!, {
    auth: {
      token
    },
    transports: ['websocket']
  });
  
  socket.on('connect', () => {
    console.log('WebSocket connected');
  });
  
  socket.on('disconnect', () => {
    console.log('WebSocket disconnected');
  });
  
  socket.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
  
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error('WebSocket not initialized');
  }
  
  return socket;
};

export const closeSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
\`\`\`

### WebSocket Events

The server should emit the following events:

1. `mission_progress_update`: When mission progress changes
2. `battlepass_progress_update`: When battlepass XP or tier changes
3. `leaderboard_update`: When leaderboard rankings change

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

The Dashboard Home should handle the following error states:

1. **Loading Error**: Display a retry button when data fails to load
2. **Action Error**: Show toast notifications for failed actions (e.g., claiming XP)
3. **Connection Error**: Indicate when real-time updates are unavailable

## Performance Considerations

### Data Fetching Optimization

1. **Parallel Requests**: Fetch independent data in parallel
2. **Caching**: Cache stable data like chess sets
3. **Pagination**: Use pagination for leaderboard data
4. **Incremental Loading**: Load mission details incrementally

### React Optimization

1. **Memoization**: Use `useMemo` and `useCallback` for expensive calculations
2. **Code Splitting**: Lazy load components that aren't immediately visible
3. **Virtualization**: Use virtualized lists for long scrollable content

### Example Implementation

\`\`\`typescript
// hooks/useDashboardData.ts
import { useState, useEffect, useMemo } from 'react';
import { fetchWithErrorHandling } from '../services/api';

export function useDashboardData(userId: string) {
  const [profile, setProfile] = useState(null);
  const [battlepass, setBattlepass] = useState(null);
  const [missions, setMissions] = useState(null);
  const [chessSets, setChessSets] = useState(null);
  const [leaderboard, setLeaderboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all data in parallel
        const [profileRes, battlepassRes, missionsRes, chessSetsRes, leaderboardRes] = await Promise.all([
          fetchWithErrorHandling(`/api/users/profile`),
          fetchWithErrorHandling(`/api/battlepass/current`),
          fetchWithErrorHandling(`/api/missions`),
          fetchWithErrorHandling(`/api/inventory/chess-sets/preview`),
          fetchWithErrorHandling(`/api/leaderboard/preview`)
        ]);
        
        // Parse all responses in parallel
        const [profileData, battlepassData, missionsData, chessSetsData, leaderboardData] = await Promise.all([
          profileRes.json(),
          battlepassRes.json(),
          missionsRes.json(),
          chessSetsRes.json(),
          leaderboardRes.json()
        ]);
        
        setProfile(profileData);
        setBattlepass(battlepassData);
        setMissions(missionsData);
        setChessSets(chessSetsData);
        setLeaderboard(leaderboardData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [userId]);

  // Memoize derived data
  const completedMissions = useMemo(() => {
    if (!missions) return { daily: 0, weekly: 0 };
    
    const dailyCompleted = missions.daily.reduce((total, mission) => {
      const completedSteps = mission.steps.filter(step => step.completed).length;
      return total + completedSteps;
    }, 0);
    
    const weeklyCompleted = missions.weekly.reduce((total, mission) => {
      const completedSteps = mission.steps.filter(step => step.completed).length;
      return total + completedSteps;
    }, 0);
    
    return { daily: dailyCompleted, weekly: weeklyCompleted };
  }, [missions]);

  return {
    profile,
    battlepass,
    missions,
    chessSets,
    leaderboard,
    completedMissions,
    loading,
    error
  };
}
\`\`\`

By following these guidelines, the Dashboard Home will provide a responsive, real-time experience that efficiently communicates with the backend services.
\`\`\`
