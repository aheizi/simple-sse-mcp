import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { z } from "zod";

const server = new McpServer({
  name: "currency-exchange-service",
  version: "1.0.0"
});

// Define supported currencies and their exchange rates
// Rates are relative to CNY (Chinese Yuan Renminbi)
const exchangeRates: Record<string, number> = {
  USD: 0.14,    // United States Dollar
  EUR: 0.13,    // Euro
  JPY: 20.41,   // Japanese Yen
  GBP: 0.11,    // British Pound Sterling
  HKD: 1.09,    // Hong Kong Dollar
  KRW: 181.21,  // South Korean Won
  SGD: 0.19,    // Singapore Dollar
  AUD: 0.21,    // Australian Dollar
  CAD: 0.19,    // Canadian Dollar
  CHF: 0.12,    // Swiss Franc
};

// Currency exchange tool
server.tool("exchange",
  'International Currency Exchange Service',
  {
    amount: z.number().positive(),
    fromCurrency: z.enum(['CNY']),  // Currently only supporting CNY as base currency
    toCurrencies: z.array(z.enum(Object.keys(exchangeRates) as [string, ...string[]])),
  },
  async ({ amount, fromCurrency, toCurrencies }) => {
    try {
      // Calculate exchange rates for requested currencies
      const results = toCurrencies.map(currency => {
        const rate = exchangeRates[currency];
        const converted = (amount * rate).toFixed(2);
        return `${converted} ${currency}`;
      });

      // Format response with proper currency codes
      return {
        content: [{
          type: "text",
          text: `${amount.toFixed(2)} ${fromCurrency} equals:\n${results.join('\n')}`
        }]
      };
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : 'Unknown error occurred';
      return {
        content: [{
          type: "text",
          text: `Error processing exchange rate calculation: ${errorMessage}`
        }],
        isError: true
      };
    }
  },
);

// Express server setup for SSE communication
const app = express();
const sessions: Record<string, { transport: SSEServerTransport; response: express.Response }> = {};

// Handle SSE connections
app.get("/sse", async (req, res) => {
  console.log(`New SSE connection established from ${req.ip}`);
  const sseTransport = new SSEServerTransport("/messages", res);
  const sessionId = sseTransport.sessionId;
  
  if (sessionId) {
    sessions[sessionId] = { transport: sseTransport, response: res };
  }
  
  await server.connect(sseTransport);
});

// Handle incoming messages
app.post("/messages", async (req, res) => {
  const sessionId = req.query.sessionId as string;
  const session = sessions[sessionId];
  
  if (!session) {
    res.status(404).send("Session not found");
    return;
  }

  await session.transport.handlePostMessage(req, res);
});

// Start server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Currency Exchange Service running on port ${PORT}`);
});