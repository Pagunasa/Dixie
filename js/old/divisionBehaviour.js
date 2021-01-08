/*****************************************/
/******FUNCTIONALITY divisionButton*******/
/*****************************************/
var graphLi = $('#graphLi');
var particleLi = $('#particleLi');
var root = $('#root');
var widthContainerC = root.width();
var dBLimit = widthContainerC * 0.15; 

function changeCanvasSize(dBPosition) {
	dB.style.left = dBPosition + 'px';

	//We repositionate both canvas, in order to do it correctly we have
	//to consider the half of the size of the button
	var graphWidth = dBPosition + dBHalfSize;
	graphLi.width(graphWidth);
	particleLi.width(widthContainerC - graphWidth);
	graphCanvas.resize();
}

function resizeElements() {
	//We have to save the old width of the container in order to
	//to know  the % that the button was occupying  
	var oldWidthContainerC = widthContainerC;

	//Every time that the screen changes his size we have to recalculate the
	//size of the container in wich the canvas are inside!!!
	widthContainerC = root.width();
	dBLimit = widthContainerC * 0.15;

	//In order to get the position we have to split and parse to float
	//because in the style is saved as a string
	var posDB = parseFloat(dB.style.left.split('px')[0]);

	//The % that represent the actual position of the
	//divisonButton over the width of the container 
	//normaly, it will be multiplied by 100 but in the
	//next step is divided by 100 so we can delete both
	//in order to avoid unnecessary operations
	var percentageValue = posDB / oldWidthContainerC;
	
	//The value in pixels of the % of the divisionButton
	//in the new width of the container
	var dBPosition = percentageValue * widthContainerC;
	dBPosition = Math.min(Math.max(dBPosition, dBLimit),  widthContainerC - dB.offsetWidth - dBLimit);

	changeCanvasSize(dBPosition);
}

resizeElements();

document.addEventListener('mousemove', function(e){
	if (dB.drag == true){
		var dBPosition = Math.min(Math.max(e.pageX, dBLimit),  widthContainerC - dB.offsetWidth - dBLimit);
		changeCanvasSize(dBPosition);
	}
});

document.addEventListener('mouseup', function(e){
	if (dB.drag == true)
		dB.drag = false;
});