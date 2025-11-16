# cPanel Deployment Configuration Guide

## Overview
This guide helps you prepare the Evolve Property Manager app for cPanel deployment.

## Prerequisites
- cPanel account with a domain
- MySQL database created in cPanel
- FTP/SFTP access to your cPanel account
- Node.js and npm installed locally

---

## Step 1: Update Frontend API URLs

### Before Building:
Update `src/services/api.js` with your production domain:

```javascript
// BEFORE (Development)
const BASE_URL = 'http://localhost/evolve_property_manager/react_taiwind_postgreess_base_plate/backend/api';

// AFTER (Production - Replace yourdomain.com with your actual domain)
const BASE_URL = 'https://yourdomain.com/api';
```

### Build Command:
```bash
cd react_taiwind_postgreess_base_plate
npm run build
```

This creates a `dist/` folder with optimized production files.

---

## Step 2: cPanel Directory Structure

Your final `public_html/` directory should look like this:

```
public_html/
├── api/                           # PHP API folder
│   ├── config/
│   │   └── Database.php          # Updated with cPanel credentials
│   ├── config.php
│   ├── properties/
│   │   ├── get_properties.php
│   │   ├── create_units.php
│   │   ├── get_units.php
│   │   └── ... (all other property endpoints)
│   ├── tenant/
│   │   ├── tenant_login.php
│   │   ├── create.php
│   │   ├── list.php
│   │   └── ... (all tenant endpoints)
│   ├── payments/
│   │   └── get_payments.php
│   ├── maintenance/
│   │   └── get_requests.php
│   └── ... (all other API folders)
├── index.html                     # React app entry point
├── assets/                        # React built assets (JS, CSS)
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── ... (all other built assets)
├── .htaccess                      # Routing configuration
├── favicon.ico
└── vite.svg
```

---

## Step 3: cPanel Database Setup

1. Log into cPanel
2. Go to **MySQL Databases**
3. Create a new database (e.g., `yourusername_evolve`)
4. Create a database user (e.g., `yourusername_evolve_user`)
5. Assign the user to the database with all privileges

**Write down:**
- Database name: `yourusername_evolve`
- Database user: `yourusername_evolve_user`
- Database password: [Your generated password]
- Database host: `localhost`

---

## Step 4: Update Database Configuration

### File: `api/config/Database.php`

Replace with your cPanel credentials:

```php
<?php
class Database {
    private $host = 'localhost';
    private $database_name = 'yourusername_evolve';  // Your cPanel database name
    private $username = 'yourusername_evolve_user';  // Your database user
    private $password = 'your_database_password';    // Your database password
    private $conn;

    public function getConnection() {
        $this->conn = null;

        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->database_name,
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            echo "Database Error: " . $e->getMessage();
        }

        return $this->conn;
    }
}
```

---

## Step 5: .htaccess Configuration

Create `.htaccess` in `public_html/`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Exclude API folder from React Router rewrite
  RewriteRule ^api/ - [L]

  # Exclude existing files and directories
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d

  # Route all other requests to index.html (React Router)
  RewriteRule . /index.html [L]
</IfModule>

# CORS Headers for API
<IfModule mod_headers.c>
  Header set Access-Control-Allow-Origin "*"
  Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
  Header set Access-Control-Allow-Headers "Content-Type, Authorization"
</IfModule>
```

---

## Step 6: Update PHP Include Paths

After moving files to cPanel's flat structure, update all PHP requires:

### Pattern: Replace paths for new structure

**Before (Local Development):**
```php
require_once '../../config/Database.php';
require_once '../../models/Property.php';
```

**After (cPanel Production):**
```php
require_once '../config/Database.php';
require_once '../models/Property.php';
```

### Files to Update:
- `api/properties/*.php` (all property endpoints)
- `api/tenant/*.php` (all tenant endpoints)
- `api/payments/*.php` (all payment endpoints)
- `api/maintenance/*.php` (all maintenance endpoints)

---

## Step 7: Update CORS Headers

In each PHP file, update the CORS header:

**Before:**
```php
header("Access-Control-Allow-Origin: http://localhost:5173");
```

**After:**
```php
header("Access-Control-Allow-Origin: https://yourdomain.com");
// Or allow all (less secure)
header("Access-Control-Allow-Origin: *");
```

---

## Step 8: File Upload to cPanel

### Using cPanel File Manager:
1. Log into cPanel
2. Open **File Manager**
3. Navigate to `public_html`
4. Upload the contents of `dist/` folder (React build)
5. Create `api/` folder
6. Upload contents of `backend/api/` to `public_html/api/`
7. Upload `.htaccess` file

### Using FTP/SFTP:
1. Connect with your FTP credentials
2. Upload `dist/*` to `public_html/`
3. Upload `backend/api/*` to `public_html/api/`
4. Upload `.htaccess` to `public_html/`

---

## Step 9: Import Database

1. Export your local MySQL database
2. Log into cPanel > phpMyAdmin
3. Select your new database
4. Click **Import**
5. Upload your exported SQL file
6. Click **Go**

---

## Step 10: Test Deployment

1. Visit `https://yourdomain.com` → Should load React app
2. Check browser console for API errors
3. Test an API endpoint: `https://yourdomain.com/api/properties/get_properties.php`
4. Test authentication and main features

---

## Troubleshooting

### 404 Errors on Page Refresh
- Ensure `.htaccess` is in `public_html/`
- Check that `mod_rewrite` is enabled in cPanel

### CORS Errors
- Update `header("Access-Control-Allow-Origin")` to your domain
- Ensure headers are sent before output

### Database Connection Errors
- Verify Database.php credentials match cPanel setup
- Check that database user has all privileges
- Ensure MySQL server is running

### API Endpoints Returning 500
- Check PHP error logs in cPanel
- Verify file paths in `require_once` statements
- Ensure all necessary files are uploaded

---

## Security Checklist

- [ ] Use HTTPS (cPanel provides free SSL via AutoSSL)
- [ ] Disable directory listing (add `Options -Indexes` to .htaccess)
- [ ] Update database passwords in cPanel
- [ ] Implement API authentication/authorization
- [ ] Validate all user inputs on backend
- [ ] Use environment variables for sensitive data
- [ ] Set proper file permissions (644 for files, 755 for directories)

---

## Next Steps

After deployment:
1. Monitor cPanel error logs
2. Test all CRUD operations
3. Set up automated backups in cPanel
4. Consider implementing monitoring/alerts
5. Plan update strategy for future releases

