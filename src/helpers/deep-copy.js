/**
 * Хелпер для глубокого копирования.
 *
 * @param {any} json
 * @return {any}
 */
export function deepCopy(json) {
    return JSON.parse(JSON.stringify(json))
}
