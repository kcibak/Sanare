
# 🧠 Sanare – TherapyNote Reimagined

**Sanare** is a modern, visual-first platform for therapists and patients to collaborate, track progress, and communicate more effectively. Designed for clarity and ease of use, Sanare helps bridge the gap between mental health care and technology.


## 🚀 Live Demo

👉 [**View the App on Netlify**](https://mysanare.netlify.app/)

<!-- Replace YOUR_NETLIFY_LINK_HERE with your actual Netlify deployment link -->

---

## ✨ Features

- 🖼️ Visual-first note system for therapists & patients
- 🧘 Smooth, distraction-free interface
- 📊 Intuitive data flow to better understand health over time
- � Secure authentication for therapists and patients
- 📝 Journal, goals, and session notes modules
- 📅 Timeline and progress tracking

---

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL
- **Containerization:** Docker, Docker Compose

---

## 📦 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- Docker & Docker Compose (for local development)

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/Perdoe/therapynoteapp.git
   cd therapynoteapp
   ```
2. Install dependencies for both frontend and backend:
   ```sh
   cd sanare-app
   npm install
   cd api
   npm install
   ```
3. Start the development environment:
   ```sh
   # From the root directory
   docker-compose -f sanare-app/docker/docker-compose.yml up --build
   ```

---

## 🧪 Usage & Test Logins

### Therapist
- **ID:** `101`
- **Password:** `therapy123`

### Patient
- **ID:** `1745013352290` (Sarah Johnson)
- **Password:** `Patient123!`
- **ID:** `1745013352291` (Michael Brown)
- **Password:** `Patient123!`

> ⚠️ All data is demo-only and resets frequently.

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request for improvements or bug fixes.

---

## 📄 License

This project is licensed under the MIT License.

---

## 🌐 Original Project

[Link to the original repo](https://github.com/Perdoe/therapynoteapp)
