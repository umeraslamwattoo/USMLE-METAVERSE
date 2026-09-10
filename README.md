# USMLE‑METAVERSE

A full‑stack **online course / e‑learning platform**. Visitors browse paid course
categories and free videos, register an account, pay for a category with **Stripe**
or **PayPal**, and then watch the videos that belong to that category. A separate
**admin dashboard** lets administrators manage users, course categories, courses,
free videos and blog posts.

The repository contains two independent applications:

| Folder      | App              | Stack                                             |
|-------------|------------------|---------------------------------------------------|
| `frontend/` | Client web app   | React 18 (Create React App), React Router v6, Bootstrap 5, SCSS, Tailwind |
| `backend/`  | REST API server  | Node.js, Express 4, MongoDB (Mongoose), Multer, Stripe, PayPal |

---

## Table of contents

1. [Features](#features)
2. [Tech stack](#tech-stack)
3. [Repository structure](#repository-structure)
4. [Architecture overview](#architecture-overview)
5. [Prerequisites](#prerequisites)
6. [Environment variables](#environment-variables)
7. [Getting started (local development)](#getting-started-local-development)
8. [Available scripts](#available-scripts)
9. [Backend API reference](#backend-api-reference)
10. [Database models](#database-models)
11. [File uploads](#file-uploads)
12. [Payments](#payments)
13. [Frontend routes](#frontend-routes)
14. [Authentication & authorization](#authentication--authorization)
15. [Deployment notes](#deployment-notes)
16. [Known limitations / TODO](#known-limitations--todo)
17. [License](#license)

---

## Features

### Public site (`frontend/`)
- Landing page with hero, course categories, pricing, blog posts and rating carousel.
- **User registration & login** (name, email, phone number, password).
- Profile management: update name/email, change password, upload/remove a profile image.
- Browse **course categories**; each category has a price.
- **Buy a category** through Stripe (card) or PayPal. After a successful payment the
  user gets access to every course/video inside that category.
- **Watch course videos** for categories the user has paid for.
- **Free videos** section available to everyone.
- **Blog**: list and read individual posts (rich‑text content).
- **Course ratings & reviews** (1–5 stars + comment).

### Admin dashboard (`frontend/src/Dashboard/`)
- Admin **register / login** (separate from normal users).
- **Users**: list all users, view their payments/ratings, toggle a user's access,
  delete users.
- **Course categories**: create, update, delete (name + price).
- **Courses**: upload a course video, assign it to a category, update, delete.
- **Free videos**: upload, list, delete.
- **Blogs**: create (rich‑text editor), update, delete, with a blog category.

---

## Tech stack

### Backend
- **Runtime:** Node.js + Express `^4.21`
- **Database:** MongoDB via **Mongoose** `^8.9`
- **Auth helpers:** `bcrypt` (password hashing), `jsonwebtoken` (JWT dependency present)
- **File uploads:** `multer` (disk storage, images & videos)
- **Payments:** `stripe` `^17`, `@paypal/checkout-server-sdk`
- **Misc:** `cors`, `dotenv`, `nodemon` (dev)

### Frontend
- **React** `^18.2` bootstrapped with **Create React App** (`react-scripts` `5.0.1`)
- **Routing:** `react-router-dom` `^6.20`
- **UI:** `bootstrap` `5`, `react-bootstrap`, custom **SCSS** (`src/sass/`),
  **Tailwind CSS** (`tailwind.config.js`), `react-icons`, `@iconify/react`
- **Content / media:** `react-quill` (rich‑text blog editor), `react-player`,
  `react-slick` / `slick-carousel`, `react-masonry-css`, `react-modal-image`
- **UX:** `react-toastify`, `sweetalert2`, `react-type-animation`,
  `react-text-transition`, `react-scroll`, `react-water-wave`
- **Payments (client):** `@stripe/stripe-js`, `@stripe/react-stripe-js`,
  `@paypal/react-paypal-js`
- **HTTP:** `axios` and the native `fetch` API
- **Node polyfills for CRA/webpack 5:** `stream-browserify`, `stream-http`,
  `https-browserify`, `browserify-zlib`, `assert`, `url`, `util`

---

## Repository structure

```
USMLE-METAVERSE/
├── README.md
├── .gitignore
│
├── backend/
│   ├── index.js                 # Express app entry: middleware, Mongo connection, server start
│   ├── upload.js                # Multer config (uploads/images, uploads/videos, 5 GB limit)
│   ├── security.js              # Helper that sets security headers (X-Frame-Options, CSP, ...)
│   ├── package.json
│   ├── .env.example             # Template for backend/.env (no secrets committed)
│   │
│   ├── Routes/
│   │   └── Routes.js            # All REST endpoints in one router, mounted at "/"
│   │
│   ├── Controllers/
│   │   ├── AdminController.js
│   │   ├── UserController.js
│   │   ├── CategoryBlogControoler.js
│   │   ├── CategoryCourseController.js
│   │   ├── CourseControoller.js
│   │   ├── PostController.js
│   │   ├── PaymentController.js       # Stripe + PayPal
│   │   ├── FreevidioController.js
│   │   └── RatingController.js
│   │
│   ├── Models/                  # Mongoose schemas
│   │   ├── AdminModel.js
│   │   ├── UserModel.js
│   │   ├── CategoryBlogModel.js
│   │   ├── CategoryCourseModel.js
│   │   ├── CourseModel.js
│   │   ├── FreeVidioModel.js
│   │   ├── PostModel.js
│   │   ├── PaymentModel.js
│   │   └── RatingModel.js
│   │
│   └── uploads/                 # Runtime‑generated (git‑ignored): images/ and videos/
│
└── frontend/
    ├── package.json
    ├── webpack.config.js
    ├── tailwind.config.js
    ├── .env.example            # Template for frontend/.env
    ├── public/
    └── src/
        ├── index.js            # ReactDOM root, BrowserRouter, global styles
        ├── App.js              # All route definitions (public + /dashboard)
        ├── CourseContext.jsx   # React context for the currently selected course/category
        ├── Pages/
        │   └── Home.jsx
        ├── Components/         # Public‑site components
        │   ├── Layout/         # Shared layout (Header + Footer + <Outlet/>)
        │   ├── Header/  Footer/  Hero/  About/  Price/  Social/  SectionHeading/
        │   ├── Login/          # MainLoginSignup, login, Signup
        │   ├── Gallery/        # Course listing + CourseShow (video player)
        │   ├── Post/           # Blog list + single post
        │   ├── FreeVidio/      # Free videos
        │   ├── BuyCategory/    # Buy.jsx — Stripe + PayPal checkout
        │   ├── Rating/         # Rating + RatingCarousel
        │   ├── Slider/         # HeroSlider, PriceSlider
        │   └── 404/            # PageNotFound
        ├── Dashboard/          # Admin dashboard
        │   ├── Layoutadmin/    # Dashboard shell
        │   ├── Admin/          # Header, SideBar, SignupSignin (Signin/Signup)
        │   ├── AllUsers/       # Users.jsx
        │   ├── AllCourses/     # Courses.jsx, FreeVidioShow.jsx
        │   ├── UplodeCourses/  # UplodeCourses.jsx, UpdateCourse.jsx, FreeVidio.jsx
        │   ├── AllBlogs/       # Blogs.jsx
        │   ├── CreateBlogs/    # CreateBlogs.jsx, Updateblog.jsx
        │   ├── Categorys/      # Categorys.jsx (course categories)
        │   └── CSS/            # AdminStyle.css
        ├── sass/               # SCSS design system (default/ + elements/)
        ├── Images/             # Logos
        └── Preloader/
```

---

## Architecture overview

```
┌────────────────────────┐        HTTPS / JSON         ┌──────────────────────────┐
│      React SPA          │  ───────────────────────▶   │   Express REST API        │
│      (frontend/)        │  ◀───────────────────────   │      (backend/)           │
│                        │                             │                          │
│  • Bootstrap + SCSS     │        multipart/form-data  │  • Mongoose models        │
│  • React Router v6      │  (video / image uploads)    │  • Multer file storage    │
│  • Stripe / PayPal JS   │                             │  • Stripe & PayPal SDK    │
└────────────────────────┘                             └───────────┬──────────────┘
                                                                   │
                                                                   ▼
                                                          ┌──────────────────┐
                                                          │     MongoDB       │
                                                          └──────────────────┘
```

- The **frontend is a single‑page app**. All screens (public site *and*
  `/dashboard`) are served by the same React build.
- The **backend is a stateless REST API**. Every route lives in
  `backend/Routes/Routes.js` and is mounted at the root path `/`.
- Uploaded files are written to `backend/uploads/images/` or
  `backend/uploads/videos/` and served as static files.
- Payment verification is done server‑side (Stripe Payment Intents, PayPal
  order capture); a `Payment` document records each successful purchase and is
  later used to gate access to a category's videos.

---

## Prerequisites

- **Node.js** ≥ 18 and **npm** ≥ 9
- **MongoDB** — a local instance (`mongodb://127.0.0.1:27017`) or a
  MongoDB Atlas connection string
- **Stripe** account → secret key + publishable key
- **PayPal** developer account → client id + secret (the backend currently uses
  the **Sandbox** environment)

---

## Environment variables

Secrets are **not** committed. Copy the example files and fill in real values.

### `backend/.env`

```bash
cp backend/.env.example backend/.env
```

| Variable            | Required | Description                                              |
|---------------------|----------|----------------------------------------------------------|
| `MONGO_URI`         | yes      | MongoDB connection string                                |
| `PORT`              | no       | API port (defaults to `5008` if not set)                 |
| `STRIPE_SECRET_KEY` | yes      | Stripe **secret** key (`sk_test_...`)                    |
| `PAYPAL_CLIENT_ID`  | yes      | PayPal REST app client id                                |
| `PAYPAL_SECRET`     | yes      | PayPal REST app secret                                   |

### `frontend/.env`

```bash
cp frontend/.env.example frontend/.env
```

| Variable                             | Required | Description                                 |
|--------------------------------------|----------|---------------------------------------------|
| `REACT_APP_STRIPE_PUBLISHABLE_KEY`   | yes      | Stripe **publishable** key (`pk_test_...`)  |
| `REACT_APP_PAYPAL_CLIENT_ID`         | yes      | PayPal client id (same app as backend)      |

> **Note on the API base URL:** the frontend currently calls the API using a
> **hard‑coded base URL** (`https://usmlebackend.backendamaze.com`) in the
> component files. To run fully against a local backend, search‑and‑replace that
> host, or introduce a `REACT_APP_API_URL` variable and use it everywhere. See
> [Known limitations](#known-limitations--todo).

---

## Getting started (local development)

```bash
# 1. Clone
git clone https://github.com/umeraslamwattoo/USMLE-METAVERSE.git
cd USMLE-METAVERSE

# 2. Backend
cd backend
npm install
cp .env.example .env          # then edit .env
node index.js                 # or: npx nodemon index.js
# → "MongoDB connected"
# → "Server running on http://localhost:5008"

# 3. Frontend (in a second terminal)
cd frontend
npm install
cp .env.example .env          # then edit .env
npm start
# → opens http://localhost:3000
```

### First run checklist
1. MongoDB is running and `MONGO_URI` points to it.
2. Create an **admin** account: `POST /admin/register` (e.g. via Postman) or the
   `/admin-signup` screen, then log in at `/admin-login`.
3. In the dashboard, create at least one **course category** (with a price) and
   upload a **course video** for it.
4. On the public site, register a **user**, buy the category, and confirm the
   video becomes playable.

---

## Available scripts

### Backend (`backend/`)
The `package.json` currently ships only a placeholder `test` script. Run the
server directly, or add these scripts:

```jsonc
// backend/package.json → "scripts"
{
  "start": "node index.js",
  "dev": "nodemon index.js"
}
```

### Frontend (`frontend/`)

| Command         | Description                                    |
|-----------------|------------------------------------------------|
| `npm start`     | Start CRA dev server on `http://localhost:3000`|
| `npm run build` | Production build into `frontend/build/`        |
| `npm test`      | Run CRA/Jest tests                             |
| `npm run eject` | Eject CRA config (irreversible)               |

---

## Backend API reference

Base URL: `http://localhost:<PORT>` (default `5008`). All request/response
bodies are JSON unless marked **multipart/form-data**. Router source:
`backend/Routes/Routes.js`.

### Users & auth

| Method | Endpoint                          | Body / params                                  | Description                            |
|--------|----------------------------------|------------------------------------------------|----------------------------------------|
| POST   | `/user/register`                 | `name, email, password, phoneno`               | Register a user (password hashed)      |
| POST   | `/user/login`                    | `email, password`                              | Log in, returns basic user object      |
| GET    | `/users`                         | –                                              | List all users                        |
| DELETE | `/users/:id`                     | –                                              | Delete a user                         |
| POST   | `/user/change-password`          | `email/current, newPassword`                   | Change password                       |
| PUT    | `/user/update/:id`               | `name, email, ...`                             | Update user profile                   |
| PUT    | `/user/toggle-access/:id`        | –                                              | Toggle `enableaccess` flag            |
| POST   | `/user/profile-image/:id`        | **multipart** `profileImage` (file)            | Upload/replace profile image          |
| DELETE | `/user/profile-image/:id`        | –                                              | Remove profile image                  |
| GET    | `/user/:userId`                  | –                                              | Get ratings created by a user *(RatingController)* |

### Admin

| Method | Endpoint            | Body / params            | Description                 |
|--------|---------------------|--------------------------|-----------------------------|
| POST   | `/admin/register`   | `name, email, password`  | Register an admin           |
| POST   | `/admin/login`      | `email, password`        | Admin login                 |
| GET    | `/admin/:id`        | –                        | Get admin by id             |
| PUT    | `/admin/:id`        | `name, email, ...`       | Update admin                |

### Blog categories

| Method | Endpoint               | Body / params      | Description               |
|--------|------------------------|--------------------|---------------------------|
| POST   | `/category/blog`       | `CategoryBlog`     | Create a blog category    |
| GET    | `/category/blog`       | –                  | List blog categories      |
| DELETE | `/category/blog/:id`   | –                  | Delete a blog category    |

### Course categories

| Method | Endpoint                 | Body / params                       | Description                  |
|--------|--------------------------|-------------------------------------|------------------------------|
| POST   | `/category/course`       | `CategoryCourse, CategoryCoursePrice`| Create a course category     |
| GET    | `/category/course`       | –                                   | List course categories       |
| GET    | `/category/course/:id`   | –                                   | Get one course category      |
| PUT    | `/category/course/:id`   | `CategoryCourse, CategoryCoursePrice`| Update a course category      |
| DELETE | `/category/course/:id`   | –                                   | Delete a course category      |

### Blog posts

| Method | Endpoint        | Body / params                                    | Description        |
|--------|-----------------|-------------------------------------------------|--------------------|
| POST   | `/posts`        | **multipart** `image` + `title, category, content, authorId` | Create a post      |
| GET    | `/posts`        | –                                               | List posts         |
| GET    | `/posts/:id`    | –                                               | Get one post       |
| PUT    | `/posts/:id`    | **multipart** `image` (optional) + fields       | Update a post      |
| DELETE | `/posts/:id`    | –                                               | Delete a post      |

### Courses

| Method | Endpoint          | Body / params                                        | Description        |
|--------|-------------------|----------------------------------------------------|--------------------|
| POST   | `/courses`        | **multipart** `coursevideo` + `title, category, authorId` | Upload a course    |
| GET    | `/courses`        | –                                                  | List courses       |
| GET    | `/courses/:id`    | –                                                  | Get one course     |
| PUT    | `/courses/:id`    | **multipart** `coursevideo` (optional) + fields    | Update a course    |
| DELETE | `/courses/:id`    | –                                                  | Delete a course    |

### Free videos

| Method | Endpoint             | Body / params                              | Description         |
|--------|----------------------|-------------------------------------------|--------------------|
| POST   | `/free-videos`       | **multipart** `Freevidiovideo` + `title, authorId` | Upload free video  |
| GET    | `/free-videos`       | –                                         | List free videos   |
| DELETE | `/free-videos/:id`   | –                                         | Delete free video  |

### Payments

| Method | Endpoint                                   | Body / params                                  | Description                                   |
|--------|--------------------------------------------|------------------------------------------------|----------------------------------------------|
| GET    | `/check-payment/:userId/:categoryId`       | –                                              | Has this user paid for this category?         |
| GET    | `/stripe/payments/:userId`                 | –                                              | List a user's payments                        |
| POST   | `/stripe/create-payment-intent`            | `amount, categoryId, userId`                    | Create a Stripe PaymentIntent                 |
| POST   | `/stripe/capture`                          | `paymentIntentId, userId, categoryId, ...`     | Record a completed Stripe payment             |
| POST   | `/paypal/create-order`                     | `amount, currency, categoryId`                  | Create a PayPal order (Sandbox)               |
| POST   | `/paypal/capture`                          | `orderId, userId, categoryId, amount, paymentMethod` | Capture PayPal order + record payment  |

### Ratings

| Method | Endpoint                              | Body / params                              | Description                       |
|--------|--------------------------------------|-------------------------------------------|----------------------------------|
| POST   | `/ratings`                           | `userId, categorycourseId, rating(1-5), comment` | Create a rating           |
| GET    | `/ratings/course/:categorycourseId`  | –                                         | List ratings for a category       |
| DELETE | `/ratings/:ratingId`                 | –                                         | Delete a rating                   |
| GET    | `/user/:userId`                      | –                                         | List ratings by a user            |

### Misc

| Method | Endpoint      | Description                       |
|--------|---------------|----------------------------------|
| GET    | `/`           | Health check – `"Server is Running!"` |
| GET    | `/uploads/*`  | Static access to uploaded files  |

---

## Database models

All models live in `backend/Models/`.

### User (`UserModel.js`)
| Field          | Type    | Notes                          |
|----------------|---------|--------------------------------|
| `name`         | String  | required                       |
| `email`        | String  | required, unique               |
| `password`     | String  | required, **bcrypt hash**      |
| `phoneno`      | String  | required                       |
| `profileImage` | String  | file path, default `null`      |
| `enableaccess` | Boolean | default `false`                |
| `createdAt`    | Date    | default now                    |

### Admin (`AdminModel.js`)
`name` (req), `email` (req, unique), `password` (req, bcrypt hash).

### CategoryBlog (`CategoryBlogModel.js`)
`CategoryBlog` (String, req, unique).

### CategoryCourse (`CategoryCourseModel.js`)
`CategoryCourse` (String, req, unique), `CategoryCoursePrice` (Number, req),
`timestamps`.

### Course (`CourseModel.js`)
`authorId` → `Admin` (req), `title` (req), `category` → `CategoryCourse` (req),
`coursevideo` (String path, req), `createdAt`, `timestamps`.

### Freevidio (`FreeVidioModel.js`)
`authorId` → `Admin` (req), `title` (req), `Freevidiovideo` (String path, req),
`createdAt`, `timestamps`.

### Post (`PostModel.js`)
`authorId` → `Admin` (req), `title` (req), `category` (String, req),
`image` (String path, req), `content` (String, req — rich‑text HTML), `createdAt`.

### Payment (`PaymentModel.js`)
`userId` → `User` (req), `categoryId` → `CategoryCourse` (req),
`paymentDate` (default now), `paymentStatus` (`Pending` | `Completed` | `Failed`,
default `Pending`), `paymentMethod` (String, req), `transactionId` (String, req).

### Rating (`RatingModel.js`)
`userId` → `User` (req), `categorycourseId` → `CategoryCourse` (req),
`rating` (Number, req, 1–5), `comment` (String, optional).

---

## File uploads

Configured in `backend/upload.js` (Multer, disk storage):

- Images → `uploads/images/`, videos → `uploads/videos/` (folders auto‑created).
- Stored filename: `` `${Date.now()}-${originalname}` ``.
- **Allowed types:** `image/*` and `video/*` only (others rejected).
- **Max file size:** `5 GB` per file.
- Served statically: `app.use('/uploads', express.static('uploads'))`.

Field names expected by the routes: `profileImage`, `image` (posts),
`coursevideo` (courses), `Freevidiovideo` (free videos).

`backend/uploads/` is **git‑ignored** — only a `.gitkeep` placeholder is tracked.

---

## Payments

### Stripe (card)
1. Frontend loads Stripe.js with `REACT_APP_STRIPE_PUBLISHABLE_KEY`.
2. `POST /stripe/create-payment-intent` → backend creates a PaymentIntent with
   `STRIPE_SECRET_KEY` and returns the client secret.
3. Card is confirmed client‑side; `POST /stripe/capture` records a `Payment`
   document for `userId` + `categoryId`.

### PayPal
- Backend uses `@paypal/checkout-server-sdk` with a
  **`SandboxEnvironment`** (`backend/Controllers/PaymentController.js`).
  Switch to `LiveEnvironment` for production.
- `POST /paypal/create-order` → returns `orderID`.
- `POST /paypal/capture` → captures the order and records the `Payment`.

### Access gating
`GET /check-payment/:userId/:categoryId` returns whether a completed payment
exists; the frontend uses it to decide if a category's videos are playable.

---

## Frontend routes

Defined in `frontend/src/App.js` (React Router v6).

### Public (wrapped in `<Layout/>`)
| Path                                  | Component      | Purpose                              |
|---------------------------------------|----------------|--------------------------------------|
| `/`                                   | `Home`         | Landing page                         |
| `/course-show-vidios/:id`             | `CourseShow`   | Watch videos of a purchased category |
| `/post/:id`                           | `Showposts`    | Read a single blog post              |
| `/buy-category/users/:categoryId`     | `Buy`          | Stripe / PayPal checkout             |
| `*`                                   | `PageNotFound` | 404                                  |

### Auth
| Path              | Component            | Purpose                         |
|-------------------|---------------------|---------------------------------|
| `/login-signup`   | `MainLoginSignup`   | User login / signup             |
| `/admin-login`    | `BackgroundImage` + `Signin` modal | Admin login      |
| `/admin-signup`   | `BackgroundImage` + `Signup` modal | Admin register   |

### Admin dashboard (wrapped in `<Layoutadmin/>`)
| Path                              | Component        | Purpose                     |
|-----------------------------------|------------------|-----------------------------|
| `/dashboard`                      | `Blogs`          | All blog posts (index)      |
| `/dashboard/create/blogs`         | `CreateBlogs`    | Create a blog post          |
| `/dashboard/update-blog/:id`      | `Updateblog`     | Edit a blog post            |
| `/dashboard/all/courses`          | `Courses`        | All courses                 |
| `/dashboard/Upload/course`        | `UplodeCourses`  | Upload a course video       |
| `/dashboard/update/course/:id`    | `UpdateCourse`   | Edit a course               |
| `/dashboard/free-vidio`           | `FreeVidio`      | Upload a free video         |
| `/dashboard/freevidios/show`      | `FreeVidioShow`  | All free videos             |
| `/dashboard/all/users`            | `Users`          | Manage users                |
| `/dashboard/all/Categories`       | `Categorys`      | Manage course categories    |

---

## Authentication & authorization

- Passwords for **both** users and admins are hashed with **bcrypt** (salt
  rounds = 10) before being stored.
- `jsonwebtoken` is a backend dependency and the frontend clears a `token` key
  from `localStorage` on logout, so JWT issuance is partially wired. Session
  data (`userData`, `token`) is kept in `localStorage` on the client.
- There is currently **no Express auth middleware** guarding the admin/CRUD
  routes — see below.

---

## Deployment notes

- **Backend**: any Node host (Render, Railway, a VPS, etc.). Set the `.env`
  variables in the host dashboard. Ensure the `uploads/` directory is on a
  **persistent volume** (uploaded videos are stored on disk, not in the DB).
  For production PayPal, change `SandboxEnvironment` → `LiveEnvironment`.
- **Frontend**: `npm run build` produces a static bundle in `frontend/build/`
  that can be served by Netlify, Vercel, GitHub Pages, or any static host.
  Because routing is client‑side, configure the host to **fall back to
  `index.html`** for unknown paths.
- **CORS**: the backend enables `cors()` with default (open) settings — restrict
  the allowed origin in production.

---

## Known limitations / TODO

- **Hard‑coded API URL** in the frontend (`https://usmlebackend.backendamaze.com`).
  Replace with a single `REACT_APP_API_URL` env variable used everywhere.
- **No route protection** on the backend: admin and CRUD endpoints are not
  behind auth middleware. Add JWT verification (the dependency is already
  installed).
- **No input validation layer** (e.g. `express-validator` / `zod`) or rate
  limiting.
- `security.js` (security headers helper) is defined but **not registered** in
  `index.js` — add `app.use(securityHeaders)`.
- `backend/package.json` has **no `start` script** — add one (see
  [Available scripts](#available-scripts)).
- Two controller filenames contain typos (`CategoryBlogControoler.js`,
  `CourseControoller.js`); the route wiring depends on these exact names.
- Large video uploads (limit 5 GB) go through the app server — consider
  offloading to object storage (S3 / Cloudinary) for scale.

---

## License

No license file is currently included. Add one (e.g. `MIT`) if you intend the
code to be reused.
