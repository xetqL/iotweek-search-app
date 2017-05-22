const express = require('express')
require('./csvsearch.js').init('test.csv',100000)//.verbose()
const {csvData} = require('./csvsearch.js')
const EasyZip = require("easy-zip").EasyZip
const {classifyRegistration,categoryToCardpressoReadable} = require('./articlesparsing.js')


function respondJSON(res,data){
  res.setHeader("Content-Type", "application/json")
  res.end(JSON.stringify(data))
}


/*================================================================================
  App setup
================================================================================*/
const app = express()

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})


//ui
app.use('/', express.static(__dirname + '/public'))


//Search api
app.get('/find',function (req, res) {
  const keys = Object.keys(req.query)
  let data = csvData()
  let response = data
  if(keys.length > 0)
  	response = data.filter( entry => {
  		let ok = true
  		for(let i=0; i<keys.length;i++){
  			let key = keys[i]
  			if(!(entry[key] && entry[key].toString().toLowerCase().includes(req.query[key].toString().toLowerCase()))){
  				ok = false
  				break
  			}
  		}
  		return ok
  	})
  respondJSON(res,response)
})


//csv printer compatible
app.get('/export', function(req, res){
	let result = "participantFirstName;participantLastName;participantCompany\n"

	let data = csvData()	
	let participants = {}

        data.forEach(entry => {
                let registrationsType = classifyRegistration(entry)
		let str = entry["Prénom"]+";"+entry["Nom"]+";"+entry["Entreprise"]+"\n"
                registrationsType.forEach( regType => {
                    participants[regType] = (regType in participants) ? participants[regType]+str : result + str
                })
	})
	let zip = new EasyZip()
        Object.keys(participants).forEach( regType => {
            zip.file(categoryToCardpressoReadable(regType) + ".csv", participants[regType])
        })
	//zip.file("all.csv", )
	//To add more files:
	//zip.file(name,content)
    res.setHeader("Content-Type", "application/zip")
    zip.writeToResponse(res,'IoTWeekDb.zip')
})

const server = app.listen(6969, () => {
  let host = server.address().address
  let port = server.address().port
  console.log("Search server running at http://%s:%s", host, port)
})
