var Twit = require('twit')
const woeid = require('woeid')
const config = require('./config')
var T = new Twit( config )


//console.log(woeid.getWoeid('FIN'))
var params = {
  id: '1 ' //1 is global, 23424812, finland
}

topTrending()

setInterval(() => topTrending(), 1000*60)

function topTrending(){
  T.get('trends/place', params, gotData);

  function gotData(err, data, response) {
      //var tweets = data;
      //console.log(JSON.stringify(tweets, undefined, 2));
      const responseFromApi = data[0].trends
      const trends = []

    //console.log(responseFromApi[0])

      Object.keys(responseFromApi).map((key, index) =>  {
        trends.push(responseFromApi[key].name)
      });

      //#1
      console.log(trends[0])

      //write to file
      const fs = require('fs')
      var json = JSON.stringify(responseFromApi[0], null, 2)
      
      fs.appendFile("trends.json", json ,
        (error) => {
          if (error) console.log("error on append", error )
          else console.log('Saved')
        })
      
      json = JSON.stringify(data, null, 2)
      fs.writeFile("response.json", json,
        (error) => {
          if (error) console.log("Error on writing file: ", error)
          else console.log("Writing file response.json")
          })
  }
}