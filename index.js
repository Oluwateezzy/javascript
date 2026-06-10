let age = "tobi"

let name = "tobi"

let isValid = true
let x = null
let y = undefined

// console.log(typeof age)
// console.log(typeof name)
// console.log(typeof isValid)
// console.log(typeof x)
// console.log(typeof y)

// console.log("Waiting !!!")
// let xx = setTimeout(() => {
//     console.log("Waiting over !!!")
//     // fetch all products
//     // return all products
// }, 30000)

// console.log(xx)

// Promise.all([
//     setTimeout((resolve, error) => {
//         console.log("Waiting over !!!")
//         // fetch all products
//         // return all products
//     }, 30000),
//     setTimeout(() => {
//         console.log("Waiting over !!!")
//         // fetch all products
//         // return all products
//     }, 40000)
// ])

// console.log("I'm waiting")

// if (typeof age === "number"){
//     console.log(age)
// } else {
//     console.log("Please input the right value")
// }

async function doSomething() {
    await setTimeout(() => {
        console.log("Waiting over !!!")
    }, 40000)

    await setTimeout(() => {
        console.log("Waiting over !!!")
    }, 40000)

    await setTimeout(() => {
        console.log("Waiting over !!!")
    }, 40000)

    await setTimeout(() => {
        console.log("Waiting over !!!")
    }, 40000)

    await setTimeout(() => {
        console.log("Waiting over !!!")
    }, 40000)

    return "oop!"
}

doSomething()

console.log(
    "Ohh I'm waiting for doSomething function"
)