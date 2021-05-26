const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../../db/db')
const database = db()
const admin = require('firebase-admin');

module.exports = {
    signup: async(req, res) => {
        const { email, password, firstName, lastName, phone} = req.body;

        const ref = database.collection('users')
        
        const snapshot = await ref.where('email', '==', email).get();

        if (!snapshot.empty) {
            console.log('Email already exists');
            return res.status(500).json({
                err: 'Email already exists'
            })
        }

        bcrypt.hash(password, 10, async (error, hash) => {
            if (error) {
                return res.status(500).json({
                    error
                })
            }

            await ref.add({
                email: email, 
                password: hash, 
                firstName: firstName,
                lastName: firstName, 
                phone: phone
            });

            res.send('user added')
        });
    },
    login: async(req, res) => {
        const { email, password } = req.body;

        const ref = database.collection('users')
        
        const users = await ref.where('email', '==', email).limit(1).get();

        if (users.empty) {
            console.log('Email doesnt exist');
            return res.status(401).json({
                message: 'Auth failed'
            });
        }


        let user;
        users.forEach(val=> user = val)
        
        bcrypt.compare(password, user._fieldsProto.password.stringValue, async (error, result) => {

            if (result) {
                const token = jwt.sign({
                    email: user.email
                },
                'noam',
                {
                    expiresIn: "3H"
                });
                
                return res.status(200).json({
                    message: 'Auth successful',
                    token
                })
            }

            res.status(401).json({
                message: 'Auth failed'
            });
        })
    },
    connect: async(req, res) => {
        const { uid, fullName} = req.body;
        var timestamp = admin.firestore.FieldValue.serverTimestamp();
        const ref = database.collection('users')

        const snapshot = await ref.where('uid', '==', uid).get();

        if (!snapshot.empty) {
            console.log('User already exists');
            return res.status(200).json({
                message: 'User already exists'
            })
        }

        await ref.add({
            uid: uid,
            fullName: fullName,
            lastUpdated: timestamp,
            isDeleted: false
        });

        return res.status(200).json({
            message: 'User added',
        })
    }
}