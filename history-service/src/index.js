const express = require('express');
const mongodb = require('mongodb');
const amqp = require('amqplib');

const DBHOST = process.env.DBHOST ?? 'mongodb://rootuser:rootpass@db:21707';
const DBNAME = process.env.DBNAME ?? 'test';
const COLLECTION_NAME = process.env.COLLECTION_NAME ?? 'videos';

const RABBIT_URI = process.env.RABBIT_URI;


async function setupHandlers(app, db) {
    const videosCollection = db.collection(COLLECTION_NAME)

    app.post("/viewed", async (req, res) => {
        const videoPath = req.body.videoPath;

        try {
            const result = await videosCollection.insertOne({ videoPath })
            console.log(`Video ${videoPath} added to history`);
            res.sendStatus(200);
        } catch (error) {
            console.log(`Video ${videoPath} failed to added to history`);
            res.sendStatus(500);
        }  
    })
}

async function connectRabbit() {
    const connection = await amqp.connect(RABBIT);
    connection.createChannel();
}


(async () => {
    const app = express();
    app.use(express.json());

    let client;
    let db;
    try {
        client = new mongodb.MongoClient(DBHOST);
        db = client.db(DBNAME);
    } catch (error) {
        console.log(error)
        throw error
    }

    try {
        await connectRabbit();
    } catch (error) {
        console.log(error)
        throw error
    }
    

    await setupHandlers(app, db);

    const port = process.env.PORT && parseInt(process.env.PORT) || 3000;
    app.listen(port, () => {
        console.log(`Server started on port: ${port}`);
    })
})();
