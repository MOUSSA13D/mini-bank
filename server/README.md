# Mini Bank Server

A Node.js/Express backend server for a mini banking application with agent management and transaction handling.

## Project Structure

```
/server/
├── 📁 controllers/             # Business logic
│   ├── agentController.js      # Agent CRUD operations
│   ├── transactionController.js # Transaction management
│   └── authController.js       # Authentication & user management
├── 📁 models/                  # Mongoose schemas
│   ├── Agent.js                # Agent model
│   └── Transaction.js          # Transaction model
├── 📁 routes/                  # API routes
│   ├── agents.js               # Agent routes (/api/agents)
│   ├── transactions.js         # Transaction routes (/api/transactions)
│   └── auth.js                 # Auth routes (/api/auth)
├── db.js                       # MongoDB connection
├── index.js                    # Main Express server
├── package.json                # Dependencies and scripts
└── .env.example               # Environment variables template
```

## Features

- **Agent Management**: Create, read, update, delete agents
- **Transaction Management**: Handle deposits, withdrawals, and transfers
- **Authentication**: JWT-based authentication system
- **Transaction Statistics**: Get insights on transaction data

## Installation

1. Navigate to the server directory:
   ```bash
   cd "/Users/macbook-air/Desktop/job react /server"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/mini-bank
   JWT_SECRET=your-super-secret-jwt-key-here
   PORT=5000
   NODE_ENV=development
   ```

4. Start MongoDB (if running locally)

5. Run the server:
   ```bash
   # Development mode with auto-restart
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new agent
- `POST /api/auth/login` - Login agent
- `GET /api/auth/profile` - Get current agent profile (protected)
- `PUT /api/auth/profile` - Update current agent profile (protected)

### Agents
- `GET /api/agents` - Get all agents
- `GET /api/agents/:id` - Get single agent
- `POST /api/agents` - Create new agent
- `PUT /api/agents/:id` - Update agent
- `DELETE /api/agents/:id` - Delete agent

### Transactions
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/stats` - Get transaction statistics
- `GET /api/transactions/agent/:agentId` - Get transactions by agent
- `GET /api/transactions/:id` - Get single transaction
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

## Data Models

### Agent Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  phone: String (required),
  agency: String (required),
  status: String (enum: ['active', 'inactive'], default: 'active'),
  createdAt: Date,
  updatedAt: Date
}
```

### Transaction Model
```javascript
{
  type: String (enum: ['deposit', 'withdrawal', 'transfer'], required),
  amount: Number (required, min: 0),
  agentId: ObjectId (ref: 'Agent', required),
  description: String,
  status: String (enum: ['pending', 'completed', 'failed'], default: 'pending'),
  reference: String (unique),
  createdAt: Date,
  updatedAt: Date
}
```

## Usage Example

```bash
# Register a new agent
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "agency": "Main Branch",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'

# Create a transaction (use token from login)
curl -X POST http://localhost:5000/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "type": "deposit",
    "amount": 1000,
    "agentId": "AGENT_ID",
    "description": "Customer deposit"
  }'
```

## Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management
