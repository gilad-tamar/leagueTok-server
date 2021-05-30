const db = require('../../db/db')
const database = db()
const admin = require('firebase-admin');
const {PythonShell} =require('python-shell'); 
const ImitationVideo = require('../models/imitationVideo');
const IMITATION_VIDEOS_COLL = "imitationVideos";

module.exports = {
    createVideo: async(req, res) => {
    const { sourceId, link, uid } = req.body;
    var timestamp = admin.firestore.FieldValue.serverTimestamp();

//  Check if uid and sourceId allready exits in the db. 
//  If so, update the record instead of creating a new one.
    var imitVideo = null;
    var isNew = false;

    try{
      var snapshot = await database.collection(IMITATION_VIDEOS_COLL).where("sourceId", "==", sourceId).where("uid", "==", uid)
      .get();    
    } catch(err){
      console.log('Failed')
      res.status(500)
      res.send('failed')
    }
    
    snapshot.forEach((doc) => {
        data = doc.data();
//      ImitVideo exists
        imitVideo = new ImitationVideo(doc.id, data.url, data.uid, data.sourceId, data.score, data.uploadDate, data.lastUpdated,
                                       data.isDeleted);
    });
    // });

//  ImitVideo does not exists
    if (imitVideo == null) {
      isNew = true;
      imitVideo = new ImitationVideo(null, link, uid, sourceId, 0, timestamp, timestamp, false);

      try{
        imitVideo.id = (await database.collection(IMITATION_VIDEOS_COLL).add(imitVideo.getObject())).id
      } catch(err){
        console.log('Failed')
        res.status(500)
        res.send('failed')
      }
    } 

    // var imitVideo = new ImitationVideo(null, link, uid, sourceId, 0, timestamp, timestamp, false);

    // try{
    //   imitVideo.id = (await database.collection(IMITATION_VIDEOS_COLL).add(imitVideo.getObject())).id
    // } catch(err){
    //   console.log('Failed')
    //   res.status(500)
    //   res.send('failed')
    // }

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
//      If the record is new
        if (isNew) {
          imitVideo.score = Math.round(Number(result[0]));
          await database.collection(IMITATION_VIDEOS_COLL).doc(imitVideo.id).update(imitVideo.getObject());

        } else {
//        The record is not new
//        Does this dance better than what exists already? If yes update, else don't. 
          if (imitVideo.score < Number(result[0])) {

            imitVideo.score = Number(result[0])
  
           // Round the score
  
            try{
              await database.collection(IMITATION_VIDEOS_COLL).doc(imitVideo.id).update({
                score: Math.round(imitVideo.score), 
                url: link, 
                uploadDate: timestamp,
                lastUpdated: timestamp 
              });
            } catch(err){
              console.log('Failed')
              res.status(500)
              res.send('failed')
            }
          }  
        }
        res.send({"result": (Math.round(Number(result[0]))).toString()})
        // res.send({"result": result[0]})
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
