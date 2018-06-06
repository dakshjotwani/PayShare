/**
 * Converts a money value string of the form '[0-9]*(|\.[0-9]{0,2})'
 * to an integer of cents (the lowest denomination)
 * @param {string} string of the form ^[0-9]*(|\.[0-9]{0,2})$
 * @return {number} integer of cents (lowest denomination)
 */
function stringToCents(string) {
    if (typeof string !== 'string'
        || string.match(/^[0-9]*(|\.[0-9]{0,2})$/) === null) return undefined;
    if (string.match(/^[0-9]*$/)) string += '.00';
    else if (string.match(/^[0-9]*\.$/)) string += '00';
    else if (string.match(/^[0-9]*\.[0-9]$/)) string += '0';
    return parseInt(string.replace(/\./g, ''), 10);
}

/**
 * Converts an integer of cents to a money value string
 * @param {number} cents as an integer
 * @return {string} of the form ^[0-9]*(|\.[0-9]{0,2})$
 */
function centsToString(cents) {
    let tempCents = cents % 100;
    let centsString = tempCents < 10
        ? ('0' + tempCents.toString())
        : tempCents.toString();
    return Math.floor(cents / 100).toString() + '.' + centsString;
}

/**
 * Shuffles elements in an array based on Durstenfeld's shuffle algorithm
 * @param {array} array of elements
 * @return {array} shuffled input array
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/**
 * Splits totalAmount equally amongst users. Distributes cents randomly.
 * @param {object} users Object of user objects with form key:{name, ...}
 * @param {string} payer email id
 * @param {number} totalAmount in cents
 * @param {boolean} splitWithPayer true if payer should be included in split
 *                  false otherwise
 * @return {object} users object with users of form key:{name,userCost,userOwe}
 */
function splitEqual(users, payer, totalAmount, splitWithPayer) {
    let numUsers = Object.keys(users).length - (!splitWithPayer ? 1 : 0);
    let splitCost = Math.floor(totalAmount / numUsers);
    let cents = totalAmount % numUsers;

    // Cleanup previous values
    for (let email in users) {
        if (!users.hasOwnProperty(email)) continue;
        users[email].userCost = 0;
        users[email].userOwe = 0;
    }

    // assign splitCost to everyone in dollars
    for (let email in users) {
        if (email === payer && !splitWithPayer) continue;
        users[email].userCost = splitCost;
        if (email !== payer) {
            users[email].userOwe = -1 * splitCost;
            users[payer].userOwe += splitCost;
        }
    }

    // assign cents randomly
    let emails = shuffleArray(Object.keys(users));
    while (cents > 0) {
        for (let i in emails) {
            if (!emails.hasOwnProperty(i)) continue;
            let email = emails[i];
            if (email === payer && !splitWithPayer) continue;
            users[email].userCost += 1;
            cents--;
            if (email !== payer) {
                users[email].userOwe += -1;
                users[payer].userOwe += 1;
            }
            if (cents <= 0) break;
        }
        if (cents <= 0) break;
    }
    return users;
}

/**
 * Assigns input given by user to users object. Splits cost unequally.
 * @param {object} users Object of user objects with form key:{name, ...}
 * @param {object} entries Object of entries provided by user
 * @param {string} payer email id
 * @return {object} users object with users of form key:{name,userCost,userOwe}
 */
function splitUnequal(users, entries, payer) {
    for (let email in users) {
        if (!users.hasOwnProperty(email)) continue;
        users[email].userCost = 0;
        users[email].userOwe = 0;
    }

    for (let email in users) {
        if (!users.hasOwnProperty(email)) continue;
        let cost = entries[email];
        if (cost === undefined) cost = 0;
        users[email].userCost = cost;
        if (email !== payer) {
            users[email].userOwe = -1 * cost;
            users[payer].userOwe += cost;
        }
    }

    return users;
}

/**
 * Splits costs based on items selected by users. Each item is split equally
 * amongst the users that have selected it.
 * @param {object} users Object of user objects with form key:{name, ...}
 * @param {object} items Object of form itemId:{users:{uid:email}, realPrice}
 * @param {number} totalAmount in cents
 * @param {string} payer email id
 * @return {object} users object with users of form key:{name,userCost,userOwe}
 */
function splitByItem(users, items, totalAmount, payer) {
    let subtotal = 0;

    for (let email in users) {
        if (!users.hasOwnProperty(email)) continue;
        users[email].userCost = 0;
        users[email].userOwe = 0;
    }

    for (let itemKey in items) {
        if (!items.hasOwnProperty(itemKey)) continue;
        let item = items[itemKey];

        // make object of the subset of users splitting the item
        let userSubset = {};
        for (let key in item.users) {
            if (!item.users.hasOwnProperty(key)) continue;
            let email = item.users[key];
            if (users[email]) {
                userSubset[email] = Object.assign({}, users[email]);
            }
        }

        let splitWithPayer = userSubset[payer] ? true : false;
        userSubset[payer] = Object.assign({}, users[payer]);

        // split the item equally
        // TODO: Can be extended to split items using different methods
        let price = item.realPrice;
        subtotal += price;
        let itemSplit = splitEqual(userSubset, payer, price, splitWithPayer);

        // add up returned user items with tracked user items
        for (let email in itemSplit) {
            if (!itemSplit.hasOwnProperty(email)) continue;
            users[email].userCost += itemSplit[email].userCost;
            users[email].userOwe += itemSplit[email].userOwe;
        }
    }

    // Split tax based on subtotal share of user
    let tax = totalAmount - subtotal;
    let taxRemaining = tax;

    for (let email in users) {
        if (!users.hasOwnProperty(email)) continue;
        let userTax = Math.floor((users[email].userCost / subtotal) * tax);
        users[email].userCost += userTax;
        if (email !== payer) {
            users[email].userOwe += -1 * userTax;
            users[payer].userOwe += userTax;
        }
        taxRemaining -= userTax;
    }

    let emails = shuffleArray(Object.keys(users));
    while (taxRemaining > 0) {
        for (let i in emails) {
            if (!emails.hasOwnProperty(i)) continue;
            let email = emails[i];
            users[email].userCost += 1;
            taxRemaining--;
            if (email !== payer) {
                users[email].userOwe += -1;
                users[payer].userOwe += 1;
            }
            if (taxRemaining <= 0) break;
        }
        if (taxRemaining <= 0) break;
    }

    return users;
}

export {stringToCents, centsToString, splitEqual, splitUnequal, splitByItem};
