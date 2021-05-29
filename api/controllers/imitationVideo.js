const db = require('../../db/db')
const database = db()
const admin = require('firebase-admin');
const {PythonShell} =require('python-shell'); 
const ImitationVideo = require('../models/imitationVideo');
const IMITATION_VIDEOS_COLL = "imitationVideos";
const USERS_COLL = "users"

module.exports = {
    createVideo: async(req, res) => {
    const { sourceId, link, uid } = req.body;
    var timestamp = admin.firestore.FieldValue.serverTimestamp();
    var imitVideo = new ImitationVideo(null, link, uid, sourceId, 0, timestamp, timestamp, false);

    try{
      imitVideo.id = (await database.collection(IMITATION_VIDEOS_COLL).add(imitVideo.getObject())).id
    } catch(err){
      console.log('Failed to get imit id')
      return res.status(500).send('failed')
    }

    let options = { 
      args: ["./videos/1/openpose", "./videos/1/Imitations/1/openpose"] //An argument which can be accessed in the script using sys.argv[1]
    }; 

    try{
      PythonShell.run('./scripts/leagueTokOpenPose.py', options, async (err, result)=>{ 
        if (err){
          console.log(err)
          res.send('Failed on python');
          return;
        }
        imitVideo.score = Number(result[0])

        try{
          await database.collection(IMITATION_VIDEOS_COLL).doc(imitVideo.id).update(imitVideo.getObject());
        } catch(err){
          console.log('Failed to update imit score')
          return res.status(500).send('failed')
        }

        const deviceToken = (await database.collection(USERS_COLL).doc(uid).get()).data().deviceToken
        await admin.messaging().send({
          "data": {
              "title": "Are you ready?",
              "message": "Tap here to find out your score"
           },
          "token": deviceToken
        });

        res.send({"result": result[0]})
      });
    } catch(err){
      console.log(err)
    }
    
  },

  getAll: async (req, res) => {
    imitVideos = [];
    const lastUpdated = new admin.firestore.Timestamp(parseInt(req.params.lastUpdated), 0);
    var snapshot = await database.collection(IMITATION_VIDEOS_COLL).where("lastUpdated", ">=", lastUpdated).get();
    snapshot.forEach((doc) => {
        data = doc.data();
        imitVideos.push(new ImitationVideo(
            doc.id, 
            data.url,
            data.uid,
            data.sourceId,
            data.score, 
            data.uploadDate._seconds, 
            data.lastUpdated._seconds, 
            data.isDeleted
        ));
    });

    res.status(200).send(imitVideos);
  },

  getUserImitationVideos: async (req, res) => {
    videos = [];
    const lastUpdated = new admin.firestore.Timestamp(parseInt(req.params.lastUpdated), 0);
    var snapshot = await database.collection(IMITATION_VIDEOS_COLL)
      .where("uid", "==", req.params.uid).get();
    snapshot.forEach((doc) => {
        data = doc.data();
        videos.push(new ImitationVideo(
            doc.id, 
            data.url,
            data.uid,
            data.sourceId,
            data.score, 
            data.uploadDate._seconds, 
            data.lastUpdated._seconds, 
            data.isDeleted
        ));
    });

    res.status(200).send(videos);
  },
};
