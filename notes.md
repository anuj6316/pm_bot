## Phase 0
```
# this creates a network
networks:
  pm_bot_network: { driver: bridge }

# this creates a named volumes
volumes:
  pg_data: {}
  qdrant_data: {}
```

```
services:
  postgres:
    image: ankane/pgvector:latest
    environment:
      - POSTGRES_DB=${POSTGRES_DB}
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
    # this is for the persistence of the data
    volumes: [ pg_data:/var/lib/postgresql/data ]
    healthcheck:
      test: [ "CMD-SHELL", "pg_isready -U ${POSTGRES_USER}" ]
      interval: 5s
      timeout: 5s
      retries: 5
    ports:
      - "5432:5432"
    networks: [ pm_bot_network ]

  adminer:
    image: adminer
    restart: always
    ports:
      - 8080:8080
    networks: [ pm_bot_network ]

  qdrant:
    image: qdrant/qdrant:latest
    environment:
      - QDRANT_SERVICE_API_KEY= ${QDRANT_API_KEY}
    volumes: [ qdrant_data:/var/lib/qdrant/data ]
    ports:
      - "6333:6333"
    networks:
      - pm_bot_network
```