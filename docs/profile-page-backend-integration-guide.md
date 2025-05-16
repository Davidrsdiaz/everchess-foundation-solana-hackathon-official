# Profile Page Backend Integration Guide

This guide provides comprehensive information for integrating the Profile page with backend services, including API endpoints, data models, WebSocket events, and implementation details.

## Overview

The Profile page allows users to:
- View and edit their profile information
- See their game statistics and history
- Track achievements and progress
- Manage connected wallets and accounts
- View their inventory and equipped items

## API Endpoints

### Get User Profile

\`\`\`
GET /api/users/me/profile
\`\`\`

**Response:**
\`\`\`json
{
  "id": "user_123",
  "username": "ChessMaster42",
  "display_name": "Chess Master",
  "avatar": "/profile-avatar.svg",
  "bio": "Chess enthusiast from California",
  "created_at": "2024-01-15T10:30:00Z",
  "social": {
    "twitter": "chessmaster42",
    "discord": "ChessMaster#1234"
  },
  "preferences": {
    "notifications": {
      "game_invites": true,
      "friend_requests": true,
      "tournaments": true,
      "promotions": false
    },
    "privacy": {
      "show_online_status": true,
      "show_game_history": true,
      "allow_friend_requests": true
    }
  },
  "connected_accounts": [
    {
      "type": "google",
      "connected_at": "2024-01-15T10:30:00Z"
    },
    {
      "type": "discord",
      "connected_at": "2024-02-20T14:45:00Z"
    }
  ],
  "wallets": [
    {
      "blockchain": "solana",
      "address": "8ZUn...",
      "connected_at": "2024-03-10T09:15:00Z"
    }
  ]
}
\`\`\`

### Update User Profile

\`\`\`
PATCH /api/users/me/profile
\`\`\`

**Request Body:**
\`\`\`json
{
  "display_name": "Chess Grandmaster",
  "bio": "Chess enthusiast and competitor from California",
  "social": {
    "twitter": "chessgrandmaster",
    "discord": "ChessMaster#1234"
  },
  "preferences": {
    "notifications": {
      "promotions": true
    }
  }
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "profile": {
    "id": "user_123",
    "username": "ChessMaster42",
    "display_name": "Chess Grandmaster",
    "avatar": "/profile-avatar.svg",
    "bio": "Chess enthusiast and competitor from California",
    "created_at": "2024-01-15T10:30:00Z",
    "social": {
      "twitter": "chessgrandmaster",
      "discord": "ChessMaster#1234"
    },
    "preferences": {
      "notifications": {
        "game_invites": true,
        "friend_requests": true,
        "tournaments": true,
        "promotions": true
      },
      "privacy": {
        "show_online_status": true,
        "show_game_history": true,
        "allow_friend_requests": true
      }
    }
  }
}
\`\`\`

### Update Avatar

\`\`\`
POST /api/users/me/avatar
\`\`\`

**Request Body:**
Form data with file upload

**Response:**
\`\`\`json
{
  "success": true,
  "avatar_url": "/avatars/user_123/custom_avatar.png"
}
\`\`\`

### Get User Statistics

\`\`\`
GET /api/users/me/stats
\`\`\`

**Response:**
\`\`\`json
{
  "rating": {
    "current": 1250,
    "peak": 1320,
    "history": [
      {"date": "2025-01-01", "rating": 1200},
      {"date": "2025-02-01", "rating": 1240},
      {"date": "2025-03-01", "rating": 1250}
    ]
  },
  "games": {
    "total": 152,
    "wins": 78,
    "losses": 65,
    "draws": 9,
    "win_rate": 51.3
  },
  "time_played": {
    "total_seconds": 98540,
    "formatted": "27:22:20"
  },
  "achievements": {
    "total": 24,
    "completed": 15,
    "recent": [
      {
        "id": "achievement_123",
        "name": "First Victory",
        "description": "Win your first game",
        "icon": "/achievements/first-victory.png",
        "completed_at": "2025-01-16T14:30:00Z"
      },
      {
        "id": "achievement_124",
        "name": "Checkmate Master",
        "description": "Win a game with a checkmate in under 20 moves",
        "icon": "/achievements/checkmate-master.png",
        "completed_at": "2025-02-10T19:45:00Z"
      }
    ]
  },
  "battlepass": {
    "current_level": 24,
    "xp": 2400,
    "next_level_xp": 3000
  },
  "balance": {
    "gold": 12500,
    "sol": 1.25
  }
}
\`\`\`

### Get Game History

\`\`\`
GET /api/users/me/games
\`\`\`

**Query Parameters:**
- `page` (optional): Page number for pagination
- `limit` (optional): Games per page (default: 20)
- `result` (optional): Filter by result (win, loss, draw)

**Response:**
\`\`\`json
{
  "games": [
    {
      "id": "game_123",
      "opponent": {
        "id": "user_456",
        "username": "GrandMaster99",
        "avatar": "/profile-avatar.svg",
        "rating": 1280
      },
      "result": "win",
      "rating_change": +12,
      "moves": 34,
      "duration": "12:45",
      "timestamp": "2025-03-15T18:30:00Z",
      "chess_set_used": "Inferno Set"
    },
    {
      "id": "game_122",
      "opponent": {
        "id": "user_789",
        "username": "ChessWizard",
        "avatar": "/avatars/user_789/custom_avatar.png",
        "rating": 1310
      },
      "result": "loss",
      "rating_change": -8,
      "moves": 42,
      "duration": "18:22",
      "timestamp": "2025-03-14T20:15:00Z",
      "chess_set_used": "Classic Wood"
    }
    // More games...
  ],
  "total": 152,
  "page": 1,
  "limit": 20
}
\`\`\`

### Get Game Details

\`\`\`
GET /api/games/:gameId
\`\`\`

**Response:**
\`\`\`json
{
  "id": "game_123",
  "players": {
    "white": {
      "id": "user_123",
      "username": "ChessMaster42",
      "rating": 1238
    },
    "black": {
      "id": "user_456",
      "username": "GrandMaster99",
      "rating": 1280
    }
  },
  "result": {
    "winner": "white",
    "reason": "checkmate",
    "rating_changes": {
      "white": +12,
      "black": -12
    }
  },
  "game_data": {
    "moves": [
      {
        "from": "e2",
        "to": "e4",
        "piece": "p",
        "timestamp": "2025-03-15T18:30:15Z"
      },
      {
        "from": "e7",
        "to": "e5",
        "piece": "p",
        "timestamp": "2025-03-15T18:30:30Z"
      }
      // More moves...
    ],
    "pgn": "1. e4 e5 2. Nf3 Nc6 3. Bb5 ...",
    "final_position": "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2"
  },
  "timestamps": {
    "started_at": "2025-03-15T18:30:00Z",
    "ended_at": "2025-03-15T18:42:45Z",
    "duration": "12:45"
  },
  "chess_sets": {
    "white": "Inferno Set",
    "black": "Classic Wood"
  }
}
\`\`\`

### Get Achievements

\`\`\`
GET /api/users/me/achievements
\`\`\`

**Query Parameters:**
- `status` (optional): Filter by status (completed, in_progress, all)

**Response:**
\`\`\`json
{
  "achievements": [
    {
      "id": "achievement_123",
      "name": "First Victory",
      "description": "Win your first game",
      "icon": "/achievements/first-victory.png",
      "category": "beginner",
      "status": "completed",
      "completed_at": "2025-01-16T14:30:00Z",
      "rewards": {
        "xp": 100,
        "gold": 500
      }
    },
    {
      "id": "achievement_125",
      "name": "Century Club",
      "description": "Play 100 games",
      "icon": "/achievements/century-club.png",
      "category": "dedication",
      "status": "in_progress",
      "progress": {
        "current": 78,
        "target": 100,
        "percentage": 78
      },
      "rewards": {
        "xp": 500,
        "gold": 1000
      }
    }
    // More achievements...
  ],
  "categories": [
    {
      "id": "beginner",
      "name": "Beginner Milestones",
      "completed": 5,
      "total": 5
    },
    {
      "id": "dedication",
      "name": "Dedication",
      "completed": 3,
      "total": 8
    }
    // More categories...
  ],
  "summary": {
    "completed": 15,
    "in_progress": 9,
    "locked": 10,
    "total": 34
  }
}
\`\`\`

### Get Inventory

\`\`\`
GET /api/users/me/inventory
\`\`\`

**Query Parameters:**
- `category` (optional): Filter by category (chess-sets, consumables, etc.)

**Response:**
\`\`\`json
{
  "inventory": [
    {
      "id": "inv_123",
      "item_id": "item_456",
      "name": "Inferno Chess Set",
      "category": "chess-sets",
      "rarity": "epic",
      "acquired_at": "2025-02-15T14:30:00Z",
      "equipped": true,
      "is_nft": true,
      "blockchain_data": {
        "token_id": "...",
        "contract_address": "..."
      },
      "image": "/chess-sets/inferno-set-icon.png"
    },
    {
      "id": "inv_124",
      "item_id": "item_789",
      "name": "XP Booster",
      "category": "consumables",
      "rarity": "rare",
      "acquired_at": "2025-03-01T10:15:00Z",
      "quantity": 3,
      "description": "Increases XP earned by 50% for 24 hours",
      "image": "/items/xp-booster.png"
    }
    // More inventory items...
  ],
  "equipped": {
    "chess_set": "inv_123"
  },
  "summary": {
    "total_items": 24,
    "by_category": {
      "chess-sets": 5,
      "consumables": 12,
      "cosmetics": 7
    },
    "by_rarity": {
      "common": 10,
      "rare": 8,
      "epic": 5,
      "legendary": 1
    }
  }
}
\`\`\`

### Connect Wallet

\`\`\`
POST /api/users/me/wallets
\`\`\`

**Request Body:**
\`\`\`json
{
  "blockchain": "solana",
  "address": "8ZUn...",
  "signature": "..."
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "wallet": {
    "blockchain": "solana",
    "address": "8ZUn...",
    "connected_at": "2025-04-10T15:30:00Z"
  }
}
\`\`\`

### Disconnect Wallet

\`\`\`
DELETE /api/users/me/wallets/:blockchain
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "message": "Wallet disconnected successfully"
}
\`\`\`

## WebSocket Events

### Profile Update

\`\`\`json
{
  "event": "profile:updated",
  "data": {
    "field": "display_name",
    "value": "Chess Grandmaster"
  }
}
\`\`\`

### Achievement Unlocked

\`\`\`json
{
  "event": "profile:achievement_unlocked",
  "data": {
    "achievement_id": "achievement_126",
    "name": "Tactical Genius",
    "description": "Win a game with a discovered check",
    "icon": "/achievements/tactical-genius.png",
    "rewards": {
      "xp": 200,
      "gold": 300
    },
    "notification": "Achievement Unlocked: Tactical Genius!"
  }
}
\`\`\`

### Rating Update

\`\`\`json
{
  "event": "profile:rating_update",
  "data": {
    "old_rating": 1250,
    "new_rating": 1262,
    "change": +12,
    "game_id": "game_124"
  }
}
\`\`\`

### Balance Update

\`\`\`json
{
  "event": "profile:balance_update",
  "data": {
    "currency": "gold",
    "old_balance": 12500,
    "new_balance": 13000,
    "change": +500,
    "reason": "achievement_reward"
  }
}
\`\`\`

### Inventory Update

\`\`\`json
{
  "event": "profile:inventory_updated",
  "data": {
    "action": "added",
    "item": {
      "id": "inv_125",
      "item_id": "item_321",
      "name": "Crystal Kingdom Set",
      "category": "chess-sets",
      "rarity": "legendary"
    }
  }
}
\`\`\`

## Data Models

### UserProfile

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique user identifier |
| username | string | Unique username |
| display_name | string | User's display name |
| avatar | string | URL to user's avatar image |
| bio | string | User's biography |
| created_at | string | Account creation timestamp |
| social | object | Social media handles |
| preferences | object | User preferences |
| connected_accounts | array | Third-party accounts |
| wallets | array | Connected blockchain wallets |

### UserStats

| Field | Type | Description |
|-------|------|-------------|
| rating | object | Chess rating information |
| games | object | Game statistics |
| time_played | object | Total time played |
| achievements | object | Achievement progress |
| battlepass | object | Battlepass progress |
| balance | object | Currency balances |

### Game

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique game identifier |
| players | object | Player information |
| result | object | Game result and rating changes |
| game_data | object | Moves and game state |
| timestamps | object | Game timing information |
| chess_sets | object | Chess sets used by players |

### Achievement

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique achievement identifier |
| name | string | Achievement name |
| description | string | Achievement description |
| icon | string | URL to achievement icon |
| category | string | Achievement category |
| status | string | Completion status |
| completed_at | string | When achievement was completed |
| progress | object | Progress for incomplete achievements |
| rewards | object | Rewards for completing achievement |

### InventoryItem

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique inventory identifier |
| item_id | string | Reference to market item |
| name | string | Item name |
| category | string | Item category |
| rarity | string | Item rarity |
| acquired_at | string | When item was acquired |
| equipped | boolean | Whether item is equipped |
| is_nft | boolean | Whether item is an NFT |
| blockchain_data | object | Optional blockchain information |
| image | string | URL to item image |
| quantity | number | Quantity for stackable items |

### Wallet

| Field | Type | Description |
|-------|------|-------------|
| blockchain | string | Blockchain type (solana, etc.) |
| address | string | Wallet address |
| connected_at | string | When wallet was connected |

## Implementation Details

### Profile Editing

1. **Avatar Upload:**
   - Client uploads image to `/api/users/me/avatar`
   - Backend validates image (size, format)
   - Processes image (resizing, optimization)
   - Stores in CDN or file storage
   - Updates user profile with new avatar URL

2. **Profile Updates:**
   - Client sends PATCH request with changed fields only
   - Backend validates input
   - Updates database
   - Returns updated profile
   - Sends WebSocket event to update other sessions

### Game History

1. **Loading Game History:**
   - Paginated API calls to `/api/users/me/games`
   - Client implements infinite scroll
   - Filters by game result (wins, losses, draws)

2. **Game Details:**
   - On-demand loading of detailed game information
   - Chess board replay functionality
   - Move-by-move analysis

### Achievement System

1. **Achievement Tracking:**
   - Backend continuously tracks user actions
   - When criteria met, marks achievement as completed
   - Awards associated rewards (XP, gold)
   - Sends WebSocket event to notify user
   - Updates achievements list

2. **Progress Tracking:**
   - For cumulative achievements, tracks progress
   - Updates percentage completion
   - Shows in UI with progress bars

### Wallet Integration

1. **Connecting Wallet:**
   - User initiates wallet connection
   - Client gets wallet address and requests signature
   - Backend verifies signature to prove ownership
   - Associates wallet with user account
   - Updates profile with wallet information

2. **NFT Verification:**
   - Backend periodically checks on-chain data
   - Verifies NFT ownership
   - Updates inventory with blockchain status

## Error Handling

The Profile page should handle these common errors:

1. **Network Errors:**
   - Implement retry logic for failed API calls
   - Cache profile data for offline viewing
   - Queue profile updates for when connection is restored

2. **Image Upload Errors:**
   - Validate file size and type client-side
   - Show clear error messages for invalid uploads
   - Provide retry functionality

3. **Wallet Connection Errors:**
   - Handle wallet not found or not installed
   - Provide clear instructions for wallet setup
   - Handle signature rejection gracefully

## Security Considerations

1. **Profile Updates:**
   - Validate all input server-side
   - Sanitize text inputs to prevent XSS
   - Rate limit update requests

2. **Wallet Security:**
   - Never store private keys or seed phrases
   - Always verify signatures for wallet operations
   - Use secure methods for blockchain interactions

3. **Privacy Controls:**
   - Honor user privacy settings
   - Implement proper access controls for profile data
   - Allow users to control data visibility

## Performance Optimization

1. **Caching:**
   - Cache profile data with appropriate TTL
   - Use browser storage for game history
   - Implement efficient invalidation strategies

2. **Lazy Loading:**
   - Load game history on demand
   - Implement pagination for achievements and inventory
   - Defer loading of detailed statistics

3. **Image Optimization:**
   - Optimize avatar and achievement icons
   - Use appropriate image formats
   - Implement responsive images

## Testing Strategy

1. **Unit Tests:**
   - Test profile update validation
   - Test achievement progress calculation
   - Test wallet signature verification

2. **Integration Tests:**
   - Test complete profile update flow
   - Test achievement unlocking and rewards
   - Test wallet connection and verification

3. **End-to-End Tests:**
   - Test profile editing user flow
   - Test game history browsing
   - Test achievement viewing and tracking

## Monitoring and Analytics

1. **Key Metrics:**
   - Profile completion rate
   - Wallet connection rate
   - Achievement completion statistics
   - Time spent viewing game history

2. **Error Tracking:**
   - Monitor failed profile updates
   - Track wallet connection failures
   - Monitor achievement processing errors

## Mobile Considerations

1. **Responsive Design:**
   - Optimize profile layout for mobile
   - Simplify game history view
   - Ensure touch-friendly UI elements

2. **Performance:**
   - Reduce data usage for mobile
   - Optimize image loading
   - Consider offline profile viewing

## Conclusion

The Profile page is a central component of the Everchess platform, providing users with a personalized space to track their progress, view their game history, and manage their account. By following this integration guide, developers can ensure a seamless and responsive profile experience that properly integrates with the game system, achievement tracking, and blockchain functionality.
