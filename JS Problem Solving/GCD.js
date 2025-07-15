function GCD(a, b) {
  return b === 0 ? a : GCD(b, a % b);
}

GCD(10, 20);
