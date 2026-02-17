# 🚀 Deployment Guide - Vercel

## Prerequisites

- GitHub account
- Vercel account (sign up at [vercel.com](https://vercel.com))
- Supabase project set up with Google OAuth configured

## Step-by-Step Deployment

### 1. Push to GitHub

```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Smart Bookmark App"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/smart-bookmark-app.git
git branch -M main
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: ./
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

### 3. Add Environment Variables

In the Vercel project settings, add:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Deploy

Click **"Deploy"** and wait for the build to complete.

### 5. Update OAuth Settings

After deployment, you'll get a URL like: `https://your-app.vercel.app`

#### Update Google OAuth:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to your OAuth 2.0 Client
3. Add to **Authorized redirect URIs**:
   ```
   https://your-supabase-project.supabase.co/auth/v1/callback
   ```

#### Update Supabase (if needed):

1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add your Vercel URL to **Site URL**:
   ```
   https://your-app.vercel.app
   ```
3. Add to **Redirect URLs**:
   ```
   https://your-app.vercel.app/auth/callback
   ```

### 6. Test Your Deployment

1. Visit your Vercel URL
2. Click "Continue with Google"
3. Authorize the app
4. Add a bookmark
5. Open in another tab to test real-time sync

## Automatic Deployments

Vercel automatically deploys:
- **Production**: Every push to `main` branch
- **Preview**: Every pull request

## Custom Domain (Optional)

1. Go to Vercel project settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update OAuth redirect URIs with new domain

## Troubleshooting

### Build Fails

- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify environment variables are set

### OAuth Redirect Error

- Verify redirect URIs match exactly (including https://)
- Check Supabase URL configuration
- Ensure Google OAuth is enabled in Supabase

### Environment Variables Not Working

- Redeploy after adding environment variables
- Ensure variable names start with `NEXT_PUBLIC_` for client-side access

## Performance Optimization

Vercel automatically provides:
- ✅ Edge caching
- ✅ Image optimization
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Serverless functions

## Monitoring

- View analytics in Vercel dashboard
- Check function logs for errors
- Monitor build times and deployment status

---

Your app is now live and production-ready! 🎉
