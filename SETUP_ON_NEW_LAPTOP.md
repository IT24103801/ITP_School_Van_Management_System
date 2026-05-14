# School Van Management System - Setup Guide for New Laptop

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Step-by-Step Installation](#step-by-step-installation)
3. [Database Setup](#database-setup)
4. [Running the Project](#running-the-project)
5. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software to Install:

1. **Node.js** (v18 or higher)
   - Download: https://nodejs.org/
   - Choose LTS version
   - Verify: `node --version` and `npm --version`

2. **XAMPP** (for MySQL and phpMyAdmin)
   - Download: https://www.apachefriends.org/
   - Install with MySQL and phpMyAdmin components
   - Start Apache and MySQL services

3. **Expo Go App** (on your phone)
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent
   - iOS: https://apps.apple.com/app/expo-go/id982107779

4. **Git** (optional, for version control)
   - Download: https://git-scm.com/

---

## Step-by-Step Installation

### Step 1: Copy Project Files

Copy the entire project folder to the new laptop:
```
IT24200911/
```

### Step 2: Install Dependencies

Open Command Prompt or PowerShell in the project folder:

```bash
# Navigate to project folder
cd "C:\path\to\IT24200911"

# Install COMPLETE-APP dependencies
cd COMPLETE-APP
npm install

# Go back to root
cd ..

# Install backend dependencies for all 6 modules
cd IT24103642-parent-student\backend
npm install
cd ..\..

cd IT24102655-driver-vehicle\backend
npm install
cd ..\..

cd IT23224902-route-schedule\backend
npm install
cd ..\..

cd IT24103801-attendance\backend
npm install
cd ..\..

cd IT24104170-billing-payment\backend
npm install
cd ..\..

cd IT24200911-emergency-safety\backend
npm install
cd ..\..
```

**OR** use the quick install script:
```bash
INSTALL_COMPLETE_APP.bat
```

---

## Database Setup

### Step 1: Start XAMPP

1. Open XAMPP Control Panel
2. Start **Apache** (for phpMyAdmin)
3. Start **MySQL** (for database)

### Step 2: Create Database

1. Open browser and go to: `http://localhost/phpmyadmin`
2. Click "New" to create a new database
3. Database name: `school_van_system`
4. Collation: `utf8mb4_general_ci`
5. Click "Create"

### Step 3: Import Schema

1. Select `school_van_system` database
2. Click "Import" tab
3. Choose file: `database/complete_schema.sql`
4. Click "Go"
5. Wait for success message

### Step 4: Import Sample Data (Optional)

1. Still in `school_van_system` database
2. Click "Import" tab
3. Choose file: `database/sample_data_fixed.sql`
4. Click "Go"
5. Wait for success message

---

## Update IP Address

### Step 1: Find Your Computer's IP Address

Open Command Prompt and run:
```bash
ipconfig
```

Look for "Wireless LAN adapter Wi-Fi" → "IPv4 Address"
Example: `192.168.1.100`

### Step 2: Update IP in All Files

**IMPORTANT:** You need to update the IP address in all frontend screens.

The current IP is: `172.20.10.3`

You need to change it to your new laptop's IP address.

**Files to update:**
- All files in `COMPLETE-APP/src/modules/*/` folders

**How to update:**

Option 1 - Manual (if you know the new IP):
1. Open each `.js` file in `COMPLETE-APP/src/modules/`
2. Find: `http://172.20.10.3:`
3. Replace with: `http://YOUR_NEW_IP:`

Option 2 - PowerShell command:
```powershell
# Replace 192.168.1.100 with YOUR actual IP address
Get-ChildItem -Path "COMPLETE-APP\src\modules" -Recurse -Filter "*.js" | ForEach-Object { (Get-Content $_.FullName) -replace '172\.20\.10\.3', '192.168.1.100' | Set-Content $_.FullName }
```

---

## Running the Project

### Method 1: One-Click Start (Recommended)

Double-click: `RUN_EVERYTHING.bat`

This will:
1. Start all 6 backends (ports 3001-3006)
2. Start the frontend app
3. Show QR code

### Method 2: Manual Start

**Terminal 1 - Start Backends:**
```bash
cd COMPLETE-APP\backend
node unified-server.js
```

**Terminal 2 - Start Frontend:**
```bash
cd COMPLETE-APP
npm start
```

### Step 3: Open on Phone

1. Make sure phone and laptop are on **same WiFi**
2. Open **Expo Go** app on phone
3. Scan the QR code shown in terminal
4. Wait for app to load (first time takes 1-2 minutes)

---

## Verification Checklist

After setup, verify everything works:

- [ ] XAMPP MySQL is running
- [ ] Database `school_van_system` exists
- [ ] All tables are created (12 tables)
- [ ] Sample data is loaded
- [ ] All 6 backends start without errors
- [ ] Frontend shows QR code
- [ ] Phone can scan QR code
- [ ] App loads on phone
- [ ] Can navigate to all 6 modules
- [ ] Can view data in each module

---

## Troubleshooting

### Problem: "Cannot find module"

**Solution:**
```bash
cd COMPLETE-APP
npm install
```

### Problem: "MySQL connection error"

**Solution:**
1. Check XAMPP MySQL is running
2. Verify database name is `school_van_system`
3. Check `.env` files in each backend folder:
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=school_van_system
   DB_USER=root
   DB_PASSWORD=
   ```

### Problem: "Network Error" on phone

**Solution:**
1. Check phone and laptop are on same WiFi
2. Verify IP address is correct in all files
3. Check Windows Firewall isn't blocking ports 3001-3006, 8081

### Problem: "Port already in use"

**Solution:**
1. Close all Node.js processes
2. Restart computer
3. Try again

### Problem: App shows blank screen

**Solution:**
1. Press "r" in terminal to reload
2. Check backend logs for errors
3. Verify all backends are running

### Problem: Data not displaying

**Solution:**
1. Check database has data (phpMyAdmin)
2. Verify IP address is correct
3. Check backend logs for errors
4. Test API endpoints: `http://YOUR_IP:3004/api/parents`

---

## Testing the App

### Test Each Module:

1. **Parent & Student**
   - View parents list
   - Add new parent
   - View students list
   - Add new student

2. **Driver & Vehicle**
   - View drivers list
   - Add new driver
   - View vehicles list
   - Add new vehicle

3. **Route & Schedule**
   - View routes list
   - View schedules
   - Check live tracking map

4. **Attendance**
   - Mark attendance
   - View attendance records
   - Check notifications

5. **Billing & Payment**
   - View bills list
   - Create new bill
   - View payment history

6. **Emergency & Safety**
   - View SOS alerts
   - Report incident
   - Send broadcast alert
   - Perform safety check

---

## Project Structure

```
IT24200911/
├── COMPLETE-APP/                    # Main unified app
│   ├── src/
│   │   ├── modules/                # All 6 modules (27 screens)
│   │   └── screens/                # Main menu
│   ├── backend/                    # Unified backend launcher
│   └── package.json
│
├── IT24103642-parent-student/      # Individual module
│   ├── backend/
│   └── frontend/
│
├── IT24102655-driver-vehicle/      # Individual module
├── IT23224902-route-schedule/      # Individual module
├── IT24103801-attendance/          # Individual module
├── IT24104170-billing-payment/     # Individual module
├── IT24200911-emergency-safety/    # Individual module
│
├── database/                       # Database files
│   ├── complete_schema.sql        # Create tables
│   └── sample_data_fixed.sql      # Sample data
│
└── RUN_EVERYTHING.bat          # Quick start script
```

---

## Quick Start Summary

1. Install Node.js, XAMPP, Expo Go
2. Copy project folder
3. Run `INSTALL_COMPLETE_APP.bat`
4. Start XAMPP (Apache + MySQL)
5. Import database files in phpMyAdmin
6. Find your IP with `ipconfig`
7. Update IP in all frontend files
8. Run `RUN_EVERYTHING.bat`
9. Scan QR code with Expo Go
10. Test all modules!

---

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify all prerequisites are installed
3. Check that all services are running
4. Review error messages in terminal

---

## Success!

Once everything is working, you should see:
- All 6 backends running on ports 3001-3006
- Frontend showing QR code
- App loading on phone
- All 6 modules accessible
- Data displaying correctly

**Good luck with your project!**
