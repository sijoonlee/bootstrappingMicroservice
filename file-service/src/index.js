const express = require("express");
const fs  = require("fs");

const app = express();

const port = process.env.PORT ?? 4088;

app.get("/video", (req, res) => {
    const { path } = req.query;

    const filePath = path == null
        ? "./video/sample.mp4"
        : "./video/" + path;

    fs.stat(filePath, (err, stats) => {
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

        fs.createReadStream(filePath).pipe(res);
    })
})

app.listen(port, () => {
    console.log(`App listening to port ${port}`)
})
