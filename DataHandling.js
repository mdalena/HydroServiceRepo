const MODEL = "/measurement";
const STORED_AT = "";
const TEMPERATURE = "/temperature";
const PRESSURE_1 = "/pressure1";
const PRESSURE_2 = "/pressure2";
const VIBRATION = "/vibration";
const HUMIDITY = "/humidity";
const CLOGGED = "/clogged";
const TEMPERATURE_UNIT = "/temperatureUnit";
const HUMIDITY_UNIT = "/humidityUnit";
const PRESSURE_UNIT = "/pressureUnit";
const VIBRATION_UNIT = "/vibrationUnit";

/*-- ###################################################### --*/
/*-- UTILITY functions										--*/
/*-- ###################################################### --*/
function strcmp ( str1, str2 ) {
    // http://kevin.vanzonneveld.net
    // +   original by: Waldo Malqui Silva
    // +      input by: Steve Hilder
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +    revised by: gorthaur
    // *     example 1: strcmp( 'waldo', 'owald' );
    // *     returns 1: 1
    // *     example 2: strcmp( 'owald', 'waldo' );
    // *     returns 2: -1

    return ( ( str1 == str2 ) ? 0 : ( ( str1 > str2 ) ? 1 : -1 ) );
}

function strcmp2 ( str1, str2 ) {
    // http://kevin.vanzonneveld.net
    // +   original by: Waldo Malqui Silva
    // +      input by: Steve Hilder
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +    revised by: gorthaur
    // *     example 1: strcmp( 'waldo', 'owald' );
    // *     returns 1: 1
    // *     example 2: strcmp( 'owald', 'waldo' );
    // *     returns 2: -1

    return ( ( str1 == str2 ) ? true : false );
}

/*-- ###################################################### --*/
/*-- DATA MODEL functions									--*/
/*-- ###################################################### --*/

var getModelFromURL = function(url) {
	
	debugger;
	
	var url = url;
	var oModel = new sap.ui.model.json.JSONModel();
	oModel.loadData(url, null, false);
	return oModel;
};

function updateDataModel(model){
	model.refresh();
}

/**
 * @param serverData {object} raw response from server; see above
 */
function measurementData(serverData) {
    this.conditions = serverData.criteria.category;
    this.makes = serverData.criteria.make;
    this.models = serverData.criteria.model;
    this.years = serverData.criteria.year;
    
}

/*-- ###################################################### --*/
/*-- All VIEWS												--*/
/*-- ###################################################### --*/
/*-- Functions for the MAIN PAGE of the app --*/

var buildMainPage = function(id, title) {
	var page = new sap.m.Page(id, {
		title : title,
		showNavButton : false
	});

	return page;
};

var buildChartPage = function(id, oModel, app, chart) {

	var chartPage = new sap.m.Page(id , {
		showNavButton: true, navButtonPress: function(){app.back();},
		content : [chart]
	});	
	chartPage.setModel(oModel);
	
	chartPage.bindProperty("title", MODEL);

	return chartPage;
};


/*-- Functions for creating the SENSOR TILES of the app --*/
var buildTemperatureTileToChart = function(app, oModel){
	debugger;
	
	var tile = new sap.m.StandardTile("Temperature" + "SensorTile", {
		numberUnit : oModel.getProperty(MODEL+TEMPERATURE_UNIT);,
		infoState : "Success",
		icon : sap.ui.core.IconPool.getIconURI("Temperature"),
		press : function(oEvent) { app.to(iconName.replace(/"([^"]+(?="))"/g, '$1') + "_detailPageChart_sensor");},
		tap   : function(oEvent) { app.to(iconName.replace(/"([^"]+(?="))"/g, '$1') + "_detailPageChart_sensor");}
	});
	tile.setModel(oModel);

	// All the bindings
	tile.bindProperty("title", "Temperature");
	tile.bindProperty("info", "Last measured temperature");
	tile.bindProperty("number", MODEL + TEMPERATURE + "Temperature")
	
	return tile;
}

var buildPressureTileToChart = function(app, oModel){
	
}

var buildVibrationTileToChart = function(app, oModel){
	
}

var buildHumidityTileToChart = function(app, oModel){
	
}

var buildCloggedTileToChart = function(app, oModel){
	
}

var buildSensorTileToChart = function(app, oModel, iconName) {

	debugger;
	
	var numUnit = "";
	
	if(strcmp2("temperature", iconName.replace(/"([^"]+(?="))"/g, '$1'))){
		numUnit = oModel.getProperty(MODEL+TEMPERATURE_UNIT);
	}else if(strcmp2("pressure", iconName.replace(/"([^"]+(?="))"/g, '$1'))){
		numUnit = oModel.getProperty(MODEL+PRESSURE_UNIT);
	}else if(strcmp2("vibration", iconName.replace(/"([^"]+(?="))"/g, '$1'))){
		numUnit = oModel.getProperty(MODEL+VIBRATION_UNIT);
	}else if(strcmp2("humidity", iconName.replace(/"([^"]+(?="))"/g, '$1'))){
		numUnit = oModel.getProperty(MODEL+HUMIDITY_UNIT);
	}else{
		console.log("ERROR - unit measurement not found");
		numUnit = "";
	}
	
	var tile = new sap.m.StandardTile(iconName.replace(/"([^"]+(?="))"/g, '$1') + "SensorTile", {
		numberUnit : numUnit,
		infoState : "Success",
		icon : sap.ui.core.IconPool.getIconURI(iconName),
		press : function(oEvent) { app.to(iconName.replace(/"([^"]+(?="))"/g, '$1') + "_detailPageChart_sensor");},
		tap   : function(oEvent) { app.to(iconName.replace(/"([^"]+(?="))"/g, '$1') + "_detailPageChart_sensor");}
	});
	tile.setModel(oModel);

	// All the bindings
	tile.bindProperty("title", MODEL +  + "/description");
	tile.bindProperty("info", MODEL + sensorNumber + "/device");
	tile.bindProperty("number", MODEL + sensorNumber + "/lastMeasurement/" + iconName.replace(/"([^"]+(?="))"/g, '$1'), function(bValue) {
		returnVal = Math.round(bValue * 10) / 10 ;
		
		if(strcmp2("temperature", iconName.replace(/"([^"]+(?="))"/g, '$1'))){
			returnVal = returnVal + "\u00b0";
		}else{
			
		}
		
		return returnVal;
	});
	return tile;

};

var buildStandaloneSensorTile = function(oModel, sensorNumber, sensorId, measurementType){

	debugger;
	
	var numUnit = "";
	
	if(strcmp2("temperature", iconName.replace(/"([^"]+(?="))"/g, '$1'))){
		numUnit = "Celsius";
	}else{
		numUnit = "Percentage";
	}
	
	var tile = new sap.m.StandardTile("myStandaloneSensorTile" + sensorNumber, {
		numberUnit : numUnit,
		infoState : "Success",
		icon : sap.ui.core.IconPool.getIconURI(measurementType),
		tap : function() {
			sendSensorValue(sensorNumber, sensorId);
		},
		press : function() {
			sendSensorValue(sensorNumber, sensorId);
		}
		
	});
	tile.setModel(oModel);

	// All the bindings
	tile.bindProperty("title", MODEL + sensorNumber + "/description");
	tile.bindProperty("info", MODEL + sensorNumber + "/device");
	tile.bindProperty("number", MODEL + sensorNumber + "/lastMeasurement/" + measurementType.replace(/"([^"]+(?="))"/g, '$1'), function(bValue) {
		returnVal = Math.round(bValue * 10) / 10 ;
		
		if(strcmp2("temperature", iconName.replace(/"([^"]+(?="))"/g, '$1'))){
			returnVal = returnVal + "\u00b0";
		}else{
			
		}
		
		return returnVal;
	});
	return tile;
	
};


/*-- Function for creating the TEMPERATURE CHARTS OF A SENSOR --*/
var getChartForMetric = function(id, model, measurementType, bindingName, minValue, maxValue){

	debugger;
	
	var oChart = new sap.makit.Chart(id, {
     height: "90%",
     width : "100%",
     type: sap.makit.ChartType.Line,
     category : new sap.makit.Category({ column : "storedAt" }),
     categoryAxis : new sap.makit.CategoryAxis({ displayLastLabel: false}),
     valueAxis    : new sap.makit.ValueAxis({  min:minValue, max:maxValue}),
     values       :  [new sap.makit.Value({ expression : measurementType, displayName : measurementType + "sensor"})]
 	});
 	
 	 oChart.addColumn(new sap.makit.Column({name:"storedAt", value:"{storedAt}"}));
     oChart.addColumn(new sap.makit.Column({name: measurementType, value:"{" + measurementType.replace(/"([^"]+(?="))"/g, '$1') + "}", type:"number"}));
     oChart.setModel(model);
     oChart.bindRows(bindingName);
 	
 	return oChart;
};	


/*-- Function to update the model of an UI object --*/

var updateModelOfUiObject = function(id, model){
	var object = sap.ui.getCore().getElementById(id);
	object.setModel(model);

};

/*-- ###################################################### --*/
/*-- THE MAIN APP											--*/
/*-- ###################################################### --*/
function mainFunction(){
	jQuery.sap.require("sap.ui.core.IconPool");
	jQuery.sap.require("sap.ui.core.Icon");
	jQuery.sap.declare("sap.ui.customized.FontIconContainer");

	var idPageMain = "main";
	var app = new sap.m.App("myApp", {
		initialPage : idPageMain
	}); 

	
	// Now create the page and place it into the HTML document
	var mainPage = buildMainPage(idPageMain, "Hydroservice Data Sensor Dashboard");
	
	var appLink = window.location.href;
	var oModelSensorData = getModelFromURL(MODEL);

	debugger;
	
	
	var sensors = oModelSensorData.getData();
	
	//Temperature tile
	var sensorTile = buildTemperatureTileToChart(app, oModelSensorData);
 	//var chart_sensor = getChartForMetric("temperature_chart_sensor" + sensorNumber, oModelSensorData, "temperature", MODEL +  sensorNumber + "/measurements", "","");
	//var detailPageChart_sensor = buildChartPage("temperature_detailPageChart_sensor" + sensorNumber,oModelSensorData, app, sensorNumber ,chart_sensor);

	mainPage.addContent(sensorTile);
	app.addPage(detailPageChart_sensor);
	
	//Humidity tile
	//var sensorTile = buildSensorTileToChart(app, oModelSensorData, sensorNumber , "humidity");
 	//var chart_sensor = getChartForMetric("humidity_chart_sensor" + sensorNumber, oModelSensorData, "humidity", MODEL +  sensorNumber + "/measurements", "","");
	//var detailPageChart_sensor = buildChartPage("humidity_detailPageChart_sensor" + sensorNumber,oModelSensorData, app, sensorNumber ,chart_sensor);

	//mainPage.addContent(sensorTile);
	//app.addPage(detailPageChart_sensor);

	
	app.addPage(mainPage);
	app.setBackgroundImage("images/sidi.jpg");
	app.setBackgroundRepeat(true);
	app.placeAt("content");

	//Update the values in the tiles and charts every x ms
	var updateInMilliseconds = 2000;
	setInterval(function() {
		var oModelSensorData = getModelFromURL("/sensordata");
		updateDataModel(oModelSensorData);

		var sensors = oModelSensorData.getData();
		for (var sensorNumber = 0; sensors.hasOwnProperty('sensor'+sensorNumber); sensorNumber++){
			updateModelOfUiObject("temperatureSensorTile" + sensorNumber,oModelSensorData);
			updateModelOfUiObject("temperature_chart_sensor" + sensorNumber,oModelSensorData);
			
			updateModelOfUiObject("humiditySensorTile" + sensorNumber,oModelSensorData);
			updateModelOfUiObject("humidity_chart_sensor" + sensorNumber,oModelSensorData);
		}
				
	}, updateInMilliseconds);
}