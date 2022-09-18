const express = require("express");
const http = require("http");

const app = express();

const port = process.env.PORT ?? 3000;

const FILE_SERVICE_HOST = process.env.FILE_SERVICE_HOST ?? 'localhost'
const FILE_SERVICE_PORT = process.env.FILE_SERVICE_PORT ? parseInt(process.env.FILE_SERVICE_PORT): 4010;

app.get("/video", (req, res) => {
    const forwardRequest = http.request(
        {
            host: FILE_SERVICE_HOST,
            port: FILE_SERVICE_PORT,
            path: '/video?path=sample.mp4',
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