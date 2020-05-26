/**
 * Конвертация даты в формат ДД.ММ.ГГГГ
 *
 * @param date
 * @return {string}
 */
export function convertDate(date) {
    date = new Date(date);

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    if (day < 10) {
        day = "0" + day;
    }

    if (month < 10) {
        month = "0" + month;
    }

    return day + "." + month + "." + year;
}
