# Currency Exchange Service

A real-time currency exchange service based on Server-Sent Events (SSE) that supports converting Chinese Yuan (CNY) to various international currencies.

## Features

- Real-time communication using SSE
- Currency conversion from CNY to multiple international currencies
- MCP (Model Context Protocol) tool service integration
- Type-safe implementation using TypeScript

## Tech Stack

- Node.js
- TypeScript
- Express.js
- Server-Sent Events (SSE)
- MCP SDK
- Zod (Type validation)

## Installation

```bash
# Clone the repository
git clone [repository-url]

# Install dependencies
npm install
```

## Running the Service

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm run build
npm start
```

The server will start at http://localhost:3001

## API Documentation

### SSE Connection
```
GET /sse
```
Establishes an SSE connection for receiving real-time data.

### Send Messages
```
POST /messages?sessionId=[sessionId]
```

### Using MCP Tool

The service provides an `exchange` tool for currency conversion:

```typescript
{
  "amount": number,       // Amount to convert
  "fromCurrency": "CNY", // Source currency (currently only CNY supported)
  "toCurrencies": string[] // Array of target currencies
}
```

Example:
```json
{
  "amount": 100,
  "fromCurrency": "CNY",
  "toCurrencies": ["USD", "EUR", "JPY"]
}
```

## Supported Currencies

Currently supports converting CNY to the following currencies:

- USD (United States Dollar)
- EUR (Euro)
- JPY (Japanese Yen)
- GBP (British Pound Sterling)
- HKD (Hong Kong Dollar)
- KRW (South Korean Won)
- SGD (Singapore Dollar)
- AUD (Australian Dollar)
- CAD (Canadian Dollar)
- CHF (Swiss Franc)
