module.exports = {

  WriteToJson: function (fileName ,toFile) {
    const fs = require('fs')
    const file = "./responses/" + fileName +  ".json"
    const json = JSON.stringify(toFile, null, 2)
      fs.writeFile(file, json,
        (error) => {
          if (error) console.log("Error on writing file: ", error)
          //else console.log("Writing file " + file)
          })
  },

  WriteToText: function (fileName ,toFile, append) {
    const fs = require('fs')
    const file = "./responses/" + fileName +  ".json"
    const text = toFile
    if (append) {
      fs.appendFile(file, text,
        (error) => {
          if (error) console.log("Error appending on file: ", error)
          else console.log("Updating file " + file)
          })
    }
    else {
      fs.writeFile(file, text,
        (error) => {
          if (error) console.log("Error on writing file: ", error)
          //else console.log("Writing file " + file)
          })
      }
  }
};