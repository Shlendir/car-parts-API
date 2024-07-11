const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const fs = require('fs');
const { parse } = require('csv-parse');
const port = 8080;
const fileName = './tester.csv';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const records = [];
// Initialize the parser
const parser = parse({
    delimiter: ';'
});
// Use the readable stream api to consume records
parser.on('readable', function () {
    let record;
    while ((record = parser.read()) !== null) {
        records.push(record);
    }
});
// Catch any error
parser.on('error', function (err) {
    console.error(err.message);
});

parser.on('end', function () {
    console.log(records);
});

// Open the file and pipe it into the parser
fs.createReadStream(fileName).pipe(parser);


router.get("/", async (req, res) => {
    try {
        return res.json({ status: 200, response: `Yes.` });
    } catch (error) {
        console.log(error);
    }
    return res.json({ status: 500, response: `Something went wrong while processing request.` });
});
app.use(router);

app.get("*", (req, res) => res.sendStatus(404));

app.listen(port);
console.log("app runnin'")