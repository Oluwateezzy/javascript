// Create variables to store your name, age, and favorite programming language. Print them using a template literal.

let name = "Tobi"
let age = 50
let favouriteProgramming = "JAVASCRIPT"

console.log(`${name}, ${age} and ${favouriteProgramming}`)

// Write a program that checks whether a number is positive, negative, or zero
let num = 0.23

if (num > 0) console.log("positive")
else if (num < 0) console.log("negative")
else console.log("zero")

// Create a function called greetUser that accepts a name and returns a greeting message.
// function greetUser(name){
//     console.log(`Welcome ${name}`)
// }

const greetUser = (name) => {
    console.log(`Welcome ${name}`)
}

greetUser("Tobi")
greetUser("Binta")

// Write an arrow function that multiplies two numbers.
let multiply = (a, b) => {
    console.log(a * b)
}

multiply(3, 6)

// Create a loop that prints numbers from 1 to 20.

for(let i = 1; i <= 20; i++) {
    console.log(i)
}
