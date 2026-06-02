const user = {
    name: "Tobi",
    password: "pass",
    gender: "male"
}

const {password, ...userResponseData} = user

const userUpdate = {...userResponseData, country: "NIG"}

console.log(userUpdate);

console.log(`my name is ${user.name} and i'm a ${user.gender}`)

console.log("My name is " + user.name + "and i'm a " + user.gender)

console.log(user?.username)

const arrayOfNumber = []
const ObjectOfData = {}
const PIE_NUM = 3.124

console.log(2 === "2")