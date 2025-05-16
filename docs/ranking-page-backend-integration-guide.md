# Ranking Page - Backend Integration Guide

This document outlines the backend integration requirements for the Everchess Ranking page. It covers API endpoints, data models, state management, and other important considerations for implementing the backend services that power the ranking experience.

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

The Ranking page allows users to:
- View global leaderboards
- See their friends' rankings
- Filter rankings by time period (all-time, season, weekly)
- View detailed player statistics
- Compare their performance with other players

## Data Requirements

The Ranking page requires the following data:

### Global Leaderboard
- Top players by rating
- Win/loss records
- Player avatars and usernames
- Current user's rank

### Friends Leaderboard
- Friends ranked by rating
- Win/loss records
- Player avatars and usernames

### Season Rankings
- Top players for the current season
- Historical season data
- Season rewards and thresholds

## API Endpoints

### Global Leaderboard Endpoint
\`\`\`
GET /api/leaderboard/global?page=1&limit=50
\`\`\`

**Response:**
\`\`\`json
{
  "leaderboard": [
    {
      "rank": 1,
      "user_id": "user123",
      "username": "GrandMaster99",
      "avatar_url": "/profile-avatar.svg",
      "rating": 2450,
      "wins": 152,
      "losses": 43,
      "win_rate": 77.9,
      "country": "US"
    },
    {
      "rank": 2,
      "user_id": "user456",
      "username": "ChessWizard",
      "avatar_url": "/male-avatar.svg",
      "rating": 2380,
      "wins": 130,
      "losses": 52,
      "win_rate": 71.4,
      "country": "DE"
    },
    // Additional players...
  ],
  "pagination": {
    "total": 10000,
    "page": 1,
    "limit": 50,
    "pages": 200
  },
  "user_rank": {
    "rank": 42,
    "rating": 1850,
    "wins": 75,
    "losses": 50,
    "win_rate": 60.0
  }
}
\`\`\`

### Friends Leaderboard Endpoint
\`\`\`
GET /api/leaderboard/friends
\`\`\`

**Response:**
\`\`\`json
{
  "leaderboard": [
    {
      "rank": 1,
      "global_rank": 15,
      "user_id": "friend123",
      "username": "ChessBuddy",
      "avatar_url": "/profile-avatar.svg",
      "rating": 2100,
      "wins": 95,
      "losses": 62,
      "win_rate": 60.5,
      "country": "CA"
    },
    // Additional friends...
  ],
  "user_rank": {
    "rank": 3,
    "global_rank": 42,
    "rating": 1850,
    "wins": 75,
    "losses": 50,
    "win_rate": 60.0
  }
}
\`\`\`

### Season Leaderboard Endpoint
\`\`\`
GET /api/leaderboard/season/:seasonId?page=1&limit=50
\`\`\`

**Response:**
\`\`\`json
{
  "season": {
    "id": 1,
    "name": "Season 1",
    "start_date": "2023-01-01T00:00:00Z",
    "end_date": "2023-03-31T23:59:59Z",
    "status": "completed"
  },
  "leaderboard": [
    {
      "rank": 1,
      "user_id": "user789",
      "username": "SeasonChamp",
      "avatar_url": "/profile-avatar.svg",
      "rating": 2350,
      "wins": 120,
      "losses": 35,
      "win_rate": 77.4,
      "country": "FR"
    },
    // Additional players...
  ],
  "pagination": {
    "total": 8500,
    "page": 1,
    "limit": 50,
    "pages": 170
  },
  "user_rank": {
    "rank": 56,
    "rating": 1800,
    "wins": 65,
    "losses": 45,
    "win_rate": 59.1
  },
  "rewards": [
    {
      "rank_threshold": 1,
      "reward": {
        "type": "chess_set",
        "id": "golden-dynasty",
        "name": "Golden Dynasty",
        "rarity": "Legendary"
      }
    },
    {
      "rank_threshold": 10,
      "reward": {
        "type": "chess_set",
        "id": "crystal-set",
        "name": "Crystal Set",
        "rarity": "Epic"
      }
    },
    {
      "rank_threshold": 100,
      "reward": {
        "type": "gold",
        "amount": 1000
      }
    },
    // Additional rewards...
  ]
}
\`\`\`

### Weekly Leaderboard Endpoint
\`\`\`
GET /api/leaderboard/weekly?page=1&limit=50
\`\`\`

**Response:**
\`\`\`json
{
  "week": {
    "start_date": "2023-06-12T00:00:00Z",
    "end_date": "2023-06-18T23:59:59Z"
  },
  "leaderboard": [
    {
      "rank": 1,
      "user_id": "user321",
      "username": "WeekendWarrior",
      "avatar_url": "/profile-avatar.svg",
      "rating": 2200,
      "wins": 25,
      "losses": 5,
      "win_rate": 83.3,
      "country": "JP"
    },
    // Additional players...
  ],
  "pagination": {
    "total": 5000,
    "page": 1,
    "limit": 50,
    "pages": 100
  },
  "user_rank": {
    "rank": 78,
    "rating": 1750,
    "wins": 12,
    "losses": 8,
    "win_rate": 60.0
  },
  "rewards": [
    {
      "rank_threshold": 1,
      "reward": {
        "type": "gold",
        "amount": 500
      }
    },
    {
      "rank_threshold": 10,
      "reward": {
        "type": "gold",
        "amount": 250
      }
    },
    {
      "rank_threshold": 100,
      "reward": {
        "type": "gold",
        "amount": 100
      }
    }
  ]
}
\`\`\`

### Player Details Endpoint
\`\`\`
GET /api/players/:userId
\`\`\`

**Response:**
\`\`\`json
{
  "user_id": "user123",
  "username": "GrandMaster99",
  "avatar_url": "/profile-avatar.svg",
  "country": "US",
  "joined_date": "2022-12-01T10:15:30Z",
  "stats": {
    "rating": 2450,
    "highest_rating": 2500,
    "wins": 152,
    "losses": 43,
    "draws": 15,
    "win_rate": 77.9,
    "games_played": 210,
    "current_streak": "W5",
    "best_streak": "W12"
  },
  "time_controls": [
    {
      "name": "Blitz (3+2)",
      "rating": 2480,
      "games_played": 120,
      "win_rate": 80.0
    },
    {
      "name": "Rapid (10+5)",
      "rating": 2420,
      "games_played": 75,
      "win_rate": 75.0
    },
    {
      "name": "Classical (30+20)",
      "rating": 2400,
      "games_played": 15,
      "win_rate": 73.3
    }
  ],
  "season_history": [
    {
      "season_id": 1,
      "rank": 3,
      "rating": 2400,
      "games_played": 150,
      "win_rate": 76.0
    },
    // Additional seasons...
  ],
  "achievements": [
    {
      "id": "first-win",
      "name": "First Victory",
      "description": "Win your first game",
      "acquired_at": "2022-12-02T14:30:45Z"
    },
    // Additional achievements...
  ]
}
\`\`\`

## Data Models

### User Stats Model

\`\`\`sql
CREATE TABLE user_stats (
  user_id UUID REFERENCES users(id) PRIMARY KEY,
  rating INTEGER DEFAULT 1000,
  highest_rating INTEGER DEFAULT 1000,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  draws INTEGER DEFAULT 0,
  games_played INTEGER DEFAULT 0,
  current_streak TEXT DEFAULT '0',
  best_streak TEXT DEFAULT '0',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
\`\`\`

### Time Control Stats Model

\`\`\`sql
CREATE TABLE time_control_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) NOT NULL,
  time_control TEXT NOT NULL,
  rating INTEGER DEFAULT 1000,
  highest_rating INTEGER DEFAULT 1000,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  draws INTEGER DEFAULT 0,
  games_played INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id, time_control)
);
\`\`\`

### Season Model

\`\`\`sql
CREATE TABLE seasons (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'upcoming', -- 'upcoming', 'active', 'completed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
\`\`\`

### Season Rankings Model

\`\`\`sql
CREATE TABLE season_rankings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  season_id INTEGER REFERENCES seasons(id) NOT NULL,
  user_id UUID REFERENCES users(id) NOT NULL,
  rank INTEGER,
  rating INTEGER DEFAULT 1000,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  draws INTEGER DEFAULT 0,
  games_played INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(season_id, user_id)
);
\`\`\`

### Weekly Rankings Model

\`\`\`sql
CREATE TABLE weekly_rankings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  week_start DATE NOT NULL,
  user_id UUID REFERENCES users(id) NOT NULL,
  rank INTEGER,
  rating INTEGER DEFAULT 1000,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  draws INTEGER DEFAULT 0,
  games_played INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(week_start, user_id)
);
\`\`\`

### Season Rewards Model

\`\`\`sql
CREATE TABLE season_rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  season_id INTEGER REFERENCES seasons(id) NOT NULL,
  rank_threshold INTEGER NOT NULL,
  reward_type TEXT NOT NULL,
  reward_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(season_id, rank_threshold)
);
\`\`\`

### Weekly Rewards Model

\`\`\`sql
CREATE TABLE weekly_rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  week_start DATE NOT NULL,
  rank_threshold INTEGER NOT NULL,
  reward_type TEXT NOT NULL,
  reward_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(week_start, rank_threshold)
);
\`\`\`

### Friendships Model

\`\`\`sql
CREATE TABLE friendships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) NOT NULL,
  friend_id UUID REFERENCES users(id) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'accepted', 'rejected'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id, friend_id),
  CHECK (user_id != friend_id)
);
\`\`\`

## State Management

### React Context Structure

The Ranking page uses several React contexts to manage state:

1. **LeaderboardContext**: Manages leaderboard data and pagination
2. **PlayerDetailsContext**: Manages detailed player information

### Example Context Implementation

\`\`\`typescript
// contexts/LeaderboardContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';

type LeaderboardEntry = {
  rank: number;
  userId: string;
  username: string;
  avatarUrl: string;
  rating: number;
  wins: number;
  losses: number;
  winRate: number;
  country?: string;
};

type UserRank = {
  rank: number;
  globalRank?: number;
  rating: number;
  wins: number;
  losses: number;
  winRate: number;
};

type Pagination = {
  total: number;
  page: number;
  limit: number;
  pages: number;
};

type LeaderboardContextType = {
  globalLeaderboard: LeaderboardEntry[];
  friendsLeaderboard: LeaderboardEntry[];
  seasonLeaderboard: LeaderboardEntry[];
  weeklyLeaderboard: LeaderboardEntry[];
  userRank: UserRank | null;
  pagination: Pagination;
  loading: boolean;
  error: string | null;
  currentView: 'global' | 'friends' | 'season' | 'weekly';
  currentSeason: number;
  setCurrentView: (view: 'global' | 'friends' | 'season' | 'weekly') => void;
  setCurrentSeason: (seasonId: number) => void;
  setPage: (page: number) => void;
  refreshLeaderboard: () => Promise<void>;
};

const LeaderboardContext = createContext<LeaderboardContextType | undefined>(undefined);

export function LeaderboardProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  
  const [globalLeaderboard, setGlobalLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [friendsLeaderboard, setFriendsLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [seasonLeaderboard, setSeasonLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [weeklyLeaderboard, setWeeklyLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<UserRank | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 50,
    pages: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'global' | 'friends' | 'season' | 'weekly'>('global');
  const [currentSeason, setCurrentSeason] = useState<number>(1);
  
  const fetchGlobalLeaderboard = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${process.env.API_URL}/api/leaderboard/global?page=${page}&limit=${pagination.limit}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch global leaderboard');
      
      const data = await response.json();
      
      setGlobalLeaderboard(data.leaderboard.map((entry: any) => ({
        rank: entry.rank,
        userId: entry.user_id,
        username: entry.username,
        avatarUrl: entry.avatar_url,
        rating: entry.rating,
        wins: entry.wins,
        losses: entry.losses,
        winRate: entry.win_rate,
        country: entry.country
      })));
      
      setUserRank(data.user_rank ? {
        rank: data.user_rank.rank,
        rating: data.user_rank.rating,
        wins: data.user_rank.wins,
        losses: data.user_rank.losses,
        winRate: data.user_rank.win_rate
      } : null);
      
      setPagination({
        total: data.pagination.total,
        page: data.pagination.page,
        limit: data.pagination.limit,
        pages: data.pagination.pages
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchFriendsLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${process.env.API_URL}/api/leaderboard/friends`, {
        headers: {
          Authorization: `Bearer ${user?.token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch friends leaderboard');
      
      const data = await response.json();
      
      setFriendsLeaderboard(data.leaderboard.map((entry: any) => ({
        rank: entry.rank,
        userId: entry.user_id,
        username: entry.username,
        avatarUrl: entry.avatar_url,
        rating: entry.rating,
        wins: entry.wins,
        losses: entry.losses,
        winRate: entry.win_rate,
        country: entry.country
      })));
      
      setUserRank(data.user_rank ? {
        rank: data.user_rank.rank,
        globalRank: data.user_rank.global_rank,
        rating: data.user_rank.rating,
        wins: data.user_rank.wins,
        losses: data.user_rank.losses,
        winRate: data.user_rank.win_rate
      } : null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchSeasonLeaderboard = async (seasonId: number, page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${process.env.API_URL}/api/leaderboard/season/${seasonId}?page=${page}&limit=${pagination.limit}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch season leaderboard');
      
      const data = await response.json();
      
      setSeasonLeaderboard(data.leaderboard.map((entry: any) => ({
        rank: entry.rank,
        userId: entry.user_id,
        username: entry.username,
        avatarUrl: entry.avatar_url,
        rating: entry.rating,
        wins: entry.wins,
        losses: entry.losses,
        winRate: entry.win_rate,
        country: entry.country
      })));
      
      setUserRank(data.user_rank ? {
        rank: data.user_rank.rank,
        rating: data.user_rank.rating,
        wins: data.user_rank.wins,
        losses: data.user_rank.losses,
        winRate: data.user_rank.win_rate
      } : null);
      
      setPagination({
        total: data.pagination.total,
        page: data.pagination.page,
        limit: data.pagination.limit,
        pages: data.pagination.pages
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchWeeklyLeaderboard = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${process.env.API_URL}/api/leaderboard/weekly?page=${page}&limit=${pagination.limit}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch weekly leaderboard');
      
      const data = await response.json();
      
      setWeeklyLeaderboard(data.leaderboard.map((entry: any) => ({
        rank: entry.rank,
        userId: entry.user_id,
        username: entry.username,
        avatarUrl: entry.avatar_url,
        rating: entry.rating,
        wins: entry.wins,
        losses: entry.losses,
        winRate: entry.win_rate,
        country: entry.country
      })));
      
      setUserRank(data.user_rank ? {
        rank: data.user_rank.rank,
        rating: data.user_rank.rating,
        wins: data.user_rank.wins,
        losses: data.user_rank.losses,
        winRate: data.user_rank.win_rate
      } : null);
      
      setPagination({
        total: data.pagination.total,
        page: data.pagination.page,
        limit: data.pagination.limit,
        pages: data.pagination.pages
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const setPage = (page: number) => {
    if (page < 1 || page > pagination.pages) return;
    
    switch (currentView) {
      case 'global':
        fetchGlobalLeaderboard(page);
        break;
      case 'season':
        fetchSeasonLeaderboard(currentSeason, page);
        break;
      case 'weekly':
        fetchWeeklyLeaderboard(page);
        break;
    }
  };
  
  const refreshLeaderboard = async () => {
    switch (currentView) {
      case 'global':
        await fetchGlobalLeaderboard(pagination.page);
        break;
      case 'friends':
        await fetchFriendsLeaderboard();
        break;
      case 'season':
        await fetchSeasonLeaderboard(currentSeason, pagination.page);
        break;
      case 'weekly':
        await fetchWeeklyLeaderboard(pagination.page);
        break;
    }
  };
  
  useEffect(() => {
    if (user) {
      refreshLeaderboard();
    }
  }, [user, currentView, currentSeason]);
  
  return (
    <LeaderboardContext.Provider value={{
      globalLeaderboard,
      friendsLeaderboard,
      seasonLeaderboard,
      weeklyLeaderboard,
      userRank,
      pagination,
      loading,
      error,
      currentView,
      currentSeason,
      setCurrentView,
      setCurrentSeason,
      setPage,
      refreshLeaderboard
    }}>
      {children}
    </LeaderboardContext.Provider>
  );
}

export function useLeaderboard() {
  const context = useContext(LeaderboardContext);
  if (context === undefined) {
    throw new Error('useLeaderboard must be used within a LeaderboardProvider');
  }
  return context;
}
\`\`\`

## Real-time Updates

The Ranking page benefits from real-time updates for:

1. **Rating Changes**: When a user's rating changes after a game
2. **Leaderboard Position**: When a user's position in the leaderboard changes

### WebSocket Events

The server should emit the following events:

1. `leaderboard_update`: When there are significant changes to the leaderboard
2. `rating_update`: When a user's rating changes

### WebSocket Implementation

\`\`\`typescript
// server/websocket/LeaderboardHandler.ts
export class LeaderboardHandler {
  constructor(io: Server) {
    this.setupEventHandlers(io);
  }
  
  private setupEventHandlers(io: Server) {
    // Listen for rating updates
    events.on('rating_updated', async (data: { userId: string, newRating: number, oldRating: number }) => {
      try {
        const { userId, newRating, oldRating } = data;
        
        // Emit update to user
        io.to(userId).emit('rating_update', {
          old_rating: oldRating,
          new_rating: newRating
        });
        
        // Check if user's position in leaderboard changed significantly
        const oldRank = await this.getUserRank(userId, oldRating);
        const newRank = await this.getUserRank(userId, newRating);
        
        if (Math.abs(oldRank - newRank) > 10 || newRank <= 100) {
          // Emit leaderboard update to all users
          io.emit('leaderboard_update', {
            type: 'position_change',
            user_id: userId,
            old_rank: oldRank,
            new_rank: newRank
          });
        }
      } catch (error) {
        console.error('Error handling rating update:', error);
      }
    });
    
    // Listen for season end events
    events.on('season_ended', async (data: { seasonId: number }) => {
      try {
        const { seasonId } = data;
        
        // Emit season end to all users
        io.emit('leaderboard_update', {
          type: 'season_ended',
          season_id: seasonId
        });
      } catch (error) {
        console.error('Error handling season end:', error);
      }
    });
    
    // Listen for weekly reset events
    events.on('weekly_reset', async () => {
      try {
        // Emit weekly reset to all users
        io.emit('leaderboard_update', {
          type: 'weekly_reset'
        });
      } catch (error) {
        console.error('Error handling weekly reset:', error);
      }
    });
  }
  
  private async getUserRank(userId: string, rating: number): Promise<number> {
    try {
      // Get user's rank based on rating
      const { count } = await db.userStats.aggregate({
        _count: {
          user_id: true
        },
        where: {
          rating: {
            gt: rating
          }
        }
      });
      
      return count + 1;
    } catch (error) {
      console.error('Error getting user rank:', error);
      return 0;
    }
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

The Ranking page should handle the following error states:

1. **Loading Error**: Display a retry button when data fails to load
2. **Pagination Error**: Show error message when changing pages fails
3. **Connection Error**: Indicate when real-time updates are unavailable

## Performance Considerations

### Data Fetching Optimization

1. **Pagination**: Implement server-side pagination for leaderboards
2. **Caching**: Cache leaderboard data with a short TTL (time-to-live)
3. **Incremental Loading**: Load player details only when needed
4. **Debouncing**: Debounce pagination requests to prevent excessive API calls

### React Optimization

1. **Memoization**: Use `useMemo` and `useCallback` for expensive calculations
2. **Virtualization**: Use virtualized lists for displaying large leaderboards
3. **Code Splitting**: Lazy load components for different leaderboard views

### Example Implementation

\`\`\`typescript
// hooks/useVirtualizedLeaderboard.ts
import { useState, useCallback } from 'react';
import { useLeaderboard } from '../contexts/LeaderboardContext';

export function useVirtualizedLeaderboard() {
  const { 
    globalLeaderboard, 
    friendsLeaderboard, 
    seasonLeaderboard, 
    weeklyLeaderboard,
    currentView,
    pagination,
    setPage
  } = useLeaderboard();
  
  const [visibleRange, setVisibleRange] = useState({ startIndex: 0, endIndex: 20 });
  
  // Get the current leaderboard based on the view
  const currentLeaderboard = (() => {
    switch (currentView) {
      case 'global':
        return globalLeaderboard;
      case 'friends':
        return friendsLeaderboard;
      case 'season':
        return seasonLeaderboard;
      case 'weekly':
        return weeklyLeaderboard;
      default:
        return globalLeaderboard;
    }
  })();
  
  // Handle scroll events to load more data
  const handleScroll = useCallback((scrollTop: number, clientHeight: number, scrollHeight: number) => {
    // Calculate visible range based on scroll position
    const itemHeight = 60; // Estimated height of each leaderboard item
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(clientHeight / itemHeight),
      currentLeaderboard.length
    );
    
    setVisibleRange({ startIndex, endIndex });
    
    // Check if we need to load the next page
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
    if (scrollPercentage > 0.9 && pagination.page < pagination.pages) {
      setPage(pagination.page + 1);
    }
  }, [currentLeaderboard.length, pagination, setPage]);
  
  // Get only the visible items
  const visibleItems = currentLeaderboard.slice(
    visibleRange.startIndex,
    visibleRange.endIndex
  );
  
  return {
    visibleItems,
    totalItems: currentLeaderboard.length,
    handleScroll
  };
}
\`\`\`

By following these guidelines, the Ranking page will provide a responsive experience that efficiently communicates with the backend services.
