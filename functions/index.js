function greetUser(username) {
    if (username === "tobi") {
        console.log("Authorize")
    } else {
        console.log("Not Authorize")
        return
    }

    console.log(`Welcome ${username}, We are happy to see you`)
}

const todayDate = () => {
    console.log(Date())
}

todayDate()

// Higher Order Function

const square = (value) => {
    console.log(`Square of ${value} is ${value * value}`)
}

function higherOrderFn(nFn, name){
    nFn(name);
    console.log("Route to the dashboard")
}

higherOrderFn(greetUser, "tobi")
higherOrderFn(square, 5)

