# AURA Beauty Studio

A full-stack beauty commerce and virtual try-on experience built with React, Vite, Express, MongoDB, and MediaPipe Face Landmarker.

Live site: [aurorabeauty-beta.vercel.app](https://aurorabeauty-beta.vercel.app/)

## Overview

AURA combines an editorial beauty storefront with a browser-based Virtual Studio. Visitors can browse a live makeup catalog, search and filter products, view product details, add products to a bag, and preview lipstick and upper-eyelid eyeshadow through the camera.

## Features

- Live product catalog powered by the Makeup API.
- Product departments for Face, Eyes, Lips, Nails, and All products.
- Search, sorting, pagination, INR pricing, image validation, and session caching.
- Product detail pages with descriptions and relevant same-type product suggestions.
- Add-to-bag flow with quantity controls, totals, and INR formatting.
- Virtual Studio with camera capture and MediaPipe face landmark tracking.
- Soft lip blending that preserves natural lip texture.
- Upper-eyelid eyeshadow placement that stays above the lash line.
- Eyeshadow, lipstick, and foundation try-on entry points.
- JWT authentication and protected AI endpoints.
- Responsive layouts for desktop and mobile.

## Technology

### Frontend

- React 18
- Vite
- React Router
- Axios
- MediaPipe Tasks Vision
- CSS

### Backend

- Node.js
- Express
- MongoDB with Mongoose
- JWT authentication
- Multer
- CORS

### External Services

- Makeup API: `https://makeup-api.herokuapp.com/api/v1/products.json`
- MediaPipe Face Landmarker model hosted by Google Cloud Storage.
- MongoDB Atlas for production database hosting.

## Project Structure

```text
glamup2/
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── data/
│       ├── pages/
│       ├── services/
│       └── styles/
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
├── netlify.toml
└── render.yaml
```

## Local Development

### Requirements

- Node.js 18 or newer.
- MongoDB for backend features, either a local instance or MongoDB Atlas.
- A browser with camera support for Virtual Studio.

### Install dependencies

```bash
cd client
npm install

cd ../server
npm install
```

### Configure the backend

Create `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/glowup-studio
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_URL=http://localhost:5173
```

### Start the backend

```bash
cd server
npm start
```

The backend runs on `http://localhost:5000`.

### Start the frontend

```bash
cd client
npm run dev
```

The Vite development server runs on `http://localhost:5173`.

For a deployed or custom backend, set the client environment variable before building:

```env
VITE_API_URL=http://localhost:5000/api
```

## API Routes

### Health

```text
GET /api/health
```

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
PUT  /api/auth/update
```

The `me` and `update` routes require a Bearer token.

### Products

```text
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

Product creation, updates, and deletion require authentication.

### AI and beauty analysis

```text
POST /api/ai/analyze
POST /api/ai/recommendations
POST /api/ai/try-on
```

These routes require authentication.

## Production Deployment

The repository includes deployment configuration for a split deployment:

Live deployment: [aurorabeauty-beta.vercel.app](https://aurorabeauty-beta.vercel.app/)

- Netlify builds and hosts the Vite frontend.
- Render runs the Express backend.
- MongoDB Atlas hosts the production database.

### Render backend

The `render.yaml` blueprint uses:

```text
Root directory: server
Build command: npm install
Start command: npm start
Health check: /api/health
```

Set these Render environment variables:

```env
MONGODB_URI=your MongoDB Atlas connection string
JWT_SECRET=your production secret
CLIENT_URL=https://your-netlify-site.netlify.app
```

### Netlify frontend

The `netlify.toml` configuration uses:

```text
Base directory: client
Build command: npm run build
Publish directory: dist
```

Set this Netlify environment variable:

```env
VITE_API_URL=https://your-render-service.onrender.com/api
```

The SPA redirect in `netlify.toml` keeps React Router routes working after refresh.

## Validation

Build the client with:

```bash
cd client
npm run build
```

The production build should complete successfully before deployment.

## Security Notes

- Never commit `.env` files, MongoDB credentials, or JWT secrets.
- Use separate secrets for local development and production.
- Restrict `CLIENT_URL` to the deployed frontend origin in production.
- Camera processing for Virtual Studio happens in the browser; camera frames are not uploaded by the frontend flow.

## License

MIT
