// Calls a function with a specified this value and individual arguments.
// ✅

const person1 = {
  name: "Mohammad",
};

function greet(greeting, punctuation) {
  console.log(`${greeting} ${this.name}${punctuation}`);
}

// greet.call(person1, "AsalamuAlikum", "!");

// apply() – Like call(), but takes arguments as an array.
// Useful when you already have a list/array of arguments.

const personsData = {
  fName: "Mohammad",
  lName: "Shahmeer",
};

function greet(greeting, punctuation) {
  console.log(`${greeting} ${this.fName} ${this.lName}${punctuation}`);
}

// greet.apply(personsData, ["Hi", "!"]);

// 🔹 3. bind() – Returns a new function with a bound this context and optional arguments.
// You can call greetShahmeer() whenever you want.

const person3 = {
  name: "Shahmeer",
};

function greet(greeting, punctuation) {
  console.log(`${greeting}, ${this.name}${punctuation}`);
}

const greetShahmeer = greet.bind(person3, "Hey", "...");
greetShahmeer();
