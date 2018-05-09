function splitEqual(users, payer, totalAmount) {
    // Work with smallest denomination. Makes life easier.
    let numUsers = Object.keys(users).length;
    let totalCost = Math.trunc(totalAmount * 100);
    let splitCost = Math.trunc(totalCost / numUsers);
    let cents = totalCost - (splitCost * numUsers);
    users[payer].userOwe = 0;
    console.log(totalCost, splitCost, cents);
    
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
    
    // assign cents. TODO: Shuffle object keys to randomize
    while (cents > 0) {
        for (let email in users) {
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
    console.log(users);
    return users;
}

export {splitEqual};
