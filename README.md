# TweetForge — AI Brand Tweet Generator

## Deploy to Vercel (5 minutes)

### Step 1: Get your free Google Gemini API Key
1. Go to https://aistudio.google.com and sign in with your Google account
2. Click **"Get API Key"** → **"Create API key"**
3. Copy the key (starts with `AIza...`)

### Step 2: Push to GitHub
1. Create a new repo on github.com (name it `tweetforge`)
2. Upload all these files into it (drag & drop works on GitHub)

### Step 3: Deploy on Vercel
1. Go to https://vercel.com → Sign up with GitHub
2. Click **"Add New Project"** → Import your `tweetforge` repo
3. Click **"Environment Variables"** and add:
   - **Name:** `GEMINI_API_KEY`
   - **Value:** your key from Step 1
4. Click **Deploy** — done! ✦

Your live URL will be something like: `https://tweetforge-yourname.vercel.app`

---

## Local Development

```bash
npm install
npm run dev
```

Add a `.env` file with:
```
GEMINI_API_KEY=AIza-your-key-here
```

> ⚠️ Never commit your `.env` file or share your API key publicly.
