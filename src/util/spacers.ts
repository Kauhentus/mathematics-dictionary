export const createVSpacer = (px: number) => {
    const spacer = document.createElement('div');
    spacer.style.height = `${px}px`;
    return spacer;
}