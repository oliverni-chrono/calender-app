# 🚀 Deployment Guide - Holiday Horizon

This guide will help you deploy your Holiday Horizon app publicly using **Vercel** (recommended) or other platforms.

---

## ⚡ Deploy to Vercel (Recommended)

Vercel is the best choice for Vite applications - it's **free**, fast, and handles automatic deployments from GitHub.

### Step 1: Sign Up/Login to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"** or **"Login"**
3. Choose **"Continue with GitHub"** to connect your GitHub account

### Step 2: Import Your Project

1. Click **"Add New Project"**
2. Select **"Import Git Repository"**
3. Find and select: `oliverni-chrono/calender-app`
4. Click **"Import"**

### Step 3: Configure Project

Vercel will auto-detect your Vite app. Configure these settings:

**Framework Preset:** Vite  
**Build Command:** `npm run build`  
**Output Directory:** `dist`  
**Install Command:** `npm install`

### Step 4: Add Environment Variables

🔑 **CRITICAL:** Add your Gemini API key as an environment variable

1. In the project settings, find **"Environment Variables"**
2. Add a new variable:
   - **Name:** `GEMINI_API_KEY`
   - **Value:** `AIzaSyB8FiZ13twHgE-I51qXvuK52zQuoDCZ548` (or your API key)
   - **Environments:** Production, Preview, Development (check all)
3. Click **"Save"**

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait 1-2 minutes for the build to complete
3. Your app will be live at: `https://your-project-name.vercel.app`

### Automatic Updates

Every time you push to GitHub, Vercel will **automatically rebuild and redeploy** your app! 🎉

---

## 🌐 Alternative: Deploy to Netlify

### Quick Deploy

1. Go to [netlify.com](https://netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect to GitHub and select `calender-app`
4. Configure:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Add Environment Variable:
   - Key: `GEMINI_API_KEY`
   - Value: Your API key
6. Click **"Deploy"**

---

## 📦 Alternative: GitHub Pages (Static Only)

**Note:** GitHub Pages doesn't support environment variables at build time, so you'll need to use a different approach for the API key.

### Option A: Client-Side API Key (Not Recommended for Production)

1. Update `vite.config.ts` to use a different env variable pattern
2. Build: `npm run build`
3. Push `dist` folder to `gh-pages` branch
4. Enable GitHub Pages in repository settings

### Option B: Use GitHub Actions with Secrets

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm install
        
      - name: Build
        env:
          GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
        run: npm run build
        
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

Add `GEMINI_API_KEY` to GitHub Secrets in repository settings.

---

## 🔒 Security Best Practices

### Protecting Your API Key

1. **Never commit `.env.local`** - Already protected by `.gitignore`
2. **Use environment variables** - Always use platform env vars for production
3. **Rotate keys** - If exposed, get a new API key from [Google AI Studio](https://aistudio.google.com/apikey)
4. **Restrict API key** - In Google Cloud Console, add domain restrictions

### Recommended: Create a Separate Production API Key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Create a new API key specifically for production
3. Add domain restrictions (e.g., `*.vercel.app`)
4. Use this key in Vercel/Netlify environment variables

---

## 🎯 Quick Start Commands

```bash
# Check current status
git status

# Push any new changes
git add .
git commit -m "Your commit message"
git push origin main

# Local build test
npm run build
npm run preview
```

---

## 📊 Deployment Checklist

- [x] Code pushed to GitHub
- [ ] Platform selected (Vercel/Netlify/GitHub Pages)
- [ ] Project imported/connected
- [ ] Environment variables configured
- [ ] Build settings verified
- [ ] First deployment successful
- [ ] Test deployed app functionality
- [ ] Custom domain configured (optional)
- [ ] API key restrictions added (optional but recommended)

---

## 🆘 Troubleshooting

### Build Fails

- Check that `GEMINI_API_KEY` is set in environment variables
- Verify Node.js version is 18 or higher
- Check build logs for specific errors

### App Loads But Doesn't Work

- Verify environment variable name matches: `GEMINI_API_KEY`
- Check browser console for API errors
- Ensure API key has proper permissions

### API Key Issues

- Test API key locally first
- Check Google AI Studio for rate limits
- Verify key hasn't been restricted to specific domains

---

## 🌟 Post-Deployment

### Custom Domain (Optional)

Both Vercel and Netlify support custom domains:

1. Go to project settings
2. Find "Domains" section
3. Add your custom domain
4. Update DNS records as instructed

### Performance Monitoring

- Vercel provides analytics by default
- Netlify has built-in analytics (paid feature)
- Add Google Analytics if needed

---

## 📱 Share Your App

Once deployed, share your app URL:

```
https://your-app-name.vercel.app
```

Or with custom domain:

```
https://holiday-horizon.yourdomain.com
```

---

**Need Help?** Check the platform documentation:
- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)

---

**Your app is ready to share with the world!** 🎉✨

