export const createVSpacer = (px: number) => {
    const spacer = document.createElement('div');
    spacer.style.height = `${px}px`;
    return spacer;
}

export const createHSpacer = (px: number) => {
    const spacer = document.createElement('div');
    spacer.style.width = `${px}px`;
    return spacer;
}