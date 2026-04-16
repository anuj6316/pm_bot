# Deployment Strategy

PM Bot uses a standard `docker-compose.yml` to orchestrate all essential microservices within isolated bridged networks. 

## Moving to Production

The codebase safely wraps secrets within `.env`. To transition to a production server:
1. Ensure your Production Postgres is spun up externally or mounted via standard persistent volume chains.
2. Bind the correct connection strings in the `.env` payload securely deployed to your host.

`[[VERIFY: The specific deployment cloud provider (AWS/DigitalOcean/GCP) hasn't been strictly locked into the repository footprint. Ensure container orchestration mappings match your cloud vendor defaults.]]`

### Command Executions
Similar to local, pulling the container into production mimics standard Docker functionality:
```bash
docker compose -f docker-compose.yml up --build -d
```
All tasks, celery configurations, and internal networking run identically.

## Container Maintenance
Because `uv` operates completely encapsulated within the backend runtime folder execution (`uv run python...`), there's no need to mutate or maintain the local system's node layout on the targeted VMs or managed instances.
