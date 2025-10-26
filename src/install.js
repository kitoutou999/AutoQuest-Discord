#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const asar = require('@electron/asar');

// Détection si on est dans un exe compilé avec pkg
const isPkg = typeof process.pkg !== 'undefined';
const exeDir = isPkg ? path.dirname(process.execPath) : __dirname;

const DISCORD_PTB_PATH = path.join(process.env.LOCALAPPDATA, 'DiscordPTB');
const CUSTOM_CODE_FILE = isPkg
    ? path.join(exeDir, 'custom-test.js')
    : path.join(__dirname, 'custom-test.js');
const TEMP_DIR = path.join(exeDir, 'temp_asar');

const colors = { reset: '\x1b[0m', green: '\x1b[32m', red: '\x1b[31m', yellow: '\x1b[33m', cyan: '\x1b[36m' };

function log(msg, color = 'reset') { console.log(`${colors[color]}${msg}${colors.reset}`); }
function error(msg) { log(`❌ ${msg}`, 'red'); }
function success(msg) { log(`✅ ${msg}`, 'green'); }
function info(msg) { log(`ℹ️  ${msg}`, 'cyan'); }

function isDiscordRunning() {
    try {
        return execSync('tasklist', { encoding: 'utf-8' }).toLowerCase().includes('discordptb.exe');
    } catch { return false; }
}

function findLatestVersion() {
    if (!fs.existsSync(DISCORD_PTB_PATH)) throw new Error('Discord PTB non installé');
    const folders = fs.readdirSync(DISCORD_PTB_PATH).filter(n => n.startsWith('app-')).sort().reverse();
    if (!folders.length) throw new Error('Aucune version trouvée');
    return folders[0];
}

function getCoreAsarPath(version) {
    const basePath = path.join(DISCORD_PTB_PATH, version, 'modules');
    const coreFolder = fs.readdirSync(basePath).find(n => n.startsWith('discord_desktop_core-'));
    if (!coreFolder) throw new Error('Module discord_desktop_core introuvable');
    return path.join(basePath, coreFolder, 'discord_desktop_core', 'core.asar');
}

function cleanTempDir() {
    if (fs.existsSync(TEMP_DIR)) fs.rmSync(TEMP_DIR, { recursive: true, force: true });
}

function extractAsar(asarPath) {
    cleanTempDir();
    info('Extraction...');
    try {
        asar.extractAll(asarPath, TEMP_DIR);
        success('Extraction terminée');
    } catch (err) {
        throw new Error(`Erreur extraction: ${err.message}`);
    }
}

async function packAsar(asarPath) {
    info('Recompression...');
    try {
        await asar.createPackage(TEMP_DIR, asarPath);
        success('Recompression terminée');
    } catch (err) {
        throw new Error(`Erreur compression: ${err.message}`);
    }
}

function findMainFile() {
    const pkgPath = path.join(TEMP_DIR, 'package.json');
    if (!fs.existsSync(pkgPath)) throw new Error('package.json introuvable');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    return path.join(TEMP_DIR, pkg.main || 'index.js');
}

function isAlreadyInjected(filePath) {
    if (!fs.existsSync(filePath)) return false;
    return fs.readFileSync(filePath, 'utf-8').includes('CUSTOM BUTTON INJECTION');
}

async function install() {
    log('\n🚀 Installation du Custom Discord Injector\n', 'cyan');

    if (isDiscordRunning()) {
        error('Discord PTB en cours d\'exécution !');
        log('Fermez Discord PTB et réessayez.', 'yellow');
        console.log('\nAppuyez sur une touche pour quitter...');
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.on('data', process.exit.bind(process, 1));
        return;
    }

    if (!fs.existsSync(CUSTOM_CODE_FILE)) {
        error('custom-test.js introuvable');
        error('Assurez-vous que le fichier custom-test.js est dans le même dossier que l\'exécutable');
        console.log('\nAppuyez sur une touche pour quitter...');
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.on('data', process.exit.bind(process, 1));
        return;
    }

    try {
        const version = findLatestVersion();
        info(`Version: ${version}`);

        const coreAsarPath = getCoreAsarPath(version);
        const backupPath = coreAsarPath + '.backup';

        if (!fs.existsSync(backupPath)) {
            fs.copyFileSync(coreAsarPath, backupPath);
            success('Sauvegarde créée');
        }

        extractAsar(coreAsarPath);

        const mainFilePath = findMainFile();

        if (isAlreadyInjected(mainFilePath)) {
            log('Déjà installé. Utilisez l\'uninstaller d\'abord.', 'yellow');
            cleanTempDir();
            console.log('\nAppuyez sur une touche pour quitter...');
            process.stdin.setRawMode(true);
            process.stdin.resume();
            process.stdin.on('data', process.exit.bind(process, 0));
            return;
        }

        const mainContent = fs.readFileSync(mainFilePath, 'utf-8');
        const customCode = fs.readFileSync(CUSTOM_CODE_FILE, 'utf-8');
        const customCodeEscaped = JSON.stringify(customCode);

        const injectionCode = `
// CUSTOM BUTTON INJECTION - START
const { app, BrowserWindow } = require('electron');
const CUSTOM_CODE = ${customCodeEscaped};

function injectCustomCode(window) {
    if (!window || window.isDestroyed()) return;
    window.webContents.on('did-finish-load', () => {
        try {
            window.webContents.executeJavaScript(CUSTOM_CODE);
            console.log('[Custom Button] Injecté');
        } catch (err) {
            console.error('[Custom Button] Erreur:', err);
        }
    });
}

app.on('browser-window-created', (event, window) => injectCustomCode(window));
if (app.isReady()) BrowserWindow.getAllWindows().forEach(w => injectCustomCode(w));
// CUSTOM BUTTON INJECTION - END

`;

        const lines = mainContent.split('\n');
        let insertIndex = 0;
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line && !line.startsWith('//') && !line.startsWith('/*') &&
                !line.includes('require(') && !line.includes('import ')) {
                insertIndex = i;
                break;
            }
        }

        lines.splice(insertIndex, 0, injectionCode);
        fs.writeFileSync(mainFilePath, lines.join('\n'), 'utf-8');
        success('Code injecté');

        await packAsar(coreAsarPath);
        cleanTempDir();

        log('\n' + '='.repeat(50), 'green');
        success('Installation terminée avec succès !');
        log('='.repeat(50) + '\n', 'green');
        log('Vous pouvez maintenant lancer Discord PTB', 'cyan');

        console.log('\nAppuyez sur une touche pour quitter...');
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.on('data', process.exit.bind(process, 0));

    } catch (err) {
        error(`Erreur: ${err.message}`);
        cleanTempDir();
        console.log('\nAppuyez sur une touche pour quitter...');
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.on('data', process.exit.bind(process, 1));
    }
}

install();
