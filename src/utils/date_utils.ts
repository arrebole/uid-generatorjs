import * as dayjs from 'dayjs';

export class DateUtils {
    /**
     * Patterns
     */
    public static readonly DAY_PATTERN: string = 'YYYY-MM-DD';
    public static readonly DATETIME_PATTERN: string = 'YYYY-MM-DD HH:mm:ss';
    public static readonly DATETIME_MS_PATTERN: string = 'YYYY-MM-DD HH:mm:ss.SSS';

    public static readonly DEFAULT_DATE: Date = DateUtils.parseDate('1970-01-01');

    public static isValidDate(date: Date) {
        return date instanceof Date && !isNaN(date.getTime());
    }

    /**
     * Parse date without Checked exception
     *
     * @param str
     * @param pattern
     * @throws Invalid Date
     */
    public static parseDate(str: string) {
        const result = new Date(str);
        if (!DateUtils.isValidDate(result)) {
            throw new Error('Invalid Date');
        }
        return result;
    }

    /**
     * Format date into string
     *
     * @param date
     * @param pattern
     * @return
     */
    public static formatDate(date: Date, pattern: string): string {
        return dayjs(date).format(pattern);
    }

    /**
     * Format date by 'yyyy-MM-dd' pattern
     *
     * @param date
     * @return
     */
    public static formatByDayPattern(date: Date | null) {
        if (date != null) return DateUtils.formatDate(date, DateUtils.DAY_PATTERN);
        return null;
    }

    /**
     * Format date by 'yyyy-MM-dd HH:mm:ss' pattern
     *
     * @param date
     * @return
     */
    public static formatByDateTimePattern(date: Date) {
        return DateUtils.formatDate(date, DateUtils.DATETIME_PATTERN);
    }

    /**
     * Get current day using format date by 'yyyy-MM-dd HH:mm:ss' pattern
     */
    public static getCurrentDayByDayPattern() {
        return DateUtils.formatByDayPattern(new Date());
    }
}
