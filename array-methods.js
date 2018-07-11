'use strict';

const dataset = require('./dataset.json');

const bankBalances = dataset['bankBalances'];

/*
  create an array with accounts from bankBalances that are
  greater than 100000
  assign the resulting new array to `hundredThousandairs`
*/

const hundredThousandairs = bankBalances
  .filter(currentObject => currentObject.amount > 100000);

/*
  DO NOT MUTATE DATA.

  create a new dataset where each bank object is a new object.
  `amount` and `state` values will be transferred to the new object.
  This new object is different, you will add one new key of `rounded`

  `rounded` value is `amount` rounded to the nearest dollar

  Example:
    {
      "amount": "134758.44",
      "state": "HI",
      "rounded": 134758
    }
  assign the resulting new array to `datasetWithRoundedDollar`
*/
const datasetWithRoundedDollar = bankBalances.map(currentObject => {

  return currentObject = {
    'amount': currentObject.amount,
    'state': currentObject.state,
    'rounded': Math.round(currentObject.amount)
  };

});

/*
  DO NOT MUTATE DATA.

  create a new dataset where each bank object is a new object.
  `amount` and `state` values will be transferred to the new object.
  This new object is different, you will add one new key of `roundedDime`

  `roundedDime` value is `amount` rounded to the nearest 10th of a cent

  Example 1
    {
      "amount": "134758.46",
      "state": "HI"
      "roundedDime": 134758.5
    }
  Example 2
    {
      "amount": "134758.44",
      "state": "HI"
      "roundedDime": 134758.4
    }
  assign the resulting new array to `roundedDime`
*/
const datasetWithRoundedDime = bankBalances.map(currentObject => {

  return {
    'amount': currentObject.amount,
    'state': currentObject.state,
    'roundedDime': roundAndAdd(currentObject.amount, undefined, 1)
  }
});

// set sumOfBankBalances to be the sum of all value held at `amount` for each bank object

const sumOfBankBalances = parseFloat(bankBalances
  .reduce((sum, currentObject) => {
    return sum += parseFloat(currentObject.amount);
  }, 0).toFixed(2)
);

/*
  from each of the following states:
    Wisconsin
    Illinois
    Wyoming
    Ohio
    Georgia
    Delaware
  take each `amount` and add 18.9% interest to it rounded to the nearest cent
  and then sum it all up into one value saved to `sumOfInterests`
 */

let statesArray = ['WI', 'IL', 'WY', 'OH', 'GA', 'DE'];
var sumOfInterests = 0;
let filteredArray = [];

filteredArray = bankBalances.filter(curr => {
  return (statesArray.some(currState => {
    return currState === curr.state;
  }));
});

sumOfInterests = filteredArray.reduce((sum, currentAccount) => {
  return roundAndAdd(sum, (currentAccount.amount * 0.189));
}, 0);


// First method I used to solve the problem
// statesArray.forEach(currentState => {
//   filteredArray.push(...bankBalances
//     .filter(currentAccount => {
//       return currentAccount.state === currentState;
//     })
//   );
// });

/*
  aggregate the sum of bankBalance amounts
  grouped by state
  set stateSums to be a hash table where

  the key is:
    the two letter state abbreviation
  and the value is:
    the sum of all amounts from that state
    the value must be rounded to the nearest cent

  note: During your summation (
    if at any point durig your calculation where the number looks like `2486552.9779399997`
    round this number to the nearest 10th of a cent before moving on.
  )
 */
var stateSums = {};

stateSums = bankBalances.reduce((sum, currentAccount) => {
  let state = currentAccount.state;

  if (!sum[state]) {
    sum[state] = 0.0;
  }

  sum[state] = roundAndAdd(sum[state], currentAccount.amount);
  return sum;
}, {});

// bankBalances.forEach(currentAccount => {
//   let balance = parseFloat(currentAccount.amount);
//   let state = currentAccount.state;

//   if (!stateSums[state]) {
//     stateSums[state] = 0.0;
//   }

//   stateSums[state] = roundAndAdd(stateSums[state], balance);

// });

/*
  for all states *NOT* in the following states:
    Wisconsin
    Illinois
    Wyoming
    Ohio
    Georgia
    Delaware
  sum the amount for each state (stateSum)
  take each `stateSum` and calculate 18.9% interest for that state
  sum the interest values that are greater than 50,000 and save it to `sumOfHighInterests`

  note: During your summation (
    if at any point durig your calculation where the number looks like `2486552.9779399997`
    round this number to the nearest 10th of a cent before moving on.
  )
 */

var sumOfHighInterests = 0;
let filteredOtherArray = [];

filteredOtherArray = bankBalances.filter(curr => {
  return !(statesArray.some(currState => {
    return currState === curr.state;
  }));
});

const otherStateSums = filteredOtherArray.reduce((sum, currentAccount) => {
  let state = currentAccount.state;

  if (!sum[state]) {
    sum[state] = 0.0;
  }

  sum[state] = roundAndAdd(sum[state], currentAccount.amount);

  return sum;
},{ });

sumOfHighInterests = Object.values(otherStateSums)
  .reduce((sum, currentStateTotal) => {
    let interest = parseFloat(currentStateTotal) * 0.189;
    if (interest > 50000) {
      sum = roundAndAdd(sum + interest);
    }

    return sum;

  }, 0);

//Original method with forEach
// statesArray.forEach(currentState => {
//   filteredOtherArray = filteredOtherArray.filter(currentAccount => {
//     return (currentAccount.state !== currentState);
//   });
// });

/*
  set `lowerSumStates` to be an array of two letter state
  abbreviations of each state where the sum of amounts
  in the state is less than 1,000,000
 */
var lowerSumStates = [];

const totalStateSums = bankBalances.reduce((sum, currentAccount) => {
  let state = currentAccount.state;

  if (!sum[state]) {
    sum[state] = 0.0;
  }

  sum[state] = roundAndAdd(sum[state], currentAccount.amount);
  
  return sum;
},{ });

Object.entries(totalStateSums).forEach(stateAccount => {
  if (stateAccount[1] < 1000000) {
    lowerSumStates.push(stateAccount[0]);
  }
});

/*
  aggregate the sum of each state into one hash table
  `higherStateSums` should be the sum of all states with totals greater than 1,000,000
 */

var higherStateSums = Object.entries(totalStateSums).reduce((sum,stateAccount) => {
  if (stateAccount[1] > 1000000) {
    sum = roundAndAdd(sum, stateAccount[1]);
  }
  return sum;
},0);

/*
  from each of the following states:
    Wisconsin
    Illinois
    Wyoming
    Ohio
    Georgia
    Delaware
 
  Check if all of these states have a sum of account values
  greater than 2,550,000
 
  if true set `areStatesInHigherStateSum` to `true`
  otherwise set it to `false`
 */

var areStatesInHigherStateSum = statesArray.every(currentState => {
  return totalStateSums[currentState] > 2550000;
});


/*
  Stretch Goal && Final Boss
 
  set `anyStatesInHigherStateSum` to be `true` if
  any of these states:
    Wisconsin
    Illinois
    Wyoming
    Ohio
    GeorgiaObject.values(lowerSumStates);
    Delaware
  have a sum of account values greater than 2,550,000
  otherwise set it to be `false`
 */

var anyStatesInHigherStateSum = statesArray.some(currentState => {
  return totalStateSums[currentState] > 2550000;
});

function roundAndAdd(number1, number2, decimalPlace) {

  if (!decimalPlace) {
    decimalPlace = 2;
  }

  number1 = parseFloat(number1);

  if (number2) {

    number2 = parseFloat(number2);

    return parseFloat((number1 + number2).toFixed(decimalPlace));
  } else {
    return parseFloat(number1.toFixed(decimalPlace));
  }
}

module.exports = {
  hundredThousandairs: hundredThousandairs,
  datasetWithRoundedDollar: datasetWithRoundedDollar,
  datasetWithRoundedDime: datasetWithRoundedDime,
  sumOfBankBalances: sumOfBankBalances,
  sumOfInterests: sumOfInterests,
  sumOfHighInterests: sumOfHighInterests,
  stateSums: stateSums,
  lowerSumStates: lowerSumStates,
  higherStateSums: higherStateSums,
  areStatesInHigherStateSum: areStatesInHigherStateSum,
  anyStatesInHigherStateSum: anyStatesInHigherStateSum
};
