var N = 100; //Size of Data.
/* var N = prompt("How many data points?",50) */
var P = randPoint(), Q = randPoint();

var w= [0,0,0]; //Weight vector

function randPoint() {
	return [1,2*Math.random()-1,2*Math.random()-1]
}

var Data = [];
for (var i = 0 ; i < N ; i++ ) {
	Data.push(randPoint()); //Generating random data.
}

function l(x) { //Line through P and Q
	return ( Q[2] - P[2] )/( Q[1] - P[1] ) * ( x - P[1] ) + P[2];
}

function f(x) { //Target function
	return Math.sign(x[2]-l(x[1]));
}

function g(x) { //Hypothesis, depends on w
	return Math.sign( dot(w,x) );
}


var M = []; //Misclassified points

function findMiscpts() { //Finding all misclassified points and putting them in array M.
	M = [];
	for ( var i = 0 ; i< Data.length ; i++ ) {
		if ( g(Data[i]) != f(Data[i]) ) {
			M.push( Data[i] );
		}
	}
}


function PLA() { //The actual algorithm
	
	w=[0,0,0]; //Reset the weight vector
	
	var ct=0; //Number of steps to converge.
	
	findMiscpts();
	
	do {
		
		ct++;
		
		var rand=Math.random();
		var v = M[ Math.floor( rand * M.length ) ];
		w[0] += f(v)*v[0];
		w[1] += f(v)*v[1];
		w[2] += f(v)*v[2];
		
		findMiscpts();
		
	} while (M.length>0)
		
	console.log("count: "+ct);
	drawline([1,-1, (-w[0]+w[1])/w[2] ] , [1, 1, (-w[0]-w[1])/w[2] ], "red");	
}

function showRealLine() {drawline([1,-1,l(-1)],[1,1,l(1)],"black")};


function dot (x,y) {
	var sum=0;
	for ( var i=0 ; i<x.length ; i++ ) {
		sum+= x[i]*y[i];
	}
	return sum;
}