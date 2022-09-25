const express = require("express");
const http = require("http");
const mongodb = require('mongodb');

const app = express();
const port = process.env.PORT ?? 3000;

const FILE_SERVICE_HOST = process.env.FILE_SERVICE_HOST ?? 'localhost'
const FILE_SERVICE_PORT = process.env.FILE_SERVICE_PORT ? parseInt(process.env.FILE_SERVICE_PORT): 4010;

const DBHOST = process.env.DBHOST ?? 'mongodb://rootuser:rootpass@db:21707';
const DBNAME = process.env.DBNAME ?? 'test';
const COLLECTION_NAME = process.env.COLLECTION_NAME ?? 'videos';

(async function main() {
    let client;
    let db;
    try {
        client = new mongodb.MongoClient(DBHOST);
        db = client.db(DBNAME);
    } catch (error) {
        console.log(error)
        throw error
    }
    

    const videosCollection = db.collection(COLLECTION_NAME);
    await videosCollection.insertOne({ id: 1, path :'sample.mp4'})
    const a = await videosCollection.findOne({ id: 1 })
    console.log("added", a)

    app.get("/video", async (req, res) => {
        const id = req.query.id
            ? parseInt(req.query.id)
            : 1
        console.log("id = ", id)
        const foundVideo = await videosCollection.findOne({ id })
        if (foundVideo == null) {
            res.sendStatus(404);
            return;
        }

        const forwardRequest = http.request(
            {
                host: FILE_SERVICE_HOST,
                port: FILE_SERVICE_PORT,
                path: `/video?path=${foundVideo.path}`,
                method: 'GET',
                headers: req.headers
            },
            ( forwardResp ) => {
                res.writeHeader(forwardResp.statusCode, forwardResp.headers)
                forwardResp.pipe(res)
            }
        )
        req.pipe(forwardRequest)
    })

    app.listen(port, () => {
        console.log(`App listening to port ${port}`)
    })
})();

function sendViewMessage(videoPath) {
    const postOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" }
    }

    const requestBody = { videoPath }

    const req = http.request("http://history/viewed", postOptions)

    req.on("close", // when request is complete
        () => {

    })

    req.on("error", (error) => {

    })

    req.write(JSON.stringify(requestBody));
    req.end();
}