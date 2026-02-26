# Phase 1 — Foundation + Local Platform Running

Goal: You can run the whole system locally with placeholders.

Deliverables

Repo structure created (frontend/, backend/*, infrastructure/)

Next.js frontend boots (basic pages: Login, Dashboard placeholder)

Spring Boot services boot:

auth-service (health endpoint)

banking-service (health endpoint)

audit-service (health endpoint)

FastAPI ai-engine boots (health endpoint)

Docker Compose starts PostgreSQL + Redis + Elasticsearch

NGINX gateway routes to each service (basic reverse proxy)

Definition of done

One command starts infra + services (or two commands: infra then apps)

You can hit:

GET /health for each service through NGINX

Frontend loads in browser


# Phase 2 - Secure Auth + Core Banking MVP

Goal: A real user can log in and do a real transfer.

Deliverables

Auth Service

Register + Login

JWT access token + refresh token

Password hashing (bcrypt)

Basic role model: CUSTOMER, STAFF

Banking Service

Accounts table + Transactions table (Postgres)

Create account for user (seed or endpoint)

Transfer endpoint with ACID transaction handling

Transaction history endpoint

Frontend

Login UI wired to auth service

Dashboard shows balances + recent transactions

Transfer form works end-to-end

Definition of done

User can:

Register → 2) Login → 3) See account → 4) Transfer funds → 5) See transaction history


# Phase 3 — Admin Controls + Audit Logs + AI Fraud Hook

Goal: Make it “enterprise”: staff view + audit trail + AI risk scoring.

Deliverables

Audit Service

Log events: login, transfers, role changes

Search/list audit logs (basic filters)

Admin Panel (Frontend)

Staff-only route

Fraud monitoring page (table of flagged/risky transactions)

Audit log viewer

AI Engine (FastAPI)

POST /ai/analyze returns risk score for a transaction

Banking service calls AI engine on transfer (sync call is fine for MVP)

If risk score high → create “risk alert” record + show in admin panel

Definition of done

Every transfer generates an audit entry

Transfers receive a risk score

Staff can view risky transactions + audit logs in the admin UI