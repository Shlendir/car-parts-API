const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const fs = require('fs');
const { parse } = require('csv-parse');
const port = 8080;
const fileName = './EditedEL.csv';

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
        records.push({ sn: record[0], name: record[1], col3: record[2], col4: record[3], col5: record[4], col6: record[5], col7: record[6], col8: record[7], col9: record[8], man: record[9], col11: record[10] });
    }
});
// Catch any error
parser.on('error', function (err) {
    console.error(err.message);
});
// Open the file and pipe it into the parser
fs.createReadStream(fileName).pipe(parser);

// Handle requests
// Filter + paginate
router.get("/spare-parts", async (req, res) => {
    try {
        const { sn, name, page } = req.query;
        var filtered = records
        if (sn)
            filtered = filtered.filter(
                (record) => record.sn.toLowerCase().includes(sn.toLowerCase())
            );
        if (name)
            filtered = filtered.filter(
                (record) => record.name.toLowerCase().includes(name.toLowerCase())
            );
        var start = page ? (page - 1) * 30 : 0
        var array = filtered.slice(start, start + 30)

        return res.status(200).json(array);
    } catch (error) {
        console.log(error);
    }
    return res.status(500).json('Something went wrong while processing request.');
});

// Search + paginate
router.get("/spare-parts/search/*", async (req, res) => {
    try {
        const { page } = req.query
        const search = req.originalUrl.slice("/spare-parts/search/".length).toLowerCase();

        var filtered = records
        if (search)
            filtered = filtered.filter(
                (record) => record.sn.toLowerCase().includes(search) || record.name.toLowerCase().includes(search)
            );

        var start = page ? (page - 1) * 30 : 0
        var array = filtered.slice(start, start + 29)

        return res.status(200).json(array);
    } catch (error) {
        console.log(error);
    }
    return res.status(500).json('Something went wrong while processing request.');
});
app.use(router);

app.get("*", (req, res) => res.sendStatus(404));

app.listen(port);
console.log("app runnin'")