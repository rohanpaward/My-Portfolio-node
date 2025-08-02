const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});


// Static resume context (you can load from DB or file if needed)
const resumeText = `
Contact: rohanpawar2003rds@gmail.com | +91-8618269927
Portfolio: https://my-portfolio-ui-lyart.vercel.app/
GitHub: https://github.com/rohanpaward

 Skills
Frontend: HTML5, CSS3, JavaScript (ES6+), React.js, Next.js, MUI, Bootstrap, Tailwind CSS, Redux
Backend: Java, Node.js, Hapi.js, Express.js, JWT, Sequelize, REST APIs, Postman, Git, GitHub
Database: PostgreSQL, MySQL
CS Concepts: OOPs, DBMS
DevOps: AWS, EC2, Lambda, CI/CD, Jenkins, Docker, DockerHub, Agile

 Experience
IdeaForge Technologies (Intern, Feb 2025 – July 2025, Bengaluru)
- Built and maintained Flight Test Monitoring Software (FTMS) using Next.js, Node.js (Hapi.js), PostgreSQL
- Designed schema and relationships for System and Sub-System modules
- Developed full-stack CRUD functionality for those modules
- Implemented history tracking for updates using Sequelize transactions
- Integrated JWT-based authentication
- Improved DB performance and backend queries

 Projects
CabZen  
Tech Stack: React.js, Node.js, Express.js, PostgreSQL, JWT, bcrypt, Socket.io  
- Full-stack geolocation-based taxi booking platform with role-based access for users and drivers  
- Designed PostgreSQL schema for taxis, users, drivers, and reservations  
- Proximity detection using geo-coordinates and Haversine formula  
- Secured user data with bcrypt and Joi  
- Link: https://drive.google.com/drive/u/0/folders/1XC71sQP9HhSL-nYupW2UD3JHlVnSODyD  

Real-Time Whiteboard  
Tech Stack: HTML5, CSS, JavaScript, Socket.io  
- Built a real-time collaborative whiteboard with pencils, erasers, sticky notes, images, undo/redo  
- Enabled multi-user sync with Socket.io  
- Deployed on GitHub Pages: https://rohanpaward.github.io/RealTimeWhiteBoard/

 Education
- BMS College Of Engineering – B.Tech in Computer Science (Feb 2023 – May 2025), CGPA: 8
- SJ Polytechnic – Diploma in Mechanical Engineering (Sept 2019 – Nov 2022), CGPA: 9.4

 Achievements
- Winner of IoT Interhouse Competition at BMSCE for an innovative solution
`;


exports.askFromResume = async (req, res) => {
  const { question } = req.body;

  const fullPrompt = `
You are a helpful and friendly chatbot trained on the following resume:

${resumeText}

Instructions:
- Answer the user's question clearly and concisely.
- Speak naturally. Do not mention "resume", "based on resume", etc.
- If any project, GitHub, portfolio, or demo link is relevant to the answer, include it in a natural way.
- When mentioning any URLs (e.g. GitHub, portfolio, or project links), do not show the full raw URL.
  Instead, write "Link" and make it clickable.
  Example: instead of showing "https://github.com/rohanpaward/xyz", just write [Link](https://github.com/rohanpaward/xyz)
- Keep answers short and helpful, like a real person chatting.

Question:
"${question}"
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash", // or gemini-1.5-pro
      contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
    });

    const answer = response.candidates[0].content.parts[0].text;
    res.status(200).json({ answer });
  } catch (err) {
    console.error("Gemini API error:", err);
    if (err.status === 503) {
      return res.json({
        answer: "The model is currently overloaded. This is a free version of Gemini and may limit usage. Please try again later.",
      });
    }

    res.status(500).json({ error: "Gemini API failed." });
  }
};
