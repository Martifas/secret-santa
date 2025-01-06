# Secret Santa Website
This is the server side of the Secret Santa program, providing the backend infrastructure for managing secret santa events, users, wishlists, and invitations.

## Features
- **Event Management**
  - Create and manage Secret Santa events with customizable budget limits
  - Set event dates and descriptions
  - Track event status and updates

- **User System**
  - Auth0 integration for secure authentication
  - User profile management with optional avatar support
  - Track user participation across multiple events

- **Invitation System**
  - Email-based invitations with secure tokens
  - Expiration dates for invitations
  - Track invitation status

- **Wishlist Management**
  - Create and manage personal wishlists
  - Add items with names, descriptions, prices, and URLs
  - Set item priorities
  - Track purchased status

## Installation
Required dependencies can be installed using:
```bash
cd packages/server
npm install
```

## Environment Setup
Create a `.env` file in the root directory based on `.env.example`:


## Database Configuration
```bash
DATABASE_URL= # PostgreSQL connection string (e.g., postgresql://user:password@localhost:5432/database)
```

## Auth0 Configuration
```bash
TOKEN_EXPIRES_IN=  #default 7 days
NODE_ENV= #default 'development'
TOKEN_KEY= #create secure one with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Server Configuration
```bash
PORT=3000 # Port number for the server to listen on
```

## Development
To start the development server with hot-reload:
```bash
npm run dev
```

## Database
The application uses Kysely for type-safe database operations with PostgreSQL.

## Database Migrations
```bash
# Create a new migration
npm run migrate:new

# Run migrations to latest version
npm run migrate:latest

# Generate TypeScript types from database schema
npm run gen:types
```

## Testing
The project uses Vitest for testing:
```bash
# Run tests in watch mode
npm run test

# Generate test coverage report
npm run coverage
```

## Tech Stack

- **Runtime:** Node.js

- **Language & Framework:** TypeScript, Express.js

- **API & Documentation:** tRPC, tRPC Panel

- **Database:** PostgreSQL, Kysely (Type-safe ORM)

- **Authentication & Validation:** Auth0 with express-oauth2-jwt-bearer, Zod for schema validation

- **Testing:** Vitest
