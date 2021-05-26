const db = require('../../db/db');
const OriginalVideo = require('../models/originalVideo');
const admin = require('firebase-admin');
const database = db();
const ORIGINAL_VIDEOS_COLL = "originalVideos";

module.exports = {
    getAll: async (req, res) => {
        origVideos = [];
        const lastUpdated = new admin.firestore.Timestamp(parseInt(req.params.lastUpdated), 0);
        var snapshot = await database.collection(ORIGINAL_VIDEOS_COLL).where("lastUpdated", ">=", lastUpdated).get();
        snapshot.forEach((doc) => {
            data = doc.data();
            origVideos.push(new OriginalVideo(
                doc.id, 
                data.name, 
                data.uri, 
                data.performer, 
                data.uploadDate._seconds, 
                data.lastUpdated._seconds, 
                data.isDeleted
            ));
        });
    
        res.status(200).send(origVideos);
    },

    create: async (req, res) => {
        const { name, uri, performer } = req.body;
        var timestamp = admin.firestore.FieldValue.serverTimestamp();
        var origVideo = new OriginalVideo(null, name, uri, performer, timestamp, timestamp, false);
        origVideo.id = (await database.collection(ORIGINAL_VIDEOS_COLL).add(origVideo.getObject())).id;
        res.status(200).send({ id: origVideo.id });
    }
}