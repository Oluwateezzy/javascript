import x, {addNumber, subNumber} from "./module.js"

const users = {
    user1: { username: "tobi", role: "admin" },
    user2: { username: "ola", role: "user" },
    user3: { username: "peace", role: "user" }
}

// console.log(users.user1.username)
// console.log(users["user1"]["username"])

// const school = {
//     name: "LASU",
//     numberOfStudent: 10000,
//     departments: ["CSC", "Arts"],
//     nameOfVc: "Toyin",
//     address: "Lagos"
// }

// // console.log(school["departments"])

// // Object.keys(school).forEach(value => console.log(school[value]))

// for (key in school){
//     console.log(school[key])
// }

// function doSomething({name, pass}){
//     console.log(name, pass)
// }

// doSomething({name: "tobi", pass: "Password123!"})

console.log(addNumber(4, 5))
console.log(subNumber(4, 5))
console.log(x([6, 7, 7, 8]))
