# Play Page - Backend Integration Guide

This document outlines the backend integration requirements for the Everchess Play page. It covers API endpoints, data models, state management, and other important considerations for implementing the backend services that power the play experience.

## Table of Contents

1. [Overview](#overview)
2. [Data Requirements](#data-requirements)
3. [API Endpoints](#api-endpoints)
4. [Matchmaking System](#matchmaking-system)
5. [Tournament System](#tournament-system)
6. [Real-time Updates](#real-time-updates)
7. [State Management](#state-management)
8. [Error Handling](#error-handling)
9. [Performance Considerations](#performance-considerations)

## Overview

The Play page serves as the main entry point for users to start games, join tournaments, and spectate ongoing matches. It includes:

- Game mode selection (Ranked, Tournaments, Wagers, Custom)
- Time control options
- Tournament listings and registration
- User statistics
- Live games for spectating

## Data Requirements

The Play page requires the following data:

### User Statistics
- Rating
- Games played
- Win rate
- Current streak
- Best time control

### Tournament Data
- Upcoming tournaments
- Registration status
- Tournament details (time control, participants, start time, prizes)

### Live Games Data
- Ongoing high-rated games
- Player information
- Game state
- Viewer count

### Queue Status
- Current queue status
- Estimated wait time
- Match found notifications

## API Endpoints

### User Statistics Endpoint
\`\`\`
GET /api/users/stats
\`\`\`

**Response:**
\`\`\`json
{
  "rating": 1250,
  "games_played": 42,
  "win_rate": 58,
  "current_streak": "3W",
  "best_time_control": "5+5"
}
\`\`\`

### Tournaments Endpoint
\`\`\`
GET /api/tournaments
\`\`\`

**Response:**
\`\`\`json
{
  "tournaments": [
    {
      "id": "hello-everchess",
      "title": "Hello Everchess",
      "time_control": "5+5",
      "participants": {
        "current": 0,
        "max": 32
      },
      "start_time": "2023-06-15T18:00:00Z",
      "prize": "500 XP",
      "status": "upcoming",
      "registered": false
    },
    // Additional tournaments...
  ]
}
\`\`\`

### Tournament Registration Endpoint
\`\`\`
POST /api/tournaments/:tournamentId/register
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "tournament_id": "hello-everchess",
  "registered": true
}
\`\`\`

### Tournament Creation Endpoint
\`\`\`
POST /api/tournaments
\`\`\`

**Request Body:**
\`\`\`json
{
  "title": "Weekend Blitz",
  "time_control": "3+2",
  "max_participants": 32,
  "start_date": "2023-06-17T15:00:00Z",
  "prize": "500 XP"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "tournament": {
    "id": "weekend-blitz-123",
    "title": "Weekend Blitz",
    "time_control": "3+2",
    "participants": {
      "current": 0,
      "max": 32
    },
    "start_time": "2023-06-17T15:00:00Z",
    "prize": "500 XP",
    "status": "upcoming"
  }
}
\`\`\`

### Live Games Endpoint
\`\`\`
GET /api/games/live
\`\`\`

**Response:**
\`\`\`json
{
  "games": [
    {
      "id": "game1",
      "white_player": {
        "username": "GrandMaster99",
        "rating": 2450
      },
      "black_player": {
        "username": "ChessWizard",
        "rating": 2380
      },
      "time_control": "5+3",
      "move_count": 24,
      "viewer_count": 128
    },
    // Additional games...
  ]
}
\`\`\`

### Queue Join Endpoint
\`\`\`
POST /api/matchmaking/join
\`\`\`

**Request Body:**
\`\`\`json
{
  "mode": "ranked",
  "time_control": "5+5"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "queue_id": "queue-123",
  "estimated_wait_time": 30
}
\`\`\`

### Queue Leave Endpoint
\`\`\`
POST /api/matchmaking/leave
\`\`\`

**Response:**
\`\`\`json
{
  "success": true
}
\`\`\`

## Matchmaking System

The matchmaking system is responsible for pairing players based on their ratings and preferences. It consists of several components:

### Queue Manager

The Queue Manager maintains separate queues for different game modes and time controls. It processes the queues at regular intervals to find suitable matches.

\`\`\`typescript
// server/services/QueueManager.ts
export class QueueManager {
  private queues: Map<string, Queue> = new Map();
  
  constructor() {
    // Initialize queues for different game modes and time controls
    this.initializeQueues();
    
    // Process queues every 5 seconds
    setInterval(() => this.processQueues(), 5000);
  }
  
  private initializeQueues() {
    // Create queues for each game mode and time control combination
    const gameModes = ['ranked', 'casual'];
    const timeControls = ['3+2', '5+5', '10+5', '15+10'];
    
    for (const mode of gameModes) {
      for (const timeControl of timeControls) {
        const queueId = `${mode}-${timeControl}`;
        this.queues.set(queueId, new Queue(queueId));
      }
    }
  }
  
  public addToQueue(userId: string, mode: string, timeControl: string, rating: number): string {
    const queueId = `${mode}-${timeControl}`;
    const queue = this.queues.get(queueId);
    
    if (!queue) {
      throw new Error(`Queue not found: ${queueId}`);
    }
    
    return queue.addPlayer(userId, rating);
  }
  
  public removeFromQueue(userId: string): boolean {
    let removed = false;
    
    // Check all queues for the user
    for (const queue of this.queues.values()) {
      if (queue.removePlayer(userId)) {
        removed = true;
      }
    }
    
    return removed;
  }
  
  private processQueues() {
    for (const queue of this.queues.values()) {
      const matches = queue.findMatches();
      
      for (const match of matches) {
        this.createGame(match);
      }
    }
  }
  
  private createGame(match: Match) {
    // Create a new game with the matched players
    const gameId = `game-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Notify players about the match
    this.notifyPlayers(match, gameId);
    
    // Create game record in database
    this.saveGame(match, gameId);
  }
  
  private notifyPlayers(match: Match, gameId: string) {
    const { player1, player2 } = match;
    
    // Use WebSockets to notify players
    io.to(player1.userId).emit('match_found', { gameId });
    io.to(player2.userId).emit('match_found', { gameId });
  }
  
  private saveGame(match: Match, gameId: string) {
    // Save game to database
    // Implementation depends on database choice
  }
}
\`\`\`

### Queue Class

The Queue class manages players waiting for a specific game mode and time control.

\`\`\`typescript
// server/services/Queue.ts
interface QueuePlayer {
  userId: string;
  rating: number;
  joinTime: Date;
}

interface Match {
  player1: QueuePlayer;
  player2: QueuePlayer;
}

export class Queue {
  private id: string;
  private players: QueuePlayer[] = [];
  
  constructor(id: string) {
    this.id = id;
  }
  
  public addPlayer(userId: string, rating: number): string {
    // Check if player is already in queue
    const existingIndex = this.players.findIndex(p => p.userId === userId);
    
    if (existingIndex !== -1) {
      // Update existing entry
      this.players[existingIndex] = {
        userId,
        rating,
        joinTime: new Date()
      };
      return this.id;
    }
    
    // Add new player to queue
    this.players.push({
      userId,
      rating,
      joinTime: new Date()
    });
    
    return this.id;
  }
  
  public removePlayer(userId: string): boolean {
    const initialLength = this.players.length;
    this.players = this.players.filter(p => p.userId !== userId);
    return this.players.length < initialLength;
  }
  
  public findMatches(): Match[] {
    const matches: Match[] = [];
    
    if (this.players.length < 2) {
      return matches;
    }
    
    // Sort by join time (oldest first)
    this.players.sort((a, b) => a.joinTime.getTime() - b.joinTime.getTime());
    
    // Find matches based on rating and wait time
    const playersToRemove = new Set<string>();
    
    for (let i = 0; i < this.players.length; i++) {
      if (playersToRemove.has(this.players[i].userId)) {
        continue;
      }
      
      const player1 = this.players[i];
      const waitTimeMinutes = (new Date().getTime() - player1.joinTime.getTime()) / 60000;
      
      // Find best match for player1
      let bestMatchIndex = -1;
      let minRatingDiff = Infinity;
      
      for (let j = i + 1; j < this.players.length; j++) {
        if (playersToRemove.has(this.players[j].userId)) {
          continue;
        }
        
        const player2 = this.players[j];
        const ratingDiff = Math.abs(player1.rating - player2.rating);
        
        // Accept match if rating difference is small or wait time is long
        if (ratingDiff < minRatingDiff && (ratingDiff < 200 || waitTimeMinutes > 2)) {
          minRatingDiff = ratingDiff;
          bestMatchIndex = j;
        }
      }
      
      if (bestMatchIndex !== -1) {
        const player2 = this.players[bestMatchIndex];
        
        matches.push({ player1, player2 });
        
        playersToRemove.add(player1.userId);
        playersToRemove.add(player2.userId);
      }
    }
    
    // Remove matched players from queue
    this.players = this.players.filter(p => !playersToRemove.has(p.userId));
    
    return matches;
  }
  
  public getEstimatedWaitTime(rating: number): number {
    // Calculate estimated wait time based on queue length and player rating
    const queueLength = this.players.length;
    
    if (queueLength === 0) {
      return 10; // Base wait time in seconds
    }
    
    // Find players with similar ratings
    const similarRatings = this.players.filter(p => Math.abs(p.rating - rating) < 200).length;
    
    if (similarRatings > 0) {
      return 30; // Shorter wait time if similar players are in queue
    }
    
    return 60; // Longer wait time if no similar players
  }
}
\`\`\`

## Tournament System

The tournament system manages tournament creation, registration, and execution.

### Tournament Manager

\`\`\`typescript
// server/services/TournamentManager.ts
export class TournamentManager {
  private tournaments: Map<string, Tournament> = new Map();
  
  constructor() {
    // Load active tournaments from database
    this.loadTournaments();
    
    // Check tournament status every minute
    setInterval(() => this.checkTournamentStatus(), 60000);
  }
  
  private async loadTournaments() {
    try {
      // Load tournaments from database
      const tournaments = await db.tournaments.findMany({
        where: {
          status: {
            in: ['upcoming', 'active']
          }
        }
      });
      
      for (const tournamentData of tournaments) {
        const tournament = new Tournament(tournamentData);
        this.tournaments.set(tournament.id, tournament);
      }
    } catch (error) {
      console.error('Failed to load tournaments:', error);
    }
  }
  
  public async createTournament(data: TournamentCreateData): Promise<Tournament> {
    try {
      // Create tournament in database
      const tournamentData = await db.tournaments.create({
        data: {
          title: data.title,
          time_control: data.timeControl,
          max_participants: data.maxParticipants,
          start_time: data.startDate,
          prize: data.prize,
          status: 'upcoming'
        }
      });
      
      const tournament = new Tournament(tournamentData);
      this.tournaments.set(tournament.id, tournament);
      
      return tournament;
    } catch (error) {
      console.error('Failed to create tournament:', error);
      throw error;
    }
  }
  
  public async registerPlayer(tournamentId: string, userId: string): Promise<boolean> {
    const tournament = this.tournaments.get(tournamentId);
    
    if (!tournament) {
      throw new Error(`Tournament not found: ${tournamentId}`);
    }
    
    return tournament.registerPlayer(userId);
  }
  
  public async unregisterPlayer(tournamentId: string, userId: string): Promise<boolean> {
    const tournament = this.tournaments.get(tournamentId);
    
    if (!tournament) {
      throw new Error(`Tournament not found: ${tournamentId}`);
    }
    
    return tournament.unregisterPlayer(userId);
  }
  
  private async checkTournamentStatus() {
    const now = new Date();
    
    for (const tournament of this.tournaments.values()) {
      // Check if tournament should start
      if (tournament.status === 'upcoming' && tournament.startTime <= now) {
        await tournament.start();
      }
      
      // Check if tournament should end
      if (tournament.status === 'active' && tournament.isCompleted()) {
        await tournament.end();
      }
    }
  }
}
\`\`\`

### Tournament Class

\`\`\`typescript
// server/services/Tournament.ts
export class Tournament {
  public id: string;
  public title: string;
  public timeControl: string;
  public maxParticipants: number;
  public startTime: Date;
  public prize: string;
  public status: 'upcoming' | 'active' | 'completed';
  
  private participants: Set<string> = new Set();
  private matches: TournamentMatch[] = [];
  
  constructor(data: TournamentData) {
    this.id = data.id;
    this.title = data.title;
    this.timeControl = data.time_control;
    this.maxParticipants = data.max_participants;
    this.startTime = new Date(data.start_time);
    this.prize = data.prize;
    this.status = data.status;
    
    // Load participants
    if (data.participants) {
      for (const participant of data.participants) {
        this.participants.add(participant.user_id);
      }
    }
    
    // Load matches
    if (data.matches) {
      this.matches = data.matches;
    }
  }
  
  public async registerPlayer(userId: string): Promise<boolean> {
    if (this.status !== 'upcoming') {
      throw new Error('Cannot register for tournament that has already started');
    }
    
    if (this.participants.size >= this.maxParticipants) {
      throw new Error('Tournament is full');
    }
    
    if (this.participants.has(userId)) {
      return false; // Already registered
    }
    
    try {
      // Add participant to database
      await db.tournamentParticipants.create({
        data: {
          tournament_id: this.id,
          user_id: userId
        }
      });
      
      this.participants.add(userId);
      
      // Notify other participants about new registration
      io.to(`tournament:${this.id}`).emit('tournament_update', {
        type: 'participant_joined',
        tournament_id: this.id,
        participants_count: this.participants.size
      });
      
      return true;
    } catch (error) {
      console.error('Failed to register player:', error);
      throw error;
    }
  }
  
  public async unregisterPlayer(userId: string): Promise<boolean> {
    if (this.status !== 'upcoming') {
      throw new Error('Cannot unregister from tournament that has already started');
    }
    
    if (!this.participants.has(userId)) {
      return false; // Not registered
    }
    
    try {
      // Remove participant from database
      await db.tournamentParticipants.delete({
        where: {
          tournament_id_user_id: {
            tournament_id: this.id,
            user_id: userId
          }
        }
      });
      
      this.participants.delete(userId);
      
      // Notify other participants about unregistration
      io.to(`tournament:${this.id}`).emit('tournament_update', {
        type: 'participant_left',
        tournament_id: this.id,
        participants_count: this.participants.size
      });
      
      return true;
    } catch (error) {
      console.error('Failed to unregister player:', error);
      throw error;
    }
  }
  
  public async start(): Promise<void> {
    if (this.status !== 'upcoming') {
      return;
    }
    
    try {
      // Update tournament status in database
      await db.tournaments.update({
        where: { id: this.id },
        data: { status: 'active' }
      });
      
      this.status = 'active';
      
      // Generate tournament brackets
      this.generateBrackets();
      
      // Notify participants that tournament has started
      io.to(`tournament:${this.id}`).emit('tournament_update', {
        type: 'tournament_started',
        tournament_id: this.id
      });
    } catch (error) {
      console.error('Failed to start tournament:', error);
      throw error;
    }
  }
  
  public async end(): Promise<void> {
    if (this.status !== 'active') {
      return;
    }
    
    try {
      // Update tournament status in database
      await db.tournaments.update({
        where: { id: this.id },
        data: { status: 'completed' }
      });
      
      this.status = 'completed';
      
      // Determine winners and award prizes
      await this.awardPrizes();
      
      // Notify participants that tournament has ended
      io.to(`tournament:${this.id}`).emit('tournament_update', {
        type: 'tournament_ended',
        tournament_id: this.id
      });
    } catch (error) {
      console.error('Failed to end tournament:', error);
      throw error;
    }
  }
  
  private generateBrackets(): void {
    // Convert participants set to array for easier manipulation
    const participantArray = Array.from(this.participants);
    
    // Shuffle participants for random pairings
    this.shuffleArray(participantArray);
    
    // Generate first round matches
    for (let i = 0; i < participantArray.length; i += 2) {
      if (i + 1 < participantArray.length) {
        const match: TournamentMatch = {
          id: `match-${this.id}-${i/2}`,
          round: 1,
          player1: participantArray[i],
          player2: participantArray[i + 1],
          status: 'pending',
          winner: null
        };
        
        this.matches.push(match);
      } else {
        // Odd number of participants, give bye to last player
        const match: TournamentMatch = {
          id: `match-${this.id}-${i/2}`,
          round: 1,
          player1: participantArray[i],
          player2: null, // Bye
          status: 'completed',
          winner: participantArray[i]
        };
        
        this.matches.push(match);
      }
    }
    
    // Save matches to database
    this.saveMatches();
  }
  
  private shuffleArray(array: string[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  
  private async saveMatches(): Promise<void> {
    try {
      // Save matches to database
      for (const match of this.matches) {
        await db.tournamentMatches.create({
          data: {
            id: match.id,
            tournament_id: this.id,
            round: match.round,
            player1_id: match.player1,
            player2_id: match.player2,
            status: match.status,
            winner_id: match.winner
          }
        });
      }
    } catch (error) {
      console.error('Failed to save matches:', error);
      throw error;
    }
  }
  
  public isCompleted(): boolean {
    // Tournament is completed when all matches are completed
    return this.matches.every(match => match.status === 'completed');
  }
  
  private async awardPrizes(): Promise<void> {
    try {
      // Find tournament winner
      const finalMatch = this.matches.find(match => 
        match.round === Math.ceil(Math.log2(this.participants.size)) && 
        match.status === 'completed'
      );
      
      if (!finalMatch || !finalMatch.winner) {
        console.error('Could not determine tournament winner');
        return;
      }
      
      const winnerId = finalMatch.winner;
      
      // Award XP or other prizes based on tournament prize
      if (this.prize.includes('XP')) {
        const xpAmount = parseInt(this.prize.split(' ')[0]);
        
        // Award XP to winner
        await db.users.update({
          where: { id: winnerId },
          data: {
            xp: {
              increment: xpAmount
            }
          }
        });
        
        // Notify winner
        io.to(winnerId).emit('xp_awarded', {
          amount: xpAmount,
          source: 'tournament_win',
          tournament_id: this.id
        });
      }
      
      // Record tournament result
      await db.tournamentResults.create({
        data: {
          tournament_id: this.id,
          winner_id: winnerId,
          completed_at: new Date()
        }
      });
    } catch (error) {
      console.error('Failed to award prizes:', error);
      throw error;
    }
  }
}
\`\`\`

## Real-time Updates

The Play page requires real-time updates for:

1. **Queue Status**: Updates on queue position and estimated wait time
2. **Match Found**: Notification when a match is found
3. **Tournament Updates**: Registration counts, start notifications
4. **Live Games**: Updates on ongoing games for spectating

### WebSocket Events

The server should emit the following events:

1. `queue_update`: Updates on queue status
2. `match_found`: When a match is found
3. `tournament_update`: Updates on tournament status
4. `live_game_update`: Updates on live games

### WebSocket Implementation

\`\`\`typescript
// server/websocket/PlayHandler.ts
export class PlayHandler {
  constructor(io: Server) {
    this.setupEventHandlers(io);
  }
  
  private setupEventHandlers(io: Server) {
    io.on('connection', (socket) => {
      // Handle queue join
      socket.on('join_queue', async (data) => {
        try {
          const { mode, timeControl } = data;
          const userId = socket.user.id;
          
          // Add user to queue
          const queueId = queueManager.addToQueue(userId, mode, timeControl, socket.user.rating);
          
          // Join queue room for updates
          socket.join(`queue:${queueId}`);
          
          // Send initial queue status
          socket.emit('queue_update', {
            status: 'joined',
            estimated_wait_time: 30
          });
        } catch (error) {
          socket.emit('error', {
            type: 'queue_join_error',
            message: error.message
          });
        }
      });
      
      // Handle queue leave
      socket.on('leave_queue', () => {
        try {
          const userId = socket.user.id;
          
          // Remove user from queue
          queueManager.removeFromQueue(userId);
          
          // Leave all queue rooms
          const rooms = Object.keys(socket.rooms);
          for (const room of rooms) {
            if (room.startsWith('queue:')) {
              socket.leave(room);
            }
          }
          
          socket.emit('queue_update', {
            status: 'left'
          });
        } catch (error) {
          socket.emit('error', {
            type: 'queue_leave_error',
            message: error.message
          });
        }
      });
      
      // Handle tournament join
      socket.on('join_tournament', async (data) => {
        try {
          const { tournamentId } = data;
          const userId = socket.user.id;
          
          // Register user for tournament
          await tournamentManager.registerPlayer(tournamentId, userId);
          
          // Join tournament room for updates
          socket.join(`tournament:${tournamentId}`);
          
          socket.emit('tournament_update', {
            type: 'joined',
            tournament_id: tournamentId
          });
        } catch (error) {
          socket.emit('error', {
            type: 'tournament_join_error',
            message: error.message
          });
        }
      });
      
      // Handle tournament leave
      socket.on('leave_tournament', async (data) => {
        try {
          const { tournamentId } = data;
          const userId = socket.user.id;
          
          // Unregister user from tournament
          await tournamentManager.unregisterPlayer(tournamentId, userId);
          
          // Leave tournament room
          socket.leave(`tournament:${tournamentId}`);
          
          socket.emit('tournament_update', {
            type: 'left',
            tournament_id: tournamentId
          });
        } catch (error) {
          socket.emit('error', {
            type: 'tournament_leave_error',
            message: error.message
          });
        }
      });
      
      // Handle spectate game
      socket.on('spectate_game', (data) => {
        try {
          const { gameId } = data;
          
          // Join game room for updates
          socket.join(`game:${gameId}`);
          
          socket.emit('spectate_update', {
            status: 'joined',
            game_id: gameId
          });
        } catch (error) {
          socket.emit('error', {
            type: 'spectate_error',
            message: error.message
          });
        }
      });
      
      // Handle disconnect
      socket.on('disconnect', () => {
        try {
          const userId = socket.user?.id;
          
          if (userId) {
            // Remove from queues
            queueManager.removeFromQueue(userId);
          }
        } catch (error) {
          console.error('Error handling disconnect:', error);
        }
      });
    });
  }
}
\`\`\`

## State Management

### React Context Structure

The Play page uses several React contexts to manage state:

1. **QueueContext**: Manages matchmaking queue state
2. **TournamentContext**: Manages tournament listings and registration
3. **LiveGamesContext**: Manages live games for spectating

### Example Context Implementation

\`\`\`typescript
// contexts/QueueContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import { useWebSocket } from './WebSocketContext';

type QueueContextType = {
  isInQueue: boolean;
  queueMode: string | null;
  queueTimeControl: string | null;
  estimatedWaitTime: number | null;
  startQueue: (mode: string, timeControl: string) => void;
  leaveQueue: () => void;
};

const QueueContext = createContext<QueueContextType | undefined>(undefined);

export function QueueProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { socket, connected } = useWebSocket();
  
  const [isInQueue, setIsInQueue] = useState(false);
  const [queueMode, setQueueMode] = useState<string | null>(null);
  const [queueTimeControl, setQueueTimeControl] = useState<string | null>(null);
  const [estimatedWaitTime, setEstimatedWaitTime] = useState<number | null>(null);
  
  useEffect(() => {
    if (!socket || !connected) return;
    
    // Listen for queue updates
    socket.on('queue_update', (data) => {
      if (data.status === 'joined') {
        setIsInQueue(true);
        setEstimatedWaitTime(data.estimated_wait_time || null);
      } else if (data.status === 'left') {
        setIsInQueue(false);
        setQueueMode(null);
        setQueueTimeControl(null);
        setEstimatedWaitTime(null);
      } else if (data.status === 'waiting') {
        setEstimatedWaitTime(data.estimated_wait_time || null);
      }
    });
    
    // Listen for match found
    socket.on('match_found', (data) => {
      setIsInQueue(false);
      setQueueMode(null);
      setQueueTimeControl(null);
      setEstimatedWaitTime(null);
      
      // Navigate to game
      window.location.href = `/game/${data.gameId}`;
    });
    
    return () => {
      socket.off('queue_update');
      socket.off('match_found');
    };
  }, [socket, connected]);
  
  const startQueue = (mode: string, timeControl: string) => {
    if (!socket || !connected) return;
    
    setQueueMode(mode);
    setQueueTimeControl(timeControl);
    
    socket.emit('join_queue', {
      mode,
      timeControl
    });
  };
  
  const leaveQueue = () => {
    if (!socket || !connected || !isInQueue) return;
    
    socket.emit('leave_queue');
  };
  
  return (
    <QueueContext.Provider value={{
      isInQueue,
      queueMode,
      queueTimeControl,
      estimatedWaitTime,
      startQueue,
      leaveQueue
    }}>
      {children}
    </QueueContext.Provider>
  );
}

export function useQueue() {
  const context = useContext(QueueContext);
  if (context === undefined) {
    throw new Error('useQueue must be used within a QueueProvider');
  }
  return context;
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

The Play page should handle the following error states:

1. **Queue Error**: Display error when joining/leaving queue fails
2. **Tournament Error**: Show error when tournament registration fails
3. **Connection Error**: Indicate when real-time updates are unavailable

## Performance Considerations

### Data Fetching Optimization

1. **Parallel Requests**: Fetch independent data in parallel
2. **Caching**: Cache stable data like tournament listings
3. **Pagination**: Use pagination for live games
4. **Incremental Loading**: Load tournament details incrementally

### React Optimization

1. **Memoization**: Use `useMemo` and `useCallback` for expensive calculations
2. **Code Splitting**: Lazy load components that aren't immediately visible
3. **Virtualization**: Use virtualized lists for tournament listings

By following these guidelines, the Play page will provide a responsive, real-time experience that efficiently communicates with the backend services.
\`\`\`
