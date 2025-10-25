@echo off



echo.
node install-asar.js uninstall

echo.
node install-asar.js install

echo.
start "" "%LOCALAPPDATA%\DiscordPTB\Update.exe" --processStart DiscordPTB.exe


