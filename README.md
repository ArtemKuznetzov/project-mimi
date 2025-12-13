# Project Mimi

Full-stack e-commerce application built with modern technologies.

## Project Structure

```
project-mimi/
├── project-mimi-ui/          # Frontend application (React + TypeScript)
└── project-mimi-server/      # Backend microservices (Spring Boot)
    ├── auth-service/         # Authentication microservice
    └── api-gateway/          # API Gateway microservice
```

## Components

### Frontend

**[project-mimi-ui](./project-mimi-ui/README.md)** - React-based frontend application

- **Tech Stack**: React 19, TypeScript, Vite, Redux Toolkit, RTK Query
- **Architecture**: Feature-Sliced Design (FSD)
- **UI**: Tailwind CSS, shadcn/ui components
- **Port**: 5173 (development)

### Backend Services

#### [API Gateway](./project-mimi-server/api-gateway/README.md)

- **Tech Stack**: Spring Cloud Gateway, Spring WebFlux
- **Port**: 4004
- **Purpose**: Routes requests to microservices and validates JWT tokens

#### [Auth Service](./project-mimi-server/auth-service/README.md)

- **Tech Stack**: Spring Boot, Spring Security, JWT
- **Port**: 4005
- **Purpose**: User authentication and authorization

## Quick Start

### Prerequisites

- **Java 21+**
- **Maven 3.9+**
- **Node.js 18+**
- **PostgreSQL 12+**
- **Docker** (optional)

### Running the Application

#### 1. Start Database

```bash
# Using Docker
docker run -d \
  --name postgres \
  -p 5001:5432 \
  -e POSTGRES_DB=db \
  -e POSTGRES_USER=admin_user \
  -e POSTGRES_PASSWORD=password \
  postgres:latest
```

#### 2. Start Backend Services

**Auth Service:**
```bash
cd project-mimi-server/auth-service
mvn clean install
mvn spring-boot:run "-Dspring.profiles.active=dev"
```

**API Gateway:**
```bash
cd project-mimi-server/api-gateway
mvn clean install
mvn spring-boot:run
```

#### 3. Start Frontend

```bash
cd project-mimi-ui
npm install
npm run dev
```

## API Endpoints

### Authentication (via API Gateway)

- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token
- `GET /auth/validate` - Validate token
- `POST /auth/logout` - User logout

### API Documentation

- Auth Service: `http://localhost:4005/swagger-ui/index.html#/`

## Architecture

### Microservices

The application follows a microservices architecture:

```
Client (Browser)
    ↓
API Gateway (4004)
    ↓
    ├──→ Auth Service (4005)
    └──→ Games Service (4000)
```

### Authentication Flow

1. User logs in via `/auth/login`
2. Auth Service validates credentials and returns JWT tokens
3. Access token stored in Redux (frontend)
4. Refresh token stored in httpOnly cookie
5. API Gateway validates JWT for protected routes

## Development

### Tech Stack Overview

**Frontend:**
- React 19 + TypeScript
- Vite (build tool)
- Redux Toolkit + RTK Query
- React Router
- Tailwind CSS

**Backend:**
- Spring Boot 3.5.5
- Spring Cloud Gateway
- Spring Security
- JWT (jjwt 0.12.6)
- PostgreSQL

### Project Structure

- **Monorepo**: All services in one repository
- **Shared Configuration**: Common `.gitignore` at root level
- **Independent Services**: Each service can be developed and deployed independently

## Documentation

- [Frontend README](./project-mimi-ui/README.md)
- [API Gateway README](./project-mimi-server/api-gateway/README.md)
- [Auth Service README](./project-mimi-server/auth-service/README.md)

