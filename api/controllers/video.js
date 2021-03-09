const mongoose = require("mongoose");
const Video = require("../models/video");
const fs = require("fs");
const db = require('../../db/db')
const database = db()
const {PythonShell} =require('python-shell'); 
const video = require("../models/video");

module.exports = {
    createVideo: async(req, res) => {
    const { sourceId, link, uid } = req.body;
    const ref = database.ref('imitationVideos/');

    let newVideo;

    try{
      newVideo = ref.push({
       Url: link,
       UID: uid,
       Score: 0,
       sourceId: sourceId,
       UploadDate: Date()
      });
    } catch(err){
      console.log('Failed')
      res.status(500)
      res.send('failed')
    }

    const videoKey = newVideo.key;

    let options = { 
      args: ["C:\\Users\\noamd\\Documents\\final-proj\\sportstar-server\\videos\\1\\openpose", "C:\\Users\\noamd\\Documents\\final-proj\\sportstar-server\\videos\\1\\Imitations\\1\\openpose"], //An argument which can be accessed in the script using sys.argv[1]
    }; 

    try{
      PythonShell.run('./scripts/leagueTokOpenPose.py', options, (err, result)=>{ 
        if (err){
          console.log(err)
          res.send('Failed on python');
          return;
        }

        console.log(result)

        const newRef = database.ref(`imitationVideos/${videoKey}/`);

        try{
          newRef.update({
           Score: Number(result[0])
          });
        } catch(err){
          console.log('Failed')
          res.status(500)
          res.send('failed')
        }

        res.send({"result": result[0]})
      });
    } catch(err){
      console.log(err)
    }
    
  }
};
