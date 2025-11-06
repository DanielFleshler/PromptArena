# 🤖 AI Model Comparator - Project Specification & Work Plan

## 📌 Overview

**Project Name:** AI Model Comparator  
**Goal:** An application that enables comparison of responses from three AI models (Claude, GPT, Gemini) simultaneously  
**Technologies:** Next.js, MongoDB, Tailwind CSS, Recharts  
**Estimated Duration:** 12 working days  
**Status:** 🔴 Not Started

---

## 🎯 Main Features

### Core Features

- ✅ Side-by-Side Comparison
- ✅ Live Streaming Responses
- ✅ Voting System + Analytics Dashboard

### Advanced Features

- ✅ Category Detection (Code/Creative/Q&A)
- ✅ Response Quality Metrics (time, tokens, readability)
- ✅ Prompt Templates Library

### Premium Features

- ✅ Prompt Optimization Suggestions

---

## 📦 Tech Stack

```
Frontend:
├── Next.js 14 (App Router)
├── React
├── Tailwind CSS
└── Recharts (Analytics)

Backend:
├── Next.js API Routes
├── MongoDB Atlas
└── Mongoose

APIs:
├── OpenAI API (GPT)
├── Anthropic API (Claude)
└── Google AI API (Gemini)

Deployment:
└── Vercel
```

---

## 🗂️ Database Structure

### Collection: `comparisons`

```javascript
{
  _id: ObjectId,
  prompt: String,
  category: String, // 'code' | 'creative' | 'factual' | 'data' | 'qa'
  responses: {
    claude: {
      text: String,
      responseTime: Number, // milliseconds
      tokenCount: Number,
      timestamp: Date
    },
    gpt: {
      text: String,
      responseTime: Number,
      tokenCount: Number,
      timestamp: Date
    },
    gemini: {
      text: String,
      responseTime: Number,
      tokenCount: Number,
      timestamp: Date
    }
  },
  winner: String, // 'claude' | 'gpt' | 'gemini' | null
  votedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 📅 Detailed Work Plan

---

## **Phase 1: Setup & Infrastructure** 🏗️

**⏱️ Duration: Day 1**  
**🎯 Goal:** Setting up the project and basic infrastructure

### 1.1 Project Setup

- [ ] Create Next.js project

  ```bash
  npx create-next-app@latest ai-comparator
  # Select: TypeScript: No, Tailwind: Yes, App Router: Yes
  ```

- [ ] Clean up unnecessary files

  - [ ] Delete default content from `app/page.js`
  - [ ] Delete unnecessary styles from `app/globals.css`

- [ ] Install dependencies

  ```bash
  npm install mongoose axios recharts
  npm install @anthropic-ai/sdk openai @google/generative-ai
  ```

- [ ] Setup Git
  ```bash
  git init
  git add .
  git commit -m "Initial commit"
  # Create repo on GitHub and push
  ```

### 1.2 Environment Variables

- [ ] Create `.env.local` file

  ```
  OPENAI_API_KEY=sk-...
  ANTHROPIC_API_KEY=sk-ant-...
  GOOGLE_AI_API_KEY=...
  MONGODB_URI=mongodb+srv://...
  ```

- [ ] Add `.env.local` to `.gitignore` (already included)

### 1.3 MongoDB Setup

- [ ] Create account on MongoDB Atlas (https://www.mongodb.com/cloud/atlas)
- [ ] Create free Cluster
- [ ] Create Database User
- [ ] Whitelist IP (0.0.0.0/0 for development)
- [ ] Get Connection String and add to `.env.local`

### 1.4 MongoDB Connection

- [ ] Create `/lib/mongodb.js`

  ```javascript
  import mongoose from "mongoose";

  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
  	throw new Error("Please define MONGODB_URI in .env.local");
  }

  let cached = global.mongoose;

  if (!cached) {
  	cached = global.mongoose = { conn: null, promise: null };
  }

  async function connectDB() {
  	if (cached.conn) return cached.conn;

  	if (!cached.promise) {
  		cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
  			return mongoose;
  		});
  	}
  	cached.conn = await cached.promise;
  	return cached.conn;
  }

  export default connectDB;
  ```

### 1.5 Create Mongoose Schema

- [ ] Create `/models/Comparison.js`

  ```javascript
  import mongoose from "mongoose";

  const ComparisonSchema = new mongoose.Schema(
  	{
  		prompt: { type: String, required: true },
  		category: { type: String, default: "general" },
  		responses: {
  			claude: {
  				text: String,
  				responseTime: Number,
  				tokenCount: Number,
  				timestamp: Date,
  			},
  			gpt: {
  				text: String,
  				responseTime: Number,
  				tokenCount: Number,
  				timestamp: Date,
  			},
  			gemini: {
  				text: String,
  				responseTime: Number,
  				tokenCount: Number,
  				timestamp: Date,
  			},
  		},
  		winner: { type: String, default: null },
  		votedAt: Date,
  	},
  	{
  		timestamps: true,
  	}
  );

  export default mongoose.models.Comparison ||
  	mongoose.model("Comparison", ComparisonSchema);
  ```

### 1.6 Project Structure

- [ ] Create folders:
  ```
  /app
    /api
      /prompt
      /vote
      /stats
    /components
    /stats
  /lib
  /models
  /utils
  ```

**✅ Checklist Phase 1:**

- [ ] Project initialized
- [ ] Dependencies installed
- [ ] Git repository created
- [ ] MongoDB connected
- [ ] Schema created
- [ ] Folder structure ready

---

## **Phase 2: Core Features** 💎

---

### **Feature #1: Side-by-Side UI**

**⏱️ Duration: Day 2**  
**🎯 Goal:** Building the basic interface for displaying responses

#### Tasks:

- [ ] **2.1.1** Create Component: `PromptInput.jsx`

  - [ ] Textarea with placeholder
  - [ ] Submit button
  - [ ] Character counter (optional)
  - [ ] Disabled state during loading

- [ ] **2.1.2** Create Component: `ResponseCard.jsx`

  - [ ] Props: `model`, `response`, `isLoading`
  - [ ] Header with logo/model name
  - [ ] Content area
  - [ ] Copy button
  - [ ] Loading skeleton

- [ ] **2.1.3** Create Component: `ComparisonGrid.jsx`

  - [ ] Grid layout: 3 columns (desktop), 1 column (mobile)
  - [ ] Responsive breakpoints
  - [ ] Contains 3 ResponseCards

- [ ] **2.1.4** Update `app/page.js`

  - [ ] State management (useState)
  - [ ] Layout: Header + PromptInput + ComparisonGrid
  - [ ] Basic styling

- [ ] **2.1.5** Styling & Responsive
  - [ ] Tailwind classes
  - [ ] Mobile: stacked cards
  - [ ] Desktop: 3-column grid
  - [ ] Tablet: 2 columns or stacked

**Testing:**

- [ ] Correct display on all screen sizes
- [ ] Copy button works
- [ ] UI is clean and organized

---

### **Feature #2: Live Streaming Responses**

**⏱️ Duration: Day 3**  
**🎯 Goal:** Calling AI models and displaying responses in real-time

#### Tasks:

- [ ] **2.2.1** Create `/utils/aiClients.js`

  - [ ] OpenAI client
  - [ ] Anthropic client
  - [ ] Google AI client
  - [ ] Error handling

- [ ] **2.2.2** Create API Route: `/app/api/prompt/route.js`

  - [ ] Receive prompt from body
  - [ ] Call 3 APIs in parallel (`Promise.all`)
  - [ ] Measure response time for each
  - [ ] Calculate token count (approximate)
  - [ ] Save to MongoDB
  - [ ] Return responses

- [ ] **2.2.3** Frontend Integration

  - [ ] Call API on Submit click
  - [ ] Display loading state
  - [ ] Display responses in ResponseCards
  - [ ] Error handling

- [ ] **2.2.4** Streaming (advanced option)

  - [ ] If there's time: implement real streaming
  - [ ] Otherwise: simulate with setTimeout

- [ ] **2.2.5** Token Count Calculation
  - [ ] Create `/utils/tokenCounter.js`
  - [ ] Function: `estimateTokens(text)`
  - [ ] Simple formula: `words * 1.3`

**Testing:**

- [ ] API calls work
- [ ] Responses display correctly
- [ ] Errors are handled
- [ ] Response time is accurate

---

### **Feature #3: Voting System + Analytics**

**⏱️ Duration: Day 4**  
**🎯 Goal:** Voting system and statistics dashboard

#### Tasks:

- [ ] **2.3.1** Vote Buttons in ResponseCard

  - [ ] Button "👍 Best Answer"
  - [ ] Disabled until all responses are loaded
  - [ ] Visual feedback on click

- [ ] **2.3.2** Create API Route: `/app/api/vote/route.js`

  - [ ] Receive `comparisonId` and `winner`
  - [ ] Update document in MongoDB
  - [ ] Return success/failure

- [ ] **2.3.3** Frontend Vote Logic

  - [ ] onClick on Vote button
  - [ ] Call API
  - [ ] Toast notification: "Vote saved!"
  - [ ] Disable all buttons after vote

- [ ] **2.3.4** Create API Route: `/app/api/stats/route.js`

  - [ ] Query all comparisons
  - [ ] Calculate:
    - Win rate per model
    - Total comparisons
    - Votes per model
  - [ ] Return JSON

- [ ] **2.3.5** Create Stats Page: `/app/stats/page.js`

  - [ ] Call `/api/stats`
  - [ ] Display basic statistics

- [ ] **2.3.6** Charts with Recharts

  - [ ] Bar Chart: Win rate per model
  - [ ] Pie Chart: Vote distribution
  - [ ] Responsive charts

- [ ] **2.3.7** Navigation
  - [ ] Link from home page to Stats
  - [ ] Link from Stats back to Home

**Testing:**

- [ ] Vote is saved in DB
- [ ] Stats are calculated correctly
- [ ] Charts display nicely
- [ ] Navigation works

**✅ Checklist Phase 2:**

- [ ] UI complete
- [ ] API calls working
- [ ] Voting system active
- [ ] Analytics dashboard displayed

---

## **Phase 3: Advanced Features** 🚀

---

### **Feature #4: Category Detection**

**⏱️ Duration: Day 5**  
**🎯 Goal:** Automatic detection of prompt type

#### Tasks:

- [ ] **3.1.1** Create `/utils/categoryDetector.js`

  ```javascript
  export function detectCategory(prompt) {
  	const lowerPrompt = prompt.toLowerCase();

  	// Code
  	if (lowerPrompt.match(/code|function|debug|error|program|script/)) {
  		return "code";
  	}

  	// Creative
  	if (lowerPrompt.match(/write|story|poem|creative|imagine|describe/)) {
  		return "creative";
  	}

  	// Data Analysis
  	if (lowerPrompt.match(/analyze|data|statistics|calculate|compare/)) {
  		return "data";
  	}

  	// Factual/Q&A
  	if (lowerPrompt.match(/what|who|where|when|how|explain|define/)) {
  		return "qa";
  	}

  	return "general";
  }
  ```

- [ ] **3.1.2** Integration in API Route

  - [ ] Call `detectCategory()` before saving
  - [ ] Save category to MongoDB

- [ ] **3.1.3** Category Badge in UI

  - [ ] Display badge above responses
  - [ ] Different colors for each category
  - [ ] Icons (💻 📝 📊 🤔)

- [ ] **3.1.4** Stats per Category
  - [ ] Update `/api/stats` to calculate by category
  - [ ] Display in Dashboard
  - [ ] Filter by category selection

**Testing:**

- [ ] Correct category detection
- [ ] Badge is displayed
- [ ] Stats divided by category

---

### **Feature #5: Response Quality Metrics**

**⏱️ Duration: Day 6**  
**🎯 Goal:** Display quality metrics for each response

#### Tasks:

- [ ] **3.2.1** Create `/utils/qualityMetrics.js`

  ````javascript
  export function calculateMetrics(text, responseTime) {
  	return {
  		responseTime, // already measured
  		tokenCount: estimateTokens(text),
  		readability: calculateReadability(text),
  		hasCode: detectCode(text),
  	};
  }

  function calculateReadability(text) {
  	const sentences = text.split(/[.!?]+/).length;
  	const words = text.split(/\s+/).length;
  	const avgWordsPerSentence = words / sentences;

  	if (avgWordsPerSentence < 15) return "Easy";
  	if (avgWordsPerSentence < 25) return "Medium";
  	return "Complex";
  }

  function detectCode(text) {
  	return (
  		text.includes("```") || text.match(/function|const|let|var|def|class/)
  	);
  }
  ````

- [ ] **3.2.2** Integration in Response Saving

  - [ ] Calculate metrics for each response
  - [ ] Save to MongoDB (extend schema)

- [ ] **3.2.3** Display in ResponseCard

  - [ ] Footer with badges:
    ```
    ⏱️ 2.3s | 📝 450 tokens | 📖 Easy | 💻 Contains code
    ```
  - [ ] Tooltips on hover

- [ ] **3.2.4** Update Schema
  - [ ] Add fields: `readability`, `hasCode`

**Testing:**

- [ ] Metrics calculated correctly
- [ ] Correct display in UI
- [ ] Schema updated

---

### **Feature #6: Prompt Templates Library**

**⏱️ Duration: Day 7**  
**🎯 Goal:** Gallery of ready-to-use prompts

#### Tasks:

- [ ] **3.3.1** Create `/data/templates.js`

  ```javascript
  export const templates = [
  	{
  		id: 1,
  		title: "🐛 Debug Code",
  		prompt:
  			"Debug this code and explain the issue:\n\n[Paste your code here]",
  		category: "code",
  		icon: "🐛",
  	},
  	{
  		id: 2,
  		title: "✍️ Write Story",
  		prompt: "Write a short creative story about ",
  		category: "creative",
  		icon: "✍️",
  	},
  	{
  		id: 3,
  		title: "📊 Analyze Data",
  		prompt: "Analyze this data and provide insights:\n\n",
  		category: "data",
  		icon: "📊",
  	},
  	{
  		id: 4,
  		title: "🤔 ELI5",
  		prompt: "Explain like I'm 5: ",
  		category: "qa",
  		icon: "🤔",
  	},
  	{
  		id: 5,
  		title: "💼 Cover Letter",
  		prompt:
  			"Write a professional cover letter for a [job title] position at [company]",
  		category: "creative",
  		icon: "💼",
  	},
  	{
  		id: 6,
  		title: "🔍 Research Summary",
  		prompt: "Summarize the key points about ",
  		category: "qa",
  		icon: "🔍",
  	},
  ];
  ```

- [ ] **3.3.2** Create Component: `TemplateCard.jsx`

  - [ ] Card with icon, title, preview
  - [ ] onClick: fills prompt input

- [ ] **3.3.3** Create Component: `TemplatesLibrary.jsx`

  - [ ] Grid of TemplateCards
  - [ ] Responsive (2-3 columns)
  - [ ] Option: Filter by category

- [ ] **3.3.4** Add to Home Page
  - [ ] Position: below PromptInput or on side
  - [ ] Collapsible/Expandable (optional)

**Testing:**

- [ ] Click on template fills input
- [ ] All templates displayed
- [ ] Responsive works

**✅ Checklist Phase 3:**

- [ ] Category detection active
- [ ] Quality metrics displayed
- [ ] Templates library ready

---

## **Phase 4: Premium Feature** ⭐

---

### **Feature #9: Prompt Optimization**

**⏱️ Duration: Days 8-9**  
**🎯 Goal:** Suggestions for improving prompts

#### Tasks:

- [ ] **4.1.1** Create `/utils/promptOptimizer.js`

  ```javascript
  export function analyzePrompt(prompt) {
  	const suggestions = [];
  	const warnings = [];

  	// Length check
  	if (prompt.length < 10) {
  		warnings.push("Prompt too short - add more details");
  	}
  	if (prompt.length > 500) {
  		suggestions.push("Consider breaking into smaller prompts");
  	}

  	// Clarity
  	if (!prompt.includes("?") && !isCommand(prompt)) {
  		suggestions.push("Try phrasing as a clear question");
  	}

  	// Specificity
  	const vagueWords = ["thing", "stuff", "some", "something"];
  	if (vagueWords.some((word) => prompt.toLowerCase().includes(word))) {
  		suggestions.push("Be more specific - avoid vague terms");
  	}

  	// Context
  	if (!hasContext(prompt)) {
  		suggestions.push("Add context: who, what, why, or when");
  	}

  	// Examples
  	if (prompt.length > 50 && !prompt.includes("example")) {
  		suggestions.push("Consider adding examples for clarity");
  	}

  	return {
  		score: calculateScore(prompt),
  		suggestions,
  		warnings,
  	};
  }

  function isCommand(prompt) {
  	const commands = ["write", "explain", "create", "make", "show"];
  	return commands.some((cmd) => prompt.toLowerCase().startsWith(cmd));
  }

  function hasContext(prompt) {
  	const contextWords = [
  		"because",
  		"for",
  		"about",
  		"regarding",
  		"in order to",
  	];
  	return contextWords.some((word) => prompt.toLowerCase().includes(word));
  }

  function calculateScore(prompt) {
  	let score = 50; // base score

  	if (prompt.length >= 20 && prompt.length <= 200) score += 20;
  	if (prompt.includes("?")) score += 10;
  	if (hasContext(prompt)) score += 20;

  	return Math.min(100, score);
  }
  ```

- [ ] **4.1.2** Create Component: `PromptAnalysis.jsx`

  - [ ] Score bar (0-100)
  - [ ] List of suggestions
  - [ ] List of warnings (red)
  - [ ] Icons: ✅ ⚠️ 💡

- [ ] **4.1.3** Real-time Analysis

  - [ ] onChange on textarea
  - [ ] Debounce (300ms) before analysis
  - [ ] Display below input

- [ ] **4.1.4** "Optimize" Button

  - [ ] Button "✨ Optimize Prompt"
  - [ ] Function: `optimizePrompt(prompt)`
  - [ ] Improvements:
    - Add "Please" at beginning
    - Convert to question (if needed)
    - Add "detailed" or "step-by-step"
  - [ ] Update textarea

- [ ] **4.1.5** Advanced Option: AI Optimization
  - [ ] If there's time: use AI API for improvement
  - [ ] API Route: `/app/api/optimize-prompt/route.js`
  - [ ] Call one model (cheap) for improvement

**Testing:**

- [ ] Analysis works in real-time
- [ ] Suggestions are relevant
- [ ] Optimize button improves prompt
- [ ] UI is clean and clear

**✅ Checklist Phase 4:**

- [ ] Prompt analysis active
- [ ] Suggestions displayed
- [ ] Optimization works

---

## **Phase 5: Polish & Deploy** 🎨

---

### **5.1 UI/UX Polish**

**⏱️ Duration: Day 10**

- [ ] **5.1.1** Animations

  - [ ] Install Framer Motion: `npm install framer-motion`
  - [ ] Cards fade in
  - [ ] Smooth transitions
  - [ ] Loading animations

- [ ] **5.1.2** Error States

  - [ ] Error boundaries
  - [ ] "Something went wrong" message
  - [ ] Retry button

- [ ] **5.1.3** Empty States

  - [ ] "No comparisons yet" on Stats page
  - [ ] Placeholder image/icon

- [ ] **5.1.4** Toast Notifications

  - [ ] Install react-hot-toast: `npm install react-hot-toast`
  - [ ] Success: "Comparison saved!"
  - [ ] Error: "Failed to save vote"

- [ ] **5.1.5** Loading Skeletons
  - [ ] Skeleton for ResponseCards
  - [ ] Shimmer effect

---

### **5.2 Performance**

**⏱️ Duration: Day 10 (continued)**

- [ ] **5.2.1** Code Splitting

  - [ ] Dynamic imports for large components
  - [ ] Lazy loading of Stats page

- [ ] **5.2.2** Caching

  - [ ] Cache stats (5 minutes)
  - [ ] React Query or SWR (optional)

- [ ] **5.2.3** Rate Limiting

  - [ ] Limit API calls (prevent spam)
  - [ ] Client-side: disable button for 3 seconds
  - [ ] Server-side: rate limiting middleware (optional)

- [ ] **5.2.4** Bundle Size
  - [ ] Check: `npm run build`
  - [ ] Optimize if needed

---

### **5.3 Documentation**

**⏱️ Duration: Day 11**

- [ ] **5.3.1** README.md

  - [ ] Project overview
  - [ ] Screenshots/GIFs
  - [ ] Features list
  - [ ] Tech stack
  - [ ] Installation instructions
  - [ ] Environment variables
  - [ ] Usage guide
  - [ ] License (MIT)

- [ ] **5.3.2** Code Comments

  - [ ] JSDoc for main functions
  - [ ] Comments for complex sections

- [ ] **5.3.3** API Documentation
  - [ ] Short document with all endpoints
  - [ ] Parameters and responses

---

### **5.4 Deployment**

**⏱️ Duration: Day 11 (continued)**

- [ ] **5.4.1** Prepare for Production

  - [ ] Check: `npm run build`
  - [ ] Fix warnings
  - [ ] Test locally: `npm run start`

- [ ] **5.4.2** GitHub

  - [ ] Push final code
  - [ ] Create Releases (optional)

- [ ] **5.4.3** Vercel Deployment

  - [ ] Sign up for Vercel (https://vercel.com)
  - [ ] "New Project" → Import from GitHub
  - [ ] Select repository
  - [ ] Framework Preset: Next.js (auto-detected)
  - [ ] Environment Variables:
    - Add all variables from `.env.local`
  - [ ] Deploy!

- [ ] **5.4.4** Post-Deploy Testing

  - [ ] Test all features
  - [ ] Mobile testing
  - [ ] Error tracking

- [ ] **5.4.5** Custom Domain (optional)
  - [ ] Purchase domain
  - [ ] Configure in Vercel

**✅ Checklist Phase 5:**

- [ ] UI polished
- [ ] Performance optimized
- [ ] Documentation complete
- [ ] Deployed successfully

---

## **Phase 6: Final Touches** ✨

**⏱️ Duration: Day 12**

### 6.1 Final Testing

- [ ] **Manual Testing**

  - [ ] All features working
  - [ ] Mobile responsive
  - [ ] Cross-browser (Chrome, Firefox, Safari)

- [ ] **Edge Cases**
  - [ ] Empty prompt
  - [ ] API failures
  - [ ] Network errors
  - [ ] Long responses

### 6.2 Analytics (optional)

- [ ] **Google Analytics**
  - [ ] Setup GA4
  - [ ] Track page views
  - [ ] Track button clicks

### 6.3 Portfolio Presentation

- [ ] **Screenshots**

  - [ ] Homepage
  - [ ] Comparison view
  - [ ] Stats dashboard
  - [ ] Mobile view

- [ ] **Demo Video**

  - [ ] 30-60 seconds
  - [ ] Shows main features
  - [ ] Upload to LinkedIn/GitHub

- [ ] **LinkedIn Post**
  - [ ] Project description
  - [ ] Link to demo
  - [ ] Hashtags: #WebDev #AI #NextJS

### 6.4 Bug Fixes

- [ ] List of found bugs:
  - [ ] Bug 1: **\*\***\_\_\_**\*\***
  - [ ] Bug 2: **\*\***\_\_\_**\*\***
  - [ ] Bug 3: **\*\***\_\_\_**\*\***

**✅ Checklist Phase 6:**

- [ ] Complete testing
- [ ] Portfolio-ready
- [ ] Demo video ready
- [ ] All bugs fixed

---

## 📊 Progress Tracking

### Overall Progress

```
Phase 1: Setup                    [ ] ⬜⬜⬜⬜⬜ 0%
Phase 2: Core Features            [ ] ⬜⬜⬜⬜⬜ 0%
Phase 3: Advanced Features        [ ] ⬜⬜⬜⬜⬜ 0%
Phase 4: Premium Feature          [ ] ⬜⬜⬜⬜⬜ 0%
Phase 5: Polish & Deploy          [ ] ⬜⬜⬜⬜⬜ 0%
Phase 6: Final Touches            [ ] ⬜⬜⬜⬜⬜ 0%

Total Progress:                   [ ] ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜ 0%
```

---

## 🎯 Success Criteria

Upon project completion, you'll be able to say:

✅ **Technical Skills:**

- Full-stack Next.js application
- Integration with 3 AI APIs
- Real-time data handling
- MongoDB database design
- RESTful API development
- Responsive UI/UX

✅ **Features Delivered:**

- Side-by-side AI comparison
- Live streaming responses
- Voting & analytics system
- Category detection
- Quality metrics
- Prompt templates
- Prompt optimization

✅ **Portfolio Value:**

- Professional, production-ready code
- Clean, modern UI
- Deployed live demo
- Comprehensive documentation
- Demo video for LinkedIn

---

## 🔗 Important Links

### Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [MongoDB Atlas](https://www.mongodb.com/docs/atlas/)
- [OpenAI API](https://platform.openai.com/docs)
- [Anthropic API](https://docs.anthropic.com)
- [Google AI API](https://ai.google.dev/docs)

### Tools

- [Vercel Dashboard](https://vercel.com/dashboard)
- [MongoDB Atlas Dashboard](https://cloud.mongodb.com)
- [GitHub Repo](YOUR_REPO_URL)

### Deployment

- **Live Demo:** YOUR_VERCEL_URL
- **GitHub:** YOUR_GITHUB_URL
