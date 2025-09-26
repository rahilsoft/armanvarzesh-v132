    # Compose Unification
    Date: 2025-08-12T11:39:52.876337Z

    ## What changed
    - Removed legacy compose files:
      - docker-compose.ci.yml
- devops/docker/docker-compose.yml
    - Added unified `docker-compose.yml` at repo root with **profiles** (`dev`, `test`).
    - Infra services: Postgres 16, Redis 7, RabbitMQ 3-management, MinIO.
    - Core app services wired with healthchecks and proper dependencies: `backend`, `auth-service`, `workouts-service`, `notifications-service`.

    ## How to use
    - Deps only: `docker compose up -d postgres redis rabbitmq minio`
    - Dev: `docker compose --profile dev up -d`
    - Test: `docker compose --profile test up -d postgres redis rabbitmq minio auth-service workouts-service`
