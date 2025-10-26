#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Détection si on est dans un exe compilé avec pkg
const isPkg = typeof process.pkg !== 'undefined';
const exeDir = isPkg ? path.dirname(process.execPath) : __dirname;

const DISCORD_PTB_PATH = path.join(process.env.LOCALAPPDATA, 'DiscordPTB');
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

function uninstall() {
    log('\n🗑️  Désinstallation du Custom Discord Injector\n', 'yellow');

    if (isDiscordRunning()) {
        error('Discord PTB en cours d\'exécution !');
        log('Fermez Discord PTB et réessayez.', 'yellow');
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
            error('Aucune sauvegarde trouvée');
            log('Le code personnalisé n\'a peut-être jamais été installé.', 'yellow');
            console.log('\nAppuyez sur une touche pour quitter...');
            process.stdin.setRawMode(true);
            process.stdin.resume();
            process.stdin.on('data', process.exit.bind(process, 1));
            return;
        }

        info('Restauration de la sauvegarde...');
        fs.copyFileSync(backupPath, coreAsarPath);
        fs.unlinkSync(backupPath);
        success('Sauvegarde restaurée');

        cleanTempDir();

        log('\n' + '='.repeat(50), 'green');
        success('Désinstallation terminée avec succès !');
        log('='.repeat(50) + '\n', 'green');
        log('Discord PTB a été restauré à son état d\'origine', 'cyan');

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

uninstall();
