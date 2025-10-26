# Discord PTB Custom Injector

> A powerful injector for Discord PTB that adds custom functionality through a burger menu interface.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Platform: Windows](https://img.shields.io/badge/Platform-Windows-blue.svg)](https://www.microsoft.com/windows)
[![Discord: PTB](https://img.shields.io/badge/Discord-PTB-7289DA.svg)](https://discord.com/)

## ⚠️ Disclaimer

This tool modifies Discord PTB client files. Use at your own risk. This may violate Discord's Terms of Service. The authors are not responsible for any consequences.

## 🎯 Features

- 🍔 Custom burger menu integrated into Discord interface
- 🎮 Quest auto-completion functionality
- 🔄 Easy installation and uninstallation

## 📦 Quick Start (For Users)

### Prerequisites

- Windows OS
- Discord PTB installed

### Installation

1. **Download the latest release** from the [Releases](releases/) folder
2. **Close Discord PTB completely**
3. Run `DiscordCustom-Install.exe`
4. Wait for the confirmation message
5. Launch Discord PTB
6. Select quest
7. Click on buger menu on top of window
8. Start auto complete

### Uninstallation

1. **Close Discord PTB completely**
2. Run `DiscordCustom-Uninstall.exe`
3. Wait for the confirmation message


## 🛠️ How It Works

1. The installer extracts Discord PTB's `core.asar` file
2. Creates an automatic backup (`.backup`)
3. Injects custom code into the main entry point
4. Repackages the modified `core.asar`
5. On uninstall, restores the original backup


## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔐 Security

- The injector creates automatic backups before any modification
- All operations are performed locally on your machine
- No data is sent to external servers
- Source code is fully transparent and auditable

---

**⭐ If you find this project useful, please consider giving it a star!**
