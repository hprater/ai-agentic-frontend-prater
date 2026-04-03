# agentic_frontend_amplify_federal
React, vite, tailwind - hosted on Firebase for POC. If adopted, will add a "Security Gate" (Load Balancer/IAP) in front for auth, for now auth is handled by Firebase standard JWTs ID tokens, where our Cloud Run orchestrator can verify them using the firebase-admin SDK.
