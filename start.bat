@echo off
title Subway Stamp Web Server
echo ==============================================================
echo  Seoul/Metropolitan Subway Stamp Collection App Starting...
echo ==============================================================
echo.
echo  [Instructions]
echo  1. Run this script on your PC.
echo  2. Open the 'Local' URL in your PC's browser to test.
echo  3. Ensure your phone and PC are connected to the same Wi-Fi.
echo  4. Open the 'Network' URL in your mobile phone's browser.
echo.
echo  * TIP: You can use the mock simulator in the app to test GPS
echo    without leaving your room!
echo.
echo ==============================================================
echo.
npm run dev -- --host
pause
