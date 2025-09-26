#!/bin/bash
echo "Setting up environment variables..."
export DATABASE_URL="postgresql://user:password@localhost:5432/armanfit"
export REDIS_URL="redis://localhost:6379"
export JWT_SECRET="your_jwt_secret"
echo "Environment variables set."