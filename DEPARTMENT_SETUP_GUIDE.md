# Department Structure Setup Guide

## 🏢 Department Structure Overview

Your website now has **4 main departments** with dedicated heads and services:

### 1. **Technology Solutions** (Head: CEO)
Services:
- Software Development
- Mobile Development
- Database Solutions
- Cloud Services
- Cybersecurity
- AI & Automation

### 2. **IT Solutions** (Head: Hardware & IT Specialist)
Services:
- Hardware & IT Support

### 3. **Creative Services** (Head: Creative Director)
Services:
- Graphic Design

### 4. **Data & Research Services** (Head: Lead Researcher)
Services:
- Marketing Research
- Digital Marketing
- Data Science
- Advanced Analytics
- Academic Writing

---

## 🚀 Setup Instructions (After Deployment)

### **Step 1: Run Setup Command in Render Shell**

```bash
npm run render:setup
```

This ONE command will:
- ✅ Create all database tables
- ✅ Create 4 departments
- ✅ Add 4 department heads to team
- ✅ Create 13 department services
- ✅ Seed Academic Writing pricing data

**Expected Output:**
```
Step 1: Creating department heads...
✓ CEO created
✓ Hardware Technician created
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
  ... (13 services total)

✅ All departments can now be edited in admin panel!
```

---

## 📝 Admin Panel Management

### **Edit Department Heads (Team Members)**
1. Go to `/admin/team`
2. You'll see 4 department heads with placeholder info
3. Click **Edit** on any team member to:
   - Update name
   - Add/change photo
   - Edit bio
   - Update contact info
   - Change role title

### **Edit Departments**
1. Go to `/admin/departments`
2. You'll see all 4 departments
3. Click **Edit** to modify:
   - Department name
   - Description
   - Icon
   - Hero image
   - Order (display position)
   - Active status

### **Edit Department Services**
1. Go to `/admin/departments`
2. Click on a department
3. You'll see all services in that department
4. Add/Edit/Delete services within each department
5. Change service descriptions, features, pricing

---

## 🌐 Main Website Display

### **Departments Page** (`/departments`)
- Shows all 4 departments in a grid
- Each department card shows:
  - Department name
  - Description
  - Service count
  - Click to view department details

### **Individual Department Pages** (`/departments/[slug]`)
- Shows department details
- Lists all services in that department
- Shows department head profile (when available)
- Displays related projects

### **Services Page** (`/services`)
- Shows all services from all departments
- Academic Writing card is expandable
- All services clickable

---

## ✅ What's Synced Between Admin and Main Site

| Admin Action | Main Site Result |
|--------------|------------------|
| Edit department name | Updates on /departments |
| Edit department description | Updates on /departments |
| Add/remove services | Services list updates |
| Upload department head photo | Shows in team section |
| Edit service details | Updates on services page |
| Upload Academic Writing doc | Shows download button |
| Deactivate department | Removed from main site |

---

## 🎯 Testing the System

### **1. Run System Check**
- Go to `/admin` dashboard
- Click **"System Check"** button (green, top right)
- Read diagnostic report
- Follow any recommendations

### **2. Verify Departments**
```
Expected Results:
- TeamMember: OK (4 records)
- Department: OK (4 records)
- DepartmentService: OK (13 records)
- AcademicWritingPhase: OK (5 records)
- AcademicWritingServiceItem: OK (13 records)
```

### **3. Check Admin Panels**
- `/admin/team` → Should show 4 department heads
- `/admin/departments` → Should show 4 departments
- `/admin/academic-writing` → Should show 5 phases

### **4. Check Main Website**
- `/departments` → Should show 4 department cards
- `/services` → Should show all services
- `/team` → Should show department heads

---

## 🔧 Troubleshooting

### Issue: "TeamMember: OK (0 records)"
**Fix:** Run `npm run db:seed-structure` in Render Shell

### Issue: "Department: ERROR - table does not exist"
**Fix:** Run `npm run db:push` in Render Shell

### Issue: Changes in admin don't show on main site
**Fix:**
1. Clear browser cache (Ctrl + Shift + R)
2. Check if service/department is marked as Active
3. Click refresh button on Academic Writing page

### Issue: Team members not showing
**Fix:**
1. Run system check to see table status
2. Ensure TeamMember table has records
3. Check browser console for API errors

---

## 📋 Quick Command Reference

```bash
# Full setup (recommended - run this first)
npm run render:setup

# Individual commands (if needed)
npm run db:push              # Create tables
npm run db:seed-structure    # Create departments & heads
npm run db:seed-academic     # Seed Academic Writing data
npm run db:seed              # Seed other general data

# Database management
npm run db:studio            # Open Prisma Studio GUI
```

---

## ✨ Summary

After running `npm run render:setup`, you will have:

✅ 4 departments with descriptions and icons
✅ 4 department heads in team (CEO, IT Specialist, Creative Director, Researcher)
✅ 13 department services properly categorized
✅ Academic Writing pricing data (5 phases, 13 items)
✅ Everything editable in admin panel
✅ Perfect sync between admin and main website
✅ No hardcoded data - 100% database-driven

**Everything is ready to customize through the admin panel!**
