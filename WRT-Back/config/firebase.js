const admin = require('firebase-admin');
const path = require('path');

// Caminho do arquivo de credenciais de serviço
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || './wrtmin-service-account.json';

let initialized = false;

const initializeFirebase = () => {
  if (!initialized && admin.apps.length === 0) {
    try {
      const serviceAccount = require(path.resolve(serviceAccountPath));
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      initialized = true;
      console.log('✅ Firebase Admin SDK inicializado com credenciais de serviço');
      console.log(`📁 Projeto: ${serviceAccount.project_id || 'N/A'}`);
    } catch (error) {
      console.error('❌ Erro ao inicializar Firebase Admin SDK:', error.message);
      console.error('💡 Verifique o caminho do arquivo de credenciais de serviço:', serviceAccountPath);
      process.exit(1);
    }
  }
  return admin.firestore();
};

const getFirestore = () => {
  if (admin.apps.length === 0) {
    throw new Error('Firebase não foi inicializado. Chame initializeFirebase() primeiro.');
  }
  return admin.firestore();
};

module.exports = {
  initializeFirebase,
  getFirestore,
  admin
}; 