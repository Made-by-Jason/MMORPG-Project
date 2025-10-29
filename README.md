# ArcadeMMO — Prototype

Author: Jason Gibson 

## Overview
ArcadeMMO is a browser-based 2D arcade MMORPG prototype:
- Client: TypeScript + Phaser 3 (Vite)
- Server: Node.js + TypeScript + Socket.IO (authoritative)
- Persistence: PostgreSQL, Redis for pub/sub & rate-limits
- Local dev: Docker Compose

## Quick start (local dev)
1. Ensure Docker Desktop, Node 20+, npm installed.
2. Clone repo and run:
   docker-compose up -d
3. Install deps:
   cd client && npm install
   cd ../server && npm install
4. Run dev:
   cd server && npm run dev
   cd ../client && npm run dev
5. Open http://localhost:5173

## Production
See `docker-compose.prod.yml` and `k8s/` manifests. Use environment variables:
- DATABASE_URL
- REDIS_URL
- JWT_SECRET
- NODE_ENV=production

## Project structure
(see repo tree in README)

## Notes & legal
This scaffold uses original asset placeholders. Do not use Blizzard or WoW trademarks, assets, or names.

## Contact
consultwithjasonfirst@gmail.com
