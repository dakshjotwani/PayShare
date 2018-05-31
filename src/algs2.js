function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function splitEqual(users, payer, totalAmount) {
    // Work with smallest denomination. Makes life easier.
    let numUsers = Object.keys(users).length;
    let totalCost = Math.trunc(totalAmount * 100);
    let splitCost = Math.trunc(totalCost / numUsers);
    let cents = totalCost - (splitCost * numUsers);
    users[payer].userOwe = 0;
    
    // Cleanup previous values
    for (let email in users) {
        users[email].userCost = 0;
        users[email].userOwe = 0;
    }
    
    // assign splitCost to everyone in dollars
    for (let email in users) {
        let cost = splitCost / 100;
        users[email].userCost = cost;
        if (email !== payer) {
            users[email].userOwe = -1 * cost;
            users[payer].userOwe += cost;
        }
    }
    
    // assign cents randomly
    let emails = shuffleArray(Object.keys(users));
    while (cents > 0) {
        for (let i in emails) {
            let email = emails[i];
            users[email].userCost += 0.01;
            cents--;
            if (email !== payer) {
                users[email].userOwe += -0.01;
                users[payer].userOwe += 0.01;
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
        cost /= 100;
        users[email].userCost = cost;
        if (email !== payer) {
            users[email].userOwe = -1 * cost;
            users[payer].userOwe += cost;
        }
    }

    return users;
}

function splitByItem(users, items, payer) {
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

        // split the item equally
        // TODO: Can be extended to split items using different methods
        let price = parseFloat(item.realPrice);
        let itemSplit = splitEqual(userSubset, payer, price);

        // add up returned user items with tracked user items
        for (let email in itemSplit) {
            users[email].userCost += itemSplit[email].userCost;
            users[email].userOwe += itemSplit[email].userOwe;
        }
    }
    return users;
}

export {splitEqual, splitUnequal, splitByItem};
