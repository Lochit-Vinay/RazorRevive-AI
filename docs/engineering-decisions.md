# Engineering Decisions

### Why LLM + deterministic guardrails?
An LLM can understand the nuanced context of a user (e.g. "This customer has a high LTV but their payment failed due to an expired card, we shouldn't just hammer them with retries, let's send a payment link"). However, LLMs are unreliable for enforcing hard limits (like "Never retry more than twice"). Combining them provides the best of both worlds.

### Why SQLite (for prototype)?
The project was originally scoped for PostgreSQL, but due to local environment constraints (missing `postgres` role password/sudo access), SQLite was chosen to guarantee a working end-to-end prototype for the 5-minute buildathon demo. The schema is fully relational and easily transferable back to Postgres via Prisma.

### Why simulation mode?
We cannot use live Razorpay transactions for failed recovery attempts in a buildathon. The simulation engine provides realistic probabilistic outcomes (e.g., retrying a temporary timeout has a 70% success rate), which populates the dashboard with realistic, calculated metrics without faking the UI numbers.

### What happens if AI fails?
The `AiDecisionEngine` falls back to a deterministic rule-based switch statement. This ensures the recovery pipeline never halts just because the LLM provider experiences an outage or rate limit.
