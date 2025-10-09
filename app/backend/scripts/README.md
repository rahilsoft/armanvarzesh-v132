
# ArmanVarzesh DevOps & Scripts

## Quick Start

1. Copy `.env.example` to `.env` and set your configs. Ensure `JWT_SECRET` (and other secrets) are defined in this file or exported in your shell before starting the stack.
2. Run:  
   `docker-compose -f scripts/docker-compose.yml up --build`
3. App will be ready at [http://localhost:4000/graphql](http://localhost:4000/graphql)

## Migrate and Seed DB

- To run migrations:  
  `npx prisma migrate dev`
- To seed database:  
  `npx ts-node scripts/seed.ts`

## Tips

- All production secrets must be managed securely, e.g., with Docker Secrets or Vault.
- For multi-environment deploy, customize `.env` and `docker-compose.yml`.
