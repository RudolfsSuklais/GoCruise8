export const CalculateTotalPrice = (car, startDate, endDate) => {
    if (!car || !startDate || !endDate) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start) || isNaN(end) || end <= start) return 0;

    const millisecondsInOneHour = 1000 * 60 * 60;
    const hoursInOneDay = 24;
    const hoursInOneFiveHourBlock = 5;
    const hoursInOneTwoHourBlock = 2;

    const durationMilliseconds = end - start;
    const durationHours = durationMilliseconds / millisecondsInOneHour;
    if (durationHours <= 0) return 0;

    const days = Math.floor(durationHours / hoursInOneDay);
    let remainingHours = durationHours % hoursInOneDay;

    let totalPrice = days * car.pricePer24h;

    if (remainingHours >= hoursInOneFiveHourBlock) {
        const count5hours = Math.floor(
            remainingHours / hoursInOneFiveHourBlock
        );
        totalPrice += count5hours * car.pricePer5h;
        remainingHours %= hoursInOneFiveHourBlock;
    }

    if (remainingHours >= hoursInOneTwoHourBlock) {
        const count2hours = Math.floor(remainingHours / hoursInOneTwoHourBlock);
        totalPrice += count2hours * car.pricePer2h;
        remainingHours %= hoursInOneTwoHourBlock;
    }

    if (remainingHours >= 1) {
        totalPrice += car.pricePer1h;
    }

    return totalPrice;
};
