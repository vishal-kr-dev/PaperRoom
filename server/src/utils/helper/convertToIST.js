export function convertToIST(date) {
    const istOffset = 5.5 * 60 * 60 * 1000;
    const utc = date.getTime();
    return new Date(utc + istOffset);
}
