"use strict";

const testlib = require('./testlib.js');

let Count = {};
let seqNow = '';
let currentIndex = 0;
let lineCount = 0;
let result=[];
let index=0;
let A= ['A'];
let C= ['C'];
let T= ['T'];
let G= ['G'];
let R= ['G', 'A'];
let Y= ['T', 'C'];
let K= ['G', 'T'];
let M= ['A', 'C'];
let S= ['G', 'C'];
let W= ['A', 'T'];
let B= ['G', 'T', 'C'];
let D= ['G', 'A', 'T'];
let H= ['A', 'C', 'T'];
let V= ['G', 'C', 'A'];
let N= ['A', 'C', 'G', 'T'];
//variable declaration(I never wanted to call this much arrays,but ti is what it takes)

let charArrayMap = {
  'A': A,
  'C': C,
  'T': T,
  'G': G,
  'R': R,
  'Y': Y,
  'K': K,
  'M': M,
  'S': S,
  'W': W,
  'B': B,
  'D': D,
  'H': H,
  'V': V,
  'N': N
};

function stringToCombo(inputString) {
  let sequences = inputString.split('').map(char => charArrayMap[char] || [char]);
  return getCombn(sequences);
}//Call getcombo and pass the strings(Patterns) to char

function getCombn(array, prefix) {
  prefix = prefix || '';

  if (!array.length) {
      return prefix;
  }

  let possiblePat = array[0].reduce(function (possiblePat, value) {
      return possiblePat.concat(getCombn(
          array.slice(1), prefix + value));
  }, []);
  return possiblePat;
}//get all arrays passed into the function and make all possible patterns regarding to the pattern and print it in an array.

function posPatChecker(pattern,index){
  if(index<result.length){
    if(seqNow.endsWith(result[index]))
    {
      Count[pattern]++;
      testlib.foundMatch(pattern, seqNow.length - pattern.length);
    }
    posPatChecker(pattern,index+1);
  }//recursive approach to loop the functions
}//get all possible patterns to be checked against the current sequence and if it matches,it will add 1 to the original pattern and print it out.

function characterProcessor(data, patterns) {
  const charNow = data[currentIndex];

  seqNow += charNow;
  patternChecker(0, patterns);

  currentIndex++;

  if (currentIndex < data.length) {
    characterProcessor(data, patterns);
  }
}//add the new taken character to the sequenceNow,and add it to it so that it can let the further processes to work.

function patternChecker(i, patterns) {
  if (i < patterns.length) {
    const pattern = patterns[i];
    //new pattern loader
    result = stringToCombo(pattern);
    //put all of the results into the result array

    if (seqNow.endsWith(pattern)) {
      Count[pattern]++;
      testlib.foundMatch(pattern, seqNow.length - pattern.length);
    }//so called "Normal Pattern"matching adding and printing
    index=0;
    posPatChecker(pattern,index);
    //this is the other not so "Normal" Pattern matching adding and printing function calling.

    patternChecker(i + 1, patterns);
    //similar to a loop structure that keeps on calling itself.
  }
}

function countReseter() {
  Object.keys(Count).forEach(key => {
    Count[key] = 0;
  });
}//Count Reseter.

testlib.on('ready', function (patterns) {
  patterns.forEach(pattern => {
    Count[pattern] = 0;
  });
  testlib.runTests();
});//basic setups for the test to run smoothly

testlib.on('data', function (data) {
  currentIndex = 0;
  characterProcessor(data, Object.keys(Count));
});//character Processor caller.

testlib.on('reset', function () {
  if (seqNow.length > 0) {
    lineCount++;
    console.log("Matching index check completed\n=========================================");
    seqNow = '';
    console.log("Line " + lineCount + " Pattern Counts:");
    testlib.frequencyTable(Count);
    console.log("=========================================");
    countReseter();
  }
});//end of (mid paragraph)line printer

testlib.on('end', function () {
  lineCount++;
  console.log("Matching index check completed\n=========================================");
  seqNow = '';
  console.log("Line " + lineCount + " Pattern Counts:");
  testlib.frequencyTable(Count);
  console.log("=========================================");
  countReseter();
  console.log("Task Ended!\n=========================================");
});//True End of line printer.

testlib.setup(3, 1);
//setup for test 