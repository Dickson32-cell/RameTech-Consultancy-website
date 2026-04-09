#!/bin/bash
# Database setup script for Render deployment
# This runs after build when database is accessible

echo "Setting up database..."

# Push schema to database (creates missing tables)
npx prisma db push --accept-data-loss --skip-generate

echo "Database setup complete!"
