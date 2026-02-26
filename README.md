# TrustCore Digital Bank

A modern, secure, and AI-powered microservices banking platform.

## Phase 1: Platform Foundation

This phase establishes the core infrastructure and microservices architecture.

### Services
- **NGINX Gateway**: Entry point for all requests (Port 80).
- **Next.js Frontend**: User interface (Port 3000).
- **Auth Service**: Spring Boot service for authentication and authorization (Port 8081).
- **Banking Service**: Spring Boot service for core banking operations (Port 8082).
- **Audit Service**: Spring Boot service for event logging (Port 8083).
- **AI Engine**: FastAPI service for fraud detection and risk scoring (Port 8000).

### Infrastructure
- **PostgreSQL**: Primary database.
- **Redis**: Caching and session management.
- **Elasticsearch**: Search engine for audit logs.

## Getting Started

### Prerequisites
- Docker and Docker Compose installed.

### Run the system
To start the entire platform locally, run:

```bash
docker compose up -d
```

### Health Check Endpoints
Once running, you can verify the status of each service through the gateway:

- **Frontend**: [http://localhost/](http://localhost/)
- **Auth Service**: [http://localhost/auth/health](http://localhost/auth/health)
- **Banking Service**: [http://localhost/banking/health](http://localhost/banking/health)
- **Audit Service**: [http://localhost/audit/health](http://localhost/audit/health)
- **AI Engine**: [http://localhost/ai/health](http://localhost/ai/health)
