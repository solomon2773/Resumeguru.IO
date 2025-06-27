export function convertToLocalTime(utcTimestamp) {
    const date = new Date(utcTimestamp);
    return date.toLocaleString(); // Converts to local time in a readable format
}
export function convertTimestampToLocalTimeWithoutSpace(timestamp) {
    // Create a new Date object using the timestamp multiplied by 1000 (to convert it to milliseconds)
    const date = new Date(timestamp);

    // Format the date and time in a local format without spaces
    return date.toLocaleDateString().replace(/\//g, '_') +"_"+ date.toLocaleTimeString().replace(/:/g, '_').replace(/ /g, '_');
}


export function parseLinkedinExperienceDateRange(dateRange) {
    const months = {
        'January': '01', 'February': '02', 'March': '03', 'April': '04', 'May': '05', 'June': '06',
        'July': '07', 'August': '08', 'September': '09', 'October': '10', 'November': '11', 'December': '12'
    };


    if (!dateRange) return { startDate: '', endDate: '' };
    const [start, end] = dateRange.split(' - ');
    if (!start) return { startDate: '', endDate: '' };
    // Parse startDate
    let [startMonth, startYear] = start.split(' ');
    let startDate = `${startYear}-${months[startMonth]}`;

    if (!end) return { startDate, endDate:'' };

    // Parse endDate
    let endDate;
    if (end && end.toLowerCase() === 'present') {
        const currentDate = new Date();
        endDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    } else {
        let [endMonth, endYear] = end.split(' ');
        endDate = `${endYear}-${months[endMonth]}`;
    }

    return { startDate, endDate };
}
