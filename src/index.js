const express = require("express");
const fs  = require("fs");

const app = express();

const port = process.env.PORT ?? 3000;

app.get("/video", (req, res) => {
    const path = "./video/sample.mp4"
    fs.stat(path, (err, stats) => {
        if(err) {
            console.error("Error on reading file");
            console.error(err);
            res.sendStatus(500);
            return;
        }

        res.writeHead(200, {
            "Content-Length": stats.size,
            "Content-Type": "video/mp4"
        });

        fs.createReadStream(path).pipe(res);
    })
})

app.listen(port, () => {
    console.log(`App listening to port ${port}`)
})