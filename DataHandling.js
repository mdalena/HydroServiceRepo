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

var buildChartPage = function(id, oModel, app, sensorNumber, chart) {

	var chartPage = new sap.m.Page(id , {
		showNavButton: true, navButtonPress: function(){app.back();},
		content : [chart]
	});	
	chartPage.setModel(oModel);
	
	chartPage.bindProperty("title", "/sensor" + sensorNumber + "/description");

	return chartPage;
};


/*-- Functions for creating the SENSOR TILES of the app --*/

var buildSensorTileToChart = function(app, oModel, sensorNumber, iconName) {
	var numUnit = "";

	if(strcmp2("temperature", iconName.replace(/"([^"]+(?="))"/g, '$1'))){
		numUnit = "C";
	}else if(strcmp2("humidity", iconName.replace(/"([^"]+(?="))"/g, '$1'))){
		numUnit = "%";
	}else if(strcmp2("pressure1", iconName.replace(/"([^"]+(?="))"/g, '$1')) || strcmp2("pressure2", iconName.replace(/"([^"]+(?="))"/g, '$1'))){
		numUnit = "BAR";
	}else if(strcmp2("vibration", iconName.replace(/"([^"]+(?="))"/g, '$1'))){
		numUnit = "MMPS";
	}
	
	var tile = new sap.m.StandardTile(iconName.replace(/"([^"]+(?="))"/g, '$1') + "SensorTile" + sensorNumber, {
		numberUnit : numUnit,
		infoState : "Success",
		//icon : sap.ui.core.IconPool.getIconURI(iconName),
		title: iconName,
		press : function(oEvent) { app.to(iconName.replace(/"([^"]+(?="))"/g, '$1') + "_detailPageChart_sensor" + sensorNumber);},
		tap   : function(oEvent) { app.to(iconName.replace(/"([^"]+(?="))"/g, '$1') + "_detailPageChart_sensor" + sensorNumber);}
	});
	tile.setModel(oModel);

	// All the bindings
	//tile.bindProperty("title", "/sensor" + sensorNumber + "/description");
	//tile.bindProperty("info", "/sensor" + sensorNumber + "/device");
	tile.bindProperty("number", "/sensor" + sensorNumber + "/lastMeasurement/" + iconName.replace(/"([^"]+(?="))"/g, '$1'), function(bValue) {
		returnVal = Math.round(bValue * 1000) / 1000 ;
		
		if(strcmp2("temperature", iconName.replace(/"([^"]+(?="))"/g, '$1'))){
			returnVal = returnVal + "\u00b0";
		}else{
			
		}
		
		return returnVal;
	});
	return tile;

};

var buildStandaloneSensorTile = function(oModel, sensorNumber, sensorId, measurementType){
	var tile = new sap.m.StandardTile("myStandaloneSensorTile" + sensorNumber, {
		numberUnit : "Celsius",
		infoState : "Success",
		title: measurementType,
		//icon : sap.ui.core.IconPool.getIconURI(measurementType),
		tap : function() {
			sendSensorValue(sensorNumber, sensorId);
		},
		press : function() {
			sendSensorValue(sensorNumber, sensorId);
		}
		
	});
	tile.setModel(oModel);

	// All the bindings
	//tile.bindProperty("title", "/sensor" + sensorNumber + "/description");
	//tile.bindProperty("info", "/sensor" + sensorNumber + "/device");
	tile.bindProperty("number", "/sensor" + sensorNumber + "/lastMeasurement/" + measurementType.replace(/"([^"]+(?="))"/g, '$1'), function(bValue) {
		returnVal = Math.round(bValue * 1000) / 1000 ;
		return returnVal + "\u00b0";
	});
	return tile;
	
};

var buildInformationBox = function(oModel, measurementType){
	debugger;
	var oTable = new sap.ui.table.Table();
	
	// define the Table columns and the binding values
	oTable.addColumn(new sap.ui.table.Column({
		label: new sap.ui.commons.Label({text: "Measurement type"}), 
		template: new sap.ui.commons.TextView({text:measurementType})
	}));
	
	oTable.addColumn(new sap.ui.table.Column({
		label: new sap.ui.commons.Label({text: "Date"}), 
		template: new sap.ui.commons.TextField({value: "Sep 1, 2016 10:50:58"})
	}));
	oTable.setModel(oModel);
	oTable.placeAt("myApp");

};

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

var checkValue = function(value){
	var check = false;
	if(value > 180){
		check = true;
	}
	return check;
};

/*-- ###################################################### --*/
/*-- THE MAIN APP											--*/
/*-- ###################################################### --*/
function mainFunction(){
	
	debugger;
	
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
	var oModelSensorData = getModelFromURL("/sensordata");

	
	var tileContainer = new sap.m.TileContainer({});
	var emptyContainer = new sap.m.TileContainer({});
	
	var sensors = oModelSensorData.getData();
	for (var sensorNumber = 0; sensors.hasOwnProperty('sensor'+sensorNumber); sensorNumber++){
		//Temperature tile
		var sensorTile = buildSensorTileToChart(app, oModelSensorData, sensorNumber , "temperature");
	 	var chart_sensor = getChartForMetric("temperature_chart_sensor" + sensorNumber, oModelSensorData, "temperature", "/sensor" +  sensorNumber + "/measurements", "","");
		var detailPageChart_sensor = buildChartPage("temperature_detailPageChart_sensor" + sensorNumber,oModelSensorData, app, sensorNumber ,chart_sensor);

		//mainPage.addContent(sensorTile);
		tileContainer.addTile(sensorTile);
		app.addPage(detailPageChart_sensor);
		
		//Humidity tile
		var sensorTile = buildSensorTileToChart(app, oModelSensorData, sensorNumber , "humidity");
	 	var chart_sensor = getChartForMetric("humidity_chart_sensor" + sensorNumber, oModelSensorData, "humidity", "/sensor" +  sensorNumber + "/measurements", "","");
		var detailPageChart_sensor = buildChartPage("humidity_detailPageChart_sensor" + sensorNumber,oModelSensorData, app, sensorNumber ,chart_sensor);

		//mainPage.addContent(sensorTile);
		tileContainer.addTile(sensorTile);
		app.addPage(detailPageChart_sensor);
		
		//Pressure1 tiles
		var sensorTile = buildSensorTileToChart(app, oModelSensorData, sensorNumber , "pressure1");
	 	var chart_sensor = getChartForMetric("pressure1_chart_sensor" + sensorNumber, oModelSensorData, "pressure1", "/sensor" +  sensorNumber + "/measurements", "","");
		var detailPageChart_sensor = buildChartPage("pressure1_detailPageChart_sensor" + sensorNumber,oModelSensorData, app, sensorNumber ,chart_sensor);

		var alert = checkValue(sensorTile.getNumber());
		if(alert){
			sensorTile.addStyleClass("alert");
		}

		//mainPage.addContent(sensorTile);
		tileContainer.addTile(sensorTile);
		app.addPage(detailPageChart_sensor);
		
		//Pressure2 tiles
		var sensorTile = buildSensorTileToChart(app, oModelSensorData, sensorNumber , "pressure2");
	 	var chart_sensor = getChartForMetric("pressure2_chart_sensor" + sensorNumber, oModelSensorData, "pressure2", "/sensor" +  sensorNumber + "/measurements", "","");
		var detailPageChart_sensor = buildChartPage("pressure2_detailPageChart_sensor" + sensorNumber,oModelSensorData, app, sensorNumber ,chart_sensor);

		//mainPage.addContent(sensorTile);
		tileContainer.addTile(sensorTile);
		app.addPage(detailPageChart_sensor);
		
		//Vibration tiles
		var sensorTile = buildSensorTileToChart(app, oModelSensorData, sensorNumber , "vibration");
	 	var chart_sensor = getChartForMetric("vibration_chart_sensor" + sensorNumber, oModelSensorData, "vibration", "/sensor" +  sensorNumber + "/measurements", "","");
		var detailPageChart_sensor = buildChartPage("vibration_detailPageChart_sensor" + sensorNumber,oModelSensorData, app, sensorNumber ,chart_sensor);

		//mainPage.addContent(sensorTile);
		tileContainer.addTile(sensorTile);
		app.addPage(detailPageChart_sensor);
		
		//Clogged tiles
		var sensorTile = buildSensorTileToChart(app, oModelSensorData, sensorNumber , "clogged");
	 	var chart_sensor = getChartForMetric("clogged_chart_sensor" + sensorNumber, oModelSensorData, "clogged", "/sensor" +  sensorNumber + "/measurements", "","");
		var detailPageChart_sensor = buildChartPage("clogged_detailPageChart_sensor" + sensorNumber,oModelSensorData, app, sensorNumber ,chart_sensor);

		//mainPage.addContent(sensorTile);
		tileContainer.addTile(sensorTile);
		app.addPage(detailPageChart_sensor);
	}
	
	

	mainPage.addContent(tileContainer);
	mainPage.addContent(emptyContainer);
	app.addPage(mainPage);
	app.setBackgroundImage("images/wallpaper.jpg");
	app.setBackgroundRepeat(true);
	app.placeAt("content");
	
	var infoBox = buildInformationBox(oModelSensorData, "pressure1");
	mainPage.addContent(infoBox);
	app.addPage(mainPage);
	
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