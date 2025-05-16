# Everchess Dashboard - Backend Integration Guide

This document outlines the steps required to integrate the Everchess dashboard frontend with a production backend. It covers API endpoints, data models, state management, authentication, and other important considerations, specifically tailored for your tech stack:

- Expo + React Native (Frontend)
- Node.js + Express.js + Websocket.io (Backend)
- Supabase (Database)

## Table of Contents

1. [Overview](#overview)
2. [Authentication & Authorization](#authentication--authorization)
3. [API Endpoints](#api-endpoints)
4. [Data Models](#data-models)
5. [State Management](#state-management)
6. [Real-time Updates](#real-time-updates)
7. [Error Handling](#error-handling)
8. [Performance Optimization](#performance-optimization)
9. [Testing](#testing)
10. [Deployment](#deployment)

## Overview

The Everchess dashboard requires integration with several backend services to function properly:

- User authentication and profile management
- Mission and XP tracking
- Battlepass progression
- Game mode selection and matchmaking
- Chess set inventory
- Leaderboard data

## Authentication & Authorization

### Implementation Steps

1. **Set up Supabase authentication**:
   \`\`\`typescript
   // lib/supabase.ts
   import { createClient } from '@supabase/supabase-js'
   
   const supabaseUrl = process.env.SUPABASE_URL!
   const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!
   
   export const supabase = createClient(supabaseUrl, supabaseAnonKey)
   \`\`\`

2. **Create authentication context in React Native**:
   \`\`\`typescript
   // contexts/AuthContext.tsx
   import React, { createContext, useState, useEffect, useContext } from 'react'
   import { supabase } from '../lib/supabase'
   import { Session, User } from '@supabase/supabase-js'
   
   type AuthContextType = {
     session: Session | null
     user: User | null
     loading: boolean
     signIn: (email: string, password: string) => Promise<void>
     signUp: (email: string, password: string) => Promise<void>
     signOut: () => Promise<void>
   }
   
   const AuthContext = createContext<AuthContextType | undefined>(undefined)
   
   export function AuthProvider({ children }: { children: React.ReactNode }) {
     const [session, setSession] = useState<Session | null>(null)
     const [user, setUser] = useState<User | null>(null)
     const [loading, setLoading] = useState(true)
   
     useEffect(() => {
       // Check for active session
       supabase.auth.getSession().then(({ data: { session } }) => {
         setSession(session)
         setUser(session?.user ?? null)
         setLoading(false)
       })
   
       // Listen for auth changes
       const { data: { subscription } } = supabase.auth.onAuthStateChange(
         (_event, session) => {
           setSession(session)
           setUser(session?.user ?? null)
         }
       )
   
       return () => subscription.unsubscribe()
     }, [])
   
     const signIn = async (email: string, password: string) => {
       const { error } = await supabase.auth.signInWithPassword({ email, password })
       if (error) throw error
     }
   
     const signUp = async (email: string, password: string) => {
       const { error } = await supabase.auth.signUp({ email, password })
       if (error) throw error
     }
   
     const signOut = async () => {
       const { error } = await supabase.auth.signOut()
       if (error) throw error
     }
   
     return (
       <AuthContext.Provider value={{ session, user, loading, signIn, signUp, signOut }}>
         {children}
       </AuthContext.Provider>
     )
   }
   
   export function useAuth() {
     const context = useContext(AuthContext)
     if (context === undefined) {
       throw new Error('useAuth must be used within an AuthProvider')
     }
     return context
   }
   \`\`\`

3. **Create protected routes in React Native**:
   \`\`\`typescript
   // components/ProtectedRoute.tsx
   import React from 'react'
   import { View, ActivityIndicator } from 'react-native'
   import { useAuth } from '../contexts/AuthContext'
   import LoginScreen from '../screens/LoginScreen'
   
   export function ProtectedRoute({ children }: { children: React.ReactNode }) {
     const { user, loading } = useAuth()
   
     if (loading) {
       return (
         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
           <ActivityIndicator size="large" color="#6366F1" />
         </View>
       )
     }
   
     if (!user) {
       return <LoginScreen />
     }
   
     return <>{children}</>
   }
   \`\`\`

4. **Set up JWT validation in Express.js**:
   \`\`\`typescript
   // server/middleware/auth.ts
   import { Request, Response, NextFunction } from 'express'
   import { createClient } from '@supabase/supabase-js'
   
   const supabaseUrl = process.env.SUPABASE_URL!
   const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!
   
   const supabase = createClient(supabaseUrl, supabaseServiceKey)
   
   export interface AuthenticatedRequest extends Request {
     user?: any
   }
   
   export async function authMiddleware(
     req: AuthenticatedRequest,
     res: Response,
     next: NextFunction
   ) {
     const token = req.headers.authorization?.split(' ')[1]
   
     if (!token) {
       return res.status(401).json({ error: 'No token provided' })
     }
   
     try {
       const { data, error } = await supabase.auth.getUser(token)
   
       if (error || !data.user) {
         return res.status(401).json({ error: 'Invalid token' })
       }
   
       req.user = data.user
       next()
     } catch (error) {
       return res.status(401).json({ error: 'Invalid token' })
     }
   }
   \`\`\`

## API Endpoints

### Express.js Routes

1. **Set up Express.js server**:
   \`\`\`typescript
   // server/index.ts
   import express from 'express'
   import cors from 'cors'
   import helmet from 'helmet'
   import { createServer } from 'http'
   import { Server } from 'socket.io'
   import { authMiddleware } from './middleware/auth'
   import userRoutes from './routes/users'
   import missionRoutes from './routes/missions'
   import battlepassRoutes from './routes/battlepass'
   import matchmakingRoutes from './routes/matchmaking'
   import inventoryRoutes from './routes/inventory'
   import leaderboardRoutes from './routes/leaderboard'
   
   const app = express()
   const httpServer = createServer(app)
   const io = new Server(httpServer, {
     cors: {
       origin: process.env.CLIENT_URL,
       methods: ['GET', 'POST']
     }
   })
   
   // Middleware
   app.use(cors())
   app.use(helmet())
   app.use(express.json())
   
   // Routes
   app.use('/api/users', userRoutes)
   app.use('/api/missions', authMiddleware, missionRoutes)
   app.use('/api/battlepass', authMiddleware, battlepassRoutes)
   app.use('/api/matchmaking', authMiddleware, matchmakingRoutes)
   app.use('/api/inventory', authMiddleware, inventoryRoutes)
   app.use('/api/leaderboard', leaderboardRoutes)
   
   // WebSocket setup
   io.on('connection', (socket) => {
     console.log('User connected:', socket.id)
     
     socket.on('join-room', (userId) => {
       socket.join(userId)
       console.log(`User ${userId} joined their room`)
     })
     
     socket.on('disconnect', () => {
       console.log('User disconnected:', socket.id)
     })
   })
   
   const PORT = process.env.PORT || 3001
   
   httpServer.listen(PORT, () => {
     console.log(`Server running on port ${PORT}`)
   })
   \`\`\`

2. **Create user routes**:
   \`\`\`typescript
   // server/routes/users.ts
   import express from 'express'
   import { createClient } from '@supabase/supabase-js'
   import { authMiddleware, AuthenticatedRequest } from '../middleware/auth'
   
   const router = express.Router()
   
   const supabaseUrl = process.env.SUPABASE_URL!
   const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!
   
   const supabase = createClient(supabaseUrl, supabaseServiceKey)
   
   // Get user profile
   router.get('/profile', authMiddleware, async (req: AuthenticatedRequest, res) => {
     try {
       const { data, error } = await supabase
         .from('profiles')
         .select('*')
         .eq('id', req.user.id)
         .single()
   
       if (error) throw error
   
       res.json(data)
     } catch (error: any) {
       res.status(500).json({ error: error.message })
     }
   })
   
   // Update user profile
   router.put('/profile', authMiddleware, async (req: AuthenticatedRequest, res) => {
     try {
       const { username, avatar_url } = req.body
   
       const { data, error } = await supabase
         .from('profiles')
         .update({ username, avatar_url, updated_at: new Date() })
         .eq('id', req.user.id)
         .select()
         .single()
   
       if (error) throw error
   
       res.json(data)
     } catch (error: any) {
       res.status(500).json({ error: error.message })
     }
   })
   
   export default router
   \`\`\`

3. **Create mission routes**:
   \`\`\`typescript
   // server/routes/missions.ts
   import express from 'express'
   import { createClient } from '@supabase/supabase-js'
   import { authMiddleware, AuthenticatedRequest } from '../middleware/auth'
   
   const router = express.Router()
   
   const supabaseUrl = process.env.SUPABASE_URL!
   const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!
   
   const supabase = createClient(supabaseUrl, supabaseServiceKey)
   
   // Get all missions
   router.get('/', async (req: AuthenticatedRequest, res) => {
     try {
       const { data, error } = await supabase
         .from('missions')
         .select('*')
         .order('created_at', { ascending: false })
   
       if (error) throw error
   
       res.json(data)
     } catch (error: any) {
       res.status(500).json({ error: error.message })
     }
   })
   
   // Get user mission progress
   router.get('/progress', async (req: AuthenticatedRequest, res) => {
     try {
       const { data, error } = await supabase
         .from('mission_progress')
         .select('*, mission_id(*)')
         .eq('user_id', req.user.id)
   
       if (error) throw error
   
       res.json(data)
     } catch (error: any) {
       res.status(500).json({ error: error.message })
     }
   })
   
   // Update mission progress
   router.post('/progress/:missionId', async (req: AuthenticatedRequest, res) => {
     try {
       const { missionId } = req.params
       const { progress, completed } = req.body
   
       // Check if progress entry exists
       const { data: existingProgress, error: fetchError } = await supabase
         .from('mission_progress')
         .select('*')
         .eq('user_id', req.user.id)
         .eq('mission_id', missionId)
         .single()
   
       if (fetchError && fetchError.code !== 'PGRST116') throw fetchError
   
       let result
   
       if (existingProgress) {
         // Update existing progress
         const { data, error } = await supabase
           .from('mission_progress')
           .update({ progress, completed, updated_at: new Date() })
           .eq('id', existingProgress.id)
           .select()
           .single()
   
         if (error) throw error
         result = data
       } else {
         // Create new progress entry
         const { data, error } = await supabase
           .from('mission_progress')
           .insert({
             user_id: req.user.id,
             mission_id: missionId,
             progress,
             completed,
           })
           .select()
           .single()
   
         if (error) throw error
         result = data
       }
   
       // If mission is completed, award XP
       if (completed) {
         const { data: mission } = await supabase
           .from('missions')
           .select('xp_reward')
           .eq('id', missionId)
           .single()
   
         if (mission) {
           await supabase.rpc('add_user_xp', {
             user_id: req.user.id,
             xp_amount: mission.xp_reward
           })
         }
       }
   
       res.json(result)
     } catch (error: any) {
       res.status(500).json({ error: error.message })
     }
   })
   
   export default router
   \`\`\`

4. **Create battlepass routes**:
   \`\`\`typescript
   // server/routes/battlepass.ts
   import express from 'express'
   import { createClient } from '@supabase/supabase-js'
   import { authMiddleware, AuthenticatedRequest } from '../middleware/auth'
   
   const router = express.Router()
   
   const supabaseUrl = process.env.SUPABASE_URL!
   const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!
   
   const supabase = createClient(supabaseUrl, supabaseServiceKey)
   
   // Get current battlepass
   router.get('/current', async (_req, res) => {
     try {
       const now = new Date()
       
       const { data, error } = await supabase
         .from('battlepasses')
         .select('*')
         .lte('start_date', now.toISOString())
         .gte('end_date', now.toISOString())
         .single()
   
       if (error) throw error
   
       res.json(data)
     } catch (error: any) {
       res.status(500).json({ error: error.message })
     }
   })
   
   // Get battlepass tiers
   router.get('/:battlepassId/tiers', async (req, res) => {
     try {
       const { battlepassId } = req.params
       
       const { data, error } = await supabase
         .from('battlepass_tiers')
         .select('*')
         .eq('battlepass_id', battlepassId)
         .order('tier_level', { ascending: true })
   
       if (error) throw error
   
       res.json(data)
     } catch (error: any) {
       res.status(500).json({ error: error.message })
     }
   })
   
   // Get user battlepass progress
   router.get('/progress', authMiddleware, async (req: AuthenticatedRequest, res) => {
     try {
       const now = new Date()
       
       // Get current battlepass
       const { data: battlepass, error: bpError } = await supabase
         .from('battlepasses')
         .select('id')
         .lte('start_date', now.toISOString())
         .gte('end_date', now.toISOString())
         .single()
   
       if (bpError) throw bpError
   
       // Get user progress
       const { data, error } = await supabase
         .from('user_battlepass')
         .select('*')
         .eq('user_id', req.user.id)
         .eq('battlepass_id', battlepass.id)
         .single()
   
       if (error && error.code !== 'PGRST116') throw error
   
       // If no progress found, create initial progress
       if (!data) {
         const { data: newProgress, error: insertError } = await supabase
           .from('user_battlepass')
           .insert({
             user_id: req.user.id,
             battlepass_id: battlepass.id,
             current_tier: 1,
             current_xp: 0,
           })
           .select()
           .single()
   
         if (insertError) throw insertError
   
         res.json(newProgress)
       } else {
         res.json(data)
       }
     } catch (error: any) {
       res.status(500).json({ error: error.message })
     }
   })
   
   // Claim battlepass reward
   router.post('/claim/:tierId', authMiddleware, async (req: AuthenticatedRequest, res) => {
     try {
       const { tierId } = req.params
       
       // Check if tier exists
       const { data: tier, error: tierError } = await supabase
         .from('battlepass_tiers')
         .select('*')
         .eq('id', tierId)
         .single()
   
       if (tierError) throw tierError
   
       // Check if user has reached this tier
       const now = new Date()
       
       const { data: battlepass } = await supabase
         .from('battlepasses')
         .select('id')
         .lte('start_date', now.toISOString())
         .gte('end_date', now.toISOString())
         .single()
   
       const { data: userProgress } = await supabase
         .from('user_battlepass')
         .select('current_tier')
         .eq('user_id', req.user.id)
         .eq('battlepass_id', battlepass.id)
         .single()
   
       if (userProgress.current_tier < tier.tier_level) {
         return res.status(400).json({ error: 'Tier not yet reached' })
       }
   
       // Check if reward already claimed
       const { data: existingClaim, error: claimError } = await supabase
         .from('battlepass_claims')
         .select('*')
         .eq('user_id', req.user.id)
         .eq('tier_id', tierId)
         .single()
   
       if (claimError && claimError.code !== 'PGRST116') throw claimError
   
       if (existingClaim) {
         return res.status(400).json({ error: 'Reward already claimed' })
       }
   
       // Record the claim
       const { data: claim, error } = await supabase
         .from('battlepass_claims')
         .insert({
           user_id: req.user.id,
           tier_id: tierId,
           claimed_at: new Date(),
         })
         .select()
         .single()
   
       if (error) throw error
   
       // Add reward to user inventory if it's an item
       if (tier.reward_type === 'item') {
         await supabase
           .from('user_inventory')
           .insert({
             user_id: req.user.id,
             item_id: tier.reward_id,
             acquired_at: new Date(),
           })
       }
   
       res.json(claim)
     } catch (error: any) {
       res.status(500).json({ error: error.message })
     }
   })
   
   export default router
   \`\`\`

5. **Create matchmaking routes**:
   \`\`\`typescript
   // server/routes/matchmaking.ts
   import express from 'express'
   import { Server } from 'socket.io'
   import { authMiddleware, AuthenticatedRequest } from '../middleware/auth'
   
   const router = express.Router()
   
   // Queue for matchmaking
   const queue: { userId: string; rating: number; timestamp: Date }[] = []
   
   // Initialize with io instance
   let io: Server
   
   export const initMatchmaking = (socketIo: Server) => {
     io = socketIo
     
     // Process matchmaking queue every 5 seconds
     setInterval(processMatchmakingQueue, 5000)
   }
   
   // Join matchmaking queue
   router.post('/join', authMiddleware, async (req: AuthenticatedRequest, res) => {
     try {
       const userId = req.user.id
       const { rating } = req.body
       
       // Remove user from queue if already in it
       const existingIndex = queue.findIndex(entry => entry.userId === userId)
       if (existingIndex !== -1) {
         queue.splice(existingIndex, 1)
       }
       
       // Add user to queue
       queue.push({
         userId,
         rating: rating || 1000, // Default rating
         timestamp: new Date()
       })
       
       res.json({ success: true, message: 'Joined matchmaking queue' })
     } catch (error: any) {
       res.status(500).json({ error: error.message })
     }
   })
   
   // Leave matchmaking queue
   router.post('/leave', authMiddleware, async (req: AuthenticatedRequest, res) => {
     try {
       const userId = req.user.id
       
       // Remove user from queue
       const existingIndex = queue.findIndex(entry => entry.userId === userId)
       if (existingIndex !== -1) {
         queue.splice(existingIndex, 1)
       }
       
       res.json({ success: true, message: 'Left matchmaking queue' })
     } catch (error: any) {
       res.status(500).json({ error: error.message })
     }
   })
   
   // Process matchmaking queue
   function processMatchmakingQueue() {
     if (queue.length < 2) return
     
     // Sort by timestamp (oldest first)
     queue.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
     
     // Find matches based on rating
     for (let i = 0; i < queue.length - 1; i++) {
       const player1 = queue[i]
       
       // Find closest rating match
       let bestMatchIndex = i + 1
       let minRatingDiff = Math.abs(player1.rating - queue[i + 1].rating)
       
       for (let j = i + 2; j < queue.length; j++) {
         const ratingDiff = Math.abs(player1.rating - queue[j].rating)
         if (ratingDiff < minRatingDiff) {
           minRatingDiff = ratingDiff
           bestMatchIndex = j
         }
       }
       
       const player2 = queue[bestMatchIndex]
       
       // Create match if rating difference is acceptable or wait time is long
       const waitTimeMinutes = (new Date().getTime() - player1.timestamp.getTime()) / 60000
       
       if (minRatingDiff < 200 || waitTimeMinutes > 2) {
         // Create game session
         const gameId = `game_${Date.now()}_${Math.floor(Math.random() * 1000)}`
         
         // Notify players
         io.to(player1.userId).emit('match_found', { gameId })
         io.to(player2.userId).emit('match_found', { gameId })
         
         // Remove players from queue
         queue.splice(bestMatchIndex, 1)
         queue.splice(i, 1)
         
         // Adjust i to account for removed players
         i--
       }
     }
   }
   
   export default router
   \`\`\`

6. **Create inventory routes**:
   \`\`\`typescript
   // server/routes/inventory.ts
   import express from 'express'
   import { createClient } from '@supabase/supabase-js'
   import { authMiddleware, AuthenticatedRequest } from '../middleware/auth'
   
   const router = express.Router()
   
   const supabaseUrl = process.env.SUPABASE_URL!
   const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!
   
   const supabase = createClient(supabaseUrl, supabaseServiceKey)
   
   // Get user inventory
   router.get('/', authMiddleware, async (req: AuthenticatedRequest, res) => {
     try {
       const { data, error } = await supabase
         .from('user_inventory')
         .select('*, item:item_id(*)')
         .eq('user_id', req.user.id)
   
       if (error) throw error
   
       res.json(data)
     } catch (error: any) {
       res.status(500).json({ error: error.message })
     }
   })
   
   // Equip item
   router.post('/equip/:itemId', authMiddleware, async (req: AuthenticatedRequest, res) => {
     try {
       const { itemId } = req.params
       const { slot } = req.body
       
       // Get item details
       const { data: item, error: itemError } = await supabase
         .from('items')
         .select('type')
         .eq('id', itemId)
         .single()
   
       if (itemError) throw itemError
       
       // Verify user owns the item
       const { data: inventory, error: invError } = await supabase
         .from('user_inventory')
         .select('id')
         .eq('user_id', req.user.id)
         .eq('item_id', itemId)
         .single()
   
       if (invError) throw invError
       
       // Unequip any item in the same slot
       await supabase
         .from('user_equipped_items')
         .delete()
         .eq('user_id', req.user.id)
         .eq('slot', slot)
       
       // Equip new item
       const { data, error } = await supabase
         .from('user_equipped_items')
         .insert({
           user_id: req.user.id,
           item_id: itemId,
           slot,
           equipped_at: new Date(),
         })
         .select()
         .single()
   
       if (error) throw error
   
       res.json(data)
     } catch (error: any) {
       res.status(500).json({ error: error.message })
     }
   })
   
   // Unequip item
   router.post('/unequip/:slot', authMiddleware, async (req: AuthenticatedRequest, res) => {
     try {
       const { slot } = req.params
       
       const { data, error } = await supabase
         .from('user_equipped_items')
         .delete()
         .eq('user_id', req.user.id)
         .eq('slot', slot)
         .select()
   
       if (error) throw error
   
       res.json({ success: true })
     } catch (error: any) {
       res.status(500).json({ error: error.message })
     }
   })
   
   // Get equipped items
   router.get('/equipped', authMiddleware, async (req: AuthenticatedRequest, res) => {
     try {
       const { data, error } = await supabase
         .from('user_equipped_items')
         .select('*, item:item_id(*)')
         .eq('user_id', req.user.id)
   
       if (error) throw error
   
       res.json(data)
     } catch (error: any) {
       res.status(500).json({ error: error.message })
     }
   })
   
   export default router
   \`\`\`

7. **Create leaderboard routes**:
   \`\`\`typescript
   // server/routes/leaderboard.ts
   import express from 'express'
   import { createClient } from '@supabase/supabase-js'
   
   const router = express.Router()
   
   const supabaseUrl = process.env.SUPABASE_URL!
   const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!
   
   const supabase = createClient(supabaseUrl, supabaseServiceKey)
   
   // Get global leaderboard
   router.get('/global', async (req, res) => {
     try {
       const limit = parseInt(req.query.limit as string) || 100
       const offset = parseInt(req.query.offset as string) || 0
       
       const { data, error } = await supabase
         .from('profiles')
         .select('id, username, avatar_url, rating, wins, losses')
         .order('rating', { ascending: false })
         .range(offset, offset + limit - 1)
   
       if (error) throw error
   
       res.json(data)
     } catch (error: any) {
       res.status(500).json({ error: error.message })
     }
   })
   
   // Get friends leaderboard
   router.get('/friends/:userId', async (req, res) => {
     try {
       const { userId } = req.params
       
       // Get user's friends
       const { data: friends, error: friendsError } = await supabase
         .from('friendships')
         .select('friend_id')
         .eq('user_id', userId)
         .eq('status', 'accepted')
   
       if (friendsError) throw friendsError
       
       if (!friends || friends.length === 0) {
         return res.json([])
       }
       
       const friendIds = friends.map(f => f.friend_id)
       
       // Add the user themselves to the list
       friendIds.push(userId)
       
       // Get profiles for all friends
       const { data, error } = await supabase
         .from('profiles')
         .select('id, username, avatar_url, rating, wins, losses')
         .in('id', friendIds)
         .order('rating', { ascending: false })
   
       if (error) throw error
   
       res.json(data)
     } catch (error: any) {
       res.status(500).json({ error: error.message })
     }
   })
   
   export default router
   \`\`\`

## Data Models

### Supabase Schema

1. **Create profiles table**:
   \`\`\`sql
   CREATE TABLE profiles (
     id UUID REFERENCES auth.users(id) PRIMARY KEY,
     username TEXT UNIQUE NOT NULL,
     avatar_url TEXT,
     rating INTEGER DEFAULT 1000,
     wins INTEGER DEFAULT 0,
     losses INTEGER DEFAULT 0,
     xp INTEGER DEFAULT 0,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
   );
   \`\`\`

2. **Create missions table**:
   \`\`\`sql
   CREATE TABLE missions (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     title TEXT NOT NULL,
     description TEXT NOT NULL,
     target_value INTEGER NOT NULL,
     xp_reward INTEGER NOT NULL,
     mission_type TEXT NOT NULL,
     is_active BOOLEAN DEFAULT TRUE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
   );
   \`\`\`

3. **Create mission_progress table**:
   \`\`\`sql
   CREATE TABLE mission_progress (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id UUID REFERENCES profiles(id) NOT NULL,
     mission_id UUID REFERENCES missions(id) NOT NULL,
     progress INTEGER DEFAULT 0,
     completed BOOLEAN DEFAULT FALSE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
     UNIQUE(user_id, mission_id)
   );
   \`\`\`

4. **Create battlepasses table**:
   \`\`\`sql
   CREATE TABLE battlepasses (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     title TEXT NOT NULL,
     description TEXT,
     start_date TIMESTAMP WITH TIME ZONE NOT NULL,
     end_date TIMESTAMP WITH TIME ZONE NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
   );
   \`\`\`

5. **Create battlepass_tiers table**:
   \`\`\`sql
   CREATE TABLE battlepass_tiers (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     battlepass_id UUID REFERENCES battlepasses(id) NOT NULL,
     tier_level INTEGER NOT NULL,
     xp_required INTEGER NOT NULL,
     reward_type TEXT NOT NULL,
     reward_id UUID,
     reward_amount INTEGER DEFAULT 1,
     is_premium BOOLEAN DEFAULT FALSE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
     UNIQUE(battlepass_id, tier_level)
   );
   \`\`\`

6. **Create user_battlepass table**:
   \`\`\`sql
   CREATE TABLE user_battlepass (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id UUID REFERENCES profiles(id) NOT NULL,
     battlepass_id UUID REFERENCES battlepasses(id) NOT NULL,
     current_tier INTEGER DEFAULT 1,
     current_xp INTEGER DEFAULT 0,
     premium_purchased BOOLEAN DEFAULT FALSE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
     UNIQUE(user_id, battlepass_id)
   );
   \`\`\`

7. **Create battlepass_claims table**:
   \`\`\`sql
   CREATE TABLE battlepass_claims (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id UUID REFERENCES profiles(id) NOT NULL,
     tier_id UUID REFERENCES battlepass_tiers(id) NOT NULL,
     claimed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
     UNIQUE(user_id, tier_id)
   );
   \`\`\`

8. **Create items table**:
   \`\`\`sql
   CREATE TABLE items (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     name TEXT NOT NULL,
     description TEXT,
     type TEXT NOT NULL,
     rarity TEXT NOT NULL,
     image_url TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
   );
   \`\`\`

9. **Create user_inventory table**:
   \`\`\`sql
   CREATE TABLE user_inventory (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id UUID REFERENCES profiles(id) NOT NULL,
     item_id UUID REFERENCES items(id) NOT NULL,
     acquired_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
     UNIQUE(user_id, item_id)
   );
   \`\`\`

10. **Create user_equipped_items table**:
    \`\`\`sql
    CREATE TABLE user_equipped_items (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID REFERENCES profiles(id) NOT NULL,
      item_id UUID REFERENCES items(id) NOT NULL,
      slot TEXT NOT NULL,
      equipped_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
      UNIQUE(user_id, slot)
    );
    \`\`\`

11. **Create friendships table**:
    \`\`\`sql
    CREATE TABLE friendships (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID REFERENCES profiles(id) NOT NULL,
      friend_id UUID REFERENCES profiles(id) NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
      UNIQUE(user_id, friend_id),
      CHECK (user_id != friend_id)
    );
    \`\`\`

12. **Create stored procedure for adding XP**:
    \`\`\`sql
    CREATE OR REPLACE FUNCTION add_user_xp(user_id UUID, xp_amount INTEGER)
    RETURNS VOID AS $$
    DECLARE
      current_battlepass_id UUID;
      user_bp_record RECORD;
      next_tier_record RECORD;
    BEGIN
      -- Update user XP
      UPDATE profiles
      SET xp = xp + xp_amount
      WHERE id = user_id;
      
      -- Get current battlepass
      SELECT id INTO current_battlepass_id
      FROM battlepasses
      WHERE start_date <= NOW() AND end_date >= NOW()
      LIMIT 1;
      
      IF current_battlepass_id IS NULL THEN
        RETURN;
      END IF;
      
      -- Get user battlepass record
      SELECT * INTO user_bp_record
      FROM user_battlepass
      WHERE user_id = add_user_xp.user_id AND battlepass_id = current_battlepass_id;
      
      IF user_bp_record IS NULL THEN
        -- Create initial record
        INSERT INTO user_battlepass (user_id, battlepass_id, current_tier, current_xp)
        VALUES (add_user_xp.user_id, current_battlepass_id, 1, xp_amount);
      ELSE
        -- Update XP
        UPDATE user_battlepass
        SET current_xp = current_xp + xp_amount
        WHERE id = user_bp_record.id;
        
        -- Check for tier up
        SELECT * INTO next_tier_record
        FROM battlepass_tiers
        WHERE battlepass_id = current_battlepass_id AND tier_level = user_bp_record.current_tier + 1;
        
        IF next_tier_record IS NOT NULL AND (user_bp_record.current_xp + xp_amount) >= next_tier_record.xp_required THEN
          -- Tier up
          UPDATE user_battlepass
          SET current_tier = current_tier + 1
          WHERE id = user_bp_record.id;
        END IF;
      END IF;
    END;
    $$ LANGUAGE plpgsql;
    \`\`\`

## State Management

### React Native Context Setup

1. **Create mission context**:
   \`\`\`typescript
   // contexts/MissionContext.tsx
   import React, { createContext, useState, useEffect, useContext } from 'react'
   import { useAuth } from './AuthContext'
   
   type Mission = {
     id: string
     title: string
     description: string
     target_value: number
     xp_reward: number
     mission_type: string
   }
   
   type MissionProgress = {
     id: string
     mission_id: string
     progress: number
     completed: boolean
     mission: Mission
   }
   
   type MissionContextType = {
     missions: Mission[]
     missionProgress: MissionProgress[]
     loading: boolean
     error: string | null
     refreshMissions: () => Promise<void>
     updateMissionProgress: (missionId: string, progress: number, completed: boolean) => Promise<void>
   }
   
   const MissionContext = createContext<MissionContextType | undefined>(undefined)
   
   export function MissionProvider({ children }: { children: React.ReactNode }) {
     const { user } = useAuth()
     const [missions, setMissions] = useState<Mission[]>([])
     const [missionProgress, setMissionProgress] = useState<MissionProgress[]>([])
     const [loading, setLoading] = useState(true)
     const [error, setError] = useState<string | null>(null)
   
     const fetchMissions = async () => {
       try {
         setLoading(true)
         setError(null)
         
         const response = await fetch(`${process.env.API_URL}/api/missions`)
         if (!response.ok) throw new Error('Failed to fetch missions')
         
         const data = await response.json()
         setMissions(data)
       } catch (err: any) {
         setError(err.message)
       } finally {
         setLoading(false)
       }
     }
   
     const fetchMissionProgress = async () => {
       if (!user) return
       
       try {
         setLoading(true)
         setError(null)
         
         const response = await fetch(`${process.env.API_URL}/api/missions/progress`, {
           headers: {
             Authorization: `Bearer ${user.token}`
           }
         })
         
         if (!response.ok) throw new Error('Failed to fetch mission progress')
         
         const data = await response.json()
         setMissionProgress(data)
       } catch (err: any) {
         setError(err.message)
       } finally {
         setLoading(false)
       }
     }
   
     const refreshMissions = async () => {
       await Promise.all([fetchMissions(), fetchMissionProgress()])
     }
   
     const updateMissionProgress = async (missionId: string, progress: number, completed: boolean) => {
       if (!user) return
       
       try {
         setError(null)
         
         const response = await fetch(`${process.env.API_URL}/api/missions/progress/${missionId}`, {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json',
             Authorization: `Bearer ${user.token}`
           },
           body: JSON.stringify({ progress, completed })
         })
         
         if (!response.ok) throw new Error('Failed to update mission progress')
         
         const updatedProgress = await response.json()
         
         setMissionProgress(prev => {
           const index = prev.findIndex(p => p.mission_id === missionId)
           if (index !== -1) {
             const updated = [...prev]
             updated[index] = updatedProgress
             return updated
           } else {
             return [...prev, updatedProgress]
           }
         })
       } catch (err: any) {
         setError(err.message)
       }
     }
   
     useEffect(() => {
       refreshMissions()
     }, [user])
   
     return (
       <MissionContext.Provider value={{
         missions,
         missionProgress,
         loading,
         error,
         refreshMissions,
         updateMissionProgress
       }}>
         {children}
       </MissionContext.Provider>
     )
   }
   
   export function useMissions() {
     const context = useContext(MissionContext)
     if (context === undefined) {
       throw new Error('useMissions must be used within a MissionProvider')
     }
     return context
   }
   \`\`\`

2. **Create battlepass context**:
   \`\`\`typescript
   // contexts/BattlepassContext.tsx
   import React, { createContext, useState, useEffect, useContext } from 'react'
   import { useAuth } from './AuthContext'
   
   type Battlepass = {
     id: string
     title: string
     description: string
     start_date: string
     end_date: string
   }
   
   type BattlepassTier = {
     id: string
     battlepass_id: string
     tier_level: number
     xp_required: number
     reward_type: string
     reward_id: string
     reward_amount: number
     is_premium: boolean
   }
   
   type UserBattlepass = {
     id: string
     battlepass_id: string
     current_tier: number
     current_xp: number
     premium_purchased: boolean
   }
   
   type BattlepassClaim = {
     id: string
     tier_id: string
     claimed_at: string
   }
   
   type BattlepassContextType = {
     currentBattlepass: Battlepass | null
     battlepassTiers: BattlepassTier[]
     userProgress: UserBattlepass | null
     claimedRewards: BattlepassClaim[]
     loading: boolean
     error: string | null
     refreshBattlepass: () => Promise<void>
     claimReward: (tierId: string) => Promise<void>
     purchasePremium: () => Promise<void>
   }
   
   const BattlepassContext = createContext<BattlepassContextType | undefined>(undefined)
   
   export function BattlepassProvider({ children }: { children: React.ReactNode }) {
     const { user } = useAuth()
     const [currentBattlepass, setCurrentBattlepass] = useState<Battlepass | null>(null)
     const [battlepassTiers, setBattlepassTiers] = useState<BattlepassTier[]>([])
     const [userProgress, setUserProgress] = useState<UserBattlepass | null>(null)
     const [claimedRewards, setClaimedRewards] = useState<BattlepassClaim[]>([])
     const [loading, setLoading] = useState(true)
     const [error, setError] = useState<string | null>(null)
   
     const fetchCurrentBattlepass = async () => {
       try {
         setLoading(true)
         setError(null)
         
         const response = await fetch(`${process.env.API_URL}/api/battlepass/current`)
         if (!response.ok) throw new Error('Failed to fetch current battlepass')
         
         const data = await response.json()
         setCurrentBattlepass(data)
         
         if (data) {
           await fetchBattlepassTiers(data.id)
         }
       } catch (err: any) {
         setError(err.message)
       } finally {
         setLoading(false)
       }
     }
   
     const fetchBattlepassTiers = async (battlepassId: string) => {
       try {
         const response = await fetch(`${process.env.API_URL}/api/battlepass/${battlepassId}/tiers`)
         if (!response.ok) throw new Error('Failed to fetch battlepass tiers')
         
         const data = await response.json()
         setBattlepassTiers(data)
       } catch (err: any) {
         setError(err.message)
       }
     }
   
     const fetchUserProgress = async () => {
       if (!user) return
       
       try {
         const response = await fetch(`${process.env.API_URL}/api/battlepass/progress`, {
           headers: {
             Authorization: `Bearer ${user.token}`
           }
         })
         
         if (!response.ok) throw new Error('Failed to fetch user battlepass progress')
         
         const data = await response.json()
         setUserProgress(data)
       } catch (err: any) {
         setError(err.message)
       }
     }
   
     const fetchClaimedRewards = async () => {
       if (!user || !currentBattlepass) return
       
       try {
         const response = await fetch(`${process.env.API_URL}/api/battlepass/claims`, {
           headers: {
             Authorization: `Bearer ${user.token}`
           }
         })
         
         if (!response.ok) throw new Error('Failed to fetch claimed rewards')
         
         const data = await response.json()
         setClaimedRewards(data)
       } catch (err: any) {
         setError(err.message)
       }
     }
   
     const refreshBattlepass = async () => {
       await fetchCurrentBattlepass()
       if (user) {
         await Promise.all([fetchUserProgress(), fetchClaimedRewards()])
       }
     }
   
     const claimReward = async (tierId: string) => {
       if (!user) return
       
       try {
         setError(null)
         
         const response = await fetch(`${process.env.API_URL}/api/battlepass/claim/${tierId}`, {
           method: 'POST',
           headers: {
             Authorization: `Bearer ${user.token}`
           }
         })
         
         if (!response.ok) throw new Error('Failed to claim reward')
         
         const claimedReward = await response.json()
         setClaimedRewards(prev => [...prev, claimedReward])
       } catch (err: any) {
         setError(err.message)
       }
     }
   
     const purchasePremium = async () => {
       if (!user || !currentBattlepass) return
       
       try {
         setError(null)
         
         const response = await fetch(`${process.env.API_URL}/api/battlepass/purchase-premium`, {
           method: 'POST',
           headers: {
             Authorization: `Bearer ${user.token}`
           }
         })
         
         if (!response.ok) throw new Error('Failed to purchase premium')
         
         const updatedProgress = await response.json()
         setUserProgress(updatedProgress)
       } catch (err: any) {
         setError(err.message)
       }
     }
   
     useEffect(() => {
       refreshBattlepass()
     }, [user])
   
     return (
       <BattlepassContext.Provider value={{
         currentBattlepass,
         battlepassTiers,
         userProgress,
         claimedRewards,
         loading,
         error,
         refreshBattlepass,
         claimReward,
         purchasePremium
       }}>
         {children}
       </BattlepassContext.Provider>
     )
   }
   
   export function useBattlepass() {
     const context = useContext(BattlepassContext)
     if (context === undefined) {
       throw new Error('useBattlepass must be used within a BattlepassProvider')
     }
     return context
   }
   \`\`\`

3. **Create inventory context**:
   \`\`\`typescript
   // contexts/InventoryContext.tsx
   import React, { createContext, useState, useEffect, useContext } from 'react'
   import { useAuth } from './AuthContext'
   
   type Item = {
     id: string
     name: string
     description: string
     type: string
     rarity: string
     image_url: string
   }
   
   type InventoryItem = {
     id: string
     item_id: string
     acquired_at: string
     item: Item
   }
   
   type EquippedItem = {
     id: string
     item_id: string
     slot: string
     equipped_at: string
     item: Item
   }
   
   type InventoryContextType = {
     inventory: InventoryItem[]
     equippedItems: EquippedItem[]
     loading: boolean
     error: string | null
     refreshInventory: () => Promise<void>
     equipItem: (itemId: string, slot: string) => Promise<void>
     unequipItem: (slot: string) => Promise<void>
   }
   
   const InventoryContext = createContext<InventoryContextType | undefined>(undefined)
   
   export function InventoryProvider({ children }: { children: React.ReactNode }) {
     const { user } = useAuth()
     const [inventory, setInventory] = useState<InventoryItem[]>([])
     const [equippedItems, setEquippedItems] = useState<EquippedItem[]>([])
     const [loading, setLoading] = useState(true)
     const [error, setError] = useState<string | null>(null)
   
     const fetchInventory = async () => {
       if (!user) return
       
       try {
         setLoading(true)
         setError(null)
         
         const response = await fetch(`${process.env.API_URL}/api/inventory`, {
           headers: {
             Authorization: `Bearer ${user.token}`
           }
         })
         
         if (!response.ok) throw new Error('Failed to fetch inventory')
         
         const data = await response.json()
         setInventory(data)
       } catch (err: any) {
         setError(err.message)
       } finally {
         setLoading(false)
       }
     }
   
     const fetchEquippedItems = async () => {
       if (!user) return
       
       try {
         setLoading(true)
         setError(null)
         
         const response = await fetch(`${process.env.API_URL}/api/inventory/equipped`, {
           headers: {
             Authorization: `Bearer ${user.token}`
           }
         })
         
         if (!response.ok) throw new Error('Failed to fetch equipped items')
         
         const data = await response.json()
         setEquippedItems(data)
       } catch (err: any) {
         setError(err.message)
       } finally {
         setLoading(false)
       }
     }
   
     const refreshInventory = async () => {
       await Promise.all([fetchInventory(), fetchEquippedItems()])
     }
   
     const equipItem = async (itemId: string, slot: string) => {
       if (!user) return
       
       try {
         setError(null)
         
         const response = await fetch(`${process.env.API_URL}/api/inventory/equip/${itemId}`, {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json',
             Authorization: `Bearer ${user.token}`
           },
           body: JSON.stringify({ slot })
         })
         
         if (!response.ok) throw new Error('Failed to equip item')
         
         const equippedItem = await response.json()
         
         setEquippedItems(prev => {
           const filtered = prev.filter(item => item.slot !== slot)
           return [...filtered, equippedItem]
         })
       } catch (err: any) {
         setError(err.message)
       }
     }
   
     const unequipItem = async (slot: string) => {
       if (!user) return
       
       try {
         setError(null)
         
         const response = await fetch(`${process.env.API_URL}/api/inventory/unequip/${slot}`, {
           method: 'POST',
           headers: {
             Authorization: `Bearer ${user.token}`
           }
         })
         
         if (!response.ok) throw new Error('Failed to unequip item')
         
         setEquippedItems(prev => prev.filter(item => item.slot !== slot))
       } catch (err: any) {
         setError(err.message)
       }
     }
   
     useEffect(() => {
       refreshInventory()
     }, [user])
   
     return (
       <InventoryContext.Provider value={{
         inventory,
         equippedItems,
         loading,
         error,
         refreshInventory,
         equipItem,
         unequipItem
       }}>
         {children}
       </InventoryContext.Provider>
     )
   }
   
   export function useInventory() {
     const context = useContext(InventoryContext)
     if (context === undefined) {
       throw new Error('useInventory must be used within an InventoryProvider')
     }
     return context
   }
   \`\`\`

4. **Create app provider wrapper**:
   \`\`\`typescript
   // providers/AppProviders.tsx
   import React from 'react'
   import { AuthProvider } from '../contexts/AuthContext'
   import { MissionProvider } from '../contexts/MissionContext'
   import { BattlepassProvider } from '../contexts/BattlepassContext'
   import { InventoryProvider } from '../contexts/InventoryContext'
   
   export function AppProviders({ children }: { children: React.ReactNode }) {
     return (
       <AuthProvider>
         <MissionProvider>
           <BattlepassProvider>
             <InventoryProvider>
               {children}
             </InventoryProvider>
           </BattlepassProvider>
         </MissionProvider>
       </AuthProvider>
     )
   }
   \`\`\`

## Real-time Updates

### WebSocket Integration

1. **Create WebSocket service**:
   \`\`\`typescript
   // services/websocket.ts
   import { io, Socket } from 'socket.io-client'
   
   let socket: Socket | null = null
   
   export const initializeSocket = (token: string) => {
     if (socket) {
       socket.disconnect()
     }
     
     socket = io(process.env.WEBSOCKET_URL!, {
       auth: {
         token
       },
       transports: ['websocket']
     })
     
     socket.on('connect', () => {
       console.log('WebSocket connected')
     })
     
     socket.on('disconnect', () => {
       console.log('WebSocket disconnected')
     })
     
     socket.on('error', (error) => {
       console.error('WebSocket error:', error)
     })
     
     return socket
   }
   
   export const getSocket = () => {
     if (!socket) {
       throw new Error('WebSocket not initialized')
     }
     
     return socket
   }
   
   export const closeSocket = () => {
     if (socket) {
       socket.disconnect()
       socket = null
     }
   }
   \`\`\`

2. **Create WebSocket context**:
   \`\`\`typescript
   // contexts/WebSocketContext.tsx
   import React, { createContext, useContext, useEffect, useState } from 'react'
   import { Socket } from 'socket.io-client'
   import { useAuth } from './AuthContext'
   import { initializeSocket, closeSocket, getSocket } from '../services/websocket'
   
   type WebSocketContextType = {
     socket: Socket | null
     connected: boolean
   }
   
   const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined)
   
   export function WebSocketProvider({ children }: { children: React.ReactNode }) {
     const { user } = useAuth()
     const [socket, setSocket] = useState<Socket | null>(null)
     const [connected, setConnected] = useState(false)
   
     useEffect(() => {
       if (user) {
         const newSocket = initializeSocket(user.token)
         
         newSocket.on('connect', () => {
           setConnected(true)
           
           // Join user's room for personalized updates
           newSocket.emit('join-room', user.id)
         })
         
         newSocket.on('disconnect', () => {
           setConnected(false)
         })
         
         setSocket(newSocket)
       } else {
         closeSocket()
         setSocket(null)
         setConnected(false)
       }
       
       return () => {
         closeSocket()
       }
     }, [user])
   
     return (
       <WebSocketContext.Provider value={{ socket, connected }}>
         {children}
       </WebSocketContext.Provider>
     )
   }
   
   export function useWebSocket() {
     const context = useContext(WebSocketContext)
     if (context === undefined) {
       throw new Error('useWebSocket must be used within a WebSocketProvider')
     }
     return context
   }
   \`\`\`

3. **Update app providers**:
   \`\`\`typescript
   // providers/AppProviders.tsx
   import React from 'react'
   import { AuthProvider } from '../contexts/AuthContext'
   import { WebSocketProvider } from '../contexts/WebSocketContext'
   import { MissionProvider } from '../contexts/MissionContext'
   import { BattlepassProvider } from '../contexts/BattlepassContext'
   import { InventoryProvider } from '../contexts/InventoryContext'
   
   export function AppProviders({ children }: { children: React.ReactNode }) {
     return (
       <AuthProvider>
         <WebSocketProvider>
           <MissionProvider>
             <BattlepassProvider>
               <InventoryProvider>
                 {children}
               </InventoryProvider>
             </BattlepassProvider>
           </MissionProvider>
         </WebSocketProvider>
       </AuthProvider>
     )
   }
   \`\`\`

4. **Implement real-time updates in mission context**:
   \`\`\`typescript
   // contexts/MissionContext.tsx (update)
   import React, { createContext, useState, useEffect, useContext } from 'react'
   import { useAuth } from './AuthContext'
   import { useWebSocket } from './WebSocketContext'
   
   // ... existing code ...
   
   export function MissionProvider({ children }: { children: React.ReactNode }) {
     const { user } = useAuth()
     const { socket } = useWebSocket()
     const [missions, setMissions] = useState<Mission[]>([])
     const [missionProgress, setMissionProgress] = useState<MissionProgress[]>([])
     const [loading, setLoading] = useState(true)
     const [error, setError] = useState<string | null>(null)
   
     // ... existing code ...
   
     useEffect(() => {
       if (socket) {
         // Listen for mission progress updates
         socket.on('mission_progress_update', (updatedProgress: MissionProgress) => {
           setMissionProgress(prev => {
             const index = prev.findIndex(p => p.mission_id === updatedProgress.mission_id)
             if (index !== -1) {
               const updated = [...prev]
               updated[index] = updatedProgress
               return updated
             } else {
               return [...prev, updatedProgress]
             }
           })
         })
         
         // Listen for new missions
         socket.on('new_mission', (newMission: Mission) => {
           setMissions(prev => [...prev, newMission])
         })
         
         return () => {
           socket.off('mission_progress_update')
           socket.off('new_mission')
         }
       }
     }, [socket])
   
     // ... rest of the component ...
   }
   \`\`\`

## Error Handling

### Global Error Handling

1. **Create error handling service**:
   \`\`\`typescript
   // services/error-handler.ts
   import * as Sentry from '@sentry/react-native'
   
   // Initialize Sentry
   export const initErrorTracking = () => {
     Sentry.init({
       dsn: process.env.SENTRY_DSN,
       environment: process.env.NODE_ENV,
       tracesSampleRate: 1.0,
     })
   }
   
   export const captureError = (error: Error, context?: Record<string, any>) => {
     console.error('Error:', error)
     
     if (context) {
       Sentry.setContext('additional', context)
     }
     
     Sentry.captureException(error)
   }
   
   export const captureMessage = (message: string, level: Sentry.Severity = Sentry.Severity.Info) => {
     console.log(`[${level}]`, message)
     Sentry.captureMessage(message, level)
   }
   
   export const setUserContext = (userId: string | null, username?: string) => {
     if (userId) {
       Sentry.setUser({
         id: userId,
         username
       })
     } else {
       Sentry.setUser(null)
     }
   }
   \`\`\`

2. **Create error boundary component**:
   \`\`\`typescript
   // components/ErrorBoundary.tsx
   import React from 'react'
   import { View, Text, Button, StyleSheet } from 'react-native'
   import * * as Sentry from '@sentry/react-native'
   import { captureError } from '../services/error-handler'
   
   interface ErrorBoundaryProps {
     children: React.ReactNode
   }
   
   interface ErrorBoundaryState {
     hasError: boolean
     error: Error | null
   }
   
   export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
     constructor(props: ErrorBoundaryProps) {
       super(props)
       this.state = { hasError: false, error: null }
     }
   
     static getDerivedStateFromError(error: Error) {
       return { hasError: true, error }
     }
   
     componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
       captureError(error, { componentStack: errorInfo.componentStack })
     }
   
     resetError = () => {
       this.setState({ hasError: false, error: null })
     }
   
     render() {
       if (this.state.hasError) {
         return (
           <View style={styles.container}>
             <Text style={styles.title}>Something went wrong</Text>
             <Text style={styles.message}>
               We're sorry, but an error occurred. Our team has been notified.
             </Text>
             <Button title="Try Again" onPress={this.resetError} />
           </View>
         )
       }
   
       return this.props.children
     }
   }
   
   const styles = StyleSheet.create({
     container: {
       flex: 1,
       justifyContent: 'center',
       alignItems: 'center',
       padding: 20,
       backgroundColor: '#0B0B0E'
     },
     title: {
       fontSize: 20,
       fontWeight: 'bold',
       color: '#FFFFFF',
       marginBottom: 10
     },
     message: {
       fontSize: 16,
       textAlign: 'center',
       color: '#CCCCCC',
       marginBottom: 20
     }
   })
   \`\`\`

3. **Create API error handling**:
   \`\`\`typescript
   // services/api.ts
   import { captureError } from './error-handler'
   
   export class ApiError extends Error {
     status: number
     data: any
   
     constructor(status: number, message: string, data?: any) {
       super(message)
       this.name = 'ApiError'
       this.status = status
       this.data = data
     }
   }
   
   export const fetchWithErrorHandling = async (
     url: string,
     options?: RequestInit
   ) => {
     try {
       const response = await fetch(url, options)
       
       if (!response.ok) {
         let errorData
         try {
           errorData = await response.json()
         } catch (e) {
           errorData = { message: response.statusText }
         }
         
         const error = new ApiError(
           response.status,
           errorData.message || 'An error occurred',
           errorData
         )
         
         throw error
       }
       
       return response
     } catch (error) {
       if (error instanceof ApiError) {
         // Log API errors
         captureError(error, {
           url,
           status: error.status,
           data: error.data
         })
       } else {
         // Log network or other errors
         captureError(error as Error, { url })
       }
       
       throw error
     }
   }
   \`\`\`

## Performance Optimization

### React Native Optimizations

1. **Implement memo and useCallback**:
   \`\`\`typescript
   // components/MissionCard.tsx
   import React, { memo, useCallback } from 'react'
   import { View, Text, StyleSheet, Pressable } from 'react-native'
   import { useMissions } from '../contexts/MissionContext'
   
   interface MissionCardProps {
     missionId: string
   }
   
   const MissionCard = ({ missionId }: MissionCardProps) => {
     const { missions, missionProgress, updateMissionProgress } = useMissions()
     
     const mission = missions.find(m => m.id === missionId)
     const progress = missionProgress.find(p => p.mission_id === missionId)
     
     const handlePress = useCallback(() => {
       // Handle mission interaction
     }, [missionId])
     
     if (!mission) return null
     
     const progressPercentage = progress 
       ? Math.min(100, (progress.progress / mission.target_value) * 100) 
       : 0
     
     return (
       <Pressable style={styles.container} onPress={handlePress}>
         <Text style={styles.title}>{mission.title}</Text>
         <Text style={styles.description}>{mission.description}</Text>
         <View style={styles.progressContainer}>
           <View 
             style={[
               styles.progressBar, 
               { width: `${progressPercentage}%` }
             ]} 
           />
         </View>
         <Text style={styles.progressText}>
           {progress?.progress || 0}/{mission.target_value}
         </Text>
         <Text style={styles.reward}>+{mission.xp_reward} XP</Text>
       </Pressable>
     )
   }
   
   const styles = StyleSheet.create({
     container: {
       backgroundColor: '#1A1A1F',
       borderRadius: 8,
       padding: 16,
       marginBottom: 12
     },
     title: {
       fontSize: 18,
       fontWeight: 'bold',
       color: '#FFFFFF',
       marginBottom: 4
     },
     description: {
       fontSize: 14,
       color: '#CCCCCC',
       marginBottom: 12
     },
     progressContainer: {
       height: 8,
       backgroundColor: '#2A2A30',
       borderRadius: 4,
       overflow: 'hidden',
       marginBottom: 4
     },
     progressBar: {
       height: '100%',
       backgroundColor: '#6366F1'
     },
     progressText: {
       fontSize: 12,
       color: '#AAAAAA',
       marginBottom: 8
     },
     reward: {
       fontSize: 14,
       fontWeight: 'bold',
       color: '#6366F1'
     }
   })
   
   export default memo(MissionCard)
   \`\`\`

2. **Implement FlatList with optimizations**:
   \`\`\`typescript
   // screens/MissionsScreen.tsx
   import React, { useCallback } from 'react'
   import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native'
   import { useMissions } from '../contexts/MissionContext'
   import MissionCard from '../components/MissionCard'
   
   const MissionsScreen = () => {
     const { missions, loading, error, refreshMissions } = useMissions()
     
     const renderItem = useCallback(({ item }) => {
       return <MissionCard missionId={item.id} />
     }, [])
     
     const keyExtractor = useCallback((item) => item.id, [])
     
     const ListEmptyComponent = useCallback(() => {
       if (loading) {
         return (
           <View style={styles.centered}>
             <ActivityIndicator size="large" color="#6366F1" />
           </View>
         )
       }
       
       if (error) {
         return (
           <View style={styles.centered}>
             <Text style={styles.errorText}>Error: {error}</Text>
           </View>
         )
       }
       
       return (
         <View style={styles.centered}>
           <Text style={styles.emptyText}>No missions available</Text>
         </View>
       )
     }, [loading, error])
     
     return (
       <View style={styles.container}>
         <Text style={styles.header}>Daily Missions</Text>
         <FlatList
           data={missions}
           renderItem={renderItem}
           keyExtractor={keyExtractor}
           contentContainerStyle={styles.list}
           ListEmptyComponent={ListEmptyComponent}
           onRefresh={refreshMissions}
           refreshing={loading}
           initialNumToRender={5}
           maxToRenderPerBatch={10}
           windowSize={5}
           removeClippedSubviews={true}
         />
       </View>
     )
   }
   
   const styles = StyleSheet.create({
     container: {
       flex: 1,
       backgroundColor: '#0B0B0E',
       padding: 16
     },
     header: {
       fontSize: 24,
       fontWeight: 'bold',
       color: '#FFFFFF',
       marginBottom: 16
     },
     list: {
       flexGrow: 1
     },
     centered: {
       flex: 1,
       justifyContent: 'center',
       alignItems: 'center',
       padding: 20
     },
     errorText: {
       fontSize: 16,
       color: '#FF6B6B',
       textAlign: 'center'
     },
     emptyText: {
       fontSize: 16,
       color: '#AAAAAA',
       textAlign: 'center'
     }
   })
   
   export default MissionsScreen
   \`\`\`

3. **Implement image caching**:
   \`\`\`typescript
   // components/CachedImage.tsx
   import React, { memo } from 'react'
   import { Image, ImageProps, StyleSheet } from 'react-native'
   import * as FileSystem from 'expo-file-system'
   import * as Crypto from 'expo-crypto'
   
   interface CachedImageProps extends ImageProps {
     uri: string
   }
   
   const CachedImage = ({ uri, ...props }: CachedImageProps) => {
     const [cachedUri, setCachedUri] = React.useState<string | null>(null)
     
     React.useEffect(() => {
       const getCachedImage = async () => {
         try {
           const hash = await Crypto.digestStringAsync(
             Crypto.CryptoDigestAlgorithm.SHA256,
             uri
           )
           
           const filename = `${FileSystem.cacheDirectory}${hash}`
           const fileInfo = await FileSystem.getInfoAsync(filename)
           
           if (fileInfo.exists) {
             setCachedUri(fileInfo.uri)
             return
           }
           
           const downloadResult = await FileSystem.downloadAsync(uri, filename)
           setCachedUri(downloadResult.uri)
         } catch (error) {
           console.error('Error caching image:', error)
           setCachedUri(uri) // Fallback to original URI
         }
       }
       
       getCachedImage()
     }, [uri])
     
     return (
       <Image
         {...props}
         source={cachedUri ? { uri: cachedUri } : require('../assets/placeholder.png')}
       />
     )
   }
   
   export default memo(CachedImage)
   \`\`\`

## Testing

### React Native Testing

1. **Set up Jest configuration**:
   \`\`\`javascript
   // jest.config.js
   module.exports = {
     preset: 'jest-expo',
     transformIgnorePatterns: [
       'node_modules/(?!(jest-)?react-native|@react-native|react-clone-referenced-element|@react-native-community|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|@sentry/.*)'
     ],
     setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
     collectCoverage: true,
     collectCoverageFrom: [
       '**/*.{ts,tsx}',
       '!**/coverage/**',
       '!**/node_modules/**',
       '!**/babel.config.js',
       '!**/jest.setup.js'
     ]
   }
   \`\`\`

2. **Create test for mission context**:
   \`\`\`typescript
   // __tests__/contexts/MissionContext.test.tsx
   import React from 'react'
   import { render, act, waitFor } from '@testing-library/react-native'
   import { MissionProvider, useMissions } from '../../contexts/MissionContext'
   import { AuthProvider } from '../../contexts/AuthContext'
   import { WebSocketProvider } from '../../contexts/WebSocketContext'
   
   // Mock fetch
   global.fetch = jest.fn()
   
   // Mock component to test the context
   const TestComponent = () => {
     const { missions, loading, error } = useMissions()
     
     return (
       <>
         {loading && <div data-testid="loading">Loading...</div>}
         {error && <div data-testid="error">{error}</div>}
         <div data-testid="mission-count">{missions.length}</div>
       </>
     )
   }
   
   describe('MissionContext', () => {
     beforeEach(() => {
       jest.clearAllMocks()
     })
     
     it('should fetch missions on mount', async () => {
       // Mock successful fetch
       const mockMissions = [
         { id: '1', title: 'Test Mission', description: 'Test', target_value: 10, xp_reward: 100, mission_type: 'daily' }
       ]
       
       ;(global.fetch as jest.Mock).mockResolvedValueOnce({
         ok: true,
         json: async () => mockMissions
       })
       
       ;(global.fetch as jest.Mock).mockResolvedValueOnce({
         ok: true,
         json: async () => []
       })
       
       const { getByTestId } = render(
         <AuthProvider>
           <WebSocketProvider>
             <MissionProvider>
               <TestComponent />
             </MissionProvider>
           </WebSocketProvider>
         </AuthProvider>
       )
       
       // Initially loading
       expect(getByTestId('loading')).toBeTruthy()
       
       // Wait for fetch to complete
       await waitFor(() => {
         expect(getByTestId('mission-count').textContent).toBe('1')
       })
       
       // Verify fetch was called
       expect(global.fetch).toHaveBeenCalledTimes(2)
     })
     
     it('should handle fetch error', async () => {
       // Mock fetch error
       ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))
       
       const { getByTestId } = render(
         <AuthProvider>
           <WebSocketProvider>
             <MissionProvider>
               <TestComponent />
             </MissionProvider>
           </WebSocketProvider>
         </AuthProvider>
       )
       
       // Wait for error
       await waitFor(() => {
         expect(getByTestId('error')).toBeTruthy()
       })
     })
   })
   \`\`\`

3. **Create test for mission card component**:
   \`\`\`typescript
   // __tests__/components/MissionCard.test.tsx
   import React from 'react'
   import { render, fireEvent } from '@testing-library/react-native'
   import MissionCard from '../../components/MissionCard'
   import { MissionProvider } from '../../contexts/MissionContext'
   import { AuthProvider } from '../../contexts/AuthContext'
   import { WebSocketProvider } from '../../contexts/WebSocketContext'
   
   // Mock the missions context
   jest.mock('../../contexts/MissionContext', () => {
     const originalModule = jest.requireActual('../../contexts/MissionContext')
     
     return {
       ...originalModule,
       useMissions: () => ({
         missions: [
           { 
             id: 'mission1', 
             title: 'Test Mission', 
             description: 'Test Description', 
             target_value: 10, 
             xp_reward: 100,
             mission_type: 'daily'
           }
         ],
         missionProgress: [
           { 
             id: 'progress1', 
             mission_id: 'mission1', 
             progress: 5, 
             completed: false 
           }
         ],
         updateMissionProgress: jest.fn()
       })
     }
   })
   
   describe('MissionCard', () => {
     it('renders mission details correctly', () => {
       const { getByText } = render(
         <AuthProvider>
           <WebSocketProvider>
             <MissionProvider>
               <MissionCard missionId="mission1" />
             </MissionProvider>
           </WebSocketProvider>
         </AuthProvider>
       )
       
       expect(getByText('Test Mission')).toBeTruthy()
       expect(getByText('Test Description')).toBeTruthy()
       expect(getByText('5/10')).toBeTruthy()
       expect(getByText('+100 XP')).toBeTruthy()
     })
     
     it('does not render if mission is not found', () => {
       const { container } = render(
         <AuthProvider>
           <WebSocketProvider>
             <MissionProvider>
               <MissionCard missionId="nonexistent" />
             </MissionProvider>
           </WebSocketProvider>
         </AuthProvider>
       )
       
       expect(container.children.length).toBe(0)
     })
   })
   \`\`\`

## Deployment

### Express.js Deployment

1. **Create PM2 ecosystem file**:
   \`\`\`javascript
   // server/ecosystem.config.js
   module.exports = {
     apps: [
       {
         name: 'everchess-api',
         script: 'dist/index.js',
         instances: 'max',
         exec_mode: 'cluster',
         autorestart: true,
         watch: false,
         max_memory_restart: '1G',
         env: {
           NODE_ENV: 'development'
         },
         env_production: {
           NODE_ENV: 'production',
           PORT: 3001
         }
       }
     ]
   }
   \`\`\`

2. **Create Dockerfile**:
   \`\`\`dockerfile
   # server/Dockerfile
   FROM node:18-alpine
   
   WORKDIR /app
   
   COPY package*.json ./
   
   RUN npm ci --only=production
   
   COPY . .
   
   RUN npm run build
   
   EXPOSE 3001
   
   CMD ["node", "dist/index.js"]
   \`\`\`

3. **Create Docker Compose file**:
   \`\`\`yaml
   # docker-compose.yml
   version: '3'
   
   services:
     api:
       build:
         context: ./server
         dockerfile: Dockerfile
       ports:
         - "3001:3001"
       environment:
         - NODE_ENV=production
         - PORT=3001
         - SUPABASE_URL=${SUPABASE_URL}
         - SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
         - SUPABASE_SERVICE_KEY=${SUPABASE_SERVICE_KEY}
         - CLIENT_URL=${CLIENT_URL}
       restart: always
   \`\`\`

4. **Set up CI/CD pipeline**:
   \`\`\`yaml
   # .github/workflows/deploy-backend.yml
   name: Deploy Backend
   
   on:
     push:
       branches: [main]
       paths:
         - 'server/**'
   
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         
         - name: Setup Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '18'
             
         - name: Install dependencies
           run: npm ci
           working-directory: ./server
           
         - name: Run tests
           run: npm test
           working-directory: ./server
           
         - name: Build
           run: npm run build
           working-directory: ./server
           
         - name: Deploy to Digital Ocean
           uses: appleboy/ssh-action@master
           with:
             host: ${{ secrets.DO_HOST }}
             username: ${{ secrets.DO_USERNAME }}
             key: ${{ secrets.DO_SSH_KEY }}
             script: |
               cd /var/www/everchess-api
               git pull
               npm ci --only=production
               npm run build
               pm2 reload ecosystem.config.js --env production
   \`\`\`

### React Native Expo Deployment

1. **Configure app.json for Expo**:
   \`\`\`json
   {
     "expo": {
       "name": "Everchess",
       "slug": "everchess",
       "version": "1.0.0",
       "orientation": "portrait",
       "icon": "./assets/icon.png",
       "splash": {
         "image": "./assets/splash.png",
         "resizeMode": "contain",
         "backgroundColor": "#0B0B0E"
       },
       "updates": {
         "fallbackToCacheTimeout": 0
       },
       "assetBundlePatterns": [
         "**/*"
       ],
       "ios": {
         "supportsTablet": true,
         "bundleIdentifier": "com.everchess.app"
       },
       "android": {
         "adaptiveIcon": {
           "foregroundImage": "./assets/adaptive-icon.png",
           "backgroundColor": "#0B0B0E"
         },
         "package": "com.everchess.app"
       },
       "web": {
         "favicon": "./assets/favicon.png"
       },
       "extra": {
         "eas": {
           "projectId": "your-project-id"
         }
       }
     }
   }
   \`\`\`

2. **Configure EAS Build**:
   \`\`\`json
   // eas.json
   {
     "cli": {
       "version": ">= 0.60.0"
     },
     "build": {
       "development": {
         "developmentClient": true,
         "distribution": "internal"
       },
       "preview": {
         "distribution": "internal"
       },
       "production": {}
     },
     "submit": {
       "production": {}
     }
   }
   \`\`\`

3. **Set up CI/CD pipeline for mobile app**:
   \`\`\`yaml
   # .github/workflows/deploy-mobile.yml
   name: Deploy Mobile App
   
   on:
     push:
       branches: [main]
       paths:
         - 'mobile/**'
   
   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         
         - name: Setup Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '18'
             
         - name: Setup Expo
           uses: expo/expo-github-action@v7
           with:
             expo-version: latest
             token: ${{ secrets.EXPO_TOKEN }}
             
         - name: Install dependencies
           run: npm ci
           working-directory: ./mobile
           
         - name: Run tests
           run: npm test
           working-directory: ./mobile
           
         - name: Build Android
           run: eas build --platform android --non-interactive
           working-directory: ./mobile
           
         - name: Build iOS
           run: eas build --platform ios --non-interactive
           working-directory: ./mobile
   \`\`\`

## Conclusion

This document provides a comprehensive guide for integrating the Everchess dashboard frontend with a production backend using your specific tech stack. By following these steps, you'll create a robust, scalable, and maintainable application that delivers a seamless user experience.

Remember to:

1. Implement proper authentication and authorization with Supabase
2. Create well-structured Express.js API endpoints
3. Design efficient Supabase data models
4. Set up state management for real-time updates in React Native
5. Handle errors gracefully in a mobile context
6. Optimize performance for React Native
7. Write comprehensive tests for your mobile app
8. Configure deployment for both Express.js backend and Expo React Native app

As you develop additional screens, create similar integration guides for each one, focusing on the specific requirements and challenges of that screen.
