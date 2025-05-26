````markdown
# MERN Stack Project with React + Vite

## Tech Stack
- **Frontend:** React, Vite, JavaScript, CSS  
- **Backend:** Node.js, Express  
- **Database:** MongoDB  
- **Auth:** JWT (optional)  
- **Tools:** Axios, dotenv, mongoose, cors  

---

## Setup Instructions

1. **Clone repo**

```bash
git clone https://github.com/your-username/your-mern-project.git
cd your-mern-project
````

2. **Backend**

```bash
cd backend
npm install
```

* Add `.env` with:

```
PORT=5000
MONGO_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
```

* Start server:

```bash
npm run dev
```

3. **Frontend**

```bash
cd frontend
npm install
```

* Add `.env` with:

```
VITE_API_BASE_URL=http://localhost:5000/api
```

* Start React app:

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
  Returns: JWT token or session

- **POST /upload** — Upload a video  
  Body: video data/form-data (depends on implementation)

- **GET /feeds** — Get video feed (all videos or filtered feed)

- **POST /purchase** — Purchase a video  
  Body: `{ videoId, userId, paymentDetails }` (example)

- **POST /videos/:id/comments** — Post a comment on a video  
  Body: `{ commentText, userId }`

- **GET /videos/:id/comments** — Get comments for a video

---

## Scripts

* Backend:
  `npm run dev` — Start server (nodemon)
  `npm start` — Start server (production)

* Frontend:
  `npm run dev` — Start dev server
  `npm run build` — Build production
  `npm run preview` — Preview production build

---

## Environment Variables

| Variable             | Description               |
| -------------------- | ------------------------- |
| PORT                 | Backend port (e.g. 8000)  |
| MONGO\_URI           | MongoDB connection string |
| JWT\_SECRET          | JWT secret key            |
| VITE\_SERVER\_URI | Backend API base URL      |

---

## License

MIT © SANJAY D
