# Render Deployment Setup Guide

## Issue: "Must supply api_key" Error on Render

The department image upload fails with "Must supply api_key" error because **Cloudinary environment variables are not set in Render**.

## Solution: Add Environment Variables to Render

### Step 1: Log into Render Dashboard

1. Go to https://dashboard.render.com
2. Log into your account
3. Select your web service (RameTech-Consultancy-website)

### Step 2: Navigate to Environment Variables

1. Click on your service name
2. In the left sidebar, click **"Environment"**
3. You'll see a section called "Environment Variables"

### Step 3: Add Cloudinary Environment Variables

Click **"Add Environment Variable"** and add each of these:

#### Option 1: Using CLOUDINARY_URL (Recommended)

Add this single variable:

```
Key: CLOUDINARY_URL
Value: cloudinary://142962498917514:WmtX55SrLC1VOV7-6Yuq91mc5AI@db6oc5tr5
```

#### Option 2: Using Individual Variables

Or add these three variables separately:

```
Key: CLOUDINARY_CLOUD_NAME
Value: db6oc5tr5
```

```
Key: CLOUDINARY_API_KEY
Value: 142962498917514
```

```
Key: CLOUDINARY_API_SECRET
Value: WmtX55SrLC1VOV7-6Yuq91mc5AI
```

### Step 4: Verify Other Required Environment Variables

Make sure these are also set in Render:

```
DATABASE_URL=postgresql://neondb_owner:npg_OlwPQCodLE93@ep-fragrant-base-amfkdlxt-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

JWT_SECRET=rametech_super_secret_jwt_key_2024_change_this_in_production

NEXT_PUBLIC_SUPABASE_URL=https://xvdjbftfdvofcllqteqf.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_6p1SpYs15DON0tMeDXZM5g_k5k1VpXd
```

### Step 5: Save and Redeploy

1. Click **"Save Changes"**
2. Render will automatically redeploy your service
3. Wait for the deployment to complete (usually 2-5 minutes)

### Step 6: Test the Upload

1. Go to your deployed site's admin panel
2. Navigate to Departments → Add New Department
3. Try uploading an image
4. It should work now!

## Verify Environment Variables Are Loaded

Visit this URL on your deployed site to check if environment variables are loaded:

```
https://your-render-url.com/api/v1/debug-env
```

This will show you the status of your Cloudinary environment variables.

## Troubleshooting

### Still Getting "Must supply api_key" Error?

1. **Check the Render logs:**
   - Go to Render Dashboard → Your Service → Logs
   - Look for lines that say "Cloudinary configuration"
   - Verify it shows api_key as "SET"

2. **Verify environment variables are saved:**
   - Go to Environment tab
   - Make sure CLOUDINARY_URL or the three individual variables are listed
   - Make sure there are no typos

3. **Force a redeploy:**
   - Go to Manual Deploy → Deploy latest commit
   - Wait for deployment to complete

4. **Check Cloudinary credentials:**
   - Log into your Cloudinary dashboard at https://cloudinary.com
   - Go to Dashboard → Settings → Access Keys
   - Verify the credentials match

### Image Upload Still Failing?

Check the browser console for errors:
1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Try uploading an image
4. Look for any error messages
5. Share the error message for further help

## Security Note

⚠️ **IMPORTANT**: Never commit your `.env` file to Git. The `.env` file is in `.gitignore` to prevent exposing your credentials.

The environment variables should ONLY be set in:
- Local development: `.env` file (not committed to Git)
- Production (Render): Render Dashboard → Environment Variables

## Additional Resources

- [Render Environment Variables Documentation](https://render.com/docs/environment-variables)
- [Cloudinary Node.js SDK](https://cloudinary.com/documentation/node_integration)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
