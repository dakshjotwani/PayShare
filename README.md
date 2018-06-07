# PayShare
PayShare makes it easy to split expenses by scanning your receipts, and letting each person select the items they bought. Once all items have been accounted for, the payer can split the cost, and all users will be notified about how much they owe the payer.

## Getting Started
1. Download `npm` or `yarn`.
2. Get firebase-tools: `npm install -g firebase-tools`
3. Install dependencies: `yarn install`
4. Update `fire_ADD_API_KEY.js` according to the instructions in the file

## Using PayShare
PayShare is currently hosted on https://payshare.dakshjotwani.com. However, should you choose to deploy your own instance, follow the steps below:

1. Login to firebase: `firebase login`
2. Run `firebase init`, select database and hosting, set build folder to `build`, and set it up as a single page app.
3. `npm run build` or `yarn build`
4. `firebase deploy`

## Known Issues
1. `Image.js` fails to minify when making a production build. For some reason, ignoring this works.
2. PayShare is not a finished product yet, so the entire project is an issue in itself.
