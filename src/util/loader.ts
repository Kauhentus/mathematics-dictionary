export const loadData = (path: string) => {
    return new Promise<any>((resolve) => {
        const client = new XMLHttpRequest();
        client.open('GET', path);
        client.responseType = 'json';
        client.onload = function() {
            const shaderCode = client.response;
            resolve(shaderCode);
        }
        client.send();
    });
}