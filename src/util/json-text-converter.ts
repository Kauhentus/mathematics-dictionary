export const toJSONSafeText = (text: string) => {
    return text
        .replace(/\\/g, "\\\\")
        .replace(/\n/g, "\\n")
        .replace(/"/g, "\\\"");
}

export const fromJSONSafeText = (text: string) => {
    return text
        .replace(/\\n/g, "\n")
        .replace(/\\"n/g, "\"");
}