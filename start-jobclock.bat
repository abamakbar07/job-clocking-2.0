@echo off
title Job Clocking Monitor
echo Starting Job Clocking Monitor...
echo.
echo  © akbarafriansyah.my.id
set /p 
node src/employeeMonitor.js %userId%
pause