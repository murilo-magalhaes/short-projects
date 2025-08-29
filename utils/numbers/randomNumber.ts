export default function randomNumber(max: number, min: number = 0): number {
    return Math.random() * (max - min) + min;
}