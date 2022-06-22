//before running the server, make sure to create a folder called "uploads" in the same directory as the index.js file

const fs = require("fs")
const express = require("express")
const app = express()
app.use(express.urlencoded({ extended: true }))

const uuid = require("uuid")
var multer = require("multer")
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + "/uploads")
  },
  filename: function (req, file, cb) {
    console.log(file)
    cb(null, uuid.v4() + ".json")
  },
})
var upload = multer({ storage: storage })
const PORT = 8080

app.post("/sendmap", upload.single("map"), (req, res) => {
  console.log(req.file)
  if (req.file) {
    res.status(200).json({
      token: req.file.filename.split(".")[0]
    })
  } else {
    res.status(400)
  }
})

app.post("/receivemap", (req, res) => {
  token = req.body.token
  try {
    mapfile = fs.readFileSync(`./uploads/${token}.json`)
    mapfile = JSON.parse(mapfile)
    res.json(mapfile)
  } catch (err) {
    console.log(err)
  }
})

app.listen(PORT, () => console.log(`Server listening on PORT ${PORT}`))
