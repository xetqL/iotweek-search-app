const fs = require('fs')
const csv = require('csvtojson')

const readCsvData = (csvFilePath, onFinished, ignoreFirsts=8) => {
    let json = []
    fs.readFile(csvFilePath, (err, content) => {
        let lines = content.toString().split(/\r|\n/)
        lines.splice(0, ignoreFirsts)
        let filteredContent = lines.join('\n')
        csv({delimiter: "auto"}).fromString(filteredContent)
        .on('json',(jsonObj)=>{
            json.push(jsonObj)              
        })
        .on('done',(error)=>{
            onFinished(json)
        })
    })
}



let csvData = {}
let initialized = false
let verbose = false
//Keys : guests, iotweek, giots
exports.init = (locations,delay) => {
    if(initialized)
        return
    initialized = true
    const f = () => {
        Object.keys(locations).forEach(key => {
            if(!locations[key])
                return
            readCsvData(locations[key], (result) => {
                csvData[key] = result
                if(verbose)
                    console.log("Registration data reloaded from disk (every "+delay+" ms")
            },(key==="iotweek" ? 8 : 0))
        })
        setTimeout(f, delay)
    }
    f()
    return {verbose: () => {verbose = true}}
}

exports.csvData = (key) => {
    if(initialized)
        return csvData[key]
    else
        throw {name: "NotInitialized",message: "Csv data reader was never initialized, use init(path,delay) before.", toString : function() {return "ERROR: "+this.name+" : "+this.message}}
}

exports.readCsvData = readCsvData


