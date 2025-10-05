# VocaSync – Language Exchange Platform

**VocaSync** is a real-time language exchange platform designed to connect users globally through 1:1 text and video chat. Leveraging the power of the [Stream API](https://getstream.io/), VocaSync facilitates seamless communication for language learners, enabling them to practice speaking, writing, and listening skills with native speakers.

---

## Live Demo

🔗 [VocaSync Live Demo]( https://vocasync.vercel.app)

*Note: Ensure your browser has camera and microphone permissions enabled to fully experience the video chat feature.*

---

## Tech Stack

* **Frontend**: React (TypeScript), Tailwind CSS
* **Backend**: Node.js with Express (TypeScript)
* **Real-Time Communication**: Stream API (for chat and video calls)
* **Authentication**: JWT (JSON Web Tokens)
* **Hosting**: Vercel (Frontend), Vercel/Heroku (Backend)
* **Bundler**: Vite

---

## 📂 Folder Structure

```
client/          # Frontend
└── src/
    ├── components/  # Reusable UI components
    ├── pages/       # React components for each page
    ├── services/    # API and Stream client services
    └── utils/       # Utility functions and hooks
server/          # Backend
└── src/
    ├── controllers/  # Route handlers
    ├── middleware/   # Authentication and error handling
    ├── models/       # Database models
    ├── routes/       # API routes
    └── server.ts     # Main server entry point
.gitignore
package.json
tsconfig.json
vercel.json
vite.config.ts
```

---

## Features

* **1:1 Text & Video Chat**: Engage in real-time conversations with language partners.
* **Screen Sharing**: Share your screen during video calls to enhance learning.
* **User Authentication**: Secure login and registration using JWT.
* **Responsive Design**: Optimized for both desktop and mobile devices.
* **Real-Time Messaging**: Instant message delivery with Stream API.

---

## Installation & Setup

### Prerequisites

* Node.js ≥ 14
* npm ≥ 6
* MongoDB (local or cloud)
* Stream API account for chat and video functionality

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/Prajwal-BLR-IN/VocaSync-VideoChat-textChat-LanguageExchange-Platform.git
   cd VocaSync-VideoChat-textChat-LanguageExchange-Platform
   ```

2. Install dependencies:

   ```bash
   # Frontend
   cd client
   npm install
   cd ..

   # Backend
   cd server
   npm install
   cd ..
   ```

3. Configure environment variables:

   **Backend `.env` file (`server/`)**:

   ```
   PORT=your_port
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   STREAM_API_KEY=your_stream_api_key
   STREAM_API_SECRET=your_stream_api_secret
   EMAIL_USER=your_email_address
   SEMAIL_PASSWORD==your_email_password
   ```

   **Frontend `.env` file (`client/`)**:

   ```
   VITE_API_URL=your_backend_url
   VITE_STREAM_API_KEY=your_stream_api_key
   ```

4. Run the application:

   ```bash
   # Backend
   cd server
   npm run dev
   cd ..

   # Frontend
   cd client
   npm run dev
   ```

   Access the application at: [http://localhost:5173](http://localhost:5173) (Vite default)

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

If you'd like to enhance this README further with a GIF or video demonstration, feel free to let me know!
