# Render Deployment Instructions

## After Every Deployment

After your Render service successfully deploys, you need to run database setup commands **ONCE** in the Render Shell.

### Step 1: Open Render Shell

1. Go to https://dashboard.render.com
2. Click on your web service
3. Click **"Shell"** tab in the left sidebar
4. Wait for shell to initialize

### Step 2: Run Setup Command

In the Render Shell, run this **ONE command**:

```bash
npm run render:setup
```

This command will:
- ✅ Create all missing database tables (including `AcademicWritingDocument`)
- ✅ Seed the Academic Writing service data (5 phases, 13 items)
- ✅ Set up everything you need

**Expected output:**
```
Prisma schema loaded from prisma/schema.prisma
🚀 Your database is now in sync with your Prisma schema
Seeding Academic Writing services...
✅ Academic Writing services seeded successfully!
Created 5 phases with service items
```

### Step 3: Verify

1. Go to your deployed site `/admin`
2. Navigate to **Academic Writing**
3. You should see:
   - ✅ No errors
   - ✅ Phases and service items loaded
   - ✅ Document upload section ready

---

## Manual Commands (Alternative)

If `npm run render:setup` doesn't work, run these commands separately:

```bash
# 1. Create database tables
npm run db:push

# 2. Seed Academic Writing data
npm run db:seed-academic

# 3. Seed other data (optional)
npm run db:seed
npm run db:seed-departments
```

---

## Troubleshooting

### Error: "Failed to fetch phases"
- **Cause:** Database tables don't exist
- **Fix:** Run `npm run render:setup` in Render Shell

### Error: "Database error: table does not exist"
- **Cause:** Database schema not synced
- **Fix:** Run `npm run db:push` in Render Shell

### Error: "Can't reach database server"
- **Cause:** Trying to access database during build (not available)
- **Fix:** This is normal during build. Run setup commands AFTER deployment in Shell

---

## Important Notes

⚠️ **DO NOT run database commands during the build phase**
- Database is only accessible AFTER deployment
- Always run setup commands in the Shell tab
- The build script only generates Prisma client and builds Next.js

✅ **Run setup commands once per deployment**
- Only needed when schema changes
- Safe to run multiple times (idempotent)
