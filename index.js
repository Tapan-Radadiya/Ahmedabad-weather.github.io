const http = require('http')
const fs = require('fs')
var requests = require('requests');
const homeFile = fs.readFileSync("home.html", "utf-8");
const localStorage = require('node-localstorage')

const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%curtemp%}", orgVal.main.temp);
    temperature = temperature.replace("{%mintemp%}", parseInt(orgVal.main.temp_min - 2));
    temperature = temperature.replace("{%maxtemp%}", parseInt(orgVal.main.temp_max + 2));
    temperature = temperature.replace("{%city%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    return temperature;
}
const server = http.createServer((req, res) => {

    if (req.url == "/") {
        requests('https://api.openweathermap.org/data/2.5/weather?q=Ahmedabad&appid=e7703be2b184182344935628621e688c&units=metric'
        )
            .on("data", function (chunk) {
                const objdata = JSON.parse(chunk);
                const arrData = [objdata]
                const actualData = arrData.map((val) => replaceVal(homeFile, val)).join("");
                res.write(actualData)
            })
            .on("end", function (err) {
                if (err) return console.log("Closed Due TO Error", err)
                res.end()
            });
    }
});
server.listen(8000, "127.0.0.1")