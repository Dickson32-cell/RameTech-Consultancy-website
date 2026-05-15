# Admin Panel Guide - Understanding Your Data Flow

## 🔍 Where Does Your Content Appear?

### Departments vs Services - Understanding the Difference

Your website has **two different sections** for organizing content:

#### 1. **Departments**
- **Where you manage them:** Admin Panel → Departments
- **Where they appear on the site:**
  - `/departments` page (dedicated departments listing)
  - **NOT on the homepage**
- **What they are:** Larger organizational units that can contain services, projects, and sub-departments

#### 2. **Services**
- **Where you manage them:** Admin Panel → Services
- **Where they appear on the site:**
  - Homepage "Our Services" section (first 6 services)
  - `/services` page (all services)
- **What they are:** Individual offerings or solutions you provide

### ⚠️ Important: The Homepage Shows Services, NOT Departments!

If you create a department and don't see it on the homepage, **this is normal behavior**. The homepage displays services, not departments.

To see your departments:
- Go to: `your-site-url.com/departments`

---

## 📊 How Data Flows from Admin to Public Pages

### When You Create/Edit a Department:

1. ✅ **You upload images** → Saved to Cloudinary
2. ✅ **You fill in the form** → Data sent to `/api/v1/admin/departments`
3. ✅ **Data is saved** → Stored in PostgreSQL database (Neon)
4. ✅ **Cache is cleared** → Next.js revalidates the pages
5. ✅ **Public page updates** → Visit `/departments` to see it

### When You Create/Edit a Service:

1. ✅ **You fill in the form** → Data sent to `/api/v1/admin/services`
2. ✅ **Data is saved** → Stored in PostgreSQL database
3. ✅ **Homepage updates** → First 6 services appear on homepage
4. ✅ **Services page updates** → All services appear on `/services`

---

## 🐛 Troubleshooting: "I created content but don't see it!"

### Check 1: Are you looking in the right place?

| Content Type | Where to Check |
|--------------|----------------|
| Department | `/departments` page |
| Service | Homepage or `/services` page |
| Blog Post | `/blog` page |
| Portfolio | `/portfolio` page |
| Team Member | `/team` page |

### Check 2: Is the content marked as "Active"?

When creating/editing content, make sure the **"Active"** checkbox is checked. Inactive content won't show on public pages.

### Check 3: Did the image upload succeed?

**Signs of failed upload:**
- You see an error message when uploading
- The image preview doesn't show
- Error says "Must supply api_key"

**Solution:**
1. Make sure Cloudinary environment variables are set in Render dashboard
2. Check Render logs for any Cloudinary errors
3. Try uploading a smaller image (under 2MB for icons, under 5MB for hero images)

### Check 4: Clear your browser cache

Sometimes your browser shows an old version of the page.

**How to force refresh:**
- Windows/Linux: `Ctrl + Shift + R` or `Ctrl + F5`
- Mac: `Cmd + Shift + R`

### Check 5: Check Render deployment logs

On Render:
1. Go to your service dashboard
2. Click "Logs" tab
3. Look for error messages after saving content
4. Look for: ✅ "Department created successfully" or "Cache revalidated"

---

## 📝 Step-by-Step: Creating a Department

### 1. Upload Images First (Recommended)

1. Go to Admin → Departments → Create New
2. **Upload Department Icon:**
   - Click "Choose File" under "Department Icon"
   - Select an image (PNG, JPEG, GIF, WebP, or SVG)
   - Must be under 2MB
   - Wait for "Upload successful" message

3. **Upload Department Hero Image:**
   - Click "Choose File" under "Department Hero Image"
   - Select an image (PNG, JPEG, GIF, or WebP)
   - Must be under 5MB
   - Wait for "Upload successful" message

### 2. Fill in Department Details

- **Name:** Display name (e.g., "Software Development")
- **Slug:** Auto-generated URL-friendly name (e.g., "software-development")
- **Description:** Brief description of the department
- **Order:** Number to control display order (lower numbers appear first)
- **Active:** Check this box to make it visible on the public site

### 3. Save

- Click "Create Department"
- Wait for success message
- You'll be redirected to the departments list

### 4. Verify It Appears

- Open a new browser tab
- Go to: `your-site-url.com/departments`
- You should see your new department!

---

## 🔐 Authentication Issues

If you get logged out frequently:
- Check your JWT_SECRET is set in Render environment variables
- Make sure your admin password is correct
- Try logging in again from `/admin/login`

---

## 📊 Database Connection Issues

**Error:** "Database tables not created yet"

**Solution:**
1. Go to Render dashboard
2. Click on your service
3. Click "Shell" tab (or use SSH)
4. Run: `npm run render:setup`
5. Wait for tables to be created
6. Refresh your admin panel

---

## 🚀 Cache and Real-Time Updates

### Why don't changes appear immediately?

Next.js uses caching to make your site fast. When you create/update/delete content, the system now:

1. Saves to database ✅
2. Automatically clears the cache ✅ (NEW!)
3. Tells Next.js to regenerate the page ✅ (NEW!)

**If changes still don't appear:**
1. Wait 30 seconds for Render to process the change
2. Force refresh your browser (`Ctrl+Shift+R`)
3. Check if the content is marked as "Active"

---

## 📞 Getting Help

If you're still having issues:

1. **Check Render Logs:**
   - Render Dashboard → Your Service → Logs
   - Look for error messages

2. **Check Browser Console:**
   - Press F12 in your browser
   - Click "Console" tab
   - Look for red error messages

3. **Test the API directly:**
   - Visit: `your-site-url.com/api/v1/departments`
   - You should see JSON with your departments

4. **Check environment variables:**
   - Visit: `your-site-url.com/api/v1/debug-env`
   - Verify Cloudinary credentials are SET

---

## ✅ Quick Reference: Common Admin Tasks

| Task | Steps |
|------|-------|
| Create Department | Admin → Departments → Create New → Fill form → Save |
| Edit Department | Admin → Departments → Click Edit → Update → Save |
| Delete Department | Admin → Departments → Click Delete → Confirm |
| Upload Images | Use file upload buttons BEFORE saving the form |
| Make Content Visible | Check "Active" checkbox when creating/editing |
| View Public Page | Go to `/departments` (NOT homepage) |

---

## 🎯 Best Practices

1. **Upload images first** before filling out the form
2. **Use descriptive names** for departments
3. **Keep descriptions concise** (2-3 sentences)
4. **Set appropriate order numbers** (e.g., 10, 20, 30 to allow inserting between them later)
5. **Mark as Active** only when ready to publish
6. **Test on the actual page** (`/departments`) not just the admin panel

---

Made with ❤️ for RameTech Consultancy
