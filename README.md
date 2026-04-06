# Snowflake Practice Exam Portal ❄️

A dynamic, production-ready React application designed to simulate the Pearson VUE exam experience for Snowflake certification. This application serves as a robust study companion, featuring interactive question banks, categorical performance tracking, and rich markdown-based study guides.

## Features ✨

- **Professional UI/UX:** Modeled closely after the Pearson VUE testing environment but modernized with a clean web aesthetic using Tailwind CSS v4.
- **Dynamic Question Banks:** Users can select between a Standard Exam or an Advanced study mode that features detailed markdown study guides.
- **Rich Explanations:** Explanations support deep markdown elements including interactive Mermaid.js system architecture diagrams, IDE-themed SQL syntax highlighting, and well-structured formatting.
- **Real-Time Analytics:** The application tracks your real-time performance to determine your categorical readiness against official Snowflake documentation benchmarks.
- **Responsive Review Mode:** Interactive expand/collapse mechanisms allow you to dive deeply into incorrect choices using tailored instructional color coding (Emerald/Rose semantics).

## Setup & Local Development 🛠️

To run the application locally on your machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ramitdour/snowflake_practice_v1.git
   cd snowflake_practice_v1
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the Vite development server:**
   ```bash
   npm run dev
   ```

## Tech Stack 🚀
- **React.js** (Vite build system)
- **Tailwind CSS v4** (Utility-first styling, customized theme)
- **Context API** (Global state management for the active examination session)
- **React Markdown & Remark GFM** (Rendering complex markdown guides)
- **React Syntax Highlighter** (VS Code styling for SQL/Code snippets)
- **Mermaid.js** (Dynamic charting and diagramming directly from data)

## Extensibility 🗄️

The question logic cleanly loads localized `.json` banks within `public/data/`. New question formats can be easily dragged into this specific folder and routed through the selection matrix in the Application Context.

## Deployment 🌐

The project is automatically pushed to GitHub pages through simplified deployment scripts.
```bash
npm run deploy
```

---

## ⚠️ Disclaimer

**Please Note:** The questions, answers, and study guides included in the question banks for this project were extracted and generated using **Google Gemini**. While the core engine and design of this portal are highly structured, the data itself is AI-generated and **answers can sometimes be incorrectly labeled or reasoned**. Please actively review the answers provided and cross-reference them with official Snowflake Documentation if you are using this as a true study aid!
