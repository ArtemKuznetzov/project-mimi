## Tech Stack (Server)

- **Java 21**
- **Spring Boot 3.5** + **Maven**
- **Spring Cloud Gateway**
- **Spring Security** + **JWT**
- **Spring Data JPA** + **PostgreSQL**
- **Liquibase**
- **STOMP / WebSocket**
- **MinIO**
- **MapStruct** + **Lombok**
- **SpringDoc OpenAPI**

## Installation and Running

```bash
docker compose up --build
```

API gateway: `http://localhost:4004`  
MinIO console: `http://localhost:9001`

## Tech Stack (Frontend)

- **React 19** + **TypeScript**
- **Vite** 
- **Redux Toolkit** + **RTK Query**
- **React Router** 
- **React Hook Form** + **Zod** 
- **Tailwind CSS** 
- **shadcn/ui**
- **Jest** + **React Testing Library** 
- **Storybook**
- **FSD (Feature-Sliced Design)**

## Installation and Running

```bash
# Install dependencies
npm install

# Run dev server
npm run dev
```

## Recommended agent skills

https://www.skills.sh/vercel-labs/agent-skills/react-best-practices

```bash
npx skills add vercel-labs/agent-skills@vercel-react-best-practices -g -y
```

https://github.com/mattpocock/skills

```bash
npx skills add mattpocock/skills -y -g
```
