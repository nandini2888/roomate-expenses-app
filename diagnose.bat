@echo off
echo ========================================
echo MySQL Connection Diagnostic Tool
echo ========================================
echo.

echo [1] Checking if MySQL service is running...
sc query MySQL80 >nul 2>&1
if %errorlevel% equ 0 (
    echo    ✓ MySQL80 service found
) else (
    echo    ✗ MySQL80 service not found
    echo    Checking for other MySQL services...
    sc query MySQL57 >nul 2>&1
    if %errorlevel% equ 0 (
        echo    ✓ MySQL57 service found
    ) else (
        echo    ✗ No MySQL service found
        echo    → MySQL may not be installed
    )
)
echo.

echo [2] Testing MySQL connection with password '123456'...
mysql -u root -p123456 -e "SELECT 1;" >nul 2>&1
if %errorlevel% equ 0 (
    echo    ✓ Connection successful with password '123456'
    echo    → Your backend should work!
    echo.
    echo    Next step: Run start-backend.bat
) else (
    echo    ✗ Connection failed with password '123456'
    echo.
    echo [3] Testing with empty password...
    mysql -u root -e "SELECT 1;" >nul 2>&1
    if %errorlevel% equ 0 (
        echo    ✓ Connection successful with empty password
        echo    → Update application.properties: spring.datasource.password=
    ) else (
        echo    ✗ Connection failed
        echo.
        echo    Possible issues:
        echo    - MySQL service is not running
        echo    - Wrong password (try: mysql -u root -p)
        echo    - MySQL not installed
        echo.
        echo    Solutions:
        echo    1. Start MySQL service (services.msc)
        echo    2. Find your MySQL password
        echo    3. Update application.properties
    )
)
echo.
echo ========================================
pause

