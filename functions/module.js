export function addNumber(a, b) {
    return a + b
}

export function subNumber(a, b){
    return b - a
}

export default function average(arr) {
    return arr.reduce((total, value) => total + value, 0) / arr.length
}