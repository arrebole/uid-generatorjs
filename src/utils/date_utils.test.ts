import { DateUtils } from './date_utils';

describe('DateUtils', () => {
    test('isValidDate', () => {
        expect(DateUtils.isValidDate(new Date(''))).not.toBeTruthy();
    });

    test('parseDate', () => {
        expect(DateUtils.parseDate('2020-12-12')).toEqual(DateUtils.parseDate('2020-12-12'));
    });

    test('formatByDayPattern', () => {
        expect(DateUtils.formatByDayPattern(new Date('2020-12-12'))).toEqual('2020-12-12');
        expect(DateUtils.formatByDayPattern(new Date('2020-12-10'))).toEqual('2020-12-10');
        expect(DateUtils.formatByDayPattern(new Date('2021-12-12'))).toEqual('2021-12-12');
        expect(DateUtils.formatByDayPattern(new Date('2020-01-12'))).toEqual('2020-01-12');
    });

    test('formatByDateTimePattern', () => {
        expect(DateUtils.formatByDateTimePattern(new Date('2020-01-12 12:12:12'))).toEqual('2020-01-12 12:12:12');
    });
});
