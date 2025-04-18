# Grammar & Tone Tool

A Next.js + TypeScript app that leverages the OpenAI API to:

- **Correct grammar**  
- **Adjust tone** (e.g. Professional, Casual, Friendly…)  
- **Rate tone** on a 0–10 scale  

Built with the App Router and styled using Tailwind CSS.

---

## 🔧 Prerequisites

- Node.js ≥ 16  
- npm or yarn  
- An [OpenAI API key](https://platform.openai.com/)

---

## 🚀 Installation

1. **Clone the repo**  
   ```bash
   git clone https://github.com/jaswantsandhu/tone‑tool.git
   cd tone‑tool
   ```

2. **Install dependencies**  
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Add your API key**  
   Create a `.env.local` in the project root:
   ```env
   OPENAI_API_KEY=sk‑yourapikey
   ```

---

## 🏃 Running Locally

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚙️ Usage

1. **Paste** your message into the textarea.  
2. **Select** a mode:
   - Grammar Review  
   - Tone Adjustment  
   - Rate Tone  
3. For **Tone Adjustment**, click one of the emoji‑labelled buttons to see:
   - Original rating  
   - Adjusted text  
   - Adjusted rating  

---

## 📜 Available Scripts

- `dev` — start development server  
- `build` — compile for production  
- `start` — run the production build  
- `lint` — run ESLint checks  

---

## 🤝 Contributing

1. Fork the repository  
2. Create a feature branch (`git checkout -b feat/your‑idea`)  
3. Commit your changes (`git commit -m "Add your feature"`)  
4. Push to GitHub (`git push origin feat/your‑idea`)  
5. Open a Pull Request  

---

## 📄 License

MIT © 2025 Jaswant Sandhu
