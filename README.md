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
- 💾 Automatic backup system
- 🔄 Easy installation and uninstallation
- 🚀 No Node.js installation required for end users

## 📦 Quick Start (For Users)

### Prerequisites

- Windows OS
- Discord PTB installed

### Installation

1. **Download the latest release** from the [Releases](releases/) folder
2. **Close Discord PTB completely**
3. Run `DiscordCustom-Install.exe`
4. Wait for the confirmation message
5. Launch Discord PTB and enjoy!

### Uninstallation

1. **Close Discord PTB completely**
2. Run `DiscordCustom-Uninstall.exe`
3. Wait for the confirmation message

That's it! No complex setup, no Node.js required.

## 📁 Project Structure

```
Discord-Custom/
├── releases/                    # Ready-to-use executables
│   ├── DiscordCustom-Install.exe
│   ├── DiscordCustom-Uninstall.exe
│   ├── custom-test.js
│   └── README.txt
├── src/                         # Source code
│   ├── install.js              # Installation script
│   ├── uninstall.js            # Uninstallation script
│   ├── build.js                # Build script
│   └── custom-test.js          # Injected code
├── docs/                        # Documentation
├── package.json
├── .gitignore
├── LICENSE
└── README.md
```

## 🔨 Development

### Prerequisites for Development

- Node.js 18+
- npm

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/discord-custom.git
cd discord-custom

# Install dependencies
npm install
```

### Build Executables

```bash
npm run build
```

This will generate:
- `releases/DiscordCustom-Install.exe` (~42 MB)
- `releases/DiscordCustom-Uninstall.exe` (~41 MB)
- `releases/custom-test.js`
- `releases/README.txt`

### Development Scripts

```bash
npm run inject      # Install (requires Node.js)
npm run remove      # Uninstall (requires Node.js)
npm run build       # Build executables
```

## 🛠️ How It Works

1. The installer extracts Discord PTB's `core.asar` file
2. Creates an automatic backup (`.backup`)
3. Injects custom code into the main entry point
4. Repackages the modified `core.asar`
5. On uninstall, restores the original backup

### Technical Details

- Uses `@electron/asar` to manipulate Discord's ASAR archives
- Employs `@yao-pkg/pkg` to compile Node.js scripts into standalone executables
- Injects code at Discord's startup to add custom UI elements
- All dependencies are bundled into the executables (~42 MB each)

## 📝 Scripts Explanation

### `install.js`
Standalone installation script that:
- Checks if Discord PTB is running
- Creates backup of original files
- Injects custom code
- Provides user-friendly console output

### `uninstall.js`
Standalone uninstallation script that:
- Restores original files from backup
- Cleans up temporary files
- Provides confirmation messages

### `custom-test.js`
The injected code that:
- Creates a burger menu UI in Discord
- Implements quest auto-completion
- Integrates seamlessly with Discord's interface

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](docs/CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔐 Security

- The injector creates automatic backups before any modification
- All operations are performed locally on your machine
- No data is sent to external servers
- Source code is fully transparent and auditable

## ❓ FAQ

**Q: Will this get my Discord account banned?**
A: Modifying Discord clients may violate their Terms of Service. Use at your own risk.

**Q: Does this work on Discord Stable/Canary?**
A: Currently only supports Discord PTB. Can be adapted for other versions.

**Q: Do I need to reinstall after Discord updates?**
A: Yes, Discord updates will overwrite the modifications. Simply run the installer again.

**Q: Can I modify the injected code?**
A: Yes! Edit `src/custom-test.js` and rebuild using `npm run build`.

**Q: Why are the executables so large?**
A: They contain a full Node.js runtime and all dependencies for standalone operation.

## 🙏 Acknowledgments

- Built with [@electron/asar](https://github.com/electron/asar)
- Compiled with [@yao-pkg/pkg](https://github.com/yao-pkg/pkg)
- Inspired by the Discord modding community

## 📧 Contact

For questions or issues, please open an issue on GitHub.

---

**⭐ If you find this project useful, please consider giving it a star!**
