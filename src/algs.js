/**
 * Splits equally. Each person will pay the same amount for an item.
 *
 *
 * @param {string[], double[]} ppl - Array of names containing everybody involved with transaction; double values are useless for this function
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
 * Splits unequally. Each person will pay an exact amount for an item based on the price they provide. Fails if prices don't add up to price of item.
 *
 *
 * @param {string[], double[]} ppl - Array of names containing everybody involved with transaction in addition to their provided payments
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
 * Splits by percentage. Each user inputs the percentage of a product they wish to pay for. Function returns an error if percentages do not add up.
 *
 *
 * @param {string[], double[]} ppl - Array of names containing everybody involved with transaction in addition to their percentages
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
 * Splits by shares. Each user will input a number of shares used to pay. These will be added up, and each will pay their number of shares divided by the total number of shares times the final price.
 *
 *
 * @param {string[], double[]} ppl - Array of names containing everybody involved with transaction in addition to the number of shares for each person
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
 * Splits prices based on adjustment. Users input manual additions to what they want to pay, and everything leftover is split equally.
 *
 *
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

/**
 * Rounds a provided number down to the number of decimal places desired.
 *
 *
 * @param {double} num - Number to be rounded
 * @param {int} dec = Number of decimal places away from 0 (in either direction)
 *
 * @return {double} - Resulting rounded number
 */
function dRound(num, dec) {
	var exp = Math.pow(10, dec);
	if (dec == 2)
		num = num + 0.00001;
	return Math.round(exp * num) / exp;
}


////////// - TESTS - \\\\\\\\\\
/*
var ppl = [];
ppl.push(["Bob", 12.347]);
ppl.push(["Sally", 21]);
ppl.push(["Chuck Norris", 6.67]);
ppl.push(["Abejing Lincoln", 8]);
price = 100;

var returned = splitShares(ppl, price);

for (var i = 0; i < returned.length; ++i) {
	for (var j = 0; j < returned[i].length; ++j) {
		console.log(returned[i][j]);
	}
}
*/
