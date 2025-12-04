# Database Migration Instructions

## Run this on Render to update the database schema

### Option 1: Via Render Shell

1. Go to your Render dashboard
2. Select your backend service
3. Click "Shell" tab
4. Run: `node server/migrate.js`

### Option 2: Add to package.json and run

Already added! Just run on Render shell:
```bash
npm run migrate
```

### What the migration does:

Adds these new columns to the `packages` table:
- sender_phone
- sender_id  
- sender_email
- sender_country
- receiver_phone
- receiver_email
- receiver_country
- product_name
- shipping_cost
- clearance_cost
- collection_date
- collection_time
- delivery_date
- arrival_date

### After migration:

The system will work with both old and new package records. Old records will have empty values for new fields.

## Summary of All Changes

✅ **Database Schema**: Added 14 new fields to packages table
✅ **Package Form**: Comprehensive form with all customer details
✅ **Receipt**: Larger text, shows all new fields, costs, dates
✅ **Email System**: Package registration email (not welcome email)
✅ **No Signup**: Removed user signup - tracking only for customers
✅ **Admin Only**: Only admin can login, customers just track
✅ **Country Dropdowns**: Full list of countries for sender/receiver

## New Workflow:

1. Admin registers package with customer email
2. Customer receives "Package Registered" email
3. Customer tracks package (no login needed)
4. Admin manages everything from dashboard
