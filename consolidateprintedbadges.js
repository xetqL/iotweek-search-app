'use strict'
const fs = require('fs')
const {readCsvData} = require('./csvsearch.js')
const fuseData = (location,onFinished) =>{
	fs.readdir(location, (err, filenames) => {
		if (err)
			throw err
		let counter = 0
		let data = {}

		filenames.forEach( filename => {
			readCsvData(location+"/"+filename,(result) => {
				data[filename.split(".")[0]] = result
				counter++
				if(counter === filenames.length)
					onFinished(data)
			},0)
		})
	})
}

const finalize = (data) => {
	let finalData = "firstName;lastName;Company;badgeType\n"
	Object.keys(data).forEach((key) => {
		data[key].forEach((entry) => {
			finalData += entry.participantFirstName+";"+entry.participantLastName+";"+(entry.participantCompany ? entry.participantCompany : "")+";"+key+"\n"
		})
	})

	fs.writeFile("/Users/olivierbelli/Dropbox/Assistant HEPIA/IoT Week/iotweek-search-app/fulllist.csv", finalData, function(err) {
	    if(err) 
	        return console.log(err)
	    console.log("The file was saved!")
	}) 
}

fuseData('/Users/olivierbelli/Desktop/IoTWeekDb-2',finalize)