'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'LuuL Tesfay',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

//formatter the currency using this  usable function

const forrmatedCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]); //this line of  code print  the dates  with every movement becouse we use  [i] index
    console.log(date);
    //we added  date and time to our app bankList

    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();

    const displayDate = `${month}/ ${day} /${year} `; //04/ 02 /2021 ,20:30

    //we are formatting the currency according to the  account country
    const formattedMov = forrmatedCur(mov, acc.locale, acc.currency); //we pass the value to the function  forrmatedCur

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
        
      </div>
    `; //<div class="movements__value">${mov.toFixed(2)}€</div>

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = forrmatedCur(
    acc.balance,
    acc.locale,
    acc.currency
  ); //`${acc.balance.toFixed(2)}€`;   this is old code we replace by the forrmatedCur function
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = forrmatedCur(incomes, acc.locale, acc.currency); //`${incomes.toFixed(2)}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = forrmatedCur(
    Math.abs(out),
    acc.locale,
    acc.currency
  ); // this is new code replces the commented out code
  //`${Math.abs(out.toFixed(2))}€`; //tofixed(2 ) fix the unnessesary numbers after the decimal point

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = forrmatedCur(
    Math.abs(interest),
    acc.locale,
    acc.currency
  ); //new code
  //`${interest.toFixed(2)}€`;// old code
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};
////////lets add setInterval timer to the bank list  if we dont use the bank list then when time reach 0  it logged out
const startLogOutTimer = function () {
  let time = 120; //100 secound
  const timer = setInterval(function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0); //we omiit the decimal parts using Math.trunc and then we added also the  start pod to make it double digit
    const sec = String(Math.trunc(time % 60)).padStart(2, 0);
    //in each call print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timer);

      labelWelcome.textContent = 'Log in To Get Started';
      containerApp.style.opacity = 0;
    }
    time--; //every time it decrese by 1 second
    //when 0 seconds stop timer and log out user
  }, 1000);
  return timer;
};

///////////////////////////////////////
// Event handlers
let currentAccount, timer; //this   variables is golobal variable becouse we use them in all the  acounts

//fake account login
//currentAccount = account1;
//updateUI(currentAccount);
//containerApp.style.opacity = 100;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    //we added  date and time to our app bankList
    const nows = new Date();
    const day = `${nows.getDate()}`.padStart(2, 0);
    const month = `${nows.getMonth() + 1}`.padStart(2, 0);
    const year = nows.getFullYear();
    const hour = nows.getHours();
    const min = `${nows.getMinutes()}`.padStart(2, 0);
    labelDate.textContent = `${month}/ ${day} /${year}, ${hour}:${min}`; //04/ 02 /2021 ,20:30

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //we call the timer to log off  and also clear the current account when we open another  account
    if (timer) clearInterval(timer); //this line of code clears or ends the current account timer  and when we log to the new account we start over with new timer
    timer = startLogOutTimer();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //date added to transfer
    currentAccount.movementsDates.push(new Date().toISOString()); //"2021-04-03T04:54:07.686Z"  with  toISOString()    and with out toISOstring   Date Fri Apr 02 2021 21:59:36 GMT-0700 (Pacific Daylight Time)
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    //reset timer while the person doing his transfer its not logout him instead it resets the timer and gives him extra time  for his activity to be done
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value); //this rounds the floor to the the lowest intger

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    //timer for loan is added
    setTimeout(function () {
      ///this will give us loan after 3 second  or it means after the 3 seconds expaired
      // Add movement
      currentAccount.movements.push(amount);
      // add loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);
      //reset timer while the person doing his transfer its not logout him instead it resets the timer and gives him extra time  for his activity to be done
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 3000);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

//NUMBNERS
/*And the first thing that you should know about numbers is that in JavaScript,
all numbers are presented internally as floating point numbers.So basically, always as decimals,
no matter if we actually write them as integers or as decimals.*/

console.log(23 === 23.0); //true       //and so you see that 23 is, in fact, the same as 23.0. Okay? And that's the reason why we only have one data type for all numbers.

/**Also, numbers are represented internally in a 64 base 2 format. So that means that numbers are always stored in a binary format.*/

//base  10 -  0 to 9// 1/10 is simply 0.1.And so that's very easy to represent.But, for example, if we were trying to do 3/10, gives us  0.33333333...
//then that is also impossible to represent for us

//Binary base 2 - 0 1
console.log(0.1 + 0.2); //0.30000000000000004
console.log(0.1 + 0.2 === 0.3); //false        incorrect as we know. This should be true but well, this is simply an error

/////CONVERSION
//change string to number
console.log(Number('23')); //23  number
//esiest way to change string to number
console.log(+'23'); //23  number

//Parsing     note: parseInt    represent intger        pasreFloat represent float number
console.log(Number.parseInt('30px', 10)); //this will read the number 30 and it was not string now  and even we can add the number  base 10 that prevent some bugs
console.log(Number.parseInt('30px', 2)); //this will not work becouse we make it the base of 2     outputs NaN
//note the above code to work it should start with number
console.log(Number.parseInt('e30px', 10)); //NaN    this sould be start with numbers not  letter

console.log(Number.parseFloat('2.5rem', 10)); //2.5
console.log(Number.parseInt('2.5rem', 10)); //2  only read 2
//console.log(parseFloat('2.5rem', 10)); //2.5  but old way

//isNaN  checking if value is NaN
console.log(Number.isNaN(20)); //false
console.log(Number.isNaN('20')); //false
console.log(Number.isNaN(+'20x')); //NAN  true
console.log(Number.isNaN(20 / 0)); //false    it is infinity

//isFinite   checking if value is number  or nut
console.log(Number.isFinite(20)); //true
console.log(Number.isFinite('20')); //false
console.log(Number.isFinite('20X')); //false
console.log(Number.isFinite(20 / 0)); //false

//////Math and Rounding
console.log(Math.sqrt(25)); //5 //sqareroot
console.log(25 ** (1 / 2)); //5  same with above code
console.log(8 ** (1 / 3)); // 2    only to calculate cubic root

//max and min
console.log(Math.max(5, 18, 23, 11, 2)); //23
console.log(Math.max(5, 18, '23', 11, 2)); //23
console.log(Math.max(5, 18, '23px', 11, 2)); //NaN

console.log(Math.min(5, 18, 23, 11, 2)); //11

//constants
console.log(Math.PI); //3.141592653589793
console.log(Math.PI * Number.parseFloat('10px') ** 2); //314.1592653589793  area of a cicle with radius 10

//formla of rundom numbers

//console.log(Math.trunc(Math.random() * 6) + 1); //numbers between 1--6

//lets make nice formula
const randomInt = (max, min) =>
  Math.floor(Math.random() * (max - min) + 1) + min; //0...1-> 0...(max-min)->min...max  we change trunc with floor  becouse floor work in all situations
//console.log(randomInt(10, 20));

//Rounding Intgers

console.log(Math.round(23.3)); //23
console.log(Math.round(23.9)); //24  //they round to the nearest intger

console.log(Math.ceil(23.3)); //24
console.log(Math.ceil(23.9)); //24

console.log(Math.floor(23.3)); //23
console.log(Math.floor('23.9')); //23

console.log(Math.trunc(23.3)); //23
console.log(Math.trunc(23.9)); //23

console.log(Math.trunc(-23.3)); //-23
console.log(Math.floor(-23.3)); //-24  it rounded to the above becouse its negative

///ROUNDING DECIMALS
console.log((2.7).toFixed(0)); //3
console.log((2.7).toFixed(3)); //2.700
console.log((2.345).toFixed(2)); //2.35
console.log(+(2.345).toFixed(2)); //2.35 //this changed to number

// The Remainder Operator
console.log(5 % 2);
console.log(5 / 2); // 5 = 2 * 2 + 1

console.log(8 % 3);
console.log(8 / 3); // 8 = 2 * 3 + 2

console.log(6 % 2);
console.log(6 / 2);

console.log(7 % 2);
console.log(7 / 2);
//check if the number is even or not
const isEven = n => n % 2 === 0;
console.log(isEven(8));
console.log(isEven(23));
console.log(isEven(514));

//lets select all movement from banklist and attach to event handler  and make every 2nd row of the movement becomes 'orengered'
labelBalance.addEventListener('click', function () {
  [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
    if (i % 2 === 0) row.style.backgroundColor = 'coral'; //every 2nd row coral like even number
    if (i % 3 === 0) row.style.backgroundColor = 'lightblue'; //every 3rd row
  });
});

//BIGINTIGER

///////////////////////////////////////
// Working with BigInt
console.log(2 ** 53 - 1); //9007199254740991
console.log(Number.MAX_SAFE_INTEGER); //9007199254740991  javascript only can hold this amount of number  but above this it dosen't represent  it accurately before ES2020
console.log(2 ** 53 + 1);
console.log(2 ** 53 + 2);
console.log(2 ** 53 + 3);
console.log(2 ** 53 + 4);

console.log(4838430248342043823408394839483204n); //4838430248342043823408394839483204n   the n represents the bigInt
console.log(BigInt(48384302)); //the same as the above code   both represent big int

// Operations
console.log(10000n + 10000n); //20000n
console.log(36286372637263726376237263726372632n * 10000000n); //362863726372637263762372637263726320000000n
//console.log(Math.sqrt(16n)); //theise kind of methods is not working     can't convert BigInt to number

const huge = 20289830237283728378237n;
const num = 23;
//console.log(huge * num); //not working  multiplication of bigInt and regular number is imposible  to make it work we need to change the regular number to big int
console.log(huge * BigInt(num)); //466666095457525752699451n   now we fix the above code  we  change the regular number to big int and aded it

// Exceptions
console.log(20n > 15); //but this worked   bigInt> regular number  sets to true
console.log(20n === 20); //false    becouse  its strict equality  and in strict equality there is no type conversion
console.log(typeof 20n); //bigint
console.log(20n == '20'); //true  becouse this is loose and  there is type conversion

console.log(huge + ' is REALLY big!!!'); //20289830237283728378237 is REALLY big!!!     this changes the huge number to string

// Divisions
console.log(11n / 3n); //3n
console.log(12n / 3n); //4n
console.log(13n / 3n); //4n

console.log(10 / 3); //3.3333333333333335

///////////////////////////////////////
// Creating Dates

const now = new Date(); //gives us current time
console.log(now);

console.log(new Date('Aug 02 2020 18:05:41')); //Sun Aug 02 2020 18:05:41 GMT-0700 (Pacific Daylight Time)
console.log(new Date('December 24, 2015')); //Thu Dec 24 2015 00:00:00 GMT-0800 (Pacific Standard Time)
console.log(new Date(account1.movementsDates[0])); //Date Mon Nov 18 2019 13:31:17 GMT-0800 (Pacific Standard Time)

console.log(new Date(2037, 10, 19, 15, 23, 5)); //Date Thu Nov 19 2037 15:23:05 GMT-0800 (Pacific Standard Time)

console.log(new Date(2037, 10, 31)); //Date Tue Dec 01 2037 00:00:00 GMT-0800 (Pacific Standard Time)

console.log(new Date(0)); //Date Wed Dec 31 1969 16:00:00 GMT-0800 (Pacific Standard Time)   the day the time is set
console.log(new Date(3 * 24 * 60 * 60 * 1000)); //Date Sat Jan 03 1970 16:00:00 GMT-0800 (Pacific Standard Time)    the  4th day after the time was set

// Working with dates
const future = new Date(2037, 10, 19, 15, 23); //Date Thu Nov 19 2037 15:23:00 GMT-0800 (Pacific Standard Time)
console.log(future);
console.log(future.getFullYear()); //2037
console.log(future.getMonth()); //10
console.log(future.getDate()); //19
console.log(future.getDay()); //4
console.log(future.getHours()); //15
console.log(future.getMinutes()); //23
console.log(future.getSeconds()); //0      secounds
console.log(future.toISOString()); // 2037-11-19T23:23:00.000Z      The International Organization for Standardization (ISO) date format is a standard way to express a numeric calendar date that eliminates ambiguity.
console.log(future.getTime()); //2142285780000      total time since 1970 to  the future  Thu Nov 19 2037 15:23:00 GMT-0800

console.log(new Date(2142256980000)); //Date Thu Nov 19 2037 07:23:00 GMT-0800 (Pacific Standard Time)    this gives as the exact time of the future

console.log(Date.now()); //1617375170358

future.setFullYear(2040); //Date Mon Nov 19 2040 15:23:00 GMT-0800 (Pacific Standard Time)    we set the date  of the future to new year
console.log(future);

///////OPERATION with DATES

//we can calculate  dates between two  differnt dates   lets  see the example below  that  a function that return the difference between two diffrent dates

const calcDaydifference = (day1, day2) =>
  Math.abs(day2 - day1) / (1000 * 60 * 60 * 24);

const daysDiffernce = calcDaydifference(
  new Date(2021, 2, 10),
  new Date(2021, 2, 14)
);
console.log(daysDiffernce); //the difference is 4 days
//console.log(daysDiffernce); //1378800000
//note: we can use the   above code  to modifay our bank list movement dates to  1 day  2day   ...see its implementation in 'final' folder

/////////// check the internationalization video and implimentation in final folder

//////////INTERNATIONALIZING NUMBERS

///we formatted dates using the Internationalization API.

//Eg  numbers in different countries
const numb = 388789.23;
console.log('US:', new Intl.NumberFormat('en-US').format(numb)); //US: 388,789.23
console.log('UK:', new Intl.NumberFormat('en-UK').format(numb)); //UK: 388,789.23
console.log('Syria:', new Intl.NumberFormat('ar-SY').format(numb)); //Syria: ٣٨٨٬٧٨٩٫٢٣

//lets create an object
//const option = { style: 'unit', unit: 'celsius' }; //you can also do {style:'currencies',currencies:'Euro'}
const option = {
  style: 'currency',
  unit: 'celsius',
  currency: 'EUR',
  //useGrouping: false, //if we   assign useGrouping: false,  then the numbers prints with out the seperators  US: €388789.23  UK: €388789.23   Syria: ٣٨٨٧٨٩٫٢٣ €  Germany: 388789,23 € ,en-US €388789.23
};

console.log('US:', new Intl.NumberFormat('en-US', option).format(numb)); //US: 388,789.23°C      currencies n-US €388,789.23
console.log('UK:', new Intl.NumberFormat('en-UK', option).format(numb)); //
console.log('Syria:', new Intl.NumberFormat('ar-SY', option).format(numb)); // if we use currency  ٣٨٨٬٧٨٩٫٢٣ €
console.log('Germany:', new Intl.NumberFormat('de-DE', option).format(numb)); //Germany:88.789,23 °C    if we use currencies   388.789,23 €

//if we want the type of the number based on the current browser
console.log(
  navigator.language,
  new Intl.NumberFormat(navigator.language, option).format(numb)
); //en-US €388,789.23    becouse am in the use this result shown en-US

////////////////////Timers
////setTimeout allows us to run a function only once after the interval of time.
//The setTimeout() is a method of the window object. The setTimeout()  sets a timer and executes a callback function after the timer expires.

//The following illustrates the syntax of setTimeout():

//let timeoutID  = setTimeout(cb [,delay], arg1, arg2,...);

/*
-cb is a callback function to be executed after the timer expires.
-delay is the time in milliseconds that the timer should wait before executing the callback function. If you omit it, the delay defaults to 0.
-arg1, arg2, … are arguments passed to the cb callback function.
*/

//eg
//note here we use arrow function
setTimeout(() => console.log('your pizza is ready'), 3000); //your pizza is ready      it output after 3 seconds
//we can pass arguments like this

setTimeout(
  (arg1, arg2, arg3) =>
    console.log(`your pizza is ready with ${arg1}, ${arg2}, and  ${arg3}`),
  3000,
  'oliveOile',
  'meat',
  'spenach'
); //your pizza is ready with oliveOile, meat, and  spenach        here we passed arguments of three ingredient and prints after the time is expaired in 3 second

////clearTimeout() The clearTimeout() method of the WindowOrWorkerGlobalScope mixin cancels a timeout previously established by calling setTimeout()

const ingredients = ['meat', 'oliveOile', 'spinach']; //array of ingradient
const pizzaTimeOut = setTimeout(
  (arg1, arg2, arg3) =>
    console.log(`your pizza is ready with ${arg1}, ${arg2}, and  ${arg3}`),
  3000,
  ...ingredients //we use spread to unpack the ingredient array here
); //your pizza is ready with oliveOile, meat, and  spenach

if (ingredients.includes('spinach')) clearTimeout(pizzaTimeOut); //there   the pizza order is  not runing  it cleared out b/c spinach is included

//note that : the  clear time out method  cancels the pizza order  that set by the setTimeOut method   if   it includes ingradient  spinach  but if not it dosent cancel

/////////  setInterval
//setInterval allows us to run a function repeatedly, starting after the interval of time, then repeating continuously at that interval.

//eg
/*
setInterval(() => {
  const now = new Date();
  console.log(now);
}, 1000);//this display the date once every secound
*/

////////lets add setinterval timer to the bank list  if we dont use the bank list then when time reach 0  it logged out
