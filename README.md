#  Management Application - Frontend

A modern React application for managing projects, tasks, and team members with real-time updates using Socket.IO.

## 🔗 Links

- **Live Demo:** https://management-application-8kbm.vercel.app/
- **Frontend Repository:** https://github.com/AhmedAli300/Management-Application-FrontEnd
- **Backend Repository:** https://github.com/AhmedAli300/Management-Application-BackEnd
- **Backend API:** https://management-application-back-end.vercel.app/

---

##  Features

- User Authentication (JWT)
- Protected Routes
- Project Management
- Task Management
- Team Member Management
- Real-time Updates (Socket.IO)
- Responsive UI
- Toast Notifications
- Loading States

---

##  Tech Stack

- React 19
- Vite
- React Router DOM
- Axios
- Bootstrap 5
- Bootstrap Icons
- React Hot Toast
- Socket.IO Client

---

## 📁 Project Structure

```
src
├── assets
├── components
├── context
├── pages
├── services
├── App.jsx
└── main.jsx
```

---

##  Architecture

The application follows a component-based architecture.

- Components contain reusable UI.
- Pages represent application screens.
- Context API manages authentication and socket state.
- Services handle API communication.
- Protected Routes secure authenticated pages.

---

##  Installation

Clone the repository

```bash
git clone https://github.com/AhmedAli300/Management-Application-FrontEnd.git
```

Install dependencies

```bash
npm install
```

Create a `.env`

```env
VITE_API_URL=https://management-application-back-end.vercel.app/
```

Start development server

```bash
npm run dev
```

Build

```bash
npm run build
```

Preview

```bash
npm run preview
```

---

##  Environment Variables

| Variable | Description |
|----------|-------------|
| VITE_API_URL | Backend API URL |

---

##  Testing

```bash
npm run test
```

---

##  API

The frontend communicates with the REST API hosted at:

https://management-application-back-end.vercel.app/

Authentication is handled using JWT tokens.

---

## 👤 Demo Accounts

### Admin

Email

```
admin123@gmail.com
```

Password

```
12345678
```

### Member

Email

```
member123@gmail.com
```

Password

```
12345678
```

---