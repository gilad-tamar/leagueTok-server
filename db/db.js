const admin = require('firebase-admin');
const serviceAccount = require('../ServiceAccountKey.json');

let _database = null; 

const connect = () => {
    const defaultApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://leaguetok-default-rtdb.firebaseio.com"
    })

    _database = admin.firestore();
    return _database
}

module.exports = () => _database ? _database : connect()