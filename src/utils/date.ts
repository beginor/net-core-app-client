import dayjs from 'dayjs';

/** Format a date as yyyy-MM-dd, empty string for missing values. */
export function formatDate(value?: string | Date | null): string {
    return value ? dayjs(value).format('YYYY-MM-DD') : '';
}

/** Format a date as yyyy-MM-dd HH:mm:ss, empty string for missing values. */
export function formatDateTime(value?: string | Date | null): string {
    return value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : '';
}
