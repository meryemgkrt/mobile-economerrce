# Mobile E-Commerce Application

A full-stack mobile e-commerce application with a React admin panel, Node.js/Express backend, and React Native mobile app.

## Project Structure

```
mobile-economerrce/
├── backend/          # Node.js/Express API server
├── admin/            # React admin panel (Vite)
├── mobile/           # React Native mobile app (Expo)
└── package.json      # Root package management
```

## Prerequisites

- Node.js >= 20.0.0
- npm (comes with Node.js)
- For mobile development: Expo CLI

## Installation

### Install All Dependencies

```bash
npm run install:all
```

This will install dependencies for both the backend and admin panel.

### Individual Installation

```bash
# Backend only
cd backend && npm install

# Admin only
cd admin && npm install

# Mobile only
cd mobile && npm install
```

## Development

### Run All Services

```bash
npm run dev
```

This runs both the backend and admin panel concurrently in development mode.

### Run Individual Services

```bash
# Backend only (development mode)
npm run dev:backend

# Admin panel only (development mode)
npm run dev:admin

# Mobile app
cd mobile && npm start
```

## Building

### Build Admin Panel

```bash
npm run build
```

This builds the admin panel for production and places the output in `admin/dist/`.

## Production Deployment

### Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
NODE_ENV=production
PORT=10000
DB_URL=your_database_connection_string
```

Refer to `.env.example` in the root directory for a template.

### Deploy to Render.com

This project includes a `render.yaml` configuration file for easy deployment to Render.com:

1. **Push your code to GitHub**
2. **Connect your repository to Render:**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect the `render.yaml` file
3. **Set environment variables:**
   - Add `DB_URL` in the Render dashboard
   - Other variables are pre-configured in `render.yaml`
4. **Deploy:**
   - Render will automatically build and deploy your application
   - The app will be available at the provided Render URL

### Deploy with Docker

Build and run using Docker:

```bash
# Build the Docker image
docker build -t mobile-ecommerce .

# Run the container
docker run -p 10000:10000 \
  -e NODE_ENV=production \
  -e DB_URL=your_database_url \
  mobile-ecommerce
```

### Manual Deployment

For deployment to other platforms (Heroku, Railway, etc.):

1. **Build the application:**
   ```bash
   npm run install:all
   npm run build
   ```

2. **Set environment variables** on your hosting platform

3. **Start the server:**
   ```bash
   npm start
   ```

The backend serves both the API (at `/api/*`) and the admin panel (as static files).

## API Endpoints

- `GET /api/health` - Health check endpoint
- Additional endpoints can be added in `backend/src/server.js`

## Mobile App Development

The mobile app uses Expo for React Native development:

```bash
cd mobile

# Start Expo development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on web
npm run web
```

## Project Scripts

Root `package.json` scripts:

- `npm run install:all` - Install dependencies for backend and admin
- `npm run build` - Build admin panel for production
- `npm start` - Start backend server in production mode
- `npm run dev:backend` - Start backend in development mode
- `npm run dev:admin` - Start admin panel in development mode
- `npm run dev` - Start both backend and admin in development mode

## Technologies Used

### Backend
- Node.js
- Express.js
- dotenv (environment management)

### Admin Panel
- React 19
- Vite (build tool)
- Tailwind CSS
- Material-UI
- Ant Design

### Mobile App
- React Native
- Expo
- React Navigation
- TypeScript

## Port Configuration

- Backend/API: Port 10000 (configurable via `PORT` environment variable)
- Admin Dev Server: Port 5173 (Vite default)
- Mobile Dev Server: Port 8081 (Expo default)

## License

ISC

## Support

For issues or questions, please open an issue in the GitHub repository.
