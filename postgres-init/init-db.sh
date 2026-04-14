#!/bin/bash
set -e

# Loop through all required databases
for db in "pm_bot" "plane_admin"; do
    echo "  Checking if database '$db' exists..."
    
    # Connect to 'postgres' and execute CREATE DATABASE if it doesn't exist
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "postgres" <<-EOSQL
        SELECT 'CREATE DATABASE $db'
        WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$db')\gexec
        GRANT ALL PRIVILEGES ON DATABASE $db TO "$POSTGRES_USER";
EOSQL
done

echo "✅ All databases initialized and ready."
