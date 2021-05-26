const db = require('../../db/db');
const OriginalVideo = require('../models/originalVideo');
const admin = require('firebase-admin');
const { exec } = require("child_process");
const database = db();
const ORIGINAL_VIDEOS_COLL = "originalVideos";
const fs = require('fs');

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
    
        
        var videosPath = 'C:\\collage\\final\\leagueTok-server\\videos';

        //Create new folder for the original video data
        try {
                 fs.mkdirSync(`${videosPath}\\4`);
                console.log(`Directory created successfully! - ${videosPath}\\4`);

        } catch (error) {
            console.log('Directory Create Failed!');
            res.status(500);
              return res.send(`failed create directory ${videosPath}\\4 \n error ${error}`);
        }
        //Run OpenPose
        //var url = 'C:\\collage\\final\\leagueTok-server\\videos\\3\\source3.mp4'
        var url = 'https://firebasestorage.googleapis.com/v0/b/leaguetok.appspot.com/o/videos%2FOriginals%2F3rls61Ny7xVNTZlg2IDZ.mp4?alt=media&token=44b05aff-bc81-4656-9fbd-b20eb1887544'
        exec(`bin\\OpenPoseDemo.exe --video "${url}" --write_json "${videosPath}\\4\\openpose" --net_resolution 320x320 --part_candidates`,
        {
            cwd: 'C:\\collage\\final\\openpose\\openposeGPU'
        }, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                res.status(500);
                return res.send(`OpenPose Filed error: ${error}`);
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            console.log(`stdout: ${stdout}`);

            //Create new folder in videos directory for imitations
            try {
                fs.mkdirSync(`${videosPath}\\4\\Imitations`);
                console.log(`Directory created successfully! - ${videosPath}\\4\\Imitations`);
            } catch (error) {
                console.log(`Directory Create Failed! - ${videosPath}\\4\\Imitations \n error- ${error}` );
            }
            res.status(200).send({ id: 4 , videos});
            
        })
    },

    create: async (req, res) => {
        const { name, uri, performer } = req.body;
        
        var timestamp = admin.firestore.FieldValue.serverTimestamp();
        var origVideo = new OriginalVideo(null, name, uri, performer, timestamp, timestamp, false);
        origVideo.id = (await database.collection(ORIGINAL_VIDEOS_COLL).add(origVideo.getObject())).id;
        
        var videosPath = 'C:\\collage\\final\\leagueTok-server\\videos';
        
         //Create new folder for the original video data
         try {
            fs.mkdirSync(`${videosPath}\\${origVideo.uri}`);
            console.log(`Directory created successfully! - ${videosPath}\\${origVideo.uri}`);

        } catch (error) {
            console.log('Directory Create Failed!');
            res.status(500);
            return res.send(`failed create directory ${origVideo.uri} \n error ${error}`);
        }

        //Run OpenPose
        exec(`bin\\OpenPoseDemo.exe --video "${origVideo.uri}" --write_json "${videosPath}\\${origVideo.id}\\openpose" --net_resolution 320x320 --part_candidates`,
        {
            cwd: 'C:\\collage\\final\\openpose\\openposeGPU'
        }, async (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            console.log(`stdout: ${stdout}`);

            //Create new folder in videos directory for imitations

            try {
                fs.mkdirSync(`${videosPath}\\${origVideo.id}\\Imitations`);
                console.log(`Directory created successfully! - ${videosPath}\\${origVideo.id}\\Imitations`);
            } catch (error) {
                console.log(`Directory Create Failed! - ${videosPath}\\${origVideo.id}\\Imitations \n error- ${error}` );
            }
            res.status(200).send( origVideo.id );
            
        })
        
    }
}