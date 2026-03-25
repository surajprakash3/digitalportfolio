@echo off
echo Starting installation... > build.log
npm install >> build.log 2>&1
echo Done >> build.log
