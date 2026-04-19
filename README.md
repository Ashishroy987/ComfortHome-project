# ComfortHome

ComfortHome is a full-stack vacation rental platform inspired by Airbnb. It combines a React frontend with an Express and MongoDB backend to let users browse stays, create property listings, leave reviews, and complete bookings through Razorpay.

The project is organized as a modern split frontend/backend application:

- `frontend/` contains the React + Vite client
- `backend/` contains the Express API, authentication, database models, and payment flow

---

## ✨ Project Highlights

- 🏠 Browse all property listings with detailed property pages
- 🔐 User authentication with session-based login using Passport.js
- 🛠️ Create, update, and delete listings with ownership checks
- 🖼️ Upload listing images through Cloudinary
- ⭐ Add and remove reviews for listings
- 🗺️ Interactive listing map powered by Leaflet and OpenStreetMap
- 💳 Razorpay checkout and payment verification for bookings
- 🛡️ Protected routes on the frontend for authenticated flows

## 🧰 Tech Stack

### Frontend

- React 19
- Vite
- React Router
- Axios
- React Toastify
- Leaflet
- React Leaflet

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- Passport.js
- Express Session
- Connect-Mongo
- Multer
- Cloudinary
- Razorpay
- Joi

## 🏗️ Architecture Overview

ComfortHome follows a decoupled frontend/backend structure:

1. The React app handles navigation, forms, protected pages, and checkout flow.
2. The Express backend exposes REST-style endpoints for listings, reviews, auth, payments, and bookings.
3. MongoDB stores users, listings, reviews, and bookings.
4. Passport manages session-based authentication.
5. Cloudinary stores uploaded listing images.
6. Razorpay handles payment order creation and payment verification.

## 📁 Folder Structure

```text
ComfortHomeProject/
|-- backend/
|   |-- controllers/
|   |-- models/
|   |-- routes/
|   |-- utils/
|   |-- init/
|   |-- app.js
|   |-- server.js
|   `-- package.json
|-- frontend/
|   |-- src/
|   |   |-- Pages/
|   |   |-- components/
|   |   `-- Styles/
|   |-- utils/
|   |-- index.html
|   `-- package.json
`-- README.md
```

## 🚀 Core Features

### 🔑 Authentication

- User signup and login
- Persistent session-based authentication using cookies
- Logout support
- Protected actions such as creating listings, editing listings, reviewing, and payment initiation

### 🏘️ Listings

- Fetch all listings
- View a single listing with populated owner and review information
- Create new listings with image upload
- Edit existing listings
- Delete listings
- Ownership checks to ensure only the creator can manage their listing

### 💬 Reviews

- Authenticated users can add reviews to listings
- Review authors can delete their own reviews
- Reviews are connected to listings and populated on listing detail pages

### 📍 Maps

- Listings support latitude and longitude coordinates
- Property details can display an interactive map using OpenStreetMap tiles

### 💰 Payments and Bookings

- Backend creates Razorpay orders for selected listings
- Payment signatures are verified server-side
- Successful payments create booking records in MongoDB
- Booking confirmation pages can fetch booking details

## 🌐 API Summary

These are the main backend routes currently available:

### Auth Routes

- `POST /users/signup` - register a new user
- `POST /users/login` - log in a user
- `POST /users/logout` - log out the current user

### Listing Routes

- `GET /listings` - fetch all listings
- `GET /listings/:id` - fetch a single listing
- `POST /listings` - create a listing
- `PUT /listings/:id` - update a listing
- `DELETE /listings/:id` - delete a listing

### Review Routes

- `POST /listings/:id/reviews` - create a review
- `DELETE /listings/:id/reviews/:reviewId` - delete a review

### Payment Routes

- `POST /payment/checkout/:id` - create a Razorpay order
- `POST /payment/verify` - verify payment and create booking

### Booking Routes

- `GET /bookings/:id` - fetch booking details
- `POST /bookings/create` - create a booking record manually

## 🧱 Data Models

### Listing

Important listing fields include:

- `title`
- `description`
- `image.url`
- `image.filename`
- `price`
- `location`
- `country`
- `coordinates.lat`
- `coordinates.lng`
- `owner`
- `reviews`

### Booking

Important booking fields include:

- `listing`
- `user`
- `amount`
- `paymentId`
- `orderId`
- `bookedAt`

## ⚙️ Local Development Setup

### ✅ Prerequisites

Make sure you have the following installed:

- Node.js 22.x
- npm
- MongoDB local instance or MongoDB Atlas database
- Cloudinary account
- Razorpay account

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd ComfortHomeProject
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Install frontend dependencies

```bash
cd ../frontend
npm install
```

## 🔐 Environment Variables

Create a `.env` file inside `backend/` and add the following values:

```env
ATLASDB_URL=mongodb://127.0.0.1:27017/comforthome
SESSION_SECRET=your_very_long_secure_session_secret_here
FRONTEND_URL=http://localhost:5173

CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

NODE_ENV=development
PORT=8080
```

Create a `.env` file inside `frontend/` and add:

```env
VITE_API_URL=http://localhost:8080
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

## ▶️ Running the Project

Start the backend server:

```bash
cd backend
npm run dev
```

Start the frontend app in another terminal:

```bash
cd frontend
npm run dev
```

Default local URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8080`

## 📜 Available Scripts

### Backend

- `npm start` - start the backend with Node
- `npm run dev` - start the backend with Nodemon

### Frontend

- `npm run dev` - start the Vite development server
- `npm run build` - build the production frontend bundle
- `npm run preview` - preview the production build locally
- `npm run lint` - run ESLint

## 🔄 Request Flow Example

Here is a typical booking flow through the app:

1. A user logs in from the React frontend.
2. The frontend sends credentials to `POST /users/login`.
3. Express creates a session and stores it using MongoDB-backed session storage.
4. The user opens a listing and proceeds to checkout.
5. The frontend requests an order from `POST /payment/checkout/:id`.
6. Razorpay checkout opens in the browser.
7. After payment, the frontend sends payment details to `POST /payment/verify`.
8. The backend verifies the signature and creates a booking record.
9. The frontend navigates to the confirmation page.

## 🛡️ Validation and Access Control

The backend includes important safeguards:

- Joi validation for listing and review payloads
- Authentication middleware for protected routes
- Owner checks for listing edits and deletion
- Review author checks for review deletion
- Server-side payment signature verification before creating bookings

## 🌍 Deployment Notes

The backend is already configured with a few deployment-aware decisions:

- `trust proxy` is enabled for secure cookie handling behind a reverse proxy
- CORS supports `http://localhost:5173` and `FRONTEND_URL`
- Session cookies switch to `secure` and `sameSite=none` in production

For production deployment, make sure:

- frontend and backend URLs match your deployed domains
- environment variables are configured on both services
- MongoDB, Cloudinary, and Razorpay credentials are valid
- HTTPS is enabled so secure cookies work correctly

## 💪 Current Strengths

- Clean separation between client and server
- Useful full-stack feature set for a portfolio project
- Real-world integrations with image hosting and payments
- Clear MVC-style backend structure

## 🔮 Possible Improvements

- Add automated tests for API routes and frontend flows
- Add search, filtering, and sorting for listings
- Add booking history for users
- Add admin moderation tools
- Add image galleries with multiple uploads per listing
- Improve validation feedback and form UX
- Add CI/CD and environment-specific config documentation

## 📄 License

This project includes an MIT license in the backend directory.

## 👨‍💻 Author

Ashish Kumar Roy
