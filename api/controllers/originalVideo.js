const db = require('../../db/db');
const OriginalVideo = require('../models/originalVideo');
const admin = require('firebase-admin');
const database = db();
const ORIGINAL_VIDEOS_COLL = "originalVideos";

module.exports = {
    getAll: async (req, res) => {
        videos = [];
        const lastUpdated = new admin.firestore.Timestamp(parseInt(req.params.lastUpdated), 0);
        var snapshot = await database.collection(ORIGINAL_VIDEOS_COLL).where("lastUpdated", ">=", lastUpdated).get();
        snapshot.forEach((doc) => {
            data = doc.data();
            videos.push(new OriginalVideo(
                doc.id, 
                data.name, 
                data.uri, 
                data.performer, 
                data.uploadDate._seconds, 
                data.lastUpdated._seconds, 
                data.isDeleted
            ));
        });
    
        res.status(200).send(videos);
    },

    create: async (req, res) => {
        // const { name, uri, performer } = req.body;
        // var timestamp = admin.firestore.FieldValue.serverTimestamp();
        // var origVideo = new OriginalVideo(null, name, uri, performer, timestamp, timestamp, false);
        // var newVideo = await database.collection(ORIGINAL_VIDEOS_COLL).add(origVideo.getObject());
        // res.status(200).send({ id: newVideo.id });
    }
}