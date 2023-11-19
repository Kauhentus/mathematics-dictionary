export const copyToClipboard = (content: string) => {
    return navigator.clipboard.writeText(content);
} 

export const copyFromClipboard = async () => {
    const text = await navigator.clipboard.readText();
    return text;
}