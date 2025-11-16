# Deployment Architecture & Flow Diagram

## Local Development Structure vs cPanel Production Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                    LOCAL DEVELOPMENT                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  evolve_property_manager/                                       │
│  ├── react_taiwind_postgreess_base_plate/                      │
│  │   ├── src/                                                  │
│  │   │   ├── services/                                         │
│  │   │   │   └── api.js (BASE_URL=http://localhost:3000/api) │
│  │   │   └── pages/                                            │
│  │   └── dist/ (after npm run build)                           │
│  │       ├── index.html                                        │
│  │       ├── assets/                                           │
│  │       └── ...                                               │
│  └── backend/                                                   │
│      ├── config/                                               │
│      │   └── Database.php (localhost credentials)              │
│      └── api/                                                   │
│          ├── properties/                                        │
│          ├── tenant/                                            │
│          ├── payments/                                          │
│          └── maintenance/                                       │
│                                                                  │
│  Local Server:                                                  │
│  ✓ React: http://localhost:5173                               │
│  ✓ API: http://localhost/evolve_property_manager/...          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

                          npm run build
                          Update URLs
                          Update Credentials
                                ↓
                                ↓

┌─────────────────────────────────────────────────────────────────┐
│              CPANEL PRODUCTION (public_html/)                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  public_html/                                                   │
│  ├── api/                                                        │
│  │   ├── config/                                               │
│  │   │   ├── Database.php (cPanel credentials) ⭐ UPDATE     │
│  │   │   └── config.php                                        │
│  │   ├── properties/                                            │
│  │   │   ├── get_properties.php (require '../config/...')    │
│  │   │   ├── create_units.php                                 │
│  │   │   └── ... (paths updated ⭐)                           │
│  │   ├── tenant/                                               │
│  │   ├── payments/                                              │
│  │   └── maintenance/                                           │
│  ├── assets/ (from dist/assets/)                               │
│  │   ├── index-[hash].js                                       │
│  │   └── index-[hash].css                                      │
│  ├── index.html (from dist/index.html)                         │
│  ├── .htaccess ⭐ CRITICAL - Updates URLs to React           │
│  └── favicon.ico                                                │
│                                                                  │
│  Production Server:                                             │
│  ✓ React: https://yourdomain.com/                             │
│  ✓ API: https://yourdomain.com/api/                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Request Flow Diagram

### Development Flow
```
User Browser
    ↓
    └─→ http://localhost:5173 (React Dev Server)
        ├─→ User clicks "View Properties"
        └─→ React Router changes URL to /properties
            └─→ JavaScript fetch() to http://localhost:3000/api/properties/get_properties.php
                ├─→ PHP executes locally
                ├─→ Queries local MySQL
                └─→ Returns JSON to React
                    └─→ React renders property list
```

### Production Flow (cPanel)
```
User Browser
    ↓
    └─→ https://yourdomain.com/ (Your domain on cPanel server)
        ├─→ .htaccess intercepts request
        │   ├─ If /api/* → send to PHP
        │   └─ Otherwise → send to index.html (React Router)
        ├─→ React app loads (index.html + assets)
        ├─→ User clicks "View Properties"
        └─→ React Router changes URL to /properties
            ├─→ Browser shows: https://yourdomain.com/properties
            │   (But React handles it client-side, no page reload)
            └─→ JavaScript fetch() to https://yourdomain.com/api/properties/get_properties.php
                ├─→ .htaccess routes to PHP file
                ├─→ PHP executes on cPanel server
                ├─→ Queries cPanel MySQL database
                └─→ Returns JSON to React
                    └─→ React renders property list
```

---

## .htaccess Magic Explained

```
User Request to /properties
           ↓
      Check .htaccess rules
           ├─ Rule 1: Is it /api/*? No → Continue
           ├─ Rule 2: Does /properties file exist? No → Continue
           ├─ Rule 3: Does /properties folder exist? No → Continue
           └─ Rule 4: Yes! Send to /index.html
                      (React Router handles /properties path)
                ↓
           React app loads
                ↓
           React Router sees /properties
                ↓
           Shows PropertyList component
                ↓
           User sees properties page

User Request to /api/properties/get_properties.php
           ↓
      Check .htaccess rules
           ├─ Rule 1: Is it /api/*? YES! Stop here.
           └─ Execute PHP file directly
                ↓
           PHP file runs
                ↓
           Database query
                ↓
           Return JSON
```

---

## Database Connection Flow

### Development (Local)
```
React App
    ↓ fetch()
Backend API (PHP)
    ↓ require_once '../../config/Database.php'
Database.php
    ├─ $host = 'localhost'
    ├─ $database = 'evolve_local'
    └─ $user = 'root'
        ↓ PDO Connection
Local MySQL Server
    ├─ Database: evolve_local
    ├─ Tables: properties, tenants, units, etc.
    └─ Returns data to PHP
        ↓
PHP returns JSON
        ↓
React displays data
```

### Production (cPanel)
```
React App (https://yourdomain.com)
    ↓ fetch()
cPanel Server (.htaccess routes to /api/)
    ↓ PHP file executes
Backend API (PHP)
    ↓ require_once '../config/Database.php'
Database.php ⭐ MUST UPDATE
    ├─ $host = 'localhost'
    ├─ $database = 'yourusername_evolve' (cPanel name)
    └─ $user = 'yourusername_evolve_user' (cPanel user)
        ↓ PDO Connection
cPanel MySQL Server
    ├─ Database: yourusername_evolve
    ├─ Tables: properties, tenants, units, etc.
    └─ Returns data to PHP
        ↓
PHP returns JSON
        ↓
React displays data
```

---

## File Path Changes Required

```
┌─────────────────────────────────────────────────────────────────┐
│                    PATH TRANSFORMATION                           │
├─────────────────────────────────────────────────────────────────┤

File: api/properties/get_properties.php

LOCAL PATH (3 levels deep):
  get_properties.php (in properties/)
    ↓ ../../config/Database.php
  Goes up 2 levels to reach config/

PRODUCTION PATH (2 levels deep):
  get_properties.php (in api/properties/)
    ↓ ../config/Database.php
  Goes up 1 level to reach config/

TRANSFORMATION:
  '../../' → '../'
  '../../models/' → '../models/'
  '../../config/' → '../config/'

EXAMPLE:
  require_once '../../config/Database.php';
  becomes:
  require_once '../config/Database.php';
```

---

## The .htaccess Routing Logic

```
When request comes to yourdomain.com/something:

                    Start
                      ↓
        ┌─────────────────────────────┐
        │ Is path /api/*?             │
        │ (matches /api/*)            │
        └─────────────────────────────┘
              ↙              ↘
            YES               NO
              ↓               ↓
        Stop rewriting   Continue checking
        Execute PHP
              ↓               ↓
        Return JSON   ┌─────────────────────────────┐
                      │ Is this a real file?        │
                      │ (like index.html, style.css)│
                      └─────────────────────────────┘
                            ↙              ↘
                          YES               NO
                            ↓               ↓
                    Send file         Continue checking
                            ↓               ↓
                        ┌─────────────────────────────┐
                        │ Is this a real directory?   │
                        │ (like /images/)             │
                        └─────────────────────────────┘
                              ↙              ↘
                            YES               NO
                              ↓               ↓
                    Send directory   REWRITE TO
                        files         /index.html
                              ↓               ↓
                        HTML file      React Router
                        sent to        handles path
                        browser        (client-side)
                              ↓               ↓
                    Browser shows    No full page
                    directory list   reload!
```

---

## Deployment Checklist Flowchart

```
Start Deployment
        ↓
┌─────────────────────────────────────────┐
│ Step 1: Prepare Locally                 │
├─────────────────────────────────────────┤
│ ✓ Update API URL in src/services/api.js │
│ ✓ npm run build                         │
│ ✓ Run path update script                │
│ ✓ Update Database.php credentials       │
└─────────────────────────────────────────┘
        ↓ (Test locally first!)
        ↓
┌─────────────────────────────────────────┐
│ Step 2: Setup cPanel                    │
├─────────────────────────────────────────┤
│ ✓ Create MySQL database                 │
│ ✓ Create database user                  │
│ ✓ Assign user to database               │
│ ✓ Note credentials                      │
└─────────────────────────────────────────┘
        ↓
        ↓
┌─────────────────────────────────────────┐
│ Step 3: Upload Files                    │
├─────────────────────────────────────────┤
│ ✓ Upload dist/* to public_html/         │
│ ✓ Upload api/* to public_html/api/      │
│ ✓ Upload .htaccess to public_html/      │
└─────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────┐
│ Step 4: Import Database                 │
├─────────────────────────────────────────┤
│ ✓ Export local database to SQL          │
│ ✓ Import via cPanel phpMyAdmin          │
└─────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────┐
│ Step 5: Test                            │
├─────────────────────────────────────────┤
│ ✓ Visit https://yourdomain.com          │
│ ✓ Check console for errors              │
│ ✓ Test API endpoints                    │
│ ✓ Test main features                    │
└─────────────────────────────────────────┘
        ↓
    ✓ SUCCESS! 🎉
```

---

## Key Points to Remember

| Concept | Local Dev | Production |
|---------|-----------|------------|
| **Website URL** | http://localhost:5173 | https://yourdomain.com |
| **API Base URL** | http://localhost:3000/api | https://yourdomain.com/api |
| **Database Host** | localhost | localhost (cPanel host) |
| **Database Name** | evolve_local | yourusername_evolve |
| **Require Paths** | ../../ | ../ |
| **Routing** | React Dev Server | .htaccess |
| **.htaccess** | Not needed | REQUIRED |
| **File Location** | Multiple folders | All in public_html |

---

## Troubleshooting Flowchart

```
Something went wrong!
        ↓
    ┌─────────────────┐
    │ What's the      │
    │ symptom?        │
    └─────────────────┘
      │   │   │   │   │
      │   │   │   │   └─→ Blank page
      │   │   │   │       ↓ Check console
      │   │   │   │       for errors
      │   │   │   │
      │   │   │   └─→ 404 on refresh
      │   │   │       ↓ Check .htaccess
      │   │   │       is uploaded
      │   │   │
      │   │   └─→ CORS error
      │   │       ↓ Update domain in
      │   │       .htaccess header
      │   │
      │   └─→ API returns 500
      │       ↓ Check cPanel
      │       error logs
      │
      └─→ No database data
          ↓ Verify database
          was imported
```

---

This diagram helps visualize:
✓ How local structure differs from production
✓ How requests flow through the system
✓ How .htaccess routes requests
✓ How the database connects
✓ Required file path changes
✓ Troubleshooting logic

Keep this handy during deployment! 📊

