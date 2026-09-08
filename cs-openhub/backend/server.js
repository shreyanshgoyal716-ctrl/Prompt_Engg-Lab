require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const path = require('path'); // <-- Add this line at the top with your other requires

// ... (your existing database setup and dataset)

const app = express();
app.use(cors());
app.use(express.json());

// 👉 ADD THIS LINE: This tells Express to serve your frontend folder automatically
app.use(express.static(path.join(__dirname, '../frontend')));

// ... (your existing /api/courses route stays here)

// ==========================================
// 1. DATABASE SCHEMA & MODEL DEFINITION
// ==========================================

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A course title is required'],
    trim: true,
    unique: true
  },
  category: {
    type: String,
    required: [true, 'A core category is required'],
    enum: [
      'Computer Science Core',
      'Mathematics for CS',
      'Systems & Architecture',
      'Data & AI',
      'Software Engineering',
      'Networks & Security',
      'Theory of Computation'
    ],
    index: true // Indexed for faster filtering
  },
  subtopic: {
    type: String,
    required: true,
    trim: true
  },
  provider: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['university', 'youtube', 'web']
  },
  url: {
    type: String,
    required: true,
    match: [/^https?:\/\/.+/, 'Please provide a valid HTTP/HTTPS URL']
  },
  level: {
    type: String,
    required: true,
    enum: ['Beginner', 'Beginner to Pro', 'Intermediate', 'Undergraduate', 'Advanced']
  },
  description: {
    type: String,
    required: true
  },
  tags: {
    type: [String],
    default: [],
    index: true // Indexed for faster tag-based searches
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a compound text index for the search functionality
courseSchema.index({ title: 'text', description: 'text', provider: 'text' });

const Course = mongoose.model('Course', courseSchema);

// ==========================================
// 2. THE MASSIVE CS DATASET
// ==========================================

const csDataset = [
  // --- CORE & PROGRAMMING ---
  {
    title: "CS50x: Introduction to Computer Science", category: "Computer Science Core", subtopic: "Intro to Programming",
    provider: "Harvard University", type: "university", url: "https://cs50.harvard.edu/x/", level: "Beginner",
    description: "Harvard's legendary introduction to the intellectual enterprises of computer science and the art of programming.", tags: ["C", "Python", "SQL", "Web"]
  },
  {
    title: "MIT 6.0001: Intro to CS and Programming in Python", category: "Computer Science Core", subtopic: "Intro to Programming",
    provider: "MIT OpenCourseWare", type: "university", url: "https://ocw.mit.edu/courses/6-0001-introduction-to-computer-science-and-programming-in-python-fall-2016/", level: "Beginner",
    description: "Designed to help people with no prior exposure to computer science learn to think computationally and write programs.", tags: ["Python", "Computation"]
  },
  {
    title: "MIT 6.006: Introduction to Algorithms", category: "Computer Science Core", subtopic: "Algorithms",
    provider: "MIT OpenCourseWare", type: "university", url: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/", level: "Intermediate",
    description: "Mathematical modeling of computational problems, common algorithms, algorithmic paradigms, and data structures.", tags: ["Sorting", "Graphs", "Dynamic Programming"]
  },
  {
    title: "Algorithms, Part I & II", category: "Computer Science Core", subtopic: "Data Structures",
    provider: "Princeton University", type: "university", url: "https://www.coursera.org/learn/algorithms-part1", level: "Intermediate",
    description: "Essential information that every serious programmer needs to know about algorithms and data structures.", tags: ["Java", "Trees", "Graphs"]
  },

  // --- MATHEMATICS FOR CS ---
  {
    title: "MIT 6.042J: Mathematics for Computer Science", category: "Mathematics for CS", subtopic: "Discrete Mathematics",
    provider: "MIT OpenCourseWare", type: "university", url: "https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-fall-2015/", level: "Undergraduate",
    description: "Elementary discrete mathematics for computer science and engineering. Proofs, logic, induction, graph theory.", tags: ["Logic", "Proofs", "Graphs"]
  },
  {
    title: "MIT 18.06: Linear Algebra", category: "Mathematics for CS", subtopic: "Linear Algebra",
    provider: "Gilbert Strang (MIT)", type: "university", url: "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/", level: "Undergraduate",
    description: "The most famous linear algebra course in the world. Essential for understanding machine learning and graphics.", tags: ["Matrices", "Vectors", "Math"]
  },
  {
    title: "Harvard Stat 110: Probability", category: "Mathematics for CS", subtopic: "Probability & Statistics",
    provider: "Harvard University", type: "university", url: "https://statistics.fas.harvard.edu/pages/stat-110", level: "Undergraduate",
    description: "Comprehensive introduction to probability as a language and set of tools for understanding statistics and randomness.", tags: ["Statistics", "Markov Chains"]
  },

  // --- SYSTEMS & ARCHITECTURE ---
  {
    title: "Nand to Tetris (Build a Modern Computer)", category: "Systems & Architecture", subtopic: "Computer Architecture",
    provider: "Hebrew University", type: "web", url: "https://www.nand2tetris.org/", level: "Intermediate",
    description: "Build a modern computer system from the ground up, starting with simple logic gates and ending with an OS.", tags: ["Hardware", "Assembly", "OS"]
  },
  {
    title: "CMU 15-213: Introduction to Computer Systems", category: "Systems & Architecture", subtopic: "Computer Architecture",
    provider: "Carnegie Mellon", type: "university", url: "https://www.cs.cmu.edu/~213/", level: "Advanced",
    description: "How computer systems execute programs, store information, and communicate. The 'programmer's perspective'.", tags: ["C", "Assembly", "Memory"]
  },
  {
    title: "MIT 6.828: Operating System Engineering", category: "Systems & Architecture", subtopic: "Operating Systems",
    provider: "MIT OpenCourseWare", type: "university", url: "https://pdos.csail.mit.edu/6.828/", level: "Advanced",
    description: "Fundamentals of OS design and implementation. Includes building a small OS kernel (xv6) in C.", tags: ["C", "Kernel", "OS"]
  },
  {
    title: "MIT 6.824: Distributed Systems", category: "Systems & Architecture", subtopic: "Distributed Systems",
    provider: "MIT OpenCourseWare", type: "university", url: "https://pdos.csail.mit.edu/6.824/", level: "Advanced",
    description: "Abstractions and implementation techniques for engineering distributed systems. Fault tolerance, consensus (Raft).", tags: ["Go", "Raft", "MapReduce"]
  },
  {
    title: "CMU 15-445: Database Systems", category: "Systems & Architecture", subtopic: "Databases (Internals)",
    provider: "Carnegie Mellon", type: "university", url: "https://15445.courses.cs.cmu.edu/", level: "Advanced",
    description: "Design and implementation of database management systems. Storage, indexing, query execution, concurrency control.", tags: ["C++", "SQL", "DBMS"]
  },
  {
    title: "Stanford CS143: Compilers", category: "Systems & Architecture", subtopic: "Compilers",
    provider: "Stanford University", type: "university", url: "https://online.stanford.edu/courses/soe-ycscs1-compilers", level: "Advanced",
    description: "Principles and practices for design and implementation of compilers and interpreters.", tags: ["Parsing", "Lexical Analysis"]
  },

  // --- DATA & AI ---
  {
    title: "Stanford CS229: Machine Learning", category: "Data & AI", subtopic: "Machine Learning",
    provider: "Stanford University", type: "university", url: "https://cs229.stanford.edu/", level: "Advanced",
    description: "The definitive machine learning course covering theoretical foundations of supervised and unsupervised learning.", tags: ["Math", "Algorithms", "AI"]
  },
  {
    title: "Fast.ai: Practical Deep Learning for Coders", category: "Data & AI", subtopic: "Deep Learning",
    provider: "Fast.ai", type: "web", url: "https://course.fast.ai/", level: "Intermediate",
    description: "A top-down approach to deep learning. Build state-of-the-art models for vision, text, and tabular data quickly.", tags: ["PyTorch", "Deep Learning"]
  },
  {
    title: "Stanford CS224N: NLP with Deep Learning", category: "Data & AI", subtopic: "Natural Language Processing",
    provider: "Stanford University", type: "university", url: "https://web.stanford.edu/class/cs224n/", level: "Advanced",
    description: "Cutting-edge research in Natural Language Processing, focusing on neural network models like Transformers and LLMs.", tags: ["LLMs", "Transformers", "NLP"]
  },
  {
    title: "Stanford CS231n: Deep Learning for Computer Vision", category: "Data & AI", subtopic: "Computer Vision",
    provider: "Stanford University", type: "university", url: "http://cs231n.stanford.edu/", level: "Advanced",
    description: "Deep learning architectures for image classification, object detection, and visual recognition.", tags: ["CNNs", "Vision", "PyTorch"]
  },

  // --- SOFTWARE ENGINEERING ---
  {
    title: "The Odin Project", category: "Software Engineering", subtopic: "Web Development",
    provider: "Open Source", type: "web", url: "https://www.theodinproject.com/", level: "Beginner to Pro",
    description: "A complete, free open source coding curriculum for full-stack web development using Ruby on Rails or NodeJS.", tags: ["JavaScript", "React", "Node"]
  },
  {
    title: "Full Stack Open", category: "Software Engineering", subtopic: "Web Development",
    provider: "University of Helsinki", type: "university", url: "https://fullstackopen.com/en/", level: "Intermediate",
    description: "Deep dive into modern web development with React, Redux, Node.js, MongoDB, GraphQL and TypeScript.", tags: ["React", "TypeScript", "GraphQL"]
  },
  {
    title: "TechWorld with Nana: DevOps Bootcamp", category: "Software Engineering", subtopic: "DevOps & Cloud",
    provider: "Nana (YouTube)", type: "youtube", url: "https://www.youtube.com/c/TechWorldwithNana", level: "Beginner to Pro",
    description: "Extensive tutorials on Docker, Kubernetes, CI/CD, Jenkins, and Terraform for modern deployment infrastructure.", tags: ["Docker", "Kubernetes", "AWS"]
  },
  {
    title: "Android Basics in Kotlin", category: "Software Engineering", subtopic: "Mobile Development",
    provider: "Google (Web)", type: "web", url: "https://developer.android.com/courses/android-basics-kotlin/course", level: "Beginner",
    description: "Official Google course on building Android applications using Kotlin and Jetpack Compose.", tags: ["Kotlin", "Android", "Mobile"]
  },

  // --- NETWORKS & SECURITY ---
  {
    title: "Computer Networking: A Top-Down Approach", category: "Networks & Security", subtopic: "Computer Networks",
    provider: "Kurose & Ross (YouTube)", type: "youtube", url: "https://www.youtube.com/playlist?list=PLawfWYMUziZqyCG5TesrmFM73a55SRgPG", level: "Undergraduate",
    description: "Lectures based on the famous networking textbook, covering Application to Physical layers.", tags: ["TCP/IP", "DNS", "Routing"]
  },
  {
    title: "Cryptography I", category: "Networks & Security", subtopic: "Cryptography",
    provider: "Stanford / Dan Boneh", type: "university", url: "https://www.coursera.org/learn/crypto", level: "Advanced",
    description: "Inner workings of cryptographic systems and how to correctly use them in real-world applications.", tags: ["Math", "Security", "Encryption"]
  },
  {
    title: "Web Security Academy", category: "Networks & Security", subtopic: "Web Security",
    provider: "PortSwigger", type: "web", url: "https://portswigger.net/web-security", level: "Intermediate",
    description: "Free, interactive training on web security vulnerabilities (SQLi, XSS, CSRF) by the creators of Burp Suite.", tags: ["Penetration Testing", "Burp Suite"]
  },
  {
    title: "MIT 6.858: Computer Systems Security", category: "Networks & Security", subtopic: "Web Security",
    provider: "MIT OpenCourseWare", type: "university", url: "https://css.csail.mit.edu/6.858/2022/", level: "Advanced",
    description: "Design and implementation of secure computer systems. Threat models, buffer overflows, privilege separation.", tags: ["Security", "Systems"]
  },

  // --- THEORY OF COMPUTATION ---
  {
    title: "Introduction to Theory of Computation", category: "Theory of Computation", subtopic: "Automata Theory",
    provider: "Michael Sipser (MIT)", type: "university", url: "https://ocw.mit.edu/courses/18-404j-theory-of-computation-fall-2020/", level: "Advanced",
    description: "Automata, computability, and complexity. Turing machines, P vs NP, decidability.", tags: ["Math", "Turing Machines", "P vs NP"]
  }
];

// ==========================================
// 3. DATABASE SEEDING LOGIC
// ==========================================

const seedDatabase = async () => {
  try {
    const count = await Course.countDocuments();
    
    // Only seed if the database is empty or if a force flag is applied
    if (count === 0 || process.argv.includes('--force-seed')) {
      console.log('🌱 Initiating database seeding sequence...');
      
      // Wipe existing collection to prevent duplication on forced seeds
      await Course.deleteMany({});
      console.log('🗑️  Cleared existing course collection.');

      // Insert the massive dataset
      const inserted = await Course.insertMany(csDataset);
      console.log(`✅ Successfully inserted ${inserted.length} courses into MongoDB.`);
    } else {
      console.log(`⚡ Database already seeded. Found ${count} courses.`);
    }
  } catch (error) {
    console.error('❌ Seeding Error:', error.message);
    process.exit(1);
  }
};

// ==========================================
// 4. EXPRESS APPLICATION SETUP & ROUTES
// ==========================================


// Middleware
app.use(cors());
app.use(express.json());

/**
 * @route   GET /api/courses
 * @desc    Fetch courses with advanced filtering, full-text search, sorting, and pagination
 */
app.get('/api/courses', async (req, res) => {
  try {
    const { category, subtopic, type, q, sort = '-createdAt', page = 1, limit = 50 } = req.query;
    
    // Construct the dynamic MongoDB query object
    let queryObj = {};

    if (category && category !== 'All') {
      queryObj.category = category;
    }
    
    if (subtopic && subtopic !== 'All') {
      queryObj.subtopic = subtopic;
    }
    
    if (type && type !== 'All') {
      queryObj.type = type;
    }

    // Apply full-text search or fallback to Regex if text index isn't sufficient
    if (q && q.trim() !== '') {
      // Using MongoDB $or with $regex for partial matches across multiple fields
      queryObj.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { provider: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ];
    }

    // Pagination calculations
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query with sorting and pagination
    const courses = await Course.find(queryObj)
                                .sort(sort)
                                .skip(skip)
                                .limit(parseInt(limit));
    
    const total = await Course.countDocuments(queryObj);

    res.status(200).json({
      success: true,
      count: courses.length,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      data: courses
    });

  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ success: false, error: 'Server Error occurred while fetching data.' });
  }
});

/**
 * @route   GET /api/courses/metadata
 * @desc    Get aggregate data (e.g., dynamic extraction of unique categories and subtopics)
 */
app.get('/api/courses/metadata', async (req, res) => {
  try {
    // Utilize MongoDB Aggregation Pipeline to dynamically map categories to subtopics
    const metadata = await Course.aggregate([
      {
        $group: {
          _id: "$category",
          subtopics: { $addToSet: "$subtopic" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({ success: true, data: metadata });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to aggregate metadata.' });
  }
});

/**
 * @route   POST /api/courses
 * @desc    Submit a new course to the directory
 */
app.post('/api/courses', async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json({ success: true, data: course });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, error: messages });
    }
    // Handle duplicate key error (11000)
    if (error.code === 11000) {
      return res.status(400).json({ success: false, error: 'A course with this title already exists.' });
    }
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// ==========================================
// 5. SERVER BOOTSTRAP & DATABASE CONNECTION
// ==========================================

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI;

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log(`📦 MongoDB Connected Successfully to ${mongoose.connection.host}`);
    
    // Automatically trigger the seeding logic upon successful database connection
    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`🚀 OpenHub API running in ${process.env.NODE_ENV} mode on port ${PORT}`);
      console.log(`🌐 Endpoints:`);
      console.log(`    GET  http://localhost:${PORT}/api/courses`);
      console.log(`    GET  http://localhost:${PORT}/api/courses/metadata`);
    });
  })
  .catch((err) => {
    console.error(`❌ MongoDB Connection Error: ${err.message}`);
    process.exit(1);
  });