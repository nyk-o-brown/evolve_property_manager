# Evolve Property Manager - cPanel Deployment Checklist

## Pre-Deployment Phase

### Local Preparation
- [ ] Update `src/services/api.js` with production API URL
  - From: `http://localhost/...`
  - To: `https://yourdomain.com/api`
- [ ] Run `npm run build` to create optimized React build
- [ ] Verify `dist/` folder is created with index.html and assets
- [ ] Test locally that all features work before deploying

### PHP Preparation
- [ ] Run path update script (Windows: `update_php_paths.ps1` or bash: `update_php_paths.sh`)
  - Reviews all PHP include paths
  - Converts from 3-level deep (`../../`) to 2-level deep (`../`)
- [ ] Manually verify critical files:
  - [ ] `api/properties/get_properties.php`
  - [ ] `api/tenant/tenant_login.php`
  - [ ] `api/payments/get_payments.php`
  - [ ] `api/maintenance/get_requests.php`
- [ ] Search for any remaining hardcoded paths (optional step)

### Database Preparation
- [ ] Export local database as SQL file
  ```bash
  # MySQL command
  mysqldump -u root -p database_name > backup.sql
  ```
- [ ] Keep backup file safe
- [ ] Verify all tables are included in export
- [ ] Check for any environment-specific data to remove

---

## cPanel Setup Phase

### Create cPanel Database
- [ ] Log into cPanel account
- [ ] Navigate to "MySQL Databases"
- [ ] Create new database
  - Name: `yourusername_evolve` (or similar)
  - Note the full database name
- [ ] Create new database user
  - Username: `yourusername_evolve_user` (or similar)
  - Generate strong password
  - **Save credentials somewhere safe**
- [ ] Assign user to database with all privileges:
  - SELECT
  - INSERT
  - UPDATE
  - DELETE
  - CREATE
  - ALTER
  - DROP

### cPanel Domain Configuration
- [ ] Verify domain is added to cPanel
- [ ] Confirm `public_html` is the document root
- [ ] Enable AutoSSL for HTTPS (should be automatic)
- [ ] Wait for SSL certificate to be issued (usually 15-30 minutes)

---

## File Upload Phase

### Update Database Configuration
- [ ] Copy `backend/config/Database.php.template` to `backend/config/Database.php`
- [ ] Update Database.php with cPanel credentials:
  - `$host = 'localhost'`
  - `$database_name = '[your cPanel db name]'`
  - `$username = '[your cPanel db user]'`
  - `$password = '[your cPanel db password]'`

### Prepare Files for Upload
- [ ] Copy entire `dist/` folder contents to staging area
- [ ] Copy entire `backend/api/` folder to staging area
- [ ] Create `.htaccess` file from template:
  - Update `Access-Control-Allow-Origin` header to your domain
  - Ensure `RewriteBase /` is correct
- [ ] Verify folder structure before upload:
  ```
  upload/
  ├── api/
  │   ├── config/
  │   ├── properties/
  │   ├── tenant/
  │   ├── payments/
  │   ├── maintenance/
  │   └── config.php
  ├── assets/
  ├── index.html
  └── .htaccess
  ```

### Upload to cPanel Using File Manager
- [ ] Log into cPanel
- [ ] Open File Manager
- [ ] Navigate to `public_html`
- [ ] **Backup existing files** (if any):
  - [ ] Download existing files
  - [ ] Or rename existing index.html to index.html.old
- [ ] Upload React build files:
  - [ ] Upload entire `assets/` folder
  - [ ] Upload `index.html`
  - [ ] Upload other static files (favicon.ico, vite.svg, etc.)
- [ ] Create `api/` folder
- [ ] Upload PHP files:
  - [ ] Upload `config/` folder with Database.php
  - [ ] Upload `properties/` folder with all endpoints
  - [ ] Upload `tenant/` folder with all endpoints
  - [ ] Upload `payments/` folder
  - [ ] Upload `maintenance/` folder
  - [ ] Upload `config.php`
- [ ] Upload `.htaccess` file to `public_html/`

### Upload to cPanel Using FTP/SFTP (Alternative)
- [ ] Connect FTP client (FileZilla, WinSCP, etc.)
- [ ] Connect using cPanel FTP credentials
- [ ] Navigate to `public_html`
- [ ] Drag and drop folders:
  - [ ] `dist/*` → `public_html/`
  - [ ] `backend/api/*` → `public_html/api/`
  - [ ] `.htaccess` → `public_html/`

### Database Import
- [ ] Log into cPanel
- [ ] Navigate to phpMyAdmin
- [ ] Select your newly created database
- [ ] Click "Import" tab
- [ ] Choose your SQL backup file
- [ ] Click "Go"
- [ ] Wait for import to complete
- [ ] Verify tables are imported:
  - [ ] `properties`
  - [ ] `properties_units`
  - [ ] `tenants`
  - [ ] `payments`
  - [ ] `maintenance_requests`
  - [ ] `users`

---

## Testing Phase

### Initial Access Test
- [ ] Visit `https://yourdomain.com` in browser
- [ ] Should load React app without errors
- [ ] Check browser console (F12) for any errors
- [ ] Browser console should be clean or show minor warnings only

### API Connectivity Test
- [ ] Open browser console
- [ ] Look for network requests to `/api/`
- [ ] Test individual endpoints:
  - [ ] GET `https://yourdomain.com/api/properties/get_properties.php`
  - [ ] Verify JSON response (not HTML error page)
  - [ ] Check status code is 200

### Feature Testing
- [ ] Test login/authentication
- [ ] View properties list
- [ ] View property units
- [ ] Create new property (if available)
- [ ] Create new tenant
- [ ] View tenant dashboard
- [ ] Test payment functionality
- [ ] Test maintenance request creation

### Error Diagnosis
If endpoints return 500 errors:
- [ ] Check cPanel error logs:
  - [ ] Go to cPanel > Error Log
  - [ ] Look for PHP errors in the last 50 lines
  - [ ] Note any file path or connection errors

If database connection fails:
- [ ] Verify Database.php credentials are correct
- [ ] Test database connection:
  ```bash
  # Via phpMyAdmin or terminal
  mysql -h localhost -u yourusername_user -p yourusername_evolve
  ```
- [ ] Check that database user has all privileges

---

## Post-Deployment Phase

### Cleanup
- [ ] Delete `.backup` files created by migration script
- [ ] Delete `.old` files from previous version (if any)
- [ ] Remove test files or debug scripts
- [ ] Review file permissions (should be 644 for files, 755 for directories)

### Security Hardening
- [ ] Enable HTTPS redirect in `.htaccess`:
  ```apache
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
  ```
- [ ] Update CORS headers to only allow your domain
- [ ] Add security headers to `.htaccess`
- [ ] Consider moving sensitive config outside `public_html`
- [ ] Set `Options -Indexes` in `.htaccess` (disable directory listing)
- [ ] Review and harden database user privileges (remove unnecessary ones)

### Monitoring & Backups
- [ ] Set up cPanel automatic backups
- [ ] Monitor error logs regularly
- [ ] Test login and critical functions daily for first week
- [ ] Plan for regular database backups
- [ ] Document any customizations made for deployment

### DNS & Domain
- [ ] Verify domain points to cPanel server (check A records)
- [ ] Test SSL certificate is valid:
  - [ ] Visit site in browser
  - [ ] Check for padlock icon
  - [ ] Verify certificate details (should show your domain)
- [ ] Test from different networks if possible

---

## Rollback Plan (In Case of Issues)

- [ ] Keep backup of `public_html/` before deployment
- [ ] Keep backup of original database
- [ ] If critical errors occur:
  1. Rename current `public_html` to `public_html-broken`
  2. Rename `public_html-backup` to `public_html` (if you made one)
  3. Restore database from backup via phpMyAdmin
  4. Investigate and fix issues locally
  5. Re-deploy when ready

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| 404 on all React routes | Check `.htaccess` is in `public_html/` and `mod_rewrite` is enabled |
| CORS errors in console | Update `Access-Control-Allow-Origin` header in `.htaccess` and PHP files |
| API returns 500 errors | Check cPanel error log and Database.php credentials |
| Database connection fails | Verify database name, user, password match cPanel setup |
| Assets not loading (CSS/JS) | Check `dist/assets/` folder exists and is uploaded |
| Blank page/white screen | Check browser console for errors; may be a React error |
| Routes show 404 instead of loading React | `.htaccess` rewrite rules not working; verify `mod_rewrite` is enabled |

---

## Support Resources

- cPanel Help: https://docs.cpanel.net/
- React Router Docs: https://reactrouter.com/
- PHP Manual: https://www.php.net/manual/
- MDN Web Docs: https://developer.mozilla.org/

---

## Final Verification Checklist

- [ ] App loads at https://yourdomain.com
- [ ] API endpoints respond with data
- [ ] Database queries execute successfully
- [ ] No 404 errors on page refresh
- [ ] HTTPS is working (padlock visible)
- [ ] All main features tested and working
- [ ] Error logs are clean
- [ ] Backups are in place
- [ ] Team is notified of live deployment
- [ ] Post-launch monitoring is set up

**Deployment completed successfully!** 🎉

---

## Next Steps

1. Monitor the site for 24-48 hours
2. Gather user feedback
3. Plan for future updates using this deployment process
4. Consider automating deployments with Git hooks or CI/CD
5. Set up error tracking/monitoring service (e.g., Sentry)

