const fs = require('fs')
const csv = require('csvtojson')

//Deprecated
function csv_into_dictionnary_deprecated(filename, separator=';', ignoreFirsts=1){
    let lines    = fs.readFileSync(filename, 'utf8').toString().split('\n');
    let elements = lines.filter(line => { return line != ''}).map(line => { return line.split(separator) });
    elements.splice(0, ignoreFirsts)
    let header  = elements.shift();
    jsonArray = [];
    console.log(header)
    var participantId = 0;
    elements = elements.map( p => {
        var zipped = header.map(function (e, i) {
            return [e, p[i]];
        }); 
        return zipped
    })
    elements.forEach(participantData => {
        jsonArray[participantId] = {};
        participantData.forEach( headerAndData => {
            jsonArray[participantId][headerAndData[0]] = headerAndData[1]
        })
        participantId++;
    })
    return jsonArray

}

const readCsvData = (csvFilePath, onFinished) => {
    let json = []
    csv({delimiter: "auto"}).fromFile(csvFilePath)
    .on('json',(jsonObj)=>{
        json.push(jsonObj)              
    })
    .on('done',(error)=>{
        onFinished(json)
    })
}



let csvData = {}
let initialized = false
let verbose = false
exports.init = (location,delay) => {
    if(initialized)
        return
    initialized = true
    const f = () => {
        readCsvData(location, (result) => {
            csvData = result
            if(verbose)
                console.log("Pricing data reloaded from disk (every "+delay+" ms")
        })
        setTimeout(f, delay)
    }
    f()
    return {verbose: () => {verbose = true}}
}

exports.csvData = () => {
    if(initialized)
        return csvData
    else
        throw {name: "NotInitialized",message: "Csv data reader was never initialized, use init(path,delay) before.", toString : function() {return "ERROR: "+this.name+" : "+this.message}}
}




