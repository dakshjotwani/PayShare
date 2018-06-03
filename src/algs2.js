function stringToCents(string) {
    if (typeof string !== 'string'
        || string.match(/^[0-9]*(|\.[0-9]{0,2})$/) === null) return undefined;
    if (string.match(/^[0-9]*$/)) string += ".00";
    else if (string.match(/^[0-9]*\.$/)) string += "00";
    else if (string.match(/^[0-9]*\.[0-9]$/)) string += "0";
    return parseInt(string.replace(/\./g, ''), 10);
}

function centsToString(cents) {
    let tempCents = cents % 100;
    let centsString = tempCents < 10
        ? ("0" + tempCents.toString())
        : tempCents.toString()
    return Math.floor(cents / 100).toString() + "." + centsString;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function splitEqual(users, payer, totalAmount, splitWithPayer) {
    // Work with smallest denomination. Makes life easier.
    let numUsers = Object.keys(users).length - (!splitWithPayer ? 1 : 0);
    let splitCost = Math.floor(totalAmount / numUsers);
    let cents = totalAmount % numUsers;
    
    // Cleanup previous values
    for (let email in users) {
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

function splitUnequal(users, entries, payer) {
    for (let email in users) {
        users[email].userCost = 0;
        users[email].userOwe = 0;
    }

    for (let email in users) {
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

function splitByItem(users, items, totalAmount, payer) {
    let subtotal = 0;

    for (let email in users) {
        users[email].userCost = 0;
        users[email].userOwe = 0;
    }

    for (let itemKey in items) {
        let item = items[itemKey];

        // make object of the subset of users splitting the item
        let userSubset = {};
        for (let key in item.users) {
            let email = item.users[key];
            if (users[email]) userSubset[email] = Object.assign({}, users[email]);
        }

        let splitWithPayer = userSubset[payer] ? true : false;
        userSubset[payer] = Object.assign({}, users[payer])

        // split the item equally
        // TODO: Can be extended to split items using different methods
        let price = item.realPrice;
        subtotal += price;
        let itemSplit = splitEqual(userSubset, payer, price, splitWithPayer);

        // add up returned user items with tracked user items
        for (let email in itemSplit) {
            users[email].userCost += itemSplit[email].userCost;
            users[email].userOwe += itemSplit[email].userOwe;
        }
    }
    let tax = totalAmount - subtotal;
    let taxRemaining = tax;

    for (let email in users) {
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
