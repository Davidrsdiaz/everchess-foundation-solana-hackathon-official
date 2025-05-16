# Market Page Backend Integration Guide

This guide provides comprehensive information for integrating the Market page with backend services, including API endpoints, data models, WebSocket events, and implementation details.

## Overview

The Market page allows users to:
- Browse available chess sets, items, and NFTs
- Purchase items using in-game currency or SOL
- View limited-time offers and promotions
- Filter and search for specific items
- View item details and previews

## API Endpoints

### Get Market Items

\`\`\`
GET /api/market/items
\`\`\`

**Query Parameters:**
- `category` (optional): Filter by category (chess-sets, consumables, cosmetics, etc.)
- `rarity` (optional): Filter by rarity (common, rare, epic, legendary)
- `price_min` (optional): Minimum price
- `price_max` (optional): Maximum price
- `sort_by` (optional): Sort field (price, popularity, release_date)
- `sort_order` (optional): asc or desc
- `page` (optional): Page number for pagination
- `limit` (optional): Items per page (default: 20)

**Response:**
\`\`\`json
{
  "items": [
    {
      "id": "item_123",
      "name": "Inferno Chess Set",
      "description": "A fiery chess set with lava-themed pieces",
      "category": "chess-sets",
      "rarity": "epic",
      "price": {
        "amount": 5000,
        "currency": "gold"
      },
      "images": {
        "thumbnail": "/chess-sets/inferno-set-icon.png",
        "preview": "/chess-sets/inferno-set-preview.png"
      },
      "is_nft": true,
      "blockchain_data": {
        "contract_address": "...",
        "token_id": "..."
      },
      "available_until": "2025-06-30T23:59:59Z",
      "stock": 50,
      "sold": 120
    },
    // More items...
  ],
  "total": 156,
  "page": 1,
  "limit": 20
}
\`\`\`

### Get Featured Items

\`\`\`
GET /api/market/featured
\`\`\`

**Response:**
\`\`\`json
{
  "featured": [
    {
      "id": "item_456",
      "name": "Crystal Kingdom Set",
      "description": "Limited edition crystal-themed chess set",
      "discount": 20,
      "original_price": {
        "amount": 6000,
        "currency": "gold"
      },
      "price": {
        "amount": 4800,
        "currency": "gold"
      },
      "images": {
        "thumbnail": "/chess-sets/crystal-set-icon.png",
        "preview": "/chess-sets/crystal-set-preview.png",
        "banner": "/promotions/crystal-set-banner.png"
      },
      "available_until": "2025-05-15T23:59:59Z"
    },
    // More featured items...
  ]
}
\`\`\`

### Get Item Details

\`\`\`
GET /api/market/items/:itemId
\`\`\`

**Response:**
\`\`\`json
{
  "id": "item_123",
  "name": "Inferno Chess Set",
  "description": "A fiery chess set with lava-themed pieces",
  "category": "chess-sets",
  "rarity": "epic",
  "price": {
    "amount": 5000,
    "currency": "gold"
  },
  "images": {
    "thumbnail": "/chess-sets/inferno-set-icon.png",
    "preview": "/chess-sets/inferno-set-preview.png",
    "pieces": {
      "pawn": "/chess-sets/inferno/pawn.png",
      "rook": "/chess-sets/inferno/rook.png",
      "knight": "/chess-sets/inferno/knight.png",
      "bishop": "/chess-sets/inferno/bishop.png",
      "queen": "/chess-sets/inferno/queen.png",
      "king": "/chess-sets/inferno/king.png"
    }
  },
  "is_nft": true,
  "blockchain_data": {
    "contract_address": "...",
    "token_id": "...",
    "blockchain": "solana"
  },
  "available_until": "2025-06-30T23:59:59Z",
  "stock": 50,
  "sold": 120,
  "attributes": [
    {
      "name": "Special Effects",
      "value": "Flame trails on move"
    },
    {
      "name": "Sound Pack",
      "value": "Crackling fire sounds"
    }
  ],
  "release_date": "2025-01-15T00:00:00Z"
}
\`\`\`

### Purchase Item

\`\`\`
POST /api/market/purchase
\`\`\`

**Request Body:**
\`\`\`json
{
  "item_id": "item_123",
  "currency": "gold"
}
\`\`\`

**Response (Success):**
\`\`\`json
{
  "success": true,
  "transaction_id": "txn_789",
  "item_id": "item_123",
  "inventory_id": "inv_456",
  "balance": {
    "gold": 12500,
    "sol": 1.25
  }
}
\`\`\`

**Response (Error - Insufficient Funds):**
\`\`\`json
{
  "success": false,
  "error": "insufficient_funds",
  "message": "Not enough gold to complete this purchase",
  "required": 5000,
  "available": 3000
}
\`\`\`

**Response (Error - Out of Stock):**
\`\`\`json
{
  "success": false,
  "error": "out_of_stock",
  "message": "This item is currently out of stock"
}
\`\`\`

### Get Purchase History

\`\`\`
GET /api/market/history
\`\`\`

**Query Parameters:**
- `page` (optional): Page number for pagination
- `limit` (optional): Items per page (default: 20)

**Response:**
\`\`\`json
{
  "transactions": [
    {
      "id": "txn_789",
      "item_id": "item_123",
      "item_name": "Inferno Chess Set",
      "price": {
        "amount": 5000,
        "currency": "gold"
      },
      "timestamp": "2025-04-01T14:32:15Z",
      "status": "completed"
    },
    // More transactions...
  ],
  "total": 12,
  "page": 1,
  "limit": 20
}
\`\`\`

### Get NFT Purchase Status

\`\`\`
GET /api/market/nft-status/:transactionId
\`\`\`

**Response (Pending):**
\`\`\`json
{
  "status": "pending",
  "transaction_id": "txn_789",
  "blockchain_txn": "sol_tx_123",
  "message": "Transaction is being processed on the blockchain"
}
\`\`\`

**Response (Completed):**
\`\`\`json
{
  "status": "completed",
  "transaction_id": "txn_789",
  "blockchain_txn": "sol_tx_123",
  "token_id": "nft_456",
  "message": "NFT has been minted and added to your inventory"
}
\`\`\`

## WebSocket Events

### Item Stock Updates

\`\`\`json
{
  "event": "market:stock_update",
  "data": {
    "item_id": "item_123",
    "stock": 49,
    "sold": 121
  }
}
\`\`\`

### New Item Available

\`\`\`json
{
  "event": "market:new_item",
  "data": {
    "item_id": "item_789",
    "name": "Dragon Kingdom Set",
    "category": "chess-sets",
    "rarity": "legendary",
    "notification": "New legendary chess set available in the market!"
  }
}
\`\`\`

### Limited Time Offer

\`\`\`json
{
  "event": "market:limited_offer",
  "data": {
    "item_id": "item_456",
    "name": "Crystal Kingdom Set",
    "discount": 20,
    "ends_at": "2025-05-15T23:59:59Z",
    "notification": "Limited time offer: 20% off Crystal Kingdom Set!"
  }
}
\`\`\`

### Purchase Confirmation

\`\`\`json
{
  "event": "market:purchase_confirmed",
  "data": {
    "transaction_id": "txn_789",
    "item_id": "item_123",
    "inventory_id": "inv_456",
    "balance": {
      "gold": 12500,
      "sol": 1.25
    }
  }
}
\`\`\`

## Data Models

### MarketItem

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier for the item |
| name | string | Display name of the item |
| description | string | Detailed description |
| category | string | Item category (chess-sets, consumables, etc.) |
| rarity | string | Item rarity (common, rare, epic, legendary) |
| price | object | Price information with amount and currency |
| images | object | URLs to item images (thumbnail, preview, etc.) |
| is_nft | boolean | Whether the item is an NFT |
| blockchain_data | object | Optional blockchain information for NFTs |
| available_until | string | Optional expiration date for limited items |
| stock | number | Available quantity (null for unlimited) |
| sold | number | Number of items sold |
| attributes | array | Additional item attributes |
| release_date | string | When the item was added to the market |

### Transaction

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique transaction identifier |
| user_id | string | ID of the user who made the purchase |
| item_id | string | ID of the purchased item |
| price | object | Price paid (amount and currency) |
| timestamp | string | When the transaction occurred |
| status | string | Transaction status (completed, pending, failed) |
| blockchain_txn | string | Optional blockchain transaction ID for NFTs |
| inventory_id | string | ID of the inventory entry created |

## Implementation Details

### Purchase Flow

1. **Regular Items:**
   - User initiates purchase
   - Backend validates user balance
   - If sufficient, deducts balance and adds item to inventory
   - Returns success response with updated balance
   - Sends WebSocket event to update UI

2. **NFT Items:**
   - User initiates purchase
   - Backend validates user balance
   - If sufficient, creates pending transaction
   - Initiates blockchain transaction to mint NFT
   - Returns pending status
   - Client polls for status or listens for WebSocket events
   - Once blockchain transaction completes, updates inventory
   - Sends WebSocket event with final status

### Inventory Integration

When a user purchases an item, the system:

1. Creates a new entry in the user's inventory
2. For chess sets, makes them available in the Chess Sets page
3. For consumables, makes them available for use in relevant contexts
4. For NFTs, associates the blockchain token with the user's account

### Blockchain Integration

For NFT items, the system integrates with the Solana blockchain:

1. Uses a server-side wallet to mint or transfer NFTs
2. Stores blockchain transaction IDs for reference
3. Verifies ownership through on-chain data
4. Handles gas fees for transactions

## Error Handling

The Market page should handle these common errors:

1. **Network Errors:**
   - Implement retry logic for failed API calls
   - Cache item data to allow browsing during connectivity issues

2. **Purchase Errors:**
   - Insufficient funds: Show clear message with current balance
   - Out of stock: Update UI and disable purchase button
   - Transaction failure: Provide retry option and support contact

3. **Blockchain Errors:**
   - Transaction timeout: Implement status checking
   - Failed minting: Refund user and notify support

## Security Considerations

1. **Purchase Validation:**
   - Always verify balance and availability server-side
   - Implement idempotency to prevent duplicate purchases
   - Rate limit purchase requests to prevent abuse

2. **NFT Security:**
   - Use secure wallet management for minting operations
   - Implement proper signature verification for blockchain transactions
   - Store minimal blockchain data in the database

## Performance Optimization

1. **Caching:**
   - Cache market item listings with appropriate TTL
   - Use CDN for item images and previews
   - Implement client-side caching for frequently accessed data

2. **Pagination:**
   - Always paginate market listings
   - Implement infinite scroll with efficient data loading
   - Pre-fetch next page data for smoother experience

3. **Image Optimization:**
   - Use appropriate image formats and sizes
   - Implement lazy loading for item previews
   - Consider using image placeholders during loading

## Testing Strategy

1. **Unit Tests:**
   - Test purchase validation logic
   - Test price calculation and discount logic
   - Test inventory update functions

2. **Integration Tests:**
   - Test complete purchase flow
   - Test inventory updates after purchase
   - Test WebSocket event handling

3. **Blockchain Tests:**
   - Test NFT minting in test environment
   - Test transaction status tracking
   - Test error recovery for failed blockchain operations

## Monitoring and Analytics

1. **Key Metrics:**
   - Purchase conversion rate
   - Popular items and categories
   - Average time spent browsing
   - Cart abandonment rate

2. **Error Tracking:**
   - Monitor failed purchases
   - Track blockchain transaction failures
   - Monitor inventory inconsistencies

## Mobile Considerations

1. **Responsive Design:**
   - Optimize market grid for smaller screens
   - Simplify filters on mobile
   - Ensure touch-friendly UI elements

2. **Performance:**
   - Reduce image sizes for mobile
   - Optimize network requests
   - Consider offline browsing capability

## Conclusion

The Market page is a critical component of the Everchess platform, enabling users to acquire new chess sets and items. By following this integration guide, developers can ensure a seamless and reliable shopping experience that properly integrates with the inventory system, blockchain functionality, and user balance management.
