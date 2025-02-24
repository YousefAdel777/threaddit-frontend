
export function formatDate(date: Date | string | number): string {
    const now = new Date();
    const postDate = new Date(date);

    const seconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds <= 60) {
        return `Just now`;
    } else if (minutes <= 60) {
        return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (hours <= 24) {
        return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else if (days <= 7) {
        return `${days} day${days !== 1 ? 's' : ''} ago`;
    } else if (weeks <= 4) {
        return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
    } else if (months <= 12) {
        return `${months} month${months !== 1 ? 's' : ''} ago`;
    } else {
        return `${years} year${years !== 1 ? 's' : ''} ago`;
    }
}

export function formatDateShort(date: Date | string | number): string {
    const formatedDate = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    };
    return formatedDate.toLocaleDateString('en-US', options);
}

export const formatTime = (date: string | number | Date) => {
    const hours = new Date(date).getHours();
    const minutes = new Date(date).getMinutes();
    const formattedHours = hours % 12 || 12;
    return `${formattedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`
}