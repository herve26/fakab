import short from "short-uuid"

const translator = short()

export const getUUID = (short: string) => {
    return translator.toUUID(short)
}

export const getShortID = (uuid: string) => {
    return translator.fromUUID(uuid)
}