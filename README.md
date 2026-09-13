# PostShare

A simple full-stack image posting app. Users can create a post by uploading an image with a caption, and browse all posts in a searchable, paginated feed with the ability to copy the image URL or download the file.

## Overview

**PostShare** lets a user:
- Upload an image (PNG/JPG/WEBP, max 5MB) along with a text caption to create a post
- Browse all posts in a responsive grid feed
- Search posts by caption
- Paginate through posts
- Copy a post's image URL to the clipboard
- Download a post's image directly

## Tech Stack

**Frontend**
- Next.js (React)
- Tailwind CSS
- lucide-react (icons)
- axios (HTTP client)

**Backend**
- Node.js
- Express.js
- MongoDB (Mongoose)
- ImageKit (image storage/CDN)

## Project Structure

```
postshare/
├── client/                # Next.js frontend
│   ├── pages/
│   │   ├── index.js       # Home page — feed, search, pagination
│   │   └── create.js      # Create Post page
│   ├── components/
│   │   ├── CreatePost.jsx # Upload form
│   │   └── PostCard.jsx   # Reusable post card
│   └── package.json
│
└── server/                 # Express backend
    ├── models/
    │   └── Post.js          # Mongoose schema (image, caption)
    ├── routes/
    │   └── post.routes.js   # /create-post, /posts
    ├── config/
    │   └── db.js            # MongoDB connection
    ├── server.js
    └── package.json
```

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A MongoDB instance (local or MongoDB Atlas)
- An ImageKit account (for image upload/storage) — or swap in your own storage provider

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/postshare.git
cd postshare
```

### 2. Set up the backend

```bash
cd server
npm install
```

Create a `.env` file inside `server/`:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

The server runs at `http://localhost:3000`.

### 3. Set up the frontend

```bash
cd ../client
npm install
```

Create a `.env.local` file inside `client/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Start the frontend:

```bash
npm run dev
```

The app runs at `http://localhost:3000` by default for Next.js — if this conflicts with the backend port, either change the backend `PORT` or run the frontend on a different port:

```bash
npm run dev -- -p 3001
```

## API Endpoints

| Method | Endpoint       | Description                          |
|--------|----------------|---------------------------------------|
| POST   | `/create-post` | Create a new post (image + caption)   |
| GET    | `/posts`       | Fetch all posts                       |

**POST `/create-post`** — expects `multipart/form-data`:
- `image` (file)
- `caption` (string)

**GET `/posts`** — returns:
```json
{
  "message": "Post fetched succesfully!",
  "post": [
    {
      "_id": "...",
      "image": "https://...",
      "caption": "...",
      "__v": 0
    }
  ]
}
```

## CORS Setup

Make sure the backend allows requests from the frontend's origin:

```js
app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ['GET', 'POST'],
}))
```

## Available Scripts

**Backend (`server/`)**
- `npm run dev` — start with nodemon (auto-restart on changes)
- `npm start` — start in production mode

**Frontend (`client/`)**
- `npm run dev` — start Next.js dev server
- `npm run build` — build for production
- `npm start` — start production build

## License

MIT
