# FAGF-FS Core: Sample Application

This project is a standalone reference implementation of the **Foundational Agentic Governance Framework for Financial Services (FAGF-FS)**.

## Core Features
- **Deterministic Validator**: A strictly synchronous engine that evaluates AI-proposals against financial mandates.
- **MAS-Aligned Mandates**: Default policy set aligned with Singapore's financial security standards (E-Payments User Protection, TRM).
- **Agent Simulation Console**: Interactive UI to simulate routine, high-value, and high-risk agent transactions.
- **Audit Trace**: Full historical logging of every governance outcome (Allow, Block, HITL).

## Project Structure
- `src/core/`: The foundational governance logic.
    - `types.ts`: FAGF-FS standardized data models.
    - `validator.ts`: The deterministic validation engine.
    - `mandates.ts`: Reference financial mandates.
- `src/App.tsx`: The sample dashboard and simulation environment.

## Running the App
1. `cd claudezone/fagf-fs-core`
2. `npm install --legacy-peer-deps`
3. `npm run dev`

---
*Powered by Foundational Agentic Governance Framework for Financial Services (FAGF-FS)*
