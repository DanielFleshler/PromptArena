# ⭐ StarScout

### _Scout your best repositories and shine on GitHub_

![Status](https://img.shields.io/badge/status-in_development-yellow)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)
![PostgreSQL](https://img.shields.io/badge/postgresql-%3E%3D14.0-blue)

---

## 📖 About

**StarScout** is a full-stack application that automatically analyzes GitHub profiles and scouts your star-worthy repositories. Built with a custom job queue system, it demonstrates advanced backend concepts including distributed workers, priority scheduling, and concurrent processing.

### The Problem It Solves

Developers have repositories scattered across GitHub but often struggle to:
- Identify which projects are portfolio-worthy
- Get objective insights into their coding activity
- Understand how their GitHub profile appears to recruiters
- Optimize their repository presentation

### The Solution

Enter a GitHub username and get:
- 📊 **Deep repository analysis** - Stars, languages, code quality, README scores
- 🏆 **Portfolio rankings** - AI-powered scoring of which repos to showcase
- 💡 **Actionable suggestions** - Specific recommendations to improve visibility
- 📦 **Ready-to-use exports** - JSON, Markdown, and HTML formats for your portfolio site

---

## ✨ Features

### Core Functionality
- 🔄 **Custom Job Queue System** - Priority-based task scheduling with heap implementation
- 👷 **Distributed Worker Pool** - Concurrent processing with 3+ workers
- 🎯 **Intelligent Ranking** - Multi-factor algorithm scoring repos 0-100
- 📈 **Real-time Progress** - Live updates as analysis progresses
- 💾 **Smart Caching** - Avoids redundant API calls and analysis

### Analysis Metrics
- ⭐ Stars, forks, and engagement metrics
- 📝 README quality scoring (0-100)
- 💻 Lines of code by language
- 🧪 Test coverage detection
- 🔄 CI/CD pipeline detection
- 📜 License verification
- 📅 Activity and recency tracking

### Portfolio Generation
- 🏅 Top 5 repository recommendations
- 📊 Language breakdown visualization
- 📈 Contribution statistics
- 💬 Personalized improvement suggestions
- 📤 Multiple export formats (JSON, Markdown, HTML)

---

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js 16+
- **Framework:** Express.js
- **Database:** PostgreSQL 14+
- **Queue:** Custom priority queue (min-heap)
- **Workers:** Node.js worker processes

### Frontend
- **Framework:** React 18
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **State:** React Hooks + Context

### External APIs
- **GitHub API** - Profile and repository data
- **Git** - Repository cloning and analysis

### Deployment
- **Backend:** Railway / Render
- **Frontend:** Vercel
- **Database:** Supabase / Railway

---

## 🏗️ System Architecture

```
User Interface (React)
        ↓
   Express API
        ↓
  Priority Queue ←→ PostgreSQL
        ↓
  Worker Pool (3 workers)
        ↓
  Job Execution
   ├─ GitHub API calls
   ├─ Git operations
   ├─ Code analysis
   └─ Portfolio generation
```

### Job Flow Example

1. **User submits:** GitHub username
2. **API creates jobs:**
   - Job #1: Fetch profile (priority: 10)
   - Job #2: Fetch repositories (priority: 9)
3. **Worker processes:** Fetches 25 repositories
4. **API creates 25 analysis jobs:** One per repo (priority: 5)
5. **Workers process in parallel:** 3 workers analyzing simultaneously
6. **Final job:** Generate portfolio (priority: 1)
7. **User receives:** Complete analysis with rankings

---

## 🎯 Usage

1. **Enter GitHub username** in the input field
2. **Click "Analyze"** to start the process
3. **Watch real-time progress** as jobs are processed
4. **View results** including:
   - Top recommended repositories
   - Language breakdown
   - Improvement suggestions
   - Detailed metrics per repository
5. **Export portfolio data** in your preferred format

---

## 📊 Project Structure

```
starscout/
├── backend/
│   ├── src/
│   │   ├── api/          # Express routes
│   │   ├── queue/        # Priority queue implementation
│   │   ├── workers/      # Worker pool
│   │   ├── jobs/         # Job definitions
│   │   ├── analyzers/    # Analysis logic
│   │   ├── services/     # External services (GitHub, Git)
│   │   └── db/           # Database models & migrations
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   └── services/     # API client
│   └── package.json
│
├── docs/                 # Documentation
├── PROJECT-SPEC.md       # Technical specification
└── README.md            # This file
```

---

## 🔑 Key Technical Highlights

### 1. Custom Priority Queue
Implemented from scratch using a min-heap for O(log n) operations:
- Efficient job prioritization
- Database-backed persistence
- Race condition handling with PostgreSQL locks

### 2. Distributed Worker Architecture
- Multiple worker processes running concurrently
- Job deduplication using `FOR UPDATE SKIP LOCKED`
- Graceful error handling and retry logic
- Exponential backoff for failed jobs

### 3. GitHub API Integration
- Rate limiting with intelligent backoff
- Pagination handling for large datasets
- Authentication with personal access tokens
- Caching to minimize API calls

### 4. Ranking Algorithm
Multi-factor scoring system considering:
- Repository engagement (stars, forks)
- Documentation quality (README score)
- Project activity and recency
- Code quality indicators (tests, CI/CD)
- Originality (not forked)

---

## 🎓 What I Learned

This project demonstrates:

- ✅ **Data Structures:** Min-heap implementation for priority queue
- ✅ **Algorithms:** Custom ranking algorithm, text analysis
- ✅ **System Design:** Job queue architecture, worker pools
- ✅ **Concurrency:** Handling race conditions, parallel processing
- ✅ **Database Design:** Complex schema, indexes, transactions
- ✅ **API Integration:** Rate limiting, pagination, error handling
- ✅ **Full-Stack Development:** React + Node.js + PostgreSQL

---

## 🤝 Contributing

This is a personal portfolio project, but feedback and suggestions are welcome!
---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Daniel Fleshler**

- GitHub: [@DanielFleshler](https://github.com/DanielFleshler)
- LinkedIn: [Connect with me](https://www.linkedin.com/in/danielflesh/)

---

---

**Built with ❤️ as a portfolio project to demonstrate full-stack and system design skills**
