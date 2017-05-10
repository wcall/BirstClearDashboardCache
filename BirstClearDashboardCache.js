/**
 * Created by gjakobson on 2/29/16.
 * Revised by wcall on 5/10/17 and repurposed for clearing all dashboard cache across SDE, Stage and RC.
 */

var wsUrl;
var soapRequest ;
var Token;
var SpaceID;
var totalQueries;
var progress=0;
var QUERY;
var totalQueries;
var QueryCounter=0;


function doLogin(){
    $("#Token").val('Pending......')
    wsUrl = $("#server").val();
    soapRequest = '<?xml version="1.0" encoding="utf-8"?><soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:bir="http://www.birst.com/"><soapenv:Header/><soapenv:Body><bir:Login><bir:username>' + $("#uid").val() + '</bir:username><bir:password>' + $("#pwd").val() + '</bir:password></bir:Login></soapenv:Body></soapenv:Envelope>';
    SpaceID = $("#spaceID").val();

    $.ajax({
        type: "POST",
        url: wsUrl,
        contentType: "text/xml",
        headers: {
            xmlns: SOAPAction = 'http://www.birst.com/Login'
        },
        dataType: "xml",
        data: soapRequest,
        success: processSuccessLogin,
        error: processError
    });
}

function processClearDashboardCache(){

    var soapRequest = '<?xml version="1.0" encoding="utf-8"?><soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:bir="http://www.birst.com/"><soapenv:Header/><soapenv:Body><bir:clearDashboardCache><bir:token>' + Token + '</bir:token><<bir:spaceID>' + SpaceID + '</bir:spaceID></bir:clearDashboardCache></soapenv:Body></soapenv:Envelope>'

    $.ajax({
        type: "POST",
        url: wsUrl,
        contentType: "text/xml",
        headers: {
            xmlns: SOAPAction = 'http://www.birst.com/clearDashboardCache'
        },
        dataType: "xml",
        data: soapRequest,
        success: showResult,
        error: showResult
    });
}


function processSuccessLogin(data, status, req) {
    if (status == "success") {



        if ($(req.responseXML).find("faultstring").text()) {
            Token = $(req.responseXML).find("faultstring").text();
        } else
        {
            Token = $(req.responseXML).find("LoginResult").text();
        }


        $("#Token").val(Token);

    }
}

function processQueries(){
    //parse through queries in the Queries text box and pass each to executeQuery()
    var queries=$("#Queries").val();


    QUERY  = queries.split(";;");

    $("#Results").val();

    totalQueries = QUERY.length;

    console.log(QUERY)

//    for (var i=0; i<totalQueries; i++){
//
//        if (QUERY[i] > '   ') {
//
//            var text = $("#Results").val();
//
//            text = text + "\n" + (i+1) + ") executing: " + QUERY[i] + "\n";
//
//
            executeQuery(QUERY[QueryCounter]);
//
//            $("#Results").val(text);
//        }
//
//    }

}

function executeQuery(){

    BQL=QUERY[QueryCounter];


    BQL=BQL.replace(";;",""); // strip semicolons
    BQL=BQL.replace(/</g,"&lt;"); // replace less than
    BQL=BQL.replace(/>/g,"&gt;"); // replace less than

    console.log ("submitting: "+ BQL)


    var text = $("#Results").val();

    text = text + "\n" + (QueryCounter+1) + ") executing: " + QUERY[QueryCounter] + "\n";

    var soapRequest = '<?xml version="1.0" encoding="utf-8"?><soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:bir="http://www.birst.com/"><soapenv:Header/><soapenv:Body><bir:executeQueryInSpace><bir:token>' + Token + '</bir:token><bir:query>' + BQL + '</bir:query><bir:spaceID>' + SpaceID + '</bir:spaceID></bir:executeQueryInSpace></soapenv:Body></soapenv:Envelope>'

    $.ajax({
        type: "POST",
        url: wsUrl,
        contentType: "text/xml",
        headers: {
            xmlns: SOAPAction = 'http://www.birst.com/executeQueryInSpace'
        },
        dataType: "xml",
        data: soapRequest,
        success: showResult,
        error: showResult
    });
}

function processError(x, y, z){
    $("#Token").val("Error: "+ x.status);
}


function showResult(data, status, req) {

        var text = $("#Results").val();
        text = text + "\n Response: " + req.responseText.substring(0,400) + "...\n\n";

    $("#Results").val(text);

//uptickProgress();
 }

function uptickProgress(){
    progress=QueryCounter *100 /totalQueries
    $("#progress").css("width",progress+ "%" )
}