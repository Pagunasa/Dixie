/*********************************************/
/*************Menu Buttons********************/
/*********************************************/
var loadInput  = document.getElementById("graphLoader"); 
var loadButton = document.getElementById("load");

loadInput.onmouseover = function() {
	loadButton.style.background = "#eceff1";
	loadButton.style.color      = "#455a64";
	loadInput.style.cursor     = "pointer";
};

loadInput.onmouseout = function() {
	loadButton.style.background = "#455a64";
	loadButton.style.color      = "#eceff1";
	loadInput.style.cursor     = "default";
};
