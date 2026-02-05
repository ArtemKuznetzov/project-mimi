# Project Mimi UI

Frontend for an online store built with modern React stack.

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** - build tool
- **Redux Toolkit** + **RTK Query** - state management and API
- **React Router** - routing
- **React Hook Form** + **Zod** - forms and validation
- **Tailwind CSS** - styling
- **shadcn/ui** - UI components (partially implemented)
- **Jest** + **React Testing Library** - testing
- **Storybook** - component documentation
- **FSD (Feature-Sliced Design)** - project architecture

## Project Structure

The project is organized according to FSD principles:

```
src/
├── app/              # Application initialization (store, routing, providers)
├── pages/            # Application pages
├── widgets/          # Large composite blocks (not used yet)
├── features/         # Business logic (authentication, etc.)
├── entities/         # Business entities (not used yet)
└── shared/           # Shared components, utilities, UI kit
```

## Installation and Running

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run Storybook
npm run storybook

# Run tests
npm test
```

## API

Backend API is located at `http://localhost:4005`

### Authentication

**POST** `/login`

Request body:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "accessToken": "jwt_token_here"
}
```

## Key Features

- ✅ JWT token authentication
- ✅ Protected routes
- ✅ Home page
- ✅ Redux Toolkit + RTK Query for API interaction
- ✅ Form validation with Zod
- ✅ Responsive design with Tailwind CSS
- ✅ Storybook for components

## Future Development

- Product catalog
- Shopping cart
- User profile
- Admin panel
- Order processing
- Payment system integration
