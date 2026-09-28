export const API_KEY = 'AIzaSyCPVbSY35CTmq5uz19zF8Sjva7xCnZbP8A';

export const value_convertor = (value) => {
    if(value>=1000000){
        return Math.floor(value/1000000) + "M";
    }else if(value >= 1000){
        return Math.floor(value/1000) + "K";
    }else{
        return value;
    }
}

export const format_duration = (duration) => {
    if (!duration) return "0:00";
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return "0:00";
    
    const hours = (parseInt(match[1]) || 0);
    const minutes = (parseInt(match[2]) || 0);
    const seconds = (parseInt(match[3]) || 0);

    const mString = hours > 0 ? String(minutes).padStart(2, '0') : minutes;
    const sString = String(seconds).padStart(2, '0');
    
    if (hours > 0) {
        return `${hours}:${mString}:${sString}`;
    } else {
        return `${mString}:${sString}`;
    }
}