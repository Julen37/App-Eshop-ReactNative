// Importation de la fonction getDefaultConfig depuis le package expo/metro-config
// Cette fonction permet de récupérer la configuration Metro par défaut fournie par Expo
const { getDefaultConfig } = require("expo/metro-config");

// Cette annotation TypeScript indique que 'config' est de type MetroConfig,
// ce qui permet d'avoir une aide à l'auto - complétion et une vérification de type 
// dans les éditeurs compatibles.

/* @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Modification de la configuration du résolveur Metro
// La propriété 'unstable_enablePackageExports' est mise à false
// Cela désactive une fonctionnalité expérimentale liée à la gestion des "exports" dans les packages,
// ce qui peut aider à résoudre certains problèmes de résolution de modules dans React Native ou Expo,
// notamment avec certains packages qui ne gèrent pas encore cette norme.
config.resolver.unstable_enablePackageExports = false;

// Export de la configuration Metro personnalisée pour que 
// Metro l'utilise lors du bundling
module.exports = config;