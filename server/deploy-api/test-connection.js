require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');

// Afficher l'IP du serveur
async function getPublicIP() {
    try {
        const response = await axios.get('https://api.ipify.org?format=json');
        console.log('Server Public IP:', response.data.ip);
    } catch (error) {
        console.error('Error getting public IP:', error.message);
    }
}

// Test de connexion MongoDB
async function testConnection() {
    try {
        console.log('Trying to connect to MongoDB...');
        console.log('MongoDB URI:', process.env.MONGODB_URI.replace(/:[^:@]*@/, ':****@')); // Masquer le mot de passe
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000 // Timeout après 5 secondes
        });
        console.log('Successfully connected to MongoDB!');
        console.log('MongoDB version:', mongoose.version);
    } catch (error) {
        console.error('MongoDB connection error details:', {
            name: error.name,
            message: error.message,
            code: error.code,
            codeName: error.codeName
        });
    }
}

// Exécuter les tests
(async () => {
    await getPublicIP();
    await testConnection();
    process.exit(0);
})();
