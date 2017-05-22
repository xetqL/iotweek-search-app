const fs = require('fs')
const csv = require('csvtojson')

function csv_to_dictionnary(filename){
    
}
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
const csvFilePath='test.csv'
let json = [];
csv().fromFile(csvFilePath)
.on('json',(jsonObj)=>{
    json.push(jsonObj)              
})
.on('done',(error)=>{
     console.log(json)
})
          
