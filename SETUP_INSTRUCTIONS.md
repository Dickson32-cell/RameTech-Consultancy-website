# 🚀 RAME Tech Website - Complete Setup Instructions

## ⚠️ IMPORTANT: Run This After Every Deployment

Your website needs ONE command to set up all departments, services, and data.

---

## 📋 **ONE-TIME SETUP (After Render Deployment)**

### **Step 1: Wait for Deployment to Complete**
- Check your Render dashboard
- Wait for build to finish (status: "Live")
- Build logs should show: "Build succeeded"

### **Step 2: Open Render Shell**
1. Go to https://dashboard.render.com
2. Click your web service (RameTech-Consultancy-website)
3. Click **"Shell"** tab on the left sidebar
4. Wait for shell prompt to appear (~ symbol)

### **Step 3: Run Setup Command**

Copy and paste this command:

```bash
npm run render:setup
```

**Press Enter** and wait 60-90 seconds.

---

## ✅ **What This Command Does:**

The `render:setup` command runs 3 sub-commands that:

### 1. **Creates All Database Tables** (`prisma db push`)
- TeamMember
- Service
- Department
- SubDepartment
- DepartmentService
- DepartmentProject
- Publication
- AcademicWritingPhase
- AcademicWritingServiceItem
- AcademicWritingDocument
- ... and all other tables

### 2. **Seeds Academic Writing Data** (`db:seed-academic`)
- Creates 5 phases
- Creates 13 service items with pricing
- Sets up phase structure

### 3. **Creates Department Structure** (`db:seed-structure`)
- Creates 4 departments
- Creates 1 sub-department (Paper Craft)
- Adds 4 department heads to team
- Creates 17 department services
- Creates 4 sample projects

---

## 📊 **Expected Output:**

You should see something like this:

```
✔ Database is now in sync with your Prisma schema

Seeding Academic Writing services...
✅ Academic Writing services seeded successfully!
Created 5 phases with service items

Creating departments structure with heads...
Step 1: Creating department heads...
✓ CEO created
✓ Hardware & IT Specialist created
✓ Creative Director created
✓ Lead Researcher created

Step 2: Creating departments...
✓ Technology Solutions department created
✓ IT Solutions department created
✓ Creative Services department created
✓ Data & Research Services department created

Step 3: Creating department services...
  ✓ Software Development
  ✓ Mobile Development
  ✓ Database Solutions
  ✓ Cloud Services
  ✓ Cybersecurity
  ✓ AI & Automation
  ✓ Hardware & IT Support
  ✓ Graphic Design
    ✓ Custom Paper Bags
    ✓ Gift Bags
    ✓ Shopping Bags
    ✓ Promotional Bags
  ✓ Marketing Research
  ✓ Digital Marketing
  ✓ Data Science
  ✓ Advanced Analytics
  ✓ Academic Writing

Step 4: Creating sample department projects...
  ✓ Technology Solutions sample project
  ✓ IT Solutions sample project
  ✓ Paper Craft sample project
  ✓ Data & Research sample project

=== SUMMARY ===
✅ 4 Departments created
✅ 1 Sub-Department created (Paper Craft)
✅ 4 Department Heads added to team
✅ 17 Department Services created
✅ 4 Sample Projects created
```

---

## 🎯 **Verify Everything Works:**

### **1. Run System Check**
- Go to `/admin` dashboard
- Click **"System Check"** button (green, top right)
- Should show: "ALL SYSTEMS OPERATIONAL ✅"

### **2. Check Admin Panels**
- `/admin/team` → Should show 4 department heads
- `/admin/departments` → Should show 4 departments
- `/admin/academic-writing` → Should show 5 phases
- `/admin/services` → Can add/edit services

### **3. Check Main Website**
- `/departments` → Should show 4 department cards
- `/services` → Should show all 10 services
- `/portfolio` → Shows all projects
- `/team` → Shows department heads

---

## 🎨 **Customize Your Departments:**

After setup, you can edit everything in the admin panel:

### **Update Department Heads:**
1. Go to `/admin/team`
2. Click **Edit** on any department head
3. Upload photos (replace placeholder images)
4. Update names and bios
5. Change contact information

### **Edit Departments:**
1. Go to `/admin/departments`
2. Click **Edit** button on any department
3. Change names, descriptions
4. Upload department hero images
5. Add/edit services within each department

### **Add Projects:**
1. Go to `/admin/departments`
2. Click on a department
3. Add projects with images/videos
4. Projects appear in /portfolio automatically

### **Upload Academic Writing Price List:**
1. Go to `/admin/academic-writing`
2. Upload your Word document
3. Document appears on main website

---

## 🔧 **If Something Goes Wrong:**

### **Departments Not Showing:**
```bash
# Run in Render Shell:
npm run render:setup
```

### **Tables Don't Exist:**
```bash
# Run in Render Shell:
npm run db:push
```

### **No Data After db:push:**
```bash
# Run in Render Shell:
npm run db:seed-structure
npm run db:seed-academic
```

### **Reset Everything (CAUTION - Deletes Data):**
```bash
# Only if you want to start fresh:
npm run db:push -- --force-reset
npm run render:setup
```

---

## 📱 **Quick Reference:**

| Command | Purpose |
|---------|---------|
| `npm run render:setup` | **RUN THIS FIRST** - Complete setup |
| `npm run db:push` | Create database tables only |
| `npm run db:seed-structure` | Create departments & heads |
| `npm run db:seed-academic` | Create Academic Writing data |
| System Check button | Check if everything is set up correctly |

---

## ✨ **After Setup, You Have:**

✅ **4 Departments:**
1. Technology Solutions (6 services)
2. IT Solutions (1 service)
3. Creative Services (1 service + 4 Paper Craft services)
4. Data & Research Services (5 services)

✅ **4 Department Heads** (editable in /admin/team)

✅ **17 Department Services** (editable in /admin/departments)

✅ **4 Sample Projects** (editable, can add more)

✅ **Academic Writing System** (5 phases, 13 items with pricing)

✅ **Perfect Admin/Main Site Sync**

---

## 🎉 **You're All Set!**

After running `npm run render:setup`, everything is configured and ready to use. The admin panel and main website are perfectly synced!
