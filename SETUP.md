# MAF.Lab - Setup Guide

## ✅ FIXED: Blank Screen Issue

The blank screen was caused by `src/lib/supabase.ts` throwing an error when environment variables were missing. This prevented the entire React app from loading.

### What was fixed:

1. **supabase.ts** - No longer throws errors, creates mock client instead
2. **auth.ts** - Checks if Supabase is configured before making calls
3. **gamification.ts** - Safely handles missing Supabase configuration
4. **Landing.tsx** - Shows helpful warning banner when not configured

## 🚀 Quick Start

### Option 1: View Landing Page (No Setup Required)

The app now loads immediately! Just run:

```bash
npm install
npm run dev
```

The landing page will display with a warning banner about missing configuration.

### Option 2: Full Setup with Supabase

1. **Copy environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Get Supabase credentials:**
   - Go to https://app.supabase.com
   - Create a new project or select existing
   - Go to Settings → API
   - Copy your Project URL and anon/public key

3. **Update .env file:**
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-actual-anon-key
   ```

4. **Restart dev server:**
   ```bash
   npm run dev
   ```

## 🎯 What Works Now

- ✅ Landing page loads without errors
- ✅ Beautiful Apple-like design preserved
- ✅ All routes accessible
- ✅ Clear error messages when Supabase not configured
- ✅ Graceful fallback for missing configuration
- ✅ Warning banner shows configuration status

## 📝 Next Steps

Once Supabase is configured, you'll have access to:
- User authentication (login/register)
- Student dashboard
- AI writing sessions
- Gamification system
- Advisor monitoring
- All protected routes

## 🔧 Troubleshooting

**Still seeing blank screen?**
- Clear browser cache
- Check browser console for errors
- Ensure all dependencies installed: `npm install`
- Try: `rm -rf node_modules && npm install`

**Warning banner won't go away?**
- Verify .env file exists in root directory
- Check environment variables are set correctly
- Restart development server after changing .env
