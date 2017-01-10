var N = 10; //Size of Data.
/* var N = prompt("How many data points?",50) */
var P = randPoint(), Q = randPoint();

var wPLA= [0,0,0]; //Weight vector
var wLG = [0,0,0]; //Another weight vector.

function randPoint() {
	return [1,2*Math.random()-1,2*Math.random()-1]
}

var Data = [];
for (var i = 0 ; i < N ; i++ ) {
	Data.push(randPoint()); //Generating random data.
}

var Outcome = [];
for (var i = 0 ; i < N ; i++ ) {
	Outcome.push([f(Data[i])]);
}

function l(x) { //Line through P and Q
	return ( Q[2] - P[2] )/( Q[1] - P[1] ) * ( x - P[1] ) + P[2];
}

function f(x) { //Target function
	return Math.sign(x[2]-l(x[1]));
}

function g(x,w) { //Hypothesis, depends on w
	return Math.sign( dot(w,x) );
}


var M = []; //Misclassified points

function findMiscpts(w) { //Finding all misclassified points and putting them in array M.
	w = w || wLG.concat();
	M = [];
	for ( var i = 0 ; i< Data.length ; i++ ) {
		if ( g(w,Data[i]) != f(Data[i]) ) {
			M.push( Data[i] );
		}
	}
}

function LG() { //The Linear reGression algorithm
	var w_ = matrixMult( pseudoInverse(Data) , Outcome );
	wLG[0] = w_[0][0];
	wLG[1] = w_[1][0];
	wLG[2] = w_[2][0];
	drawline([1,-1, (-wLG[0]+wLG[1])/wLG[2] ] , [1, 1, (-wLG[0]-wLG[1])/wLG[2] ], "blue");
}

function PLA() { //The actual algorithm
	
	wPLA=wLG.concat(); //Reset the weight vector. If wLG is nontrivial (i.e. has already run), then start at wLG.
	
	var ct=0; //Number of steps to converge.
	
	findMiscpts(wPLA);
	
	
	while (M.length>0) {	
		ct++;
		
		var rand=Math.random();
		var v = M[ Math.floor( rand * M.length ) ];
		wPLA[0] += f(v)*v[0];
		wPLA[1] += f(v)*v[1];
		wPLA[2] += f(v)*v[2];
		
		findMiscpts(wPLA);
	}
		
		
	console.log("count: "+ct);
	drawline([1,-1, (-wPLA[0]+wPLA[1])/wPLA[2] ] , [1, 1, (-wPLA[0]-wPLA[1])/wPLA[2] ], "green");	
}

function showRealLine() {drawline([1,-1,l(-1)],[1,1,l(1)],"red")};


function dot (x,y) {
	var sum=0;
	for ( var i=0 ; i<x.length ; i++ ) {
		sum+= x[i]*y[i];
	}
	return sum;
}

function scaltimesMatr(c,X) {
	for (var i = 0 ; i<X.length; i++) {
		for (var j = 0 ; j<X[i].length; j++) {
			X[i][j] *= c;
		}
	}
	return X;
}

function transpose(X) {
	var X_=[];
	for (var i=0 ; i<X[0].length; i++ ) {
		X_.push([]);
		for (var j = 0 ; j<X.length; j++) {
			X_[i][j]=X[j][i];
		}
	}
	return X_;
}

function matrixMult(X,Y) {
	var finalMatrix = [];
	if (X[0].length != Y.length) {throw "Error, Matrix dimensions do not match."}
	for (var i = 0 ; i<X.length; i++ ) {
		finalMatrix.push([]);
		for (var j = 0 ; j<Y[0].length ; j++ ) {
			var sum = 0;
			for (var k = 0 ; k<X[0].length ; k++) {
				sum += X[i][k] * Y[k][j];
			}
			finalMatrix[i].push(sum);
			
		}
	}
	return finalMatrix;
}

function inverse(X) { //Inverts a 3x3 matrix... I'm too lazy to do the general case. Give me a break. Honestly, inverting matrices sucks. 
	var a=X[0][0],b=X[0][1],c=X[0][2],d=X[1][0],e=X[1][1],f=X[1][2],g=X[2][0],h=X[2][1],i=X[2][2];
	var X_ = [ [ e*i-f*h , c*h-b*i , b*f-c*e ] , [ f*g-d*i , a*i-c*g , c*d-a*f ] , [ d*h-e*g , b*g-a*h , a*e-b*d ] ];
	if (a*(e*i-f*h)-b*(d*i-f*g)+c*(d*h-e*g)===0) {throw "Matrix not invertible."}
	return scaltimesMatr( 1/(a*(e*i-f*h)-b*(d*i-f*g)+c*(d*h-e*g)) , X_);
}

function pseudoInverse(X) {
	return matrixMult(inverse(matrixMult(transpose(X),X)) , transpose(X)  );
}