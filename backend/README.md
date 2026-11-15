# Backend boundary for the SC4025 MVP

This presentation MVP does not run a backend server, database, payment gateway or real outlet integration. Vite serves the React frontend. App.jsx stores orders, invitations, payments, consent, history and notifications in the current browser tab.

The live mock fixtures are in [frontend/src/data.js](../frontend/src/data.js). The [mock-data directory](mock-data/README.md) contains generated reference JSON for the report and future backend work. It is not an API and is not loaded separately by the app. No extra backend process is needed.

Real multi-device invitations and durable orders would require a shared backend and production account/payment services. They are outside this prototype. See [the actual architecture](../docs/architecture/README.md).
