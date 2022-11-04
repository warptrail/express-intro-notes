function getRandomNumber(min, max) {
  const totalEle = max - min + 1;
  const result = Math.floor(Math.random() * totalEle) + min;
  return result;
}
function createArrayOfNumbers(start, end) {
  const myArray = [];
  for (let i = start; i <= end; i++) {
    myArray.push(i);
  }
  return myArray;
}

function generateRandomArrayNoRep(start, end, pull) {
  const numbersArray = createArrayOfNumbers(start, end);
  const newArray = [];
  console.log(numbersArray);

  if (pull > end) {
    console.error('pull cannot be longer than max');
    return { error: 'pull cannot be longer than max' };
  }

  if (numbersArray.length === 0) {
    console.log('No more random number');
    return newArray;
  }
  for (let i = 0; i < pull; i++) {
    const randomIndex = getRandomNumber(0, numbersArray.length - 1);
    const randomNumber = numbersArray[randomIndex];
    numbersArray.splice(randomIndex, 1);
    newArray.push(randomNumber);
    console.log(randomNumber);
  }

  return newArray;
}

// console.log(process.argv);
// const start = parseInt(process.argv[2]);
// const end = parseInt(process.argv[3]);
// const pull = parseInt(process.argv[4]);
// console.log(process.argv.length);
// console.log(start, end, pull);
// console.log(numbersArray);

// generateRandomArrayNoRep(start, end, pull);

module.exports = generateRandomArrayNoRep;
