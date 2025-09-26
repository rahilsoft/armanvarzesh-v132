#!/bin/bash
echo "Backing up database..."
pg_dump -U $DB_USER -h $DB_HOST $DB_NAME > backup.sql
echo "Backup complete."