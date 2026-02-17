# OAuth Consent Screen - App Name Not Showing Issue

## Issue Description

When users tried to login with Google OAuth, the consent screen was not displaying the application name properly. Instead of showing "Smart Bookmark Manager", it was showing a generic or blank app name.

## Root Cause

The issue occurred because the OAuth consent screen configuration in Google Cloud Console was not properly set up with the application name.

## Solution

### Step 1: Access Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project

### Step 2: Configure OAuth Consent Screen
1. Navigate to **APIs & Services** → **OAuth consent screen**
2. Click **Edit App**
3. Fill in the required fields:
   - **App name**: `Smart Bookmark Manager` (or your preferred app name)
   - **User support email**: Your email address
   - **App logo** (optional): Upload your app logo
   - **Application home page** (optional): Your app URL
   - **Application privacy policy link** (optional): Privacy policy URL
   - **Application terms of service link** (optional): Terms of service URL
   - **Authorized domains**: Add your domain (e.g., `vercel.app` for Vercel deployments)
   - **Developer contact information**: Your email address

### Step 3: Save Changes
1. Click **Save and Continue**
2. Complete the remaining steps (Scopes, Test users if needed)
3. Click **Back to Dashboard**

### Step 4: Verify the Fix
1. Clear browser cache and cookies
2. Try logging in again with Google OAuth
3. The consent screen should now display your app name correctly

## Important Notes

- Changes to the OAuth consent screen may take a few minutes to propagate
- If you're in testing mode, only test users can see the consent screen
- For production apps, you need to submit for verification to remove the "unverified app" warning

## Prevention

Always configure the OAuth consent screen BEFORE creating OAuth credentials to avoid this issue.

## Related Configuration

Make sure your Supabase Google OAuth settings also have:
- Correct Client ID
- Correct Client Secret
- Proper redirect URIs configured

## Verification Checklist

- [x] App name is set in OAuth consent screen
- [x] User support email is configured
- [x] Developer contact email is configured
- [x] OAuth credentials are created with correct redirect URIs
- [x] Supabase has correct Client ID and Secret
- [x] Consent screen shows app name when logging in

---

**Issue Status**: ✅ Resolved

**Resolution Date**: [Current Date]

**Tested By**: [Your Name]
