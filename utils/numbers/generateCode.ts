// A = 65 - Z = 90

export function randomInInterval(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateCode(length = 6) {
    let code = ''
    for (let i = 0; i < length; i++) {
        const letter = randomInInterval(65, 90).toString()
        code += String.fromCharCode(Number(letter))
    }
    return code
}