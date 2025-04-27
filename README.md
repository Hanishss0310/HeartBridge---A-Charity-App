📝 Project Description
HeartBridge is a MERN (MongoDB, Express.js, React.js, Node.js) full-stack web application that connects donors and charitable trusts together under one platform. Users can donate, become members, post blogs/events, and interact with trusts. Trusts can register themselves, request for donations, and share updates. Admins can manage and approve trust registrations and donations.

HeartBridge makes giving back to society easier, faster, and more transparent!

✨ Features
🔒 Secure Authentication (JWT-based)

🎯 Trust Registration Forms with file uploads (Legal documents, NOCs, Trustee IDs)

🎁 Donation System with user history

📝 Blog and Event Posting for trusts and admins

👨‍💻 User Dashboards and Trust Dashboards

🔐 Admin Approval System for new trusts and donations

🤖 AI Chatbot Support (powered by Gemini API)

🌍 Fully Responsive Design (Built with Tailwind CSS)

📂 File Uploads handled by Multer

🛡️ Role-Based Access (User / Trust / Admin)

📂 Folder Structure
arduino
Copy
Edit
heartbridge/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   └── tailwind.config.js
└── README.md
🛠️ Installation & Setup
Follow these steps carefully:

1. Clone the Repository
bash
Copy
Edit
git clone https://github.com/your-username/heartbridge.git
cd heartbridge
2. Backend Setup
bash
Copy
Edit
cd backend

# Install backend dependencies
npm install

# Create a `.env` file inside backend folder with these variables:
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000

# Start the backend server
npm run dev
👉 Important NPM Packages for Backend:

bash
Copy
Edit
npm install express mongoose dotenv cors bcryptjs jsonwebtoken multer
npm install nodemon --save-dev
3. Frontend Setup
bash
Copy
Edit
cd ../frontend

# Install frontend dependencies
npm install

# Start the React frontend
npm start
👉 Important NPM Packages for Frontend:

bash
Copy
Edit
npm install react-router-dom axios
npm install tailwindcss postcss autoprefixer
npm install @heroicons/react
npm install react-icons
Setup Tailwind CSS using this command if not already initialized:

bash
Copy
Edit
npx tailwindcss init -p
📸 Screenshots
(Add images showing:

Trust Registration Form

Donation Page

User Dashboard

Admin Panel

Blog/Event Posting Page

AI Chatbot in action)

🚀 Deployment
You can deploy HeartBridge using:

Frontend: Vercel, Netlify

Backend: Render, Railway, Heroku

Database: MongoDB Atlas

🤝 Contribution
Pull requests are welcome!
For major changes, please open an issue first to discuss what you would like to change.
Let's build an even better HeartBridge together! 💬

🙋‍♂️ About the Developer
👋 Hi, I'm Hanish, a passionate Full Stack Developer!
I'm currently working as a Developer Intern at 1990Minds, Bengaluru.
I love building beautiful, functional, and impactful web apps.

🔗 Portfolio: hanishprofile.in

📧 Contact: hanishgowda7795Gmail.com

📜 License
This project is licensed under the hanishprofile.in .

🌈 Thank You for Visiting HeartBridge!
