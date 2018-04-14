/**
 * @param {string[], double[]} ppl - Array of names containing everybody involved with transaction
 * @param {double} price - Final price of product
 *
 * @return {<string[], double[]>} ret - 2D array containing all members and all prices being returned for each
 */
function splitEqual(ppl, price) {
	var pplSize = ppl.length;
	var finalPercentages = 100 / pplSize;
	var pass = [];
	for (var i = 0; i < pplSize; ++i) {
		pass.push([ppl[i][0], finalPercentages]);
	}
	return splitPercent(pass, price);
}


/**
 * @param {string[], double[]} ppl - Array of names containing everybody involved with transaction
 * @param {double} price - Final price of product
 *
 * @return {<string[], double[]>} ret - 2D array containing all members and all prices being returned for each
 */
function splitUnequal(ppl, price) {
	var pplSize = ppl.length;
	var totalPrice = 0;
	for (var i = 0; i < pplSize; ++i) {
		totalPrice = totalPrice + ppl[i][1];
	}
	var ret = [];
	//console.log(dRound(totalPrice, 2));
	if (dRound(totalPrice, 2) != price) {
		ret.push(["ERROR", 0]);
		return ret;
	}
	for (var i = 0; i < pplSize; ++i) {
		ret.push([ppl[i][0], ppl[i][1]]);
	}
	return ret;
}


/**
 * @param {string[], double[]} ppl - Array of names containing everybody involved with transaction
 * @param {double} price - Final price of product
 *
 * @return {<string[], double[]>} ret - 2D array containing all members and all prices being returned for each
 */
function splitPercent(ppl, price) {
	var pplSize = ppl.length;
	var finalPercentages = 0;
	var pass = [];
	for (var i = 0; i < pplSize; ++i) {
		finalPercentages = finalPercentages + ppl[i][1];
	}
	//console.log(finalPercentages);
	if (dRound(finalPercentages, 10) != 100) {
		pass.push(["ERROR", 0]);
		return pass;
	}
	finalPercentages = 0;
	for (var i = 0; i < pplSize; ++i) {
		pass.push([ppl[i][0], dRound((ppl[i][1] * price) / 100, 2)]);
		finalPercentages = finalPercentages + pass[i][1];
	}
	var totalLeft = price - finalPercentages;
	var i = 0;
	var boolVar = true;
	if (totalLeft < 0)
		boolVar = false;
	while (dRound(totalLeft, 2) != 0) {
		if (totalLeft > 0) {
			pass[i][1] = dRound(pass[i][1] + 0.01, 2);
			totalLeft = totalLeft - 0.01;
		}
		else {
			pass[i][1] = dRound(pass[i][1] - 0.01, 2);
			totalLeft = totalLeft + 0.01;
		}
		i++;
		if (i == pplSize)
			i = 0;
	}
	return splitUnequal(pass, price);
}


/**
 * @param {string[], double[]} ppl - Array of names containing everybody involved with transaction
 * @param {double} price - Final price of product
 *
 * @return {<string[], double[]>} ret - 2D array containing all members and all prices being returned for each
 */
function splitShares(ppl, price) {
	var pplSize = ppl.length;
	var totalShares = 0;
	var pass = [];
	for (var i = 0; i < pplSize; ++i) {
		totalShares = totalShares + ppl[i][1];
	}

	for (var i = 0; i < pplSize; ++i) {
		pass.push([ppl[i][0], 100 * ppl[i][1] / totalShares]);
	}
	return splitPercent(pass, price);
}


/**
 * @param {string[], double[]} ppl - Array of names containing everybody involved with transaction
 * @param {double} price - Final price of product
 *
 * @return {<string[], double[]>} ret - 2D array containing all members and all prices being returned for each
 */
function splitAdjust(ppl, price) {
	var pplSize = ppl.length;
	var finalPrice = price;
	var pass = [];
	for (var i = 0; i < pplSize; ++i) {
		pass.push([ppl[i][0], 0]);
		finalPrice = finalPrice - ppl[i][1];
	}

	var ret = splitEqual(pass, finalPrice);
	for (var i = 0; i < pplSize; ++i) {
		ret[i][1] = ret[i][1] + ppl[i][1];
	}
	return ret;
}


function dRound(num, dec) {
	var exp = Math.pow(10, dec);
	if (dec == 2)
		num = num + 0.00001;
	return Math.round(exp * num) / exp;
}

var ppl = [];
//ppl[0][0] = "Bob";
//ppl[1][0] = "Sally";
//ppl[2][0] = "Chuck Norris";
//ppl[3][0] = "Abejing Lincoln";
//ppl[0][1] = 75;
//ppl[1][1] = 150;
//ppl[2][1] = 50;
//ppl[3][1] = 25;

//ppl["Bob"] = 75;
//ppl["Sally"] = 150;
//ppl["Chuck Norris"] = 50;
//ppl["Abejing Lincoln"] = 25;

//ppl.push([]);
//ppl.push([]);

//ppl[0].push("Bob");
//ppl[0].push(75);
//ppl[1].push("Sally");
//ppl[1].push(150);

//ppl.push(["Bob", 12.5]);
ppl.push(["Sally", 2]);
ppl.push(["Chuck Norris", 6]);
ppl.push(["Abejing Lincoln", 8]);
price = 100;

var returned = splitShares(ppl, price);

for (var i = 0; i < returned.length; ++i) {
	for (var j = 0; j < returned[i].length; ++j) {
		console.log(returned[i][j]);
	}
}
