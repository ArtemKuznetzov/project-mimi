# Auth Service

Authentication microservice built with Spring Boot, providing JWT-based authentication with access and refresh tokens.

## Tech Stack

- **Java 21**
- **Spring Boot 3.5.5**
- **Spring Security** - authentication and authorization
- **Spring Data JPA** - database access
- **PostgreSQL** - database
- **JWT (jjwt 0.12.6)** - token generation and validation
- **Lombok** - reducing boilerplate code
- **SpringDoc OpenAPI** - API documentation (Swagger)

## Quick Start

### Prerequisites

- Java 21+
- Maven 3.9+
- PostgreSQL 12+

### Running

```bash
# Install dependencies
mvn clean install

# Run with dev profile
mvn spring-boot:run "-Dspring.profiles.active=dev"
```

## Docker

### Database

Image: `postgres:latest`

Binding ports: `5001:5432`

Run options:
```
--network internal
```

Environment variables:

```
POSTGRES_DB=db
POSTGRES_PASSWORD=password
POSTGRES_USER=admin_user
```

### Auth Service

Image tag: `auth-service:latest`

Binding ports: `4005:4005`

Run options:
```
--network internal
```

Environment variables:

```
SPRING_PROFILES_ACTIVE=dev
SPRING_DATASOURCE_URL=jdbc:postgresql://auth-service-db:5432/db
SPRING_DATASOURCE_USERNAME=admin_user
SPRING_DATASOURCE_PASSWORD=password
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SPRING_SQL_INIT_MODE=always
JWT_SECRET=pGG0RBuZIhX1mJGKqA5XvTQFy39jhr6puGk8xa4tQOg\=
```

## Security

- **Access Token**: 10 hours lifetime, stored in memory
- **Refresh Token**: 7 days lifetime, stored in httpOnly cookie
- **Password**: BCrypt hashing (strength 12)
- **CORS**: Configurable per environment
- **Cookies**: httpOnly, secure (configurable), sameSite=Strict

