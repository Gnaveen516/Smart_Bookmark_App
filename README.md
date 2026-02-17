# 🔖 Smart Bookmark Manager

A modern, production-ready bookmark management application with real-time synchronization across multiple tabs. Built with Next.js 14, Supabase, and Tailwind CSS.

## ✨ Features

- 🔐 **Google OAuth Authentication** - Secure login with Google accounts only
- 📚 **Personal Bookmarks** - Each user has their own private bookmark collection
- ⚡ **Real-time Sync** - Instant updates across all open tabs without refresh
- 🎨 **Modern UI** - Clean, professional SaaS-style interface
- ✅ **URL Validation** - Ensures only valid URLs are saved
- 🗑️ **Easy Management** - Delete bookmarks with a single click
- 📱 **Responsive Design** - Works seamlessly on all devices
- 🚀 **Production Ready** - Optimized for deployment on Vercel

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Authentication**: Supabase Auth (Google OAuth)
- **Database**: Supabase PostgreSQL
- **Real-time**: Supabase Realtime Subscriptions
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Notifications**: React Hot Toast

## 📁 Project Structure

```
smart-bookmark-app/
├── app/
│   ├── auth/
│   │   └── callback/          # OAuth callback handler
│   ├── dashboard/             # Main dashboard page
│   ├── login/                 # Login page
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Root redirect
│   └── globals.css            # Global styles
├── components/
│   ├── bookmark/
│   │   ├── AddBookmarkForm.tsx    # Form to add bookmarks
│   │   ├── BookmarkCard.tsx       # Individual bookmark card
│   │   └── BookmarkList.tsx       # List with realtime sync
│   └── ui/
│       ├── Button.tsx             # Reusable button component
│       ├── Card.tsx               # Card wrapper component
│       ├── Input.tsx              # Form input component
│       └── Navbar.tsx             # Navigation bar
├── lib/
│   └── supabase/
│       ├── client.ts              # Browser Supabase client
│       └── server.ts              # Server Supabase client
├── types/
│   └── index.ts                   # TypeScript type definitions
├── middleware.ts                  # Auth middleware
└── supabase-setup.sql             # Database schema
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account ([supabase.com](https://supabase.com))
- Google Cloud Console project for OAuth

### 1. Clone and Install

```bash
# Navigate to project directory
cd "Abstrabit Assignment"

# Install dependencies
npm install
```

### 2. Supabase Setup

#### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be provisioned

#### Set up Database

1. Go to the SQL Editor in your Supabase dashboard
2. Copy the contents of `supabase-setup.sql` and execute it
3. This will create the `bookmarks` table with proper RLS policies

#### Configure Google OAuth

1. Go to **Authentication** → **Providers** in Supabase
2. Enable **Google** provider
3. Follow Supabase's instructions to set up Google OAuth:
   - Create a project in [Google Cloud Console](https://console.cloud.google.com)
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI from Supabase
   - Copy Client ID and Client Secret to Supabase

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these values from:
- Supabase Dashboard → Project Settings → API

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📊 Database Schema

### Bookmarks Table

```sql
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Row Level Security (RLS)

- Users can only read their own bookmarks
- Users can only insert bookmarks for themselves
- Users can only delete their own bookmarks

## 🏗️ Architecture Decisions

### Why App Router?

- Server Components by default for better performance
- Built-in loading and error states
- Simplified data fetching
- Better SEO capabilities

### Why Supabase?

- **Authentication**: Built-in OAuth providers
- **Database**: PostgreSQL with real-time capabilities
- **RLS**: Row-level security for data privacy
- **Real-time**: WebSocket subscriptions out of the box
- **Free tier**: Generous limits for development

### Component Architecture

- **Server Components**: Used for initial data fetching (Dashboard page)
- **Client Components**: Used for interactive features (forms, lists)
- **Separation of Concerns**: UI components separated from business logic
- **Reusability**: Generic UI components (Button, Input, Card)

### Real-time Implementation

- Supabase Realtime subscriptions listen to database changes
- Optimistic UI updates for better UX
- Automatic cleanup of subscriptions on unmount

## 🎨 UI/UX Features

- **Modern Design**: Inspired by Linear.app's minimal aesthetic
- **Smooth Animations**: Fade-in and slide-up effects
- **Hover States**: Interactive feedback on all clickable elements
- **Loading States**: Spinners and disabled states during operations
- **Toast Notifications**: Success and error messages
- **Empty States**: Helpful messages when no bookmarks exist
- **Responsive Grid**: Adapts to different screen sizes

## 🔒 Security Features

- **Row Level Security**: Database-level access control
- **Server-side Auth**: Middleware protects routes
- **HTTPS Only**: OAuth requires secure connections
- **No Hardcoded Secrets**: Environment variables for sensitive data
- **XSS Protection**: React's built-in escaping

## 🚢 Deployment on Vercel

### Quick Deploy

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy!

### Update OAuth Redirect

After deployment, update your Google OAuth settings:
- Add your Vercel domain to authorized redirect URIs
- Update Supabase redirect URL if needed

## 🧪 Testing Real-time Sync

1. Open the app in two different browser tabs
2. Add a bookmark in one tab
3. Watch it appear instantly in the other tab
4. Delete a bookmark in one tab
5. See it disappear in the other tab immediately

## 🐛 Troubleshooting

### OAuth Not Working

- Verify Google OAuth credentials in Supabase
- Check redirect URIs match exactly
- Ensure Google+ API is enabled

### Bookmarks Not Appearing

- Check RLS policies are enabled
- Verify user is authenticated
- Check browser console for errors

### Real-time Not Working

- Ensure Realtime is enabled in Supabase project settings
- Check network tab for WebSocket connection
- Verify table name matches in subscription

## 📝 Challenges & Solutions

### Challenge 1: Real-time Across Tabs
**Problem**: Keeping bookmarks synchronized across multiple browser tabs.
**Solution**: Implemented Supabase Realtime subscriptions that listen to database changes and update the UI automatically.

### Challenge 2: Secure Data Access
**Problem**: Ensuring users can only access their own bookmarks.
**Solution**: Implemented Row Level Security (RLS) policies at the database level, providing security even if client-side checks fail.

### Challenge 3: OAuth Flow
**Problem**: Handling OAuth callback and session management.
**Solution**: Used Supabase SSR package with proper middleware to handle cookie-based sessions across server and client components.

### Challenge 4: Optimistic UI
**Problem**: Providing instant feedback while waiting for database operations.
**Solution**: Implemented loading states and toast notifications to give users immediate feedback.

## 🎯 Future Enhancements

- [ ] Search and filter bookmarks
- [ ] Tags and categories
- [ ] Bookmark folders
- [ ] Import/export functionality
- [ ] Browser extension
- [ ] Bookmark sharing
- [ ] Dark mode

## 📄 License

MIT License - feel free to use this project for learning or production.

## 👨‍💻 Author

Built as a production-ready assignment project demonstrating modern full-stack development practices.

---

**Note**: This project follows industry best practices for code organization, security, and user experience. It's designed to showcase professional development skills for technical interviews.
