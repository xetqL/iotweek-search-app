function createRequest() {
    var result = null;
    if (window.XMLHttpRequest) {
        result = new XMLHttpRequest()
    }
    else {
        alert("Ajax not available !")
    }
    return result
}

function emptyObject(obj){
    return Object.keys(obj).length === 0 && obj.constructor === Object
}

function sendRequest(url,method,header,params,callback){
    var req = createRequest()
    req.onerror = function(r){callback("error",undefined)}
    req.onreadystatechange = function(){
        if(req.readyState === 4){
            var data = req.responseText;
            callback(req.status,req.status === 200 ? JSON.parse(data) : data)
        }
    }
    req.open(method,url,true)
    header.forEach(function(h){
        req.setRequestHeader(h[0],h[1])
    })
    if(!emptyObject(params)){
        req.setRequestHeader("Content-type","application/json")
        req.send(JSON.stringify(params))
    }else{
        req.send()
    }
}
var restclient = {
    
    get: function(url,params,header){
        return {then: function(f){
            sendRequest(url,"get",header ? header : [], params ? params : {},f)
            }
        }
    },
    post: function(url,params,header){
        return {then: function(f){
            sendRequest(url,"post",header ? header : [], params ? params : {},f)
            }
        }
    }

}