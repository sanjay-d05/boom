# MERN Stack Project with React + Vite

## Tech Stack
- **Frontend:** React, Vite, JavaScript, CSS, Tailwind CSS  
- **Backend:** Node.js, Express  
- **Database:** MongoDB  
- **Auth:** JWT (JSON Web Token)  
- **Tools:** Axios, dotenv, mongoose, cors  

---

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- npm or yarn
- [Cloudinary](https://cloudinary.com/) account (for video upload)

---

## Setup Instructions

### 1. Clone Repo

```bash
git clone https://github.com/sanjay-d05/boom.git
cd boom
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

- Create a `.env` file in `/backend`:

```env
PORT=8000
MONGO_URI=your_mongo_uri
CLIENT_URI=your_client_uri
JWT_SECRET=your_jwt_secret
```

- Start the server:

```bash
npm run dev
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
```

- Create a `.env` file in `/frontend`:

```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
VITE_SERVER_URI=http://localhost:8000
```

- Start the React app:

```bash
npm run dev
```

---

## API Endpoints (Base URL: `/api`)

- **GET /** — Test route

- **POST /register** — Register a new user  
  Body: `{ username, email, password }`

- **POST /login** — Login user  
  Body: `{ email, password }`  
  Returns: JWT token

- **POST /upload** — Upload a video  
  Body: video data/form-data

- **GET /feeds** — Get all video feeds

- **POST /purchase** — Purchase a video  
  Body: `{ videoId, userId }`

- **POST /videos/:id/comments** — Post a comment on a video  
  Body: `{ commentText, userId }`

- **GET /videos/:id/comments** — Get all comments for a video

---

## Scripts

### Backend

- `npm run dev` — Start server with nodemon  
- `npm start` — Start production server

### Frontend

- `npm run dev` — Start Vite dev server  
- `npm run build` — Build frontend for production  
- `npm run preview` — Preview production build

---

## Environment Variables

| Variable                   | Description                  |
|----------------------------|------------------------------|
| PORT                       | Backend port (e.g. 8000)     |
| MONGO_URI                  | MongoDB connection string    |
| CLIENT_URI                 | Frontend origin URL          |
| JWT_SECRET                 | JWT secret key               |
| VITE_SERVER_URI            | Backend API base URL         |
| VITE_CLOUDINARY_CLOUD_NAME| Cloudinary cloud name        |
| VITE_CLOUDINARY_UPLOAD_PRESET | Upload preset for Cloudinary |

---

## License

MIT © SANJAY D
