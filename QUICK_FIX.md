# 🔧 QUICK FIX - Departments Not Showing

## Problem
API returns `{success: true, data: []}` - meaning database is working but has no departments.

## Solution

Run these commands **ONE AT A TIME** in Render Shell and watch for errors:

### **Command 1: Create Departments**
```bash
npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seeds/create-departments-structure.ts
```

**Watch for:**
- ✅ "Step 1: Creating department heads..."
- ✅ "Step 2: Creating departments..."
- ✅ "✅ 4 Departments created"

**If you see an error**, copy the FULL error message and share it.

### **Command 2: Verify Departments Were Created**

After running the command, check if it worked:

```bash
npx prisma studio
```

This opens a database GUI. Look for:
- **Department** table → Should have 4 entries
- **TeamMember** table → Should have 4 entries
- **DepartmentService** table → Should have 17 entries

### **Command 3: Test the API**

Or check from command line:

```bash
curl https://your-site.onrender.com/api/v1/departments | grep -o '"success":[^,]*' | head -1
```

Should show: `"success":true`

And count departments:

```bash
curl https://your-site.onrender.com/api/v1/departments 2>/dev/null | grep -o '"id":"[^"]*"' | wc -l
```

Should show: `4` (or number of departments)

---

## If Command 1 Gives an Error

### **Common Errors:**

**Error: "Table Department does not exist"**
```bash
# Run this first:
npm run db:push
# Then try Command 1 again
```

**Error: "Cannot find module"**
```bash
# Install dependencies:
npm install
# Then try Command 1 again
```

**Error: "Unique constraint failed"**
```bash
# Departments already exist! Just refresh your browser
# Or clear them and recreate:
npx prisma studio
# Delete all Department entries, then run Command 1
```

---

## After Running Commands

1. Refresh `/departments` page in browser
2. Should now show 4 department cards!
3. Go to `/admin/departments` → Should show 4 departments

---

## Still Not Working?

Run System Check:
1. Go to `/admin` dashboard
2. Click "System Check" button
3. Share the diagnostic output with me
