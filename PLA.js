var N = 50/* = prompt("How many data points?",50) */; //Size of Data.
var P = [1,2*Math.random()-1,2*Math.random()-1];
var Q = [1,2*Math.random()-1,2*Math.random()-1];

var Data = [];
for (var i = 0 ; i < N ; i++ ) {
	Data.push([1,2*Math.random()-1,2*Math.random()-1]);
}

function l(x) { //Line through P and Q
	return ( Q[2] - P[2] )/( Q[1] - P[1] ) * ( x - P[1] ) + P[2];
}

function f(x) {
	return Math.sign(x[2]-l(x[1]));
}

var w= [0,0,0];

function g(x) {
	return Math.sign( dot(w,x) );
}

var M = []; //Misclassified points

function PLA() {
	
	w=[0,0,0];
	
	var ct=0
	
	M = [];
		for ( var i = 0 ; i< Data.length ; i++ ) {
			if ( g(Data[i]) != f(Data[i]) ) {
				M.push( Data[i] );
			}
		}
	
	do {
		
		ct++;
		
		
		
		var rand=Math.random();
		var v = M[ Math.floor( rand * M.length ) ];
		w[0] += f(v)*v[0];
		w[1] += f(v)*v[1];
		w[2] += f(v)*v[2];
		
		M = [];
		for ( var i = 0 ; i< Data.length ; i++ ) {
			if ( g(Data[i]) != f(Data[i]) ) {
				M.push( Data[i] );
			}
		}
		
	} while (M.length>0)	
		
	console.log("count: "+ct);
	ctx.beginPath();
	ctx.moveTo( ToCanvasX(-1) , ToCanvasY( (-w[0]+w[1])/w[2]) );
	ctx.lineTo( ToCanvasX(1)  , ToCanvasY( (-w[0]-w[1])/w[2]) );
	ctx.strokeStyle="black";
	ctx.stroke();
	
}

function showRealLine() {
	ctx.beginPath();
	ctx.moveTo( ToCanvasX(-1) , ToCanvasY( l(-1) ) );
	ctx.lineTo( ToCanvasX( 1) , ToCanvasY( l( 1) ) );
	ctx.strokeStyle="red";
	ctx.stroke();
}

function dot (x,y) {
	var sum=0;
	for ( var i=0 ; i<x.length ; i++ ) {
		sum+= x[i]*y[i];
	}
	return sum;
}