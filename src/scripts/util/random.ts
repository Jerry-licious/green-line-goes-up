// https://stackoverflow.com/a/36481059
// Gaussian random variable.
export function gaussianRandom(mean: number, std: number): number {
    let u = 1 - Math.random(); // Converts [0, 1) to (0, 1].
    let v = Math.random();
    let z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return z * std + mean;
}


export function clamp(x: number, min: number, max: number): number {
    return Math.min(Math.max(x, min), max);
}