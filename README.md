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
Create a .env file inside the server/ directory based on the .env.example
                       
## Client configuration
Create a .env file inside the client/ directory based on the .env.example

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
  
