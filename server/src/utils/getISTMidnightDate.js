// utils/dateUtils.js (or at the top of your controller file)
export function getISTMidnightDate(date = new Date()) {
    const istDateString = date.toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
    });
    const istDate = new Date(istDateString);
    istDate.setHours(0, 0, 0, 0);
    return istDate;
}
