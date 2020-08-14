var express = require('express');
var router = express.Router();
var axios = require("axios");
const { restart } = require('nodemon');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.json({ data: "this is the index route" });
});

async function getCoordinates(city) {
  try {
    const token = process.env.MAPBOX_TOKEN;
    const res = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(city)}.json?access_token=${token}`)
    // aginst some attacks(sql injection)
    console.log(res.data); // res.data will be define by axios;
    if (res.data.features.length > 0) {
      return res.data.features[0] // return the best match(first element)
    }
    return null
  } catch (err) {
    console.log(err)
    return null
  }
}

async function getWeather([lng, lat]) {
  try {
    const token = process.env.OPENWEATHER_TOKEN
    console.log(token)
    const res = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&appid=${token}&units=metric`)
    return res.data
  } catch (err) {
    console.log(err)
    return null
  }

}





// put, post, patch, delte, get
// localhost:5000/weather
router.get("/weather", async function (req, res) { // 왜 여기에는 async가 붙지??? line#7 참조
  // console.log(req.query);

  try {
    const { city } = req.query;
    if (!city) {
      // status 400 means bad request
      return res.status(400).json({ error: "city query is required" })
    };

    // cannot use fetch here in nodejs, fetch is an object of the browser

    // console.log(req);




    // use Mapbox to get coordinates from city/place string
    const coordinates = await getCoordinates(city)
    if (!coordinates) {
      return res.status(400).json({ error: "cannot find the name" })
    };
    console.log(coordinates)
    // coordinates.geometry.coordinates=[longitude, latitude]
    // use openWether api to get weather forecast from coordinates 



    
    const result = await getWeather(coordinates.geometry.coordinates)
    if (!result) {
      return res.status(400).json({ error: "cannot find the weather" })
    }
    // console.log(result)
    res.json({ data: result })
  } catch (err) {
    console.log(err)
    return res.send("ok")
  }
})

// router.get('/jee', function (req, res, next) {
//   res.send("yay");
// });

// router.get('/sun', function (req, res, next) {
//   res.send("hello");
// });

module.exports = router;


// https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&appid=${process.env.OPEN_WEATHER_KEY}&units=metric

// https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json ? access_token = ${ token }



// http://localhost:5000/
// http://localhost:5000/sun