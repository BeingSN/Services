function memoize(fn) {
  const cache = {};
  return function (...args) {
    //rest parameter
    const key = JSON.stringify(args); //[2,3]

    if (cache[key]) {
      return cache[key];
    } else {
      return (cache[key] = fn(...args)); //while calling fn (...) works as passing arguments
    }
  };
}

function add(a, b) {
  return a + b;
}

const cachedAdd = memoize(add);

console.log(cachedAdd(2, 3));
console.log(cachedAdd(2, 3));
