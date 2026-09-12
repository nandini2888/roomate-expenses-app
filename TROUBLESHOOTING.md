# Troubleshooting: "Access to localhost denied"

## Common Causes & Solutions

### 1. MySQL Service Not Running
**Check if MySQL is running:**
```bash
# Windows (PowerShell as Admin)
Get-Service -Name MySQL*

# Or check in Services app
# Press Win+R, type: services.msc
# Look for "MySQL" service and ensure it's "Running"
```

**Start MySQL if stopped:**
```bash
# Windows (PowerShell as Admin)
Start-Service MySQL80
# Or MySQL57, MySQL, etc. - check your service name
```

### 2. Wrong MySQL Credentials
**Test your MySQL connection:**
```bash
mysql -u root -p123456
```

If this fails, your password might be different. Try:
- Empty password: `mysql -u root`
- Different password
- Check MySQL Workbench or phpMyAdmin for your actual credentials

**Update application.properties with correct password:**
```properties
spring.datasource.password=YOUR_ACTUAL_PASSWORD
```

### 3. MySQL Port Not 3306
**Check if MySQL is on a different port:**
```bash
# Check MySQL configuration
# Usually in: C:\ProgramData\MySQL\MySQL Server X.X\my.ini
# Look for: port=3306
```

If different, update application.properties:
```properties
spring.datasource.url=jdbc:mysql://localhost:YOUR_PORT/sharing_is_caring?...
```

### 4. MySQL User Permissions
**Grant permissions if needed:**
```sql
-- Connect to MySQL as root
mysql -u root -p

-- Grant all privileges
GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

### 5. Firewall Blocking Connection
**Temporarily disable Windows Firewall to test:**
- Go to Windows Security > Firewall & network protection
- Temporarily turn off firewall
- Try starting the app again
- If it works, add MySQL to firewall exceptions

### 6. Use H2 Database (Temporary Solution)
If MySQL continues to cause issues, you can temporarily use H2 (in-memory database):

**Add to pom.xml:**
```xml
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>runtime</scope>
</dependency>
```

**Update application.properties:**
```properties
# Comment out MySQL config
# spring.datasource.url=jdbc:mysql://...
# spring.datasource.username=root
# spring.datasource.password=123456

# Use H2 instead
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driver-class-name=org.h2.Driver
spring.h2.console.enabled=true
```

**Note:** H2 is in-memory, so data is lost on restart. Use only for testing.

## Step-by-Step Diagnostic

1. **Test MySQL Connection:**
   ```bash
   mysql -u root -p123456
   ```
   If this works, MySQL is fine. If not, fix MySQL first.

2. **Check if port 3306 is in use:**
   ```bash
   netstat -an | findstr 3306
   ```

3. **Verify MySQL is listening:**
   ```bash
   telnet localhost 3306
   ```
   (If telnet not available, skip this)

4. **Check application.properties:**
   - Username: `root`
   - Password: `123456` (or your actual password)
   - Port: `3306`
   - Database: `sharing_is_caring` (will be auto-created)

5. **Check backend logs:**
   Look at the console output when starting the backend. The error message will tell you exactly what's wrong.

## Quick Fix Checklist

- [ ] MySQL service is running
- [ ] MySQL credentials are correct (test with `mysql -u root -p`)
- [ ] Port 3306 is correct
- [ ] MySQL user has permissions
- [ ] Firewall is not blocking
- [ ] application.properties has correct password

## Still Not Working?

Share the exact error message from the backend console, and I can provide a more specific solution!



