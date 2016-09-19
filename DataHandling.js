const ITEM = "/Measurement";
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


/*-- ###################################################### --*/
/*-- DATA MODEL functions									--*/
/*-- ###################################################### --*/

var getModelFromURL = function(url) {
	var url = url;
	var oModel = new sap.ui.model.json.JSONModel();
	oModel.loadData(url, null, false);
	return oModel;
};

function updateDataModel(model){
	model.refresh();
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
var buildTemperatureTileToChart = function(app, oModel, path){
	
	debugger;
	
	var tile = new sap.m.StandardTile("TemperatureSensorTile", {
		//numberUnit : oModel.getProperty(ITEM + measurementNumber + TEMPERATURE_UNIT),
		infoState : "Success",
		icon : sap.ui.core.IconPool.getIconURI("Temperature"),
		//press : function(oEvent) { app.to(iconName.replace(/"([^"]+(?="))"/g, '$1') + "_detailPageChart_sensor");},
		//tap   : function(oEvent) { app.to(iconName.replace(/"([^"]+(?="))"/g, '$1') + "_detailPageChart_sensor");}
	});
	tile.setModel(oModel);

	// All the bindings
	tile.bindProperty("title", "Temperature");
	//tile.bindProperty("info", "Last measured temperature");
	tile.bindProperty("number", path + TEMPERATURE);
	tile.bindProperty("numberUnit", path + TEMPERATURE_UNIT);
	
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


/*-- Function for creating the TEMPERATURE CHARTS OF A SENSOR --*/
var getChartForMetric = function(id, model, measurementType, bindingName, minValue, maxValue){

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
	
	console.log("entered main function...");
	
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
	
	var measurements = oModelSensorData.getData();
	var measurementsLength = Object.keys( measurements ).length-1;

	//for (var measurementNumber = 0; measurements.hasOwnProperty('Measurement'+measurementNumber); measurementNumber++){
		//Temperature tile
		//var path = "/Measurement"+measurementNumber;
		var path = "/Measurement"+measurementsLength;
		var sensorTile = buildTemperatureTileToChart(app, oModelSensorData, path);
	 	//var chart_sensor = getChartForMetric("temperature_chart_sensor" + sensorNumber, oModelSensorData, "temperature", MODEL +  sensorNumber + "/measurements", "","");
		//var detailPageChart_sensor = buildChartPage("temperature_detailPageChart_sensor" + sensorNumber,oModelSensorData, app, sensorNumber ,chart_sensor);
	
		mainPage.addContent(sensorTile);
		//app.addPage(detailPageChart_sensor);
		
		//Humidity tile
		//var sensorTile = buildSensorTileToChart(app, oModelSensorData, sensorNumber , "humidity");
	 	//var chart_sensor = getChartForMetric("humidity_chart_sensor" + sensorNumber, oModelSensorData, "humidity", MODEL +  sensorNumber + "/measurements", "","");
		//var detailPageChart_sensor = buildChartPage("humidity_detailPageChart_sensor" + sensorNumber,oModelSensorData, app, sensorNumber ,chart_sensor);
	
		//mainPage.addContent(sensorTile);
		//app.addPage(detailPageChart_sensor);
	//}

	app.addPage(mainPage);
	app.setBackgroundImage("images/sidi.jpg");
	app.setBackgroundRepeat(true);
	app.placeAt("content");

	//Update the values in the tiles and charts every x ms
	/*var updateInMilliseconds = 2000;
	setInterval(function() {
		var oModelSensorData = getModelFromURL(MODEL);
		updateDataModel(oModelSensorData);

		var measurements = oModelSensorData.getData();
		for (var sensorNumber = 0; sensors.hasOwnProperty('sensor'+sensorNumber); sensorNumber++){
			updateModelOfUiObject("temperatureSensorTile" + sensorNumber,oModelSensorData);
			updateModelOfUiObject("temperature_chart_sensor" + sensorNumber,oModelSensorData);
			
			updateModelOfUiObject("humiditySensorTile" + sensorNumber,oModelSensorData);
			updateModelOfUiObject("humidity_chart_sensor" + sensorNumber,oModelSensorData);
		}
				
	}, updateInMilliseconds);*/
}