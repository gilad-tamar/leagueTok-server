const admin = require('firebase-admin');
const serviceAccount = require('../ServiceAccountKey.json');

let _database = null; 

const connect = () => {
    console.log('a')
    const defaultApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://leaguetok-default-rtdb.firebaseio.com"
    })

    _database = defaultApp.database();
    return _database
}

module.exports = () => _database ? _database : connect()


// database.ref('users/').push({
//     username: 'tttt',
//     email: 'b',
//     profile_picture : 'c'
// });