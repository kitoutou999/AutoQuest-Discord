const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const releasesDir = path.join(projectRoot, 'releases');

console.log('🔨 Construction des exécutables...\n');

// Créer le dossier releases s'il n'existe pas
if (!fs.existsSync(releasesDir)) {
    fs.mkdirSync(releasesDir, { recursive: true });
}

try {
    // Compiler l'installateur
    console.log('📦 Compilation de l\'installateur...');
    execSync('npx pkg src/install.js -t node18-win-x64 -o releases/DiscordCustom-Install.exe', {
        stdio: 'inherit',
        cwd: projectRoot
    });

    // Compiler le désinstallateur
    console.log('\n📦 Compilation du désinstallateur...');
    execSync('npx pkg src/uninstall.js -t node18-win-x64 -o releases/DiscordCustom-Uninstall.exe', {
        stdio: 'inherit',
        cwd: projectRoot
    });

    // Copier custom-test.js dans releases
    console.log('\n📋 Copie de custom-test.js...');
    fs.copyFileSync(
        path.join(__dirname, 'custom-test.js'),
        path.join(releasesDir, 'custom-test.js')
    );

    // Créer un fichier README dans releases
    console.log('📄 Création du README...');
    const readmeContent = `# Discord Custom Injector

## Installation

1. Fermez Discord PTB complètement
2. Double-cliquez sur DiscordCustom-Install.exe
3. Attendez le message de confirmation
4. Lancez Discord PTB

## Désinstallation

1. Fermez Discord PTB complètement
2. Double-cliquez sur DiscordCustom-Uninstall.exe
3. Attendez le message de confirmation

---

⚠️ IMPORTANT: Ne supprimez pas le fichier custom-test.js !
Il doit rester dans le même dossier que les exécutables.

✅ Aucune installation de Node.js ou autre logiciel n'est requise !
Tout est inclus dans les exécutables.
`;

    fs.writeFileSync(path.join(releasesDir, 'README.txt'), readmeContent, 'utf-8');

    console.log('\n' + '='.repeat(60));
    console.log('✅ Compilation terminée avec succès !');
    console.log('='.repeat(60));
    console.log(`\n📁 Fichiers générés dans: ${releasesDir}\n`);
    console.log('📝 Fichiers créés:');
    console.log('   • DiscordCustom-Install.exe   - Pour installer');
    console.log('   • DiscordCustom-Uninstall.exe - Pour désinstaller');
    console.log('   • custom-test.js              - Code à injecter');
    console.log('   • README.txt                  - Instructions\n');
    console.log('💡 Prêt pour GitHub ! Le dossier releases/ contient tout le nécessaire.');
    console.log('   Les utilisateurs peuvent télécharger directement les .exe\n');

} catch (error) {
    console.error('❌ Erreur lors de la compilation:', error.message);
    process.exit(1);
}
