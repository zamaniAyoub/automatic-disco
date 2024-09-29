// Importer les modules nécessaires
const express = require('express');
const bodyParser = require('body-parser');
const firebase = require('firebase-admin');

// Initialiser l'application Express
const app = express();
app.use(bodyParser.json()); // Pour analyser les requêtes JSON

// Charger la clé privée Firebase
const serviceAccount = require('./firebase-service-account.json');

// Initialiser Firebase Admin SDK
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://powerappschat-default-rtdb.firebaseio.com/"  // Remplacer par l'URL de votre base de données
});

const db = firebase.firestore();




// Route de test (GET)
app.get('/', (req, res) => {
  res.send('API Firebase avec Node.js est opérationnelle !');
});






// Route POST pour envoyer un message à Firebase
app.post('/messages', async (req, res) => {
  try {
    // Extracting email and content from the request body
    const { email, content } = req.body;

    // Check if email and content are provided
    if (!email || !content) {
      return res.status(400).json({ error: 'Email and content are required' });
    }

    // Create the message object
    const message = {
      email,
      content,
      timestamp: new Date()
    };

    // Store the message in the Firestore collection
    const docRef = await db.collection('messages').add(message);

    // Respond with the created message
    res.status(201).json({ id: docRef.id, ...message });
  } catch (err) {
    console.error('Error posting message:', err);
    res.status(500).json({ error: 'Failed to post message' });
  }
});



app.use((req, res) => {
    res.status(404).send('Not Found');
});





//developpment Api
app.post('/messages',  async(req, res) => {
  try {
    const { email, content } = req.body;
    const message = {
      email,
      content,
      timestamp: new Date()
    };
    const docRef = await firebase.database('message')..add(message);
    res.status(201).json({ id: docRef.id, ...message });
  } catch (err) {
    res.status(400).json({ error: 'Failed to send message' });
  }
});



// Lancer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
