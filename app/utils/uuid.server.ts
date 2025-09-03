import short from "short-uuid"

const translator = short()

/**
 * Converts a short ID to a full UUID.
 *
 * @param {string} shortId - The short ID to convert.
 * @returns {string} The full UUID.
 */
export const getUUID = (shortId: string) => {
    return translator.toUUID(shortId)
}

/**
 * Converts a full UUID to a short ID.
 *
 * @param {string} uuid - The full UUID to convert.
 * @returns {string} The short ID.
 */
export const getShortID = (uuid: string) => {
    return translator.fromUUID(uuid)
}