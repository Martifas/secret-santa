# Secret Santa Website

LIVE PAGE: https://giftmeister.eu/

A full-stack application for organizing and managing Secret Santa events. Users can create events, invite participants, manage wishlists, and participate in gift exchanges.

## Features
- **Event Management**
  - Create and manage Secret Santa events with customizable budget limits
  - Set event dates and descriptions
  - Track event status and updates

- **User System**
  - Authentication via Auth0 integration with Google login
  - User profile management with basic information
  - Track user participation across multiple events

- **Invitation System**
  - Email-based invitations
  - Email bodies with all essential information
  - Track invitation status

- **Wishlist Management**
  - Create and manage personal wishlists
  - Add items with names, descriptions, and prices
  - Delete unwanted items

## Installation
Required dependencies can be installed using:
```bash
npm install
```

## Environment Setup
Create a .env file inside the server/ directory based on the .env.example:

## Server Configuration
```bash
NODE_ENV=development                 # Environment mode (default: 'development')
PORT=3000                            # Port number for the server to listen on
```

# Database Configuration
```bash
DATABASE_URL=postgres://postgres:password@localhost:5432/database_name  # PostgreSQL connection string
```

# Auth0 Configuration
```bash
AUTH0_ISSUER_BASE_URL=https://your-auth0-domain.us.auth0.com           # Auth0 issuer base URL
AUTH0_CLIENT_ID=your_auth0_client_id                                   # Auth0 client ID
AUTH0_CLIENT_SECRET=your_auth0_client_secret                           # Auth0 client secret
AUTH0_SECRET=your_random_secret                                        # Secure secret for Auth0 sessions
```

# Application URLs
```bash
BASE_URL=http://localhost:3000                                         # Base URL for the server
HOST_URL=http://localhost:5173/                                        # URL for the client app
```

# Email Configuration
```bash
EMAIL_SENDER=your_email@gmail.com                                      # Sender email address
EMAIL_PASSWORD=your_email_password                                    # Email password (use app-specific password if needed)
```

## Client configuration
Create a .env file inside the client/ directory based on the .env.example:

# API Configuration
```bash
VITE_API_ORIGIN=http://localhost:3000                                  # Origin URL of the API
VITE_API_PATH=/api/v1/trpc                                            # API path for tRPC
```

# Auth0 Configuration
```bash
VITE_AUTH0_DOMAIN=https://your-auth0-domain.us.auth0.com              # Auth0 domain
VITE_AUTH0_CLIENT_ID=your_auth0_client_id                             # Auth0 client ID
VITE_AUTH0_AUDIENCE=https://your-auth0-audience/                      # Auth0 audience for API access
```

# Gift Recommendation Service
```bash
VITE_GIFT_RECOMMMENDATION_PUBLIC_KEY=your_public_key                  # Public key for gift recommendation service
```

# Testing Credentials
```bash
VITE_TESTING_EMAIL=your_testing_email@gmail.com                       # Test email for development/testing
VITE_TESTING_PASSWORD=your_testing_password                           # Test password for development/testing
```

## Development
To start the development server with hot-reload:
```bash
npm run dev -w=server
```

## Database
The application uses Kysely for type-safe database operations with PostgreSQL.

## Database Migrations
```bash
# Create a new migration
npm run migrate:new -w=server

# Run migrations to latest version
npm run migrate:latest -w=server

# Generate TypeScript types from database schema
npm run gen:types -w=server
```

## Testing
The project uses Vitest for testing.

Server tests:
```bash
# Run tests in watch mode
npm run test -w=server

# Generate test coverage report
npm run coverage -w=server
```
Client tests:
```bash
# Run unit tests in watch mode
npm run test:unit -w=client

# Run e2e tests:
npm run test:e2e -w=server
```

Be aware that e2e tests require VITE_TESTING_EMAIL and VITE_TESTING_PASSWORD set. You can get these by registering to the app using Auth0.


## Tech Stack
### Backend:

- Node.js, TypeScript, Express
- tRPC with Panel for API
- PostgreSQL with Kysely ORM
- Pino logging
- Nodemailer for emails
- Vitest testing

### Frontend:

- Vue 3, TypeScript
- Vite
- TailwindCSS, Flowbite
- Auth0 with Google login
- Vue Router, Pinia

### Development:

- ESLint, Prettier
- Playwright E2E tests
- GitHub Actions CI/CD

## Planned features
Future features involve additional functionalies, options:
- Delete wishlist
- Options to change user picture, name
- More explicit errors UI
  
