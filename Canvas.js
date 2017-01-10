/*
	This file is used in PLA.html, LinearRegression.html, NonLinearTransformation.html
*/

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

ctx.lineWidth = 2;

drawline([1,-1,0],[1,1,0]);
drawline([1,0,-1],[1,0,1]);

ctx.lineWidth=1;

function ToCanvasX(x0) {
	return 200+200*x0;
}
function ToCanvasY(y0) {
	return 200-200*y0;
}

for (var i in Data) {
	var colors="";
	f(Data[i])==1 ? colors = "darkgray" : colors = "black";
	drawpoint([1,Data[i][1],Data[i][2]],colors);
}

function drawline(p1, p2, color) {
	color = color||"black";
	ctx.beginPath();
	ctx.moveTo( ToCanvasX(p1[1]) , ToCanvasY(p1[2]) );
	ctx.lineTo( ToCanvasX(p2[1]) , ToCanvasY(p2[2]) );
	ctx.strokeStyle=color;
	ctx.stroke();
	ctx.strokeStyle="black";
}

function drawpoint(p, color) {
	if (color) {
		ctx.fillStyle = color;
	}
	ctx.beginPath();
	ctx.arc( ToCanvasX(p[1]) , ToCanvasY(p[2]) , 2, 0, 2*Math.PI, false);
	ctx.fill();
	ctx.fillStyle="black";
}