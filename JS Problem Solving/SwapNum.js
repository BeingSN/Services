function SwapNumber(x, y) {
  let a = x; //15
  let b = y; //10

  a = a + b;
  b = a - b;
  a = a - b;

  return [a, b];
}
console.log(SwapNumber(10, 15));
