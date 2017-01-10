var n = 10000; //Number of times to run the experiment.
var N = 1000; //Number of coins.
var M = 10; //Number of times to flip each coin.

function experiment() {
	var coins = [];
	var least = [0,0]; //[place, number of tails]
	for (var i = 0 ; i<N ; i++) {
		var result = [];
		var ct=0;
		for (var j = 0 ; j<M ; j++) {
			var rand = throwCoin();
			result.push(rand);
			if (rand){ct++;}
		}
		if (ct > least[1]) {least = [i,ct];}
		coins.push([result,ct/10]);
	}
	var c1 = coins[0];
	var crand = coins[Math.floor(Math.random()*coins.length)];
	var cmin = coins[least[0]]
	return [c1, crand, cmin];
}

function throwCoin() { //Returns 0 if heads and 1 if tails.
	return Math.floor(2*Math.random());
}


function gatherData() {
	var sumn1=0, sumn2=0, sumn3=0;
	for (var k = 0 ; k<n ; k++ ) {
		var output = experiment();
		sumn1+=output[0][1]/n;
		sumn2+=output[1][1]/n;
		sumn3+=output[2][1]/n;
	}
	return [sumn1,sumn2,sumn3];
}