/**
 * ALL ERROR CODES:
 *
 * ERROR 0 *: Payments offered by users do not match total expenses!
 * ERROR 1 *: No people included in transaction!
 * ERROR 2 *: Error within code and should never appear; people selected for specific item payments do not match people included within full transaction
 * ERROR 3 *: No payers included in transaction!
 * ERROR 4 *: Invalid value for splitType!
 * ERROR 5 *: Error within code and should never appear; people owe money, but there's nobody to receive it (or other way around)
 * ERROR 6 *: More people included in exchange than in database!
 * ERROR 7 *: Error within code and should never appear; db size does not match pass size!
 * ERROR 8 *: Divide by zero error!
 */


export function getError(res) {
    if (res.length === 0 || res[0].length < 2) {
        return "ERROR!  Code: nu, ll";
    }
    var ret = "ERROR!  Code: " + res[0][1].toString();
    if (res[0].length === 3) {
        ret = ret + ", " + res[0][2].toString();
    }   
    if (res[0][1] === 0) {
        ret = ret + "\nPayments do not match total expenses!";
    }
    if (res[0][1] === 1) {
        ret = ret + "\nNo people included in transaction!";
    }
    if (res[0][1] === 3) {
        ret = ret + "\nNo payer selected!";
    }
    if (res[0][1] === 8) {
        ret = ret + "\nDividing by zero due to use of invalid values that sum to zero!";
    }
    return ret;
}


/**
 * Calculates how much money is owed to whoever pays an expense by others
 *
 * @param {<string, double>} ppl - Array of all people involved with transaction in addition to whatever payment value is being used alongside the split function
 * @param {<string, double>} payers - 2D array of all people that paid and how much they paid
 * @param {int} splitType - represents type of split function to be used
 *  0: splitEqual
 *  1: splitUnequal
 *  2: splitPercent
 *  3: splitShares
 *  4: splitAdjust
 *  5: splitByItem
 * @param {<string, string[], double>} items - (Used only for splitByItem, else null) 2D array containing all items, the people involved in the transaction, and the prices of the items
 * @param {String} currUser - (Used only for splitByItem) the user that is calling the function
 *
 * @return {<string, double>} - 2D array that holds information on who owes what: if double is positive, the person is owed money; if negative, the person owes money
 */
export function calculateWithPayer(pplIn, payers, splitType, items, currUser) {
    let ppl = [];
    for (var i = 0; i < pplIn.length; ++i) {
        ppl.push([pplIn[i][0], pplIn[i][1]]);
    }
    let pplSize = ppl.length;
    var splits = [];
    if (pplSize === 0) {
        splits.push(["ERROR", 1, 1]);
        return splits;
    }
    let payerSize = payers.length;
    if (payerSize === 0) {
        splits.push(["ERROR", 3, 1]);
        return splits;
    }
    let price = 0;
    for (let i = 0; i < payerSize; ++i) {
        price = price + payers[i][1];
    }
    let userItemSelect = [];
    if (splitType === 5) {
        ppl = splitByItem(ppl, items, userItemSelect, currUser);
        //console.log(ppl);
        pplSize = ppl.length;
        if (ppl[0][0] === "ERROR") {
            splits.push(["ERROR", ppl[0][1], 0]);
            return splits;
        }
        let tmptotal = 0;
        for (let i = 0; i < pplSize; ++i) {
            tmptotal = tmptotal + ppl[i][1];
        }
        if (tmptotal !== price) {
            splits.push(["ERROR", 0, 1]);
            return splits;
        }
    }
    for (let i = 0; i < pplSize; ++i) {
        splits.push([ppl[i][0], 0]);
        for (let j = 0; j < payerSize; ++j) {
            if (splits[i][0] === payers[j][0]) {
                splits[i][1] = 0 - payers[j][1];
                break;
            }
        }
    }
    for (let i = 0; i < payerSize; ++i) {
        let retPayment;
        switch (splitType) {
            case 0:
                retPayment = splitEqual(ppl, payers[i][1]);
                break;
            case 1: case 3: case 5:
                retPayment = splitShares(ppl, payers[i][1]);
                //console.log(retPayment);
                break;
            case 2:
                retPayment = splitPercent(ppl, payers[i][1]);
                //console.log(retPayment);
                break;
            case 4:
                let tmp = [];
                for (var j = 0; j < pplSize; ++j) {
                    tmp.push([ppl[j][0], ppl[j][1] * payers[i][1] / price]);
                }
                retPayment = splitAdjust(tmp, payers[i][1]);
                break;
            default:
                var errRet = [];
                errRet.push(["ERROR", 4, 1]);
                return errRet;
        }
        if (retPayment[0][0] === "ERROR") {
            var errReturn = [];
            errReturn.push(["ERROR", retPayment[0][1], 0]);
            return errReturn;
        }
        for (let j = 0; j < splits.length; ++j) {
            splits[j][1] = splits[j][1] + retPayment[j][1];
        }
    }
    for (let i = 0; i < splits.length; ++i) {
        splits[i][1] = dRound(0 - splits[i][1], 2);
    }

    //console.log(splits);
    return splits;
}


/**
 * Calculates a simplified summary of who owes who money
 *
 * @param {<string, double>} ppl - the people involved and the amount they owe or are owed
 *
 * @return {<string, string, double>} ret - 2D array that holds information on who owes what; [PERSON] owes [PERSON] this much [MONEY]; returns '["EMPTY", "EMPTY", 0]' if no money is owed
 */
export function calculateMoneyOwed(ppl) {
    var ret1 = [];
    var ret2 = [];
    let pos1 = [];
    let neg1 = [];
    for (let i = 0; i < ppl.length; ++i) {
        if (ppl[i][1] < 0) {
            neg1.push([ppl[i][0], 0 - ppl[i][1]]);
        }
        else if (ppl[i][1] > 0) {
            pos1.push([ppl[i][0], ppl[i][1]]);
        }
    }
    if (pos1.length === 0 || neg1.length === 0) {
        if (pos1.length === neg1.length) {
            ret1.push(["EMPTY", "EMPTY", 0]);
            return ret1;
        }
        else {
            ret1.push(["ERROR", 5, 2]);
            return ret1;
        }
    }
    sortExp(pos1);
    sortExp(neg1);
    let pos2 = [];
    let neg2 = [];
    for (let i = 0; i < pos1.length; ++i) {
        pos2.push([pos1[i][0], pos1[i][1]]);
    }
    for (let i = 0; i < neg1.length; ++i) {
        neg2.push([neg1[i][0], neg1[i][1]]);
    }

    let cPos = 0;
    let cNeg = 0;
    for (let i = 0; i < pos1.length; ++i) {
        for (let j = 0; j < neg1.length; ++j) {
            if (pos1[i][1] === neg1[j][1]) {
                ret1.push([neg1[j][0], pos1[i][0], pos1[i][1]]);
                ret2.push([neg2[j][0], pos2[i][0], pos2[i][1]]);
                pos1[i][1] = 0;
                neg1[j][1] = 0;
                pos2[i][1] = 0;
                neg2[j][1] = 0;
                break;
            }
        }
    }
    while (cPos !== pos1.length && cNeg !== neg1.length) {
        if (pos1[cPos][1] === 0) {
            cPos++;
            continue;
        }
        if (neg1[cNeg][1] === 0) {
            cNeg++;
            continue;
        }
        if (neg1[cNeg][1] <= pos1[cPos][1]) {
            ret1.push([neg1[cNeg][0], pos1[cPos][0], neg1[cNeg][1]]);
            pos1[cPos][1] = dRound(pos1[cPos][1] - neg1[cNeg][1], 2);
            neg1[cNeg][1] = 0;
            cNeg++;
            continue;
        }
        if (neg1[cNeg][1] > pos1[cPos][1]) {
            ret1.push([neg1[cNeg][0], pos1[cPos][0], pos1[cPos][1]]);
            neg1[cNeg][1] = dRound(neg1[cNeg][1] - pos1[cPos][1], 2);
            pos1[cPos][1] = 0;
            cPos++;
            continue;
        }
    }
    if ((cPos !== pos1.length && pos1[cPos][1] !== 0) || (cNeg !== neg1.length && neg1[cNeg][1] !== 0)) {
        var errRet = [];
        errRet.push(["ERROR", 0, 2]);
        return errRet;
    }
    
    //console.log(neg2);
    cPos = 0;
    cNeg = neg2.length-1;
    while (cPos !== pos2.length && cNeg >= 0) {
        if (pos2[cPos][1] === 0) {
            cPos++;
            continue;
        }
        if (neg2[cNeg][1] === 0) {
            cNeg--;
            continue;
        }
        if (neg2[cNeg][1] <= pos2[cPos][1]) {
            ret2.push([neg2[cNeg][0], pos2[cPos][0], neg2[cNeg][1]]);
            pos2[cPos][1] = dRound(pos2[cPos][1] - neg2[cNeg][1], 2);
            neg2[cNeg][1] = 0;
            cNeg--;
            continue;
        }
        if (neg2[cNeg][1] > pos2[cPos][1]) {
            ret2.push([neg2[cNeg][0], pos2[cPos][0], pos2[cPos][1]]);
            neg2[cNeg][1] = dRound(neg2[cNeg][1] - pos2[cPos][1], 2);
            pos2[cPos][1] = 0;
            cPos++;
            continue;
        }
    }
    if ((cPos !== pos2.length && pos2[cPos][1] !== 0) || (cNeg >= 0 && neg2[cNeg][1] !== 0)) {
        var errReturn = [];
        errReturn.push(["ERROR", 0, 2]);
        return errReturn;
    }

    /*
    for (let i = 0; i < pos.length; ++i) {
        let exch = splitShares(neg, pos[i][1]);
        //console.log(pos);
        //console.log(0 - neg[i][1]);
        if (exch[0][0] == "ERROR") {
            var errRet = [];
            errRet.push(["ERROR", exch[0][1], 3]);
            return errRet;
        }
        for (let j = 0; j < exch.length; ++j) {
            ret1.push([exch[j][0], pos[i][0], exch[j][1]]);
        }
    }
    */
    
    //console.log(ret1);
    //console.log(ret2);
    if (ret1.length < ret2.length) {
        return ret1;
    }
    return ret2;
}

/**
 * Sorts 2D array's double values from greatest to least
 *
 * @param {<string, double>} ppl - 2D array to be sorted
 *
 * @return {<string, double>} ret - 2D array to be returned
 */
function sortExp(ppl) {
    for (let i = 0; i < ppl.length-1; ++i) {
        for (let j = i+1; j < ppl.length; ++j) {
            if (ppl[i][1] < ppl[j][1]) {
                let t0 = ppl[i][0];
                let t1 = ppl[i][1];
                ppl[i][0] = ppl[j][0];
                ppl[i][1] = ppl[j][1];
                ppl[j][0] = t0;
                ppl[j][1] = t1;
            }
        }
    }
}


/**
 * Updates database by adding on to previous expenses
 *
 * @param {<string, double>} dBase - database containing users and what they owe/are owed
 * @param {<string, double>} exch - new exchange to be tacked on to other data from the database
 *
 * @return {<string, double>} ret - updated database results containing users and what they owe/are owed
 */
export function updateExpenses(dBase, exch) {
    var pass = [];
    if (dBase.length === 0) {
        pass.push(["ERROR", 1, 4]);
        return pass;
    }
    if (dBase.length < exch.length) {
        pass.push(["ERROR", 6, 4]);
        return pass;
    }
    for (let i = 0; i < dBase.length; ++i) {
        let j = 0;
        for (; j < exch.length; ++j) {
            if (dBase[i][0] === exch[j][0]) {
                pass.push([dBase[i][0], dRound(dBase[i][1] + exch[j][1], 2)]);
                break;
            }
        }
        if (j === exch.length) {
            pass.push([dBase[i][0], dBase[i][1]]);
        }
    }
    if (pass.length !== dBase.length) {
        var errRet = [];
        errRet.push(["ERROR", 7]);
        return errRet;
    }
    let get = calculateMoneyOwed(pass);
    var ret = [];
    if (get[0][0] === "ERROR") {
        ret.push(["ERROR", get[0][1]]);
        return ret;
    }
    for (let i = 0; i < pass.length; ++i) {
        ret.push([pass[i][0], 0]);
    }
    for (let i = 0; i < ret.length; ++i) {
        for (var j = 0; j < get.length; ++j) {
            if (ret[i][0] === get[j][0]) {
                ret[i][1] = dRound(ret[i][1] - get[j][2], 2);
            }
            if (ret[i][0] === get[j][1]) {
                ret[i][1] = dRound(ret[i][1] + get[j][2], 2);
            }
        }
    }
    return ret;
}


/**
 * Splits by item. Each item is split equally based on who wants to pay for each item. All prices are added together for each person.
 *
 * @param {<string, double>} ppl - Array of all people involved with transaction; doubles are useless for this function
 * @param {<string, string[], double>} items - 2D array containing all items, the people involved in the transaction, and the prices of the items
 * @param {<string, double>} userItemSelect - Empty 2D array to store items being paid for by user and how much is being paid
 * @param {string} currUser - Current user calling function
 *
 * @return {<string, double>} ret - 2D array containing all members and all prices being returned for each
 */
export function splitByItem(ppl, items, userItemSelect, currUser) {
    let pplSize = ppl.length;
 	var ret = [];
	if (pplSize === 0) {
	    ret.push(["ERROR", 1]);
		return ret;
	}
	let itemSize = items.length;
    for (let i = 0; i < pplSize; ++i) {
        ret.push([ppl[i][0], 0]);
    }
    for (let i = 0; i < itemSize; ++i) {
        let passPpl = [];
        for (let j = 0; j < items[i][1].length; ++j) {
            passPpl.push([items[i][1][j], 0]);
        }
        var get = splitEqual(passPpl, items[i][2]);
        if (get[0][0] === "ERROR") {
            return get;
        }
        for (let j = 0; j < get.length; ++j) {
            for (let k = 0; k <= pplSize; ++k) {
                if (k === pplSize) {
                    var errRet = [];
                    errRet.push(["ERROR", 2]);
                    return errRet;
                }
                if (ppl[k][0] === get[j][0]) {
                    ret[k][1] = dRound(ret[k][1] + get[j][1], 2);
                    if (ppl[k][0] === currUser) {
                        userItemSelect.push([items[i][0], get[j][1]]);
                    }
                    break;
                }
            }
        }
    }
    return ret;
}


/**
 * Splits equally. Each person will pay the same amount for an item.
 *
 * @param {<string, double>} ppl - Array of names containing everybody involved with transaction; double values are useless for this function
 * @param {double} price - Final price of product
 *
 * @return {<string, double>} ret - 2D array containing all members and all prices being returned for each
 */
function splitEqual(ppl, price) {
	let pplSize = ppl.length;
	var pass = [];
	if (pplSize === 0) {
	    pass.push(["ERROR", 1]);
		return pass;
	}
	let finalPercentages = 100 / pplSize;
	for (let i = 0; i < pplSize; ++i) {
		pass.push([ppl[i][0], finalPercentages]);
	}
	return splitPercent(pass, price);
}


/**
 * Splits unequally. Each person will pay an exact amount for an item based on the price they provide. Fails if prices don't add up to price of item.
 *
 * @param {<string, double>} ppl - Array of names containing everybody involved with transaction in addition to their provided payments
 * @param {double} price - Final price of product
 *
 * @return {<string, double>} ret - 2D array containing all members and all prices being returned for each
 */
function splitUnequal(ppl, price) {
	let pplSize = ppl.length;
	var ret = [];
	if (pplSize === 0) {
	    ret.push(["ERROR", 1]);
		return ret;
	}
	let totalPrice = 0;
	for (let i = 0; i < pplSize; ++i) {
		totalPrice = totalPrice + ppl[i][1];
	}
	//console.log(dRound(totalPrice, 2));
	if (dRound(totalPrice, 2) !== price) {
		ret.push(["ERROR", 0]);
		return ret;
	}
	for (let i = 0; i < pplSize; ++i) {
		ret.push([ppl[i][0], ppl[i][1]]);
	}
	return ret;
}


/**
 * Splits by percentage. Each user inputs the percentage of a product they wish to pay for. Function returns an error if percentages do not add up.
 *
 * @param {<string, double>} ppl - Array of names containing everybody involved with transaction in addition to their percentages
 * @param {double} price - Final price of product
 *
 * @return {<string, double>} ret - 2D array containing all members and all prices being returned for each
 */
function splitPercent(ppl, price) {
    //console.log(ppl+price);
	let pplSize = ppl.length;
	var pass = [];
	if (pplSize === 0) {
	    pass.push(["ERROR", 1]);
		return pass;
	}
	let finalPercentages = 0;
	for (let i = 0; i < pplSize; ++i) {
		finalPercentages = finalPercentages + ppl[i][1];
	}
	//console.log(finalPercentages);
	if (dRound(finalPercentages, 10) !== 100) {
		pass.push(["ERROR", 0]);
		return pass;
	}
	finalPercentages = 0;
	for (let i = 0; i < pplSize; ++i) {
		pass.push([ppl[i][0], dRound((ppl[i][1] * price) / 100, 2)]);
		finalPercentages = finalPercentages + pass[i][1];
	}
	let totalLeft = price - finalPercentages;
	let i = 0;
	while (dRound(totalLeft, 2) !== 0) {
		if (totalLeft > 0) {
			pass[i][1] = dRound(pass[i][1] + 0.01, 2);
			totalLeft = totalLeft - 0.01;
			if (totalLeft < 0) {
                break;
			}
		}
		else {
			pass[i][1] = dRound(pass[i][1] - 0.01, 2);
			totalLeft = totalLeft + 0.01;
			if (totalLeft > 0) {
                break;
			}
		}
		i++;
		if (i === pplSize)
			i = 0;
	}
	return splitUnequal(pass, price);
}


/**
 * Splits by shares. Each user will input a number of shares used to pay. These will be added up, and each will pay their number of shares divided by the total number of shares times the final price.
 *
 * @param {<string, double>} ppl - Array of names containing everybody involved with transaction in addition to the number of shares for each person
 * @param {double} price - Final price of product
 *
 * @return {<string, double>} ret - 2D array containing all members and all prices being returned for each
 */
function splitShares(ppl, price) {
	let pplSize = ppl.length;
	var pass = [];
	if (pplSize === 0) {
	    pass.push(["ERROR", 1]);
		return pass;
	}
	let totalShares = 0;
	for (let i = 0; i < pplSize; ++i) {
		totalShares = totalShares + ppl[i][1];
	}
	if (totalShares === 0) {
        pass.push(["ERROR", 8]);
        //console.log(ppl + price);
        return pass;
	}

	for (let i = 0; i < pplSize; ++i) {
		pass.push([ppl[i][0], 100 * ppl[i][1] / totalShares]);
	}
	return splitPercent(pass, price);
}


/**
 * Splits prices based on adjustment. Users input manual additions to what they want to pay, and everything leftover is split equally.
 *
 * @param {<string, double>} ppl - Array of names containing everybody involved with transaction
 * @param {double} price - Final price of product
 *
 * @return {<string, double>} ret - 2D array containing all members and all prices being returned for each
 */
function splitAdjust(ppl, price) {
	let pplSize = ppl.length;
	var ret = [];
	if (pplSize === 0) {
	    ret.push(["ERROR", 1]);
		return ret;
	}
	let finalPrice = price;
	var pass = [];
	for (let i = 0; i < pplSize; ++i) {
		pass.push([ppl[i][0], 0]);
		finalPrice = finalPrice - ppl[i][1];
	}

	ret = splitEqual(pass, finalPrice);
	for (let i = 0; i < pplSize; ++i) {
		ret[i][1] = ret[i][1] + ppl[i][1];
	}
	return ret;
}

/**
 * Rounds a provided number down to the number of decimal places desired.
 *
 * @param {double} num - Number to be rounded
 * @param {int} dec = Number of decimal places away from 0 (in either direction)
 *
 * @return {double} - Resulting rounded number
 */
export function dRound(num, dec) {
	let exp = Math.pow(10, dec);
	if (dec === 2)
		num = num + 0.00001;
	return Math.round(exp * num) / exp;
}


/*
////////// - TESTS - \\\\\\\\\\

// Temporary static 2D array used for testing; stores name of member plus the money they owe/are owed: positive indicates how much they are owed; negative indicates what they owe
var groupMembers = [["Bob", 0], ["Sally", 0], ["Chuck Norris", 0], ["Abejing Lincoln", 0]];

var ppl = [];
var payers = [];
var items = [];
var splitType = 5;
items.push(["Chicken", ["Bob", "Chuck Norris"], 20]);
items.push(["Eggs", ["Sally", "Bob"], 10]);
items.push(["Pizza", ["Chuck Norris"], 20]);
ppl.push(["Bob", 67]);
ppl.push(["Sally", 0]);
ppl.push(["Chuck Norris", 0]);
ppl.push(["Abejing Lincoln", 33]);
payers.push(["Bob", 30]);
payers.push(["Abejing Lincoln", 20]);

var price = 51;

//var returned = splitShares(ppl, price);
var returned = calculateWithPayer(ppl, payers, splitType, items, Bob);
groupMembers = updateExpenses(groupMembers, returned);
//console.log(groupMembers);
returned = calculateWithPayer(ppl, payers, 2, null, Bob);
groupMembers = updateExpenses(groupMembers, returned);
//console.log(groupMembers);
returned = calculateMoneyOwed(groupMembers);

for (var i = 0; i < returned.length; ++i) {
	for (var j = 0; j < returned[i].length; ++j) {
		console.log(returned[i][j]);
	}
	console.log();
}
*/
