import express from "express";
import path from "path";

const app = express()
const port = 14898
const __dirname = path.dirname(new URL(import.meta.url).pathname);

console.log("URL", import.meta.url);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/../client/dist/index.html'));
});

app.use(express.static(path.join(__dirname, '/../client/dist')));

export function startServer() {
    app.listen(port, () => {
        console.log(`server started on ${port}`)
    });
}