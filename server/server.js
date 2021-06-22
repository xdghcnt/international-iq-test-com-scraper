import express from "express";
import path from "path";
import fs from "fs";

const app = express()
const port = 1488
const __dirname = path.dirname(new URL(import.meta.url).pathname);

let statsData = [];

const updateData = () => {
    fs.readFile(path.join(__dirname, './store.txt'), (error, data) => {
        statsData = JSON.parse(`[${data.toString().split("\n").filter((line) => line).join(",")}]`);
    });
};

updateData();
setInterval(updateData, 60000);

app.get('/studies/iq', (req, res) => {
    res.sendFile(path.join(__dirname, '/../client/dist/index.html'));
});

app.get('/studies/iq/data', (req, res) => {
    res.send(statsData);
});

app.use(express.static(path.join(__dirname, '/../client/dist')));

export function startServer() {
    app.listen(port, () => {
        console.log(`server started on ${port}`)
    });
}