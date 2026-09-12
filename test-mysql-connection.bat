@echo off
echo Testing MySQL Connection...
echo.
echo Attempting to connect with:
echo Username: root
echo Password: 123456
echo.
mysql -u root -p123456 -e "SELECT 'Connection successful!' AS Status;"
if %errorlevel% equ 0 (
    echo.
    echo ✓ MySQL connection successful!
    echo.
    echo Creating database if it doesn't exist...
    mysql -u root -p123456 -e "CREATE DATABASE IF NOT EXISTS sharing_is_caring;"
    echo.
    echo ✓ Database ready!
) else (
    echo.
    echo ✗ MySQL connection failed!
    echo.
    echo Possible issues:
    echo 1. MySQL service is not running
    echo 2. Wrong password (try: mysql -u root -p)
    echo 3. MySQL not installed
    echo.
    echo Check TROUBLESHOOTING.md for solutions
)
pause

