/**
 * Хелпер для глубокого копирования.
 * Возвращает готовый к использованию json.
 *
 * @param json
 * @return {any}
 */
export function deepCopy(json) {
    return JSON.parse(JSON.stringify(json))
}
