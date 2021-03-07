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
      args: ['1', '2'], //An argument which can be accessed in the script using sys.argv[1]
    }; 

    try{
      PythonShell.run('./scripts/script1.py', options, (err, result)=>{ 
        if (err){
          console.log(err)
          res.send('Failed on python');
        }

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

        console.log('result: ', ); 

        res.send(result[0])
      });
    } catch(err){
      console.log(err)
    }
    
  }
};
