@echo off

if "%1" == "" goto help
if "%1" == "x86" goto launch86
if "%1" == "x64" goto launch64

:help
echo Launches the MongoDB
echo.
echo === Help ===
echo usage:
echo    run.bat platform
echo.
echo platform:
echo    x86
echo    x64
goto end

:launch86
echo === Launching MongoDB x86 ===
start MongoDB\x86\bin\mongod.exe --dbpath MongoDB\data\
goto launchgeddy

:launch64
echo === Launching MongoDB x64 ===
start MongoDB\x64\bin\mongod.exe --dbpath MongoDB\data\
goto launchgeddy

:launchgeddy
call node app.js
goto end

:end