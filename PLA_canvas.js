var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

ctx.lineWidth = 2;

ctx.moveTo(0,200);
ctx.lineTo(400,200);
ctx.moveTo(200,0);
ctx.lineTo(200,400);
ctx.strokeStyle="black";
ctx.stroke();ctx.stroke();ctx.stroke();ctx.closePath();

function ToCanvasX(x0) {
	return  200+200*x0;
}
function ToCanvasY(y0) {
	return 200-200*y0;
}

for (var i in Data) {
	var x00 = ToCanvasX(Data[i][1]);
	var y00 = ToCanvasY(Data[i][2]);
	if (f(Data[i])==1) {
		ctx.fillStyle = "red";
		ctx.strokeStyle = "blue";
	} else {
		ctx.fillStyle = "blue";
		ctx.strokeStyle = "red";
	}
//	ctx.fillRect(x00-2,y00-2,4,4);
	ctx.beginPath();
	ctx.arc(x00,y00, 2, 0, 2*Math.PI, false);
	ctx.fill();
	ctx.lineWidth=1;
//	ctx.stroke();
//	ctx.lineWidth=2;
}