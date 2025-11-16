# cPanel Deployment - Quick Reference Guide

## 5-Minute Summary

### What You Need
1. ✅ cPanel account with domain
2. ✅ MySQL database created in cPanel
3. ✅ Node.js/npm installed locally
4. ✅ React app built (`npm run build`)
5. ✅ PHP files ready with updated paths

### 4-Step Process

**Step 1: Update API URL** (2 min)
```javascript
// In src/services/api.js
const BASE_URL = 'https://yourdomain.com/api';  // Change this

// Then run:
npm run build
```

**Step 2: Update Database Config** (1 min)
```php
// In backend/config/Database.php
private $database_name = 'yourusername_evolve';     // From cPanel
private $username = 'yourusername_evolve_user';     // From cPanel
private $password = 'your_generated_password';      // From cPanel
```

**Step 3: Upload Files** (10 min)
```
Via cPanel File Manager or FTP:
- Upload dist/* → public_html/
- Upload backend/api/* → public_html/api/
- Upload .htaccess → public_html/
```

**Step 4: Import Database** (2 min)
```
Via cPanel phpMyAdmin:
- Select your database
- Click Import
- Select your SQL backup file
- Click Go
```

---

## Directory Structure Reference

```
public_html/                    (Your website root)
├── api/                        (PHP backend)
│   ├── config/
│   │   └── Database.php        (WITH YOUR CREDENTIALS)
│   ├── properties/
│   ├── tenant/
│   ├── payments/
│   ├── maintenance/
│   └── config.php
├── assets/                     (React built files)
│   ├── index-[hash].js
│   └── index-[hash].css
├── index.html                  (React entry point)
├── .htaccess                   (Routing config - CRITICAL)
└── favicon.ico
```

---

## Common Commands

### Build React
```bash
cd react_taiwind_postgreess_base_plate
npm run build
```

### Update PHP Paths (Windows)
```powershell
.\update_php_paths.ps1
```

### Update PHP Paths (Mac/Linux)
```bash
bash update_php_paths.sh
```

### Export Database
```bash
mysqldump -u root -p database_name > backup.sql
```

### Test API Endpoint
```bash
# In browser or curl
curl https://yourdomain.com/api/properties/get_properties.php
```

---

## Critical .htaccess Settings

```apache
# MUST HAVE for React Router to work:
RewriteRule ^api/ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# MUST UPDATE for your domain:
Header set Access-Control-Allow-Origin "https://yourdomain.com"
```

---

## Troubleshooting Quick Fixes

| Problem | Fix |
|---------|-----|
| **Blank page** | Check browser console (F12). Fix React errors. |
| **404 on refresh** | `.htaccess` missing or `mod_rewrite` disabled. Check cPanel. |
| **CORS error** | Update domain in `.htaccess` and PHP CORS headers. |
| **API 500 error** | Check cPanel error log. Verify Database.php credentials. |
| **No database data** | Verify database was imported in phpMyAdmin. |
| **CSS/JS not loading** | Check `dist/assets/` folder exists. Verify paths in index.html. |

---

## Critical Points to Remember

1. **Update API_URL** before building React
2. **Update Database.php** credentials from cPanel
3. **Upload .htaccess** to the root (public_html)
4. **Exclude /api folder** in .htaccess rewrite rules
5. **Test after each step** - don't skip to the end
6. **Backup everything** before deploying
7. **Use HTTPS** (cPanel has free SSL)

---

## Files to Review Locally First

Before uploading to cPanel, verify these files locally:

1. ✅ React builds successfully: `npm run build`
2. ✅ Database.php has correct credentials
3. ✅ PHP include paths are updated (run script)
4. ✅ API endpoints respond: Test `/api/properties/get_properties.php`
5. ✅ No console errors in browser

---

## After Deployment

1. ✅ Visit `https://yourdomain.com` - should load React app
2. ✅ Check browser console (F12) - should be clean
3. ✅ Test API endpoints - should return JSON data
4. ✅ Test login/main features - should work normally
5. ✅ Set up monitoring/backups - to prevent issues

---

## Ask For Help If

- You don't know your cPanel database credentials (check cPanel > MySQL Databases)
- `.htaccess` causes 500 error (try disabling mod_rewrite temporarily)
- React app loads but API doesn't work (check cPanel error log)
- Database won't import (check for special characters in SQL file)
- CORS errors appear (update `Access-Control-Allow-Origin` header)

---

## Important Links

- **cPanel File Manager**: https://yourdomain.com:2083 > File Manager
- **phpMyAdmin**: https://yourdomain.com:2083 > phpMyAdmin
- **Error Logs**: https://yourdomain.com:2083 > Error Log
- **Domain Settings**: https://yourdomain.com:2083 > Addon Domains

Replace `yourdomain.com` with your actual domain.

---

## Estimated Time

- Local preparation: **15 minutes**
- cPanel setup: **10 minutes**
- File upload: **10 minutes**
- Database import: **5 minutes**
- Testing & troubleshooting: **20 minutes**

**Total: ~1 hour** (first deployment)

---

Last Updated: November 2025
For latest docs, see: `DEPLOYMENT_CONFIG.md` and `DEPLOYMENT_CHECKLIST.md`
