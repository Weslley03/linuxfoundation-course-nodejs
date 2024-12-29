#!/usr/bin/env node
import got from 'got';
const API = `http://localhost:3000`;

const usage = (msg = `Back office for My App`) => {
  console.log(`\n${msg}\n`);
  console.log(`usage: cmd <ID> <amount >`);
};

//get the arguments from the command line.
const argv = process.argv.slice(2);

//if there are no arguments, show the usage and exit.
if(argv.length < 2) {
  usage();
  process.exit(1);
};

//deconstruct the arguments into variables
const [ argId, argAmount ] = argv;

//check if the amount ' is a number.
const amount  = parseInt(argAmount);

//if there are no arguments, show the usage and exit.
if(isNaN(amount )) {
  usage(`Error: <AMOUNT> must be a number`);
  process.exit(1);
};

//update the order with a given ID

try{
  //use GOT to make a POST request to the API
  await got.post(`${API}/orders/${argId}`, {
    json: { amount },
  })
  //log the result to the console
  console.log(`order ${argId} updated with amount ${amount}`);
}catch(err) {
  //if there is an error, log it to the console and exit
  console.log(err.message);
  process.exit(1);
};