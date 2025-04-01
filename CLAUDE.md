# Intention-Ally Development Guide

## Build & Development Commands
- `npm run dev` - Start Next.js development server
- `npm run build` - Build Next.js application
- `npm run start` - Start Next.js production server
- `npm run lint` - Run Next.js linting
- `python backend/api.py` - Run FastAPI backend server
- `python frontend/app.py` - Run Streamlit frontend

## Code Style Guidelines

### JavaScript/React
- Use functional components with React hooks
- Include JSDoc comments for component documentation
- Use destructured props in component parameters
- Format components: imports → hooks → handlers → return JSX
- Handle errors with try/catch blocks and meaningful messages
- Use conditional rendering with logical && or ternary operators

### Python
- Follow PEP 8 style guidelines
- Use async/await for asynchronous operations
- Implement proper exception handling with specific exceptions
- Structure API endpoints with clear request/response models
- Log errors and important information with appropriate levels

### Naming Conventions
- React Components: PascalCase (SearchBar, MainLayout)
- Functions/variables: camelCase (handleSubmit, searchTerm)
- Python variables/functions: snake_case (search_brave, get_keywords)
- Constants: UPPERCASE (BACKEND_HOST, BACKEND_PORT)

### Error Handling
- Client-side: Use try/catch with user-friendly messages
- Server-side: Use try/except with proper HTTP status codes and logging