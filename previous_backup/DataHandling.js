const ITEM = "/Measurement";
const MODEL= "/measurement";
const STORED_AT = "/storedAt";
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

const temperatureIcon = "\e008";
const pressureIcon = "";
const vibrationIcon = "";
const humidityIcon = "";
const cloggedIcon = "";

//const JSON_FAKE_MODEL = "{\"TEMPERATURE\":[{\"storedAt\":\"2016-09-13 15:53:37.565\",\"value\":49.70450008082865},{\"storedAt\":\"2016-09-13 15:54:22.239\",\"value\":46.761483011614246},{\"storedAt\":\"2016-09-13 15:54:31.304\",\"value\":49.602693307494846}],\"PRESSURE1\":[{\"storedAt\":\"2016-09-13 15:53:37.565\",\"value\":115.29260642561148},{\"storedAt\":\"2016-09-13 15:54:22.239\",\"value\":115.09299407897575},{\"storedAt\":\"2016-09-13 15:54:31.304\",\"value\":118.88586932476329}],\"PRESSURE2\":[{\"storedAt\":\"2016-09-13 15:53:37.565\",\"value\":44.75406852678511},{\"storedAt\":\"2016-09-13 15:54:22.239\",\"value\":47.48943423965213},{\"storedAt\":\"2016-09-13 15:54:31.304\",\"value\":43.692587028152936}],\"VIBRATION\":[{\"storedAt\":\"2016-09-13 15:53:37.565\",\"value\":0},{\"storedAt\":\"2016-09-13 15:54:22.239\",\"value\":0},{\"storedAt\":\"2016-09-13 15:54:31.304\",\"value\":0}],\"HUMIDITY\":[{\"storedAt\":\"2016-09-13 15:53:37.565\",\"value\":6},{\"storedAt\":\"2016-09-13 15:54:22.239\",\"value\":2},{\"storedAt\":\"2016-09-13 15:54:31.304\",\"value\":3}],\"CLOGGED\":[{\"storedAt\":\"2016-09-13 15:53:37.565\",\"value\":1},{\"storedAt\":\"2016-09-13 15:54:22.239\",\"value\":3},{\"storedAt\":\"2016-09-13 15:54:31.304\",\"value\":0}]}";
const JSON_FAKE_MODEL = "{\"level0\":{\"level1\":[{\"storedAt\":\"2016-09-13 15:53:37.565\",\"tvalue\":49.70450008082865,\"p1value\":115.29260642561148,\"p2value\":44.75406852678511,\"vvalue\":0,\"hvalue\":6,\"cvalue\":1},{\"storedAt\":\"2016-09-13 15:54:22.239\",\"value\":46.761483011614246,\"p1value\":115.09299407897575,\"p2value\":47.48943423965213,\"vvalue\":0,\"hvalue\":2,\"cvalue\":2},{\"storedAt\":\"2016-09-13 15:54:31.304\",\"value\":49.602693307494846,\"p1value\":118.88586932476329,\"p2value\":43.692587028152936,\"vvalue\":0,\"hvalue\":3,\"cvalue\":3}]}}";

/*-- ###################################################### --*/
/*-- UTILITY functions										--*/
/*-- ###################################################### --*/
//Adding custom icons
/*sap.ui.getCore().attachInit(function () {
  //sap.ui.core.IconPool.addIcon(iconName, collectionName, fontfamily, content)//icon definition 
	sap.ui.core.IconPool.addIcon('icon-humidity', 'custom-icons', 'custom-icons', '\ci001'); //adding new icon
	sap.ui.core.IconPool.addIcon('icon-pressure', 'custom-icons', 'custom-icons', '\ci002'); //adding new icon
	sap.ui.core.IconPool.addIcon('icon-vibration', 'custom-icons', 'custom-icons', '\ci003'); //adding new icon
	sap.ui.core.IconPool.addIcon('icon-temperature', 'custom-icons', 'custom-icons', '\ci004'); //adding new icon
	sap.ui.core.IconPool.addIcon('icon-filter', 'custom-icons', 'custom-icons', '\ci005'); //adding new icon
})  */

/*var truncateDouble = function(value, decimals) {
	truncated = Number(Math.round(value + 'e'+decimals) + 'e-'+decimals);
	return truncated
};*/
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

var buildChartPage = function(id, oModel, app, path, chart) {
	var chartPage = new sap.m.Page(id , {
		showNavButton: true, navButtonPress: function(){app.back();},
		content : [chart]
	});	
	chartPage.setModel(oModel);
	
	chartPage.bindProperty("title", path);

	return chartPage;
};

/*-- Functions for creating the SENSOR TILES of the app --*/
var buildTemperatureTileToChart = function(app, oModel, path){
	var tile = new sap.m.StandardTile("TemperatureSensorTile", {
		infoState : "Success",
		icon : sap.ui.core.IconPool.getIconURI(temperatureIcon),
		title: "Temperature",
		press : function(oEvent) { app.to("Temperature_detail_chart");},
		tap   : function(oEvent) { app.to("Temperature_detail_chart");}
	});
	tile.setModel(oModel);

	// All the bindings
	//tile.bindProperty("title", "Temperature");
	tile.bindProperty("number", path + TEMPERATURE, function(bValue) {
		truncated = Math.round(bValue*10000)/10000 + "\u00b0";
		return truncated;
	});
	tile.bindProperty("numberUnit", path + TEMPERATURE_UNIT);
	
	return tile;
}

var buildPressureTileToChart = function(app, oModel, path, sensorNum){
	var sensor = "/pressure"+sensorNum;
	
	var tile = new sap.m.StandardTile("Pressure"+sensorNum+"SensorTile", {
		infoState : "Success",
		title: "Pressure"+sensorNum,
		icon : sap.ui.core.IconPool.getIconURI(pressureIcon),
		press : function(oEvent) { app.to("Pressure"+sensorNum+"_detail_chart");},
		tap   : function(oEvent) { app.to("Pressure"+sensorNum+"_detail_chart");}
	});
	tile.setModel(oModel);

	// All the bindings
	//tile.bindProperty("title", "Pressure"+sensorNum);
	tile.bindProperty("number", path + sensor , function(bValue) {
		truncated = Math.round(bValue*10000)/10000;
		return truncated;
	});
	tile.bindProperty("numberUnit", path + PRESSURE_UNIT);
	
	return tile;
}

var buildVibrationTileToChart = function(app, oModel, path){
	var tile = new sap.m.StandardTile("VibrationSensorTile", {
		infoState : "Success",
		title: "Vibration",
		icon : sap.ui.core.IconPool.getIconURI(vibrationIcon),
		press : function(oEvent) { app.to("Vibration_detail_chart");},
		tap   : function(oEvent) { app.to("Vibration_detail_chart");}
	});
	tile.setModel(oModel);

	// All the bindings
	//tile.bindProperty("title", "Vibration");
	tile.bindProperty("number", path + VIBRATION);
	tile.bindProperty("numberUnit", path + VIBRATION_UNIT);
	
	return tile;
}

var buildHumidityTileToChart = function(app, oModel, path){
	var tile = new sap.m.StandardTile("HumiditySensorTile", {
		infoState : "Success",
		title: "Humidity",
		icon : sap.ui.core.IconPool.getIconURI(humidityIcon),
		press : function(oEvent) { app.to("Humidity_detail_chart");},
		tap   : function(oEvent) { app.to("Humidity_detail_chart");}
	});
	tile.setModel(oModel);

	// All the bindings
	//tile.bindProperty("title", "Humidity");
	tile.bindProperty("number", path + HUMIDITY);
	tile.bindProperty("numberUnit", path + HUMIDITY_UNIT);
	
	return tile;
}

var buildCloggedTileToChart = function(app, oModel, path){
	var tile = new sap.m.StandardTile("FilterSensorTile", {
		infoState : "Success",
		title: "Filter",
		icon : sap.ui.core.IconPool.getIconURI(humidityIcon),
		press : function(oEvent) { app.to("Filter_detail_chart");},
		tap   : function(oEvent) { app.to("Filter_detail_chart");}
	});
	tile.setModel(oModel);

	// All the bindings
	//tile.bindProperty("title", "Filter");
	tile.bindProperty("number", path + CLOGGED);

	return tile;
}

/*-- Function for creating the TEMPERATURE CHARTS OF A SENSOR --*/
var getChartForMetric = function(id, model, measurementType, minValue, maxValue){
	var oChart = new sap.makit.Chart(id, {
		height: "90%",
		width : "100%",
		type: sap.makit.ChartType.Line,
		category : new sap.makit.Category({ column : "storedAt" }),
		categoryAxis : new sap.makit.CategoryAxis({ displayLastLabel: false}),
		valueAxis    : new sap.makit.ValueAxis({  min:minValue, max:maxValue}),
		values       : [new sap.makit.Value({ expression : measurementType, displayName : measurementType})]
 	});
 	
	oChart.addColumn(new sap.makit.Column({name:"storedAt", value:"{storedAt}"}));
	oChart.addColumn(new sap.makit.Column({name: measurementType, value:"{tvalue}", type:"number"}));
	oChart.setModel(model);
	var bindingName = "/"+measurementType;
	oChart.bindRows("/level0/level1");
 	
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
	
	//debugger;
	
	jQuery.sap.require("sap.ui.core.IconPool");
	jQuery.sap.require("sap.ui.core.Icon");
	jQuery.sap.declare("sap.ui.customized.FontIconContainer");

	var idPageMain = "main";
	var app = new sap.m.App("myApp", {
		initialPage : idPageMain
	}); 

	
	// Now create the page and place it into the HTML document
	var mainPage = buildMainPage(idPageMain, "Preditive IoT Data Sensor Dashboard");
	
	var appLink = window.location.href;
	var oModelSensorData = getModelFromURL(MODEL);
	
	var measurements = oModelSensorData.getData();
	var measurementsLength = Object.keys( measurements ).length-1;
	
	var fakeJsonModel = new sap.ui.model.json.JSONModel();
	fakeJsonModel.setData(JSON_FAKE_MODEL);

	debugger;
	//getSensorMeasurement(MODEL, "temperature", measurements);

	//for (var measurementNumber = 0; measurements.hasOwnProperty('Measurement'+measurementNumber); measurementNumber++){
		//Temperature tile
		//var path = "/Measurement"+measurementNumber;
		var path = "/Measurement"+measurementsLength;
		var sensorTile = buildTemperatureTileToChart(app, oModelSensorData, path);
	 	var chart_sensor = getChartForMetric("Temperature_chart", fakeJsonModel, "TEMPERATURE", "","");
		var detail_chart_sensor = buildChartPage("Temperature_detail_chart", fakeJsonModel, app, "TEMPERATURE", chart_sensor);
	
		mainPage.addContent(sensorTile);
		app.addPage(detail_chart_sensor);
		
		sensorTile = buildPressureTileToChart(app, oModelSensorData, path, 1);
		mainPage.addContent(sensorTile);
		
		sensorTile = buildPressureTileToChart(app, oModelSensorData, path, 2);
		mainPage.addContent(sensorTile);
		
		sensorTile = buildVibrationTileToChart(app, oModelSensorData, path);
		mainPage.addContent(sensorTile);
		
		sensorTile = buildHumidityTileToChart(app, oModelSensorData, path);
		mainPage.addContent(sensorTile);
		
		sensorTile = buildCloggedTileToChart(app, oModelSensorData, path);
		mainPage.addContent(sensorTile);
		
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