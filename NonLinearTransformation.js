var N = 5000; //Size of Data.
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

function transformData() {
	for ( var i in Data) {
		Data[i] = [1,Data[i][1],Data[i][2],Data[i][1]*Data[i][2],Data[i][1]*Data[i][1],Data[i][2]*Data[i][2]];
	}
}
transformData();

/* 
var Data=0;
for (var i = 0 ; i<1000 ; i++) {Data.push(randPoint();)}
var ct=0;
for ( var i in Data) {if (f(Data[i])==g(Data[i],wLG)){ct++;}}
console.log(ct/1000);
*/	

function l(x) { //Line through P and Q
	return ( Q[2] - P[2] )/( Q[1] - P[1] ) * ( x - P[1] ) + P[2];
}

function f(x) { //Target function --changed!
	return Math.sign(x[1]*x[1]+x[2]*x[2]-0.6);
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
	for (var i = 0 ; i<w_.length ; i++) {
		wLG[i] = w_[i][0];
	}
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

function inverse(X) { 
	var a=X[0][0],b=X[0][1],c=X[0][2],d=X[1][0],e=X[1][1],f=X[1][2],g=X[2][0],h=X[2][1],i=X[2][2];
	var X_ = [ [ e*i-f*h , c*h-b*i , b*f-c*e ] , [ f*g-d*i , a*i-c*g , c*d-a*f ] , [ d*h-e*g , b*g-a*h , a*e-b*d ] ];
	if (a*(e*i-f*h)-b*(d*i-f*g)+c*(d*h-e*g)===0) {throw "Matrix not invertible."}
	return scaltimesMatr( 1/(a*(e*i-f*h)-b*(d*i-f*g)+c*(d*h-e*g)) , X_);
}

function pseudoInverse(X) {
	return matrixMult(matrix_invert(matrixMult(transpose(X),X)) , transpose(X)  );
}

/* This part of the code is taken from http://blog.acipo.com/matrix-inversion-in-javascript/ */
// Returns the inverse of matrix `M`.
function matrix_invert(M){
    // I use Guassian Elimination to calculate the inverse:
    // (1) 'augment' the matrix (left) by the identity (on the right)
    // (2) Turn the matrix on the left into the identity by elemetry row ops
    // (3) The matrix on the right is the inverse (was the identity matrix)
    // There are 3 elemtary row ops: (I combine b and c in my code)
    // (a) Swap 2 rows
    // (b) Multiply a row by a scalar
    // (c) Add 2 rows
    
    //if the matrix isn't square: exit (error)
    if(M.length !== M[0].length){return;}
    
    //create the identity matrix (I), and a copy (C) of the original
    var i=0, ii=0, j=0, dim=M.length, e=0, t=0;
    var I = [], C = [];
    for(i=0; i<dim; i+=1){
        // Create the row
        I[I.length]=[];
        C[C.length]=[];
        for(j=0; j<dim; j+=1){
            
            //if we're on the diagonal, put a 1 (for identity)
            if(i==j){ I[i][j] = 1; }
            else{ I[i][j] = 0; }
            
            // Also, make the copy of the original
            C[i][j] = M[i][j];
        }
    }
    
    // Perform elementary row operations
    for(i=0; i<dim; i+=1){
        // get the element e on the diagonal
        e = C[i][i];
        
        // if we have a 0 on the diagonal (we'll need to swap with a lower row)
        if(e==0){
            //look through every row below the i'th row
            for(ii=i+1; ii<dim; ii+=1){
                //if the ii'th row has a non-0 in the i'th col
                if(C[ii][i] != 0){
                    //it would make the diagonal have a non-0 so swap it
                    for(j=0; j<dim; j++){
                        e = C[i][j];       //temp store i'th row
                        C[i][j] = C[ii][j];//replace i'th row by ii'th
                        C[ii][j] = e;      //repace ii'th by temp
                        e = I[i][j];       //temp store i'th row
                        I[i][j] = I[ii][j];//replace i'th row by ii'th
                        I[ii][j] = e;      //repace ii'th by temp
                    }
                    //don't bother checking other rows since we've swapped
                    break;
                }
            }
            //get the new diagonal
            e = C[i][i];
            //if it's still 0, not invertable (error)
            if(e==0){return}
        }
        
        // Scale this row down by e (so we have a 1 on the diagonal)
        for(j=0; j<dim; j++){
            C[i][j] = C[i][j]/e; //apply to original matrix
            I[i][j] = I[i][j]/e; //apply to identity
        }
        
        // Subtract this row (scaled appropriately for each row) from ALL of
        // the other rows so that there will be 0's in this column in the
        // rows above and below this one
        for(ii=0; ii<dim; ii++){
            // Only apply to other rows (we want a 1 on the diagonal)
            if(ii==i){continue;}
            
            // We want to change this element to 0
            e = C[ii][i];
            
            // Subtract (the row above(or below) scaled by e) from (the
            // current row) but start at the i'th column and assume all the
            // stuff left of diagonal is 0 (which it should be if we made this
            // algorithm correctly)
            for(j=0; j<dim; j++){
                C[ii][j] -= e*C[i][j]; //apply to original matrix
                I[ii][j] -= e*I[i][j]; //apply to identity
            }
        }
    }
    
    //we've done all operations, C should be the identity
    //matrix I should be the inverse:
    return I;
}
