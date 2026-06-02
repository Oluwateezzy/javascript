// console.log("1, 2, 3, 4, 5, 6, 7, 8, 9, 10")


// for (let i = 100; i > 0; i--){
//     if (i % 2 == 0){
//         console.log("Even " + i)
//     } else {
//         console.log("Odd " + i)
//     }
// }

// const fruits = ["mango", "apple", "grape"];

// console.log(fruits)

// fruits.map((fruit) => {
//     if (fruit === "mango") {
//         console.log("Amazing " + fruit)
//     }
//     console.log(fruit)
// })



function search(value){
    for (let x = 1; x <= 100; x++) {
        if (x === value){
            console.log("Found " + value)
            break
        }
        console.log(x)
    }
}

search(50)