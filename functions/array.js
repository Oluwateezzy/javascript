let fruit = [
    "mango",
    "apple",
    "pear"
]

let [mango, , pear] = [
    "mango",
    "apple",
    "pear"
]

console.log(mango)

let a = 10, b = 14;

console.log(a, b);

[a, b] = [b, a];

console.log(a, b)


// console.log(fruit.length)

// // for (let i = 0; i < fruit.length; i++){
// //     console.log(fruit[i])
// // }

// // fruit.map(value => console.log(value))

// // fruit.forEach((value) => console.log(value))


// let numArr = [2, 3, 4, 4, 5, 6, 2]
// let numArr2 = [2, 2, 2]

// let filterNum = numArr.filter(value => value % 2 === 1)
// console.log(filterNum)

// let sum = numArr.reduce((total, value) => total * value, 1)

// let joinFruit = fruit.reduce((combVal, value) => combVal + " " + value, "")

// console.log(sum)
// console.log(joinFruit)

// let search = numArr.find((value) => value == 8)
// console.log(search)

// let someSearch = numArr.some((value) => value == 2)
// console.log(someSearch)

// let everySearch = numArr2.every((value) => value == 2)
// console.log(everySearch)

// let includes = numArr.includes(2)
// console.log(includes)

// let numArr3 = [2, 4, 6, 7, 7, 4]

// let seven = numArr3.filter((value) => value === 7)
// let doubleSeven = seven.map(value => value * 2)
// console.log(doubleSeven.reduce((sum, value) => sum + value, 0))
