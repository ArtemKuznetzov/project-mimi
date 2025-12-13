# API Gateway

API Gateway microservice built with Spring Cloud Gateway, providing routing and JWT validation for microservices.

## Tech Stack

- **Java 21**
- **Spring Boot 3.5.5**
- **Spring Cloud Gateway 2025.0.0** - API gateway and routing
- **Spring WebFlux** - reactive programming model
- **Reactor** - reactive streams

## Quick Start

### Prerequisites

- Java 21+
- Maven 3.9+

### Running

```bash
# Install dependencies
mvn clean install
```

## Docker

### API Gateway

Image tag: `api-gateway:latest`

Binding ports: `4004:4004`

Run options:
```
--network internal
```

Environment variables:

```
AUTH_SERVICE_URL=http://localhost:4004
```

