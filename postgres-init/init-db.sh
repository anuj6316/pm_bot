#!/bin/bash
set -e

# This script is IDEMPOTENT and runs with the container's POSTGRES_USER.
# It handles the creation of additional databases if requested.

if [ -n "$POSTGRES_MULTIPLE_DATABASES" ]; then
    echo "Creating additional databases: $POSTGRES_MULTIPLE_DATABASES"
    for db in $(echo $POSTGRES_MULTIPLE_DATABASES | tr ',' ' '); do
        echo "  - Checking database: $db"
        psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "postgres" <<-EOSQL
            SELECT 'CREATE DATABASE "$db"'
            WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$db')\gexec
            GRANT ALL PRIVILEGES ON DATABASE "$db" TO "$POSTGRES_USER";
EOSQL
    done
fi

echo "✅ Database initialization sequence completed."
