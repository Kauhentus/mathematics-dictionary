export const getMMDDYYYY = () => {
    const date = new Date();
    const MM = `${date.getMonth() + 1}`.padStart(2, '0');
    const DD = `${date.getDate()}`.padStart(2, '0');
    const YYYY = `${date.getFullYear()}`;
    return `${MM}-${DD}-${YYYY}`;
}

export const getHHMM = () => {
    const date = new Date();
    let XM = 'AM';
    let HH: string | number = date.getHours();
    if(HH === 0) {
        HH = 12;
        XM = 'AM';
    } else if(HH === 12){
        XM = 'PM';
    } else if(HH >= 13){
        HH -= 12;
        XM = 'PM';
    }
    HH = `${HH}`.padStart(2, '0');
    let MM = `${date.getMinutes()}`.padStart(2, '0');
    return `${HH}-${MM}${XM}`
}