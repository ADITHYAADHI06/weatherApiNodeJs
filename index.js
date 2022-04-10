require("dotenv").config();
const http = require("http");
const fs = require("fs");
// var requests = require("./node_modules/requests/index");
let requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
  let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
  temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
  temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
  temperature = temperature.replace("{%location%}", orgVal.name);
  temperature = temperature.replace("{%country%}", orgVal.sys.country);
  temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);

  return temperature;
};

const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests(
      "https://api.openweathermap.org/data/2.5/weather?q=Pune&appid=8be14e82b1a2433e1c3843342cac9d52"
    )
      .on("data", (chunk) => {
        // console.log(chunk);    ====== we get json data in chunk by url
        const objdata = JSON.parse(chunk);
        const arrData = [objdata];
        // arrData is array of object [{},{},a];
        // console.log(arrData[0].main.temp);
        const realTimeData = arrData
          .map((val) => replaceVal(homeFile, val))
          .join("");
        // join(""); used to convert array type tempreture to string =========
        res.write(realTimeData);
        // console.log(realTimeData);
      })
      .on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);
        res.end();
        // res.end(); must write., otherwise no ouput get displayed
      });
  } else {
    res.end("File not found");
  }
});

server.listen(8003, "127.0.0.1");
