// logic is if the char is ( and then if we get ) then we will pop the ( char from stack right

function BalancedParantheses(str) {
  let stack = [];

  for (let char of str) {
    if (char === "(") {
      stack.push(char); // Add opening parenthesis to the stack
    } else if (char === ")") {
      if (stack.length === 0) return false; // No match for closing one
      stack.pop(); // Remove the last opening parenthesis
    }
  }
  console.log(stack, "stack");

  return stack.length === 0; // If stack is empty, everything matched
}

console.log(BalancedParantheses("(())"));

function checkBalancedParantheses(str) {
  let stack = [];

  for (char of str) {
    if (char === "(") {
      stack.push(char);
    } else if (char === ")") {
      stack.pop();
      if (stack.length === 0) return;
    }
  }
  return stack.length === 0;
}

checkBalancedParantheses("(())");
