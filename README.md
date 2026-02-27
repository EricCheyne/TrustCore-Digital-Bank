🏦 TrustCore Digital Bank

Production-quality digital banking platform — secure, observable, and cloud-ready.

Table of Contents
- Executive Summary
- Architecture at a Glance
- Service Map & Ports
- Security Model
- Local Development (Quick Start)
- API Gateway Routes
- Testing
- Troubleshooting

Executive Summary
TrustCore demonstrates how real banks build software: clear service boundaries, ACID-safe money movement, strong authentication, and an AI sidecar for risk. The goal is not just to “run,” but to model production trade‑offs: correctness first, with maintainability and evolvability built in.

Architecture at a Glance
Client (Next.js)
        ↓ HTTPS
NGINX API Gateway
        ↓
Auth Service (Spring Boot)    — Identity & Access
Banking Service (Spring Boot) — Accounts & Transactions
Audit Service (Spring Boot)   — Compliance & Events
AI Engine (FastAPI)           — Risk Scoring & Anomaly Detection
        ↓
Data Layer: PostgreSQL | Redis | Elasticsearch

Service Map & Ports
- NGINX Gateway: 80
- Auth Service: 8081 (dev)
- Banking Service: 8082 (dev)
- Audit Service: 8083 (dev)
- AI Engine: 8000 (Docker) | 8084 (local dev)
- PostgreSQL: 5432 | Redis: 6379 | Elasticsearch: 9200

Security Model (defense‑in‑depth)
- JWT access tokens + refresh tokens; RBAC
- Bcrypt password hashing, strict input validation
- TLS‑ready gateway with security headers and rate limiting
- ACID transactions with rollback guarantees for money movement
- Full audit trail for sensitive operations

Local Development (Quick Start)
Option A — All containers
```
docker compose up -d
```

Option B — From source (developer workflow)
1) Infra: `docker compose up -d postgres redis elasticsearch nginx-gateway`
2) Spring Boot: run `backend/auth-service`, `backend/banking-service`, `backend/audit-service` (8081/8082/8083)
3) AI Engine (dev):
```
cd backend/ai-engine
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8084
```
4) Frontend:
```
cd frontend && npm install && npm run dev
```

API Gateway Routes
- /auth  → Auth Service
- /api   → Banking Service
- /audit → Audit Service
- /ai    → AI Engine

Testing
- Spring Boot: `./mvnw test`
- AI Engine: `pytest`

Troubleshooting
- Elasticsearch not starting: ensure Docker has ≥2GB RAM (compose sets single‑node mode and Java opts).
- 401/403 errors: ensure `Authorization: Bearer <token>` is present and unexpired; refresh tokens supported.

— Detailed reference continues below —

## Enterprise-Grade Secure Digital Banking Platform

TrustCore is a production-style enterprise banking platform designed using real-world fintech architecture patterns. The system simulates a modern digital bank with secure transaction processing, microservices architecture, AI-driven fraud detection, and enterprise-grade infrastructure.

This project demonstrates how real financial systems are engineered, focusing on:

## Secure system design

Financial transaction integrity

Microservices architecture

Enterprise Java development

AI service integration

## Production deployment strategy

TrustCore is designed as a portfolio-quality enterprise banking system representing realistic fintech engineering practices.

## Executive Overview

TrustCore models the architecture of modern digital banking platforms used by financial institutions and fintech companies.

## The system supports:

Customer Banking

Secure authentication with JWT

Multi-account management

Funds transfers

Transaction history

Spending analytics

AI-powered risk analysis

Bank Operations

Fraud monitoring dashboards

Risk alerts

Full audit logging

User role management

Administrative controls

## System Architecture

TrustCore follows a service-oriented microservices architecture with strict service boundaries.

Client (Next.js)

      ↓ HTTPS

NGINX API Gateway

      ↓

Microservices

Auth Service (Spring Boot)
Banking Service (Spring Boot)
Audit Service (Spring Boot)
AI Engine (FastAPI)

      ↓

Data Layer

PostgreSQL
Redis
Elasticsearch
Architecture Principles

TrustCore was designed using enterprise software architecture principles.

Clean Service Boundaries

Each microservice owns its data and domain logic:

Service	Responsibility
Auth Service	Identity + Access Management
Banking Service	Financial transaction processing
Audit Service	Compliance logging
AI Engine	Risk analysis
Financial Transaction Integrity

The banking service enforces:

ACID database transactions

Balance validation

Transaction atomicity

Consistency checks

Failure rollbacks

This ensures financial correctness similar to real banking systems.

Security-First Design

TrustCore follows a defense-in-depth security model.

Security features include:

JWT authentication

Refresh tokens

Role-based access control

Password hashing (bcrypt)

TLS-ready configuration

Input validation

Rate limiting

Audit logging

Designed with guidance from:

OWASP Top 10

PCI-DSS principles

SOC2 architecture practices

Technology Stack
Frontend

Next.js

TypeScript

TailwindCSS

Chart.js

Backend
Core Services

Spring Boot microservices:

Auth Service

Banking Service

Audit Service

Features:

REST APIs

JPA persistence

Transaction management

Validation

Structured logging

AI Engine

Python FastAPI microservice.

Capabilities:

Transaction risk scoring

Anomaly detection

Behavior modeling

Initial models:

Statistical anomaly detection

Isolation Forest (planned)

Data Layer
PostgreSQL

Primary relational database:

Tables include:

users

accounts

transactions

audit_logs

refresh_tokens

risk_alerts

Redis

Used for:

Session caching

Rate limiting

Temporary data

Elasticsearch

Used for:

Audit log search

Transaction search

Fraud analytics

Infrastructure
Containerization

Docker-based development environment.

Services:

PostgreSQL

Redis

Elasticsearch

NGINX gateway

docker compose up -d
API Gateway

NGINX provides:

Central routing

TLS termination

Request filtering

Rate limiting

Security headers

Routes:

/auth → Auth Service
/api → Banking Service
/audit → Audit Service
/ai → AI Engine
Cloud Deployment Strategy

Designed for AWS deployment.

## Target architecture:

AWS RDS (PostgreSQL)

AWS EC2 / EKS

AWS S3

AWS Secrets Manager

CloudWatch Monitoring

Repository Structure
trustcore-bank/

frontend/

backend/

auth-service/
banking-service/
audit-service/
ai-engine/

infrastructure/

docker/
nginx/
k8s/

docs/

docker-compose.yml
README.md
Development Roadmap

TrustCore is built in three enterprise phases.

Total commits: ~30

## Development style:

Small pull requests

Incremental delivery

Production-style commits

## Primary IDE:

IntelliJ IDEA

## Phase 1 — Platform Foundation
Objective

Establish a runnable microservices platform.

Components

Project structure

Docker infrastructure

PostgreSQL

Redis

Elasticsearch

NGINX gateway

Spring Boot services

FastAPI service

Next.js frontend

Result

Entire system boots locally.

docker compose up -d

## Phase 2 — Secure Banking MVP
Objective

Implement secure banking functionality.

Features

Authentication:

Register users

Login

JWT tokens

Refresh tokens

Roles

Banking:

Accounts

Transfers

Transaction history

Frontend:

Login UI

Dashboard

Transfers

Result

End-to-end banking workflow:

Register → Login → Transfer → View Transactions

## Phase 3 — Enterprise Controls + AI
Objective

Introduce enterprise capabilities.

Features

Audit System:

Compliance logging

Event search

AI Engine:

Transaction risk scoring

Fraud detection

Admin Panel:

Risk alerts

Audit logs

Result

Enterprise banking simulation with fraud monitoring.

## Running Locally
Start Infrastructure
docker compose up -d
Run Spring Boot Services

Open in IntelliJ:

backend/auth-service
backend/banking-service
backend/audit-service

Run each service.

Ports:

8081
8082
8083
Run AI Engine
cd backend/ai-engine

python3 -m venv .venv

source .venv/bin/activate

pip install -r requirements.txt

uvicorn main:app --reload --port 8084
Run Frontend
cd frontend

npm install

npm run dev
Testing

Spring Boot:

./mvnw test

AI Engine:

pytest
Engineering Highlights

TrustCore demonstrates:

✔ Enterprise Java microservices
✔ Secure authentication design
✔ Financial transaction modeling
✔ AI microservice integration
✔ Production-style architecture
✔ Containerized infrastructure
✔ Cloud-ready deployment

## Future Roadmap

Kubernetes production deployment

Mobile banking app

Credit scoring models

Real bank API integration

Event-driven architecture

Distributed tracing

## Author

Eric Cheyne
