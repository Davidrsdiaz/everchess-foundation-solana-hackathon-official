# Battlepass Page - Backend Integration Guide

This document outlines the backend integration requirements for the Everchess Battlepass page. It covers API endpoints, data models, state management, and other important considerations for implementing the backend services that power the battlepass experience.

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

The Battlepass page allows users to:
- View their current battlepass progress
- See available rewards for free and premium tiers
- Claim rewards for completed tiers
- Complete missions to earn XP
- Purchase premium battlepass

## Data Requirements

The Battlepass page requires the following data:

### Battlepass Data
- Current season information
- User's current tier
- XP progress
- Premium status
- Tier rewards (free and premium)
- Claimed rewards

### Missions Data
- Daily missions (with progress)
- Weekly missions (with progress)
- Completion status
- XP rewards

## API Endpoints

### Current Battlepass Endpoint
\`\`\`
GET /api/battlepass/current
\`\`\`

**Response:**
\`\`\`json
{
  "season": 1,
  "title": "Season 1",
  "start_date": "2023-01-01T00:00:00Z",
  "end_date": "2023-03-31T23:59:59Z",
  "user_progress": {
    "current_tier": 10,
    "max_tier": 100,
    "current_xp": 210,
    "xp_required": 250,
    "premium": false
  }
}
\`\`\`

### Battlepass Tiers Endpoint
\`\`\`
GET /api/battlepass/tiers
\`\`\`

**Response:**
\`\`\`json
{
  "tiers": [
    {
      "tier": 1,
      "free_reward": {
        "type": "gold",
        "amount": 50,
        "claimed": true
      },
      "premium_reward": {
        "type": "gold",
        "amount": 100,
        "claimed": false
      }
    },
    {
      "tier": 2,
      "free_reward": {
        "type": "xp-boost",
        "amount": "5%",
        "claimed": true
      },
      "premium_reward": {
        "type": "gold",
        "amount": 75,
        "claimed": false
      }
    },
    // Additional tiers...
  ]
}
\`\`\`

### Claim Reward Endpoint
\`\`\`
POST /api/battlepass/claim/:tier
\`\`\`

**Request Body:**
\`\`\`json
{
  "reward_type": "free" // or "premium"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "reward": {
    "type": "gold",
    "amount": 50
  },
  "tier": 1
}
\`\`\`

### Claim All Rewards Endpoint
\`\`\`
POST /api/battlepass/claim-all
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "claimed_rewards": [
    {
      "tier": 1,
      "reward": {
        "type": "gold",
        "amount": 50
      }
    },
    {
      "tier": 2,
      "reward": {
        "type": "xp-boost",
        "amount": "5%"
      }
    }
    // Additional claimed rewards...
  ]
}
\`\`\`

### Purchase Premium Endpoint
\`\`\`
POST /api/battlepass/purchase-premium
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "premium": true,
  "unlocked_rewards": [
    {
      "tier": 1,
      "reward": {
        "type": "gold",
        "amount": 100
      }
    },
    // Additional unlocked rewards...
  ]
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
    // Additional daily missions...
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

### Claim XP Endpoint
\`\`\`
POST /api/missions/claim-xp
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "total_xp_claimed": 150,
  "new_xp_total": 360,
  "tier_progress": {
    "previous_tier": 10,
    "current_tier": 10,
    "current_xp": 360,
    "xp_required": 250,
    "level_up": false
  }
}
\`\`\`

## Data Models

### Battlepass Model

\`\`\`sql
CREATE TABLE battlepasses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  season INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
\`\`\`

### Battlepass Tiers Model

\`\`\`sql
CREATE TABLE battlepass_tiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  battlepass_id UUID REFERENCES battlepasses(id) NOT NULL,
  tier_level INTEGER NOT NULL,
  xp_required INTEGER NOT NULL,
  free_reward_type TEXT NOT NULL,
  free_reward_data JSONB NOT NULL,
  premium_reward_type TEXT NOT NULL,
  premium_reward_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(battlepass_id, tier_level)
);
\`\`\`

### User Battlepass Progress Model

\`\`\`sql
CREATE TABLE user_battlepass_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) NOT NULL,
  battlepass_id UUID REFERENCES battlepasses(id) NOT NULL,
  current_tier INTEGER DEFAULT 1,
  current_xp INTEGER DEFAULT 0,
  premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id, battlepass_id)
);
\`\`\`

### Battlepass Rewards Claim Model

\`\`\`sql
CREATE TABLE battlepass_reward_claims (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) NOT NULL,
  battlepass_id UUID REFERENCES battlepasses(id) NOT NULL,
  tier_level INTEGER NOT NULL,
  reward_type TEXT NOT NULL, -- 'free' or 'premium'
  claimed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id, battlepass_id, tier_level, reward_type)
);
\`\`\`

### Missions Model

\`\`\`sql
CREATE TABLE missions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mission_type TEXT NOT NULL, -- 'daily' or 'weekly'
  title TEXT NOT NULL,
  description TEXT,
  steps JSONB NOT NULL, -- Array of step objects with target, xp, etc.
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
\`\`\`

### Mission Progress Model

\`\`\`sql
CREATE TABLE mission_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) NOT NULL,
  mission_id UUID REFERENCES missions(id) NOT NULL,
  progress JSONB NOT NULL, -- Array of progress values for each step
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id, mission_id)
);
\`\`\`

## State Management

### React Context Structure

The Battlepass page uses several React contexts to manage state:

1. **BattlepassContext**: Manages battlepass progress and rewards
2. **MissionsContext**: Manages daily and weekly missions

### Example Context Implementation

\`\`\`typescript
// contexts/BattlepassContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import { useWebSocket } from './WebSocketContext';

type Reward = {
  type: string;
  amount?: number | string;
  name?: string;
  claimed: boolean;
};

type BattlepassTier = {
  tier: number;
  freeReward: Reward;
  premiumReward: Reward;
};

type BattlepassContextType = {
  currentSeason: number;
  currentTier: number;
  maxTier: number;
  xpProgress: number;
  xpRequired: number;
  isPremium: boolean;
  tiers: BattlepassTier[];
  loading: boolean;
  error: string | null;
  refreshBattlepass: () => Promise<void>;
  claimReward: (tier: number, rewardType: 'free' | 'premium') => Promise<void>;
  claimAllRewards: () => Promise<void>;
  purchasePremium: () => Promise<void>;
};

const BattlepassContext = createContext<BattlepassContextType | undefined>(undefined);

export function BattlepassProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { socket, connected } = useWebSocket();
  
  const [currentSeason, setCurrentSeason] = useState(1);
  const [currentTier, setCurrentTier] = useState(1);
  const [maxTier, setMaxTier] = useState(100);
  const [xpProgress, setXpProgress] = useState(0);
  const [xpRequired, setXpRequired] = useState(100);
  const [isPremium, setIsPremium] = useState(false);
  const [tiers, setTiers] = useState<BattlepassTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchBattlepassData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch current battlepass
      const battlepassResponse = await fetch(`${process.env.API_URL}/api/battlepass/current`, {
        headers: {
          Authorization: `Bearer ${user?.token}`
        }
      });
      
      if (!battlepassResponse.ok) throw new Error('Failed to fetch battlepass data');
      
      const battlepassData = await battlepassResponse.json();
      
      setCurrentSeason(battlepassData.season);
      setCurrentTier(battlepassData.user_progress.current_tier);
      setMaxTier(battlepassData.user_progress.max_tier);
      setXpProgress(battlepassData.user_progress.current_xp);
      setXpRequired(battlepassData.user_progress.xp_required);
      setIsPremium(battlepassData.user_progress.premium);
      
      // Fetch battlepass tiers
      const tiersResponse = await fetch(`${process.env.API_URL}/api/battlepass/tiers`, {
        headers: {
          Authorization: `Bearer ${user?.token}`
        }
      });
      
      if (!tiersResponse.ok) throw new Error('Failed to fetch battlepass tiers');
      
      const tiersData = await tiersResponse.json();
      
      // Transform tiers data to match our state structure
      const transformedTiers = tiersData.tiers.map((tier: any) => ({
        tier: tier.tier,
        freeReward: {
          type: tier.free_reward.type,
          amount: tier.free_reward.amount,
          name: tier.free_reward.name,
          claimed: tier.free_reward.claimed
        },
        premiumReward: {
          type: tier.premium_reward.type,
          amount: tier.premium_reward.amount,
          name: tier.premium_reward.name,
          claimed: tier.premium_reward.claimed
        }
      }));
      
      setTiers(transformedTiers);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const refreshBattlepass = async () => {
    await fetchBattlepassData();
  };
  
  const claimReward = async (tier: number, rewardType: 'free' | 'premium') => {
    try {
      setError(null);
      
      const response = await fetch(`${process.env.API_URL}/api/battlepass/claim/${tier}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`
        },
        body: JSON.stringify({ reward_type: rewardType })
      });
      
      if (!response.ok) throw new Error('Failed to claim reward');
      
      const data = await response.json();
      
      // Update local state
      setTiers(prevTiers => {
        return prevTiers.map(t => {
          if (t.tier === tier) {
            if (rewardType === 'free') {
              return {
                ...t,
                freeReward: {
                  ...t.freeReward,
                  claimed: true
                }
              };
            } else {
              return {
                ...t,
                premiumReward: {
                  ...t.premiumReward,
                  claimed: true
                }
              };
            }
          }
          return t;
        });
      });
      
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };
  
  const claimAllRewards = async () => {
    try {
      setError(null);
      
      const response = await fetch(`${process.env.API_URL}/api/battlepass/claim-all`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user?.token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to claim all rewards');
      
      const data = await response.json();
      
      // Update local state
      await refreshBattlepass();
      
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };
  
  const purchasePremium = async () => {
    try {
      setError(null);
      
      const response = await fetch(`${process.env.API_URL}/api/battlepass/purchase-premium`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user?.token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to purchase premium');
      
      const data = await response.json();
      
      setIsPremium(true);
      
      // Update local state with newly unlocked rewards
      await refreshBattlepass();
      
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };
  
  useEffect(() => {
    if (user) {
      fetchBattlepassData();
    }
  }, [user]);
  
  useEffect(() => {
    if (!socket || !connected) return;
    
    // Listen for battlepass updates
    socket.on('battlepass_update', (data) => {
      if (data.type === 'xp_update') {
        setXpProgress(data.current_xp);
        setCurrentTier(data.current_tier);
        
        // If tier changed, refresh all data
        if (data.previous_tier !== data.current_tier) {
          refreshBattlepass();
        }
      } else if (data.type === 'premium_purchased') {
        setIsPremium(true);
        refreshBattlepass();
      } else if (data.type === 'reward_claimed') {
        // Update local state
        setTiers(prevTiers => {
          return prevTiers.map(t => {
            if (t.tier === data.tier) {
              if (data.reward_type === 'free') {
                return {
                  ...t,
                  freeReward: {
                    ...t.freeReward,
                    claimed: true
                  }
                };
              } else {
                return {
                  ...t,
                  premiumReward: {
                    ...t.premiumReward,
                    claimed: true
                  }
                };
              }
            }
            return t;
          });
        });
      }
    });
    
    return () => {
      socket.off('battlepass_update');
    };
  }, [socket, connected]);
  
  return (
    <BattlepassContext.Provider value={{
      currentSeason,
      currentTier,
      maxTier,
      xpProgress,
      xpRequired,
      isPremium,
      tiers,
      loading,
      error,
      refreshBattlepass,
      claimReward,
      claimAllRewards,
      purchasePremium
    }}>
      {children}
    </BattlepassContext.Provider>
  );
}

export function useBattlepass() {
  const context = useContext(BattlepassContext);
  if (context === undefined) {
    throw new Error('useBattlepass must be used within a BattlepassProvider');
  }
  return context;
}
\`\`\`

## Real-time Updates

The Battlepass page benefits from real-time updates for:

1. **XP Progress**: When a user completes a mission or game, XP progress should update in real-time
2. **Tier Advancement**: When a user advances to a new tier
3. **Reward Claims**: When a user claims a reward

### WebSocket Events

The server should emit the following events:

1. `battlepass_update`: Updates on battlepass progress, tier changes, and reward claims
2. `mission_progress_update`: Updates on mission progress

### WebSocket Implementation

\`\`\`typescript
// server/websocket/BattlepassHandler.ts
export class BattlepassHandler {
  constructor(io: Server) {
    this.setupEventHandlers(io);
  }
  
  private setupEventHandlers(io: Server) {
    // Listen for XP updates
    events.on('user_xp_gained', async (data: { userId: string, xpAmount: number }) => {
      try {
        const { userId, xpAmount } = data;
        
        // Get user's current battlepass progress
        const userProgress = await db.userBattlepassProgress.findFirst({
          where: {
            user_id: userId,
            battlepass: {
              start_date: { lte: new Date() },
              end_date: { gte: new Date() }
            }
          },
          include: {
            battlepass: true
          }
        });
        
        if (!userProgress) return;
        
        // Calculate new XP and tier
        const previousTier = userProgress.current_tier;
        let currentXp = userProgress.current_xp + xpAmount;
        let currentTier = userProgress.current_tier;
        
        // Check if user leveled up
        const tierData = await db.battlepassTiers.findMany({
          where: {
            battlepass_id: userProgress.battlepass_id
          },
          orderBy: {
            tier_level: 'asc'
          }
        });
        
        // Find next tier requirements
        while (true) {
          const nextTier = tierData.find(t => t.tier_level === currentTier + 1);
          
          if (!nextTier || currentXp < nextTier.xp_required) {
            break;
          }
          
          currentTier++;
        }
        
        // Update user progress in database
        await db.userBattlepassProgress.update({
          where: { id: userProgress.id },
          data: {
            current_tier: currentTier,
            current_xp: currentXp
          }
        });
        
        // Emit update to user
        io.to(userId).emit('battlepass_update', {
          type: 'xp_update',
          previous_tier: previousTier,
          current_tier: currentTier,
          current_xp: currentXp,
          xp_required: tierData.find(t => t.tier_level === currentTier + 1)?.xp_required || 0
        });
      } catch (error) {
        console.error('Error handling XP update:', error);
      }
    });
    
    // Listen for reward claims
    events.on('reward_claimed', async (data: { userId: string, tier: number, rewardType: string }) => {
      try {
        const { userId, tier, rewardType } = data;
        
        // Emit update to user
        io.to(userId).emit('battlepass_update', {
          type: 'reward_claimed',
          tier,
          reward_type: rewardType
        });
      } catch (error) {
        console.error('Error handling reward claim:', error);
      }
    });
    
    // Listen for premium purchases
    events.on('premium_purchased', async (data: { userId: string }) => {
      try {
        const { userId } = data;
        
        // Emit update to user
        io.to(userId).emit('battlepass_update', {
          type: 'premium_purchased'
        });
      } catch (error) {
        console.error('Error handling premium purchase:', error);
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

The Battlepass page should handle the following error states:

1. **Loading Error**: Display a retry button when data fails to load
2. **Action Error**: Show toast notifications for failed actions (e.g., claiming rewards)
3. **Connection Error**: Indicate when real-time updates are unavailable

## Performance Considerations

### Data Fetching Optimization

1. **Parallel Requests**: Fetch battlepass and missions data in parallel
2. **Caching**: Cache stable data like tier requirements
3. **Pagination**: Load tier data in chunks (e.g., 10 tiers at a time)
4. **Incremental Loading**: Load detailed reward information only when needed

### React Optimization

1. **Memoization**: Use `useMemo` and `useCallback` for expensive calculations
2. **Virtualization**: Use virtualized lists for displaying many tiers
3. **Lazy Loading**: Load reward images only when they come into view

### Example Implementation

\`\`\`typescript
// hooks/useBattlepassData.ts
import { useState, useEffect, useMemo } from 'react';
import { fetchWithErrorHandling } from '../services/api';

export function useBattlepassData(userId: string) {
  const [battlepass, setBattlepass] = useState(null);
  const [tiers, setTiers] = useState([]);
  const [visibleTierRange, setVisibleTierRange] = useState({ start: 1, end: 10 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch battlepass data
  useEffect(() => {
    const fetchBattlepassData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetchWithErrorHandling(`/api/battlepass/current`);
        const data = await response.json();
        
        setBattlepass(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBattlepassData();
  }, [userId]);

  // Fetch visible tiers
  useEffect(() => {
    const fetchVisibleTiers = async () => {
      try {
        if (!battlepass) return;
        
        const response = await fetchWithErrorHandling(
          `/api/battlepass/tiers?start=${visibleTierRange.start}&end=${visibleTierRange.end}`
        );
        
        const data = await response.json();
        
        setTiers(prevTiers => {
          // Merge new tiers with existing ones
          const newTiers = [...prevTiers];
          
          data.tiers.forEach((tier: any) => {
            const index = newTiers.findIndex(t => t.tier === tier.tier);
            
            if (index !== -1) {
              newTiers[index] = tier;
            } else {
              newTiers.push(tier);
            }
          });
          
          return newTiers.sort((a, b) => a.tier - b.tier);
        });
      } catch (err: any) {
        setError(err.message);
      }
    };
    
    fetchVisibleTiers();
  }, [battlepass, visibleTierRange]);

  // Handle tier visibility changes (e.g., from scrolling)
  const updateVisibleTierRange = (start: number, end: number) => {
    setVisibleTierRange({ start, end });
  };

  // Memoize computed values
  const currentTierProgress = useMemo(() => {
    if (!battlepass) return 0;
    
    const { current_xp, xp_required } = battlepass.user_progress;
    return (current_xp / xp_required) * 100;
  }, [battlepass]);

  const unclaimedRewards = useMemo(() => {
    if (!tiers.length) return 0;
    
    return tiers.reduce((count, tier) => {
      if (tier.tier <= battlepass?.user_progress.current_tier) {
        if (!tier.free_reward.claimed) count++;
        if (battlepass?.user_progress.premium && !tier.premium_reward.claimed) count++;
      }
      return count;
    }, 0);
  }, [tiers, battlepass]);

  return {
    battlepass,
    tiers,
    loading,
    error,
    currentTierProgress,
    unclaimedRewards,
    updateVisibleTierRange
  };
}
\`\`\`

By following these guidelines, the Battlepass page will provide a responsive, real-time experience that efficiently communicates with the backend services.
