import { UidGenerateException } from './uid_generate_exception';

describe('UidGenerateException', () => {
    test('Default constructor', () => {
        expect(new UidGenerateException().message).toEqual('');
    });

    test('Constructor with message', () => {
        expect(new UidGenerateException('test').message).toEqual('test');
    });

    test('Constructor with message format', () => {
        expect(new UidGenerateException('test %d %s', 1, 'aaa').message).toEqual('test 1 aaa');
        expect(new UidGenerateException('test %d %d', -1, -2).message).toEqual('test -1 -2');
        expect(new UidGenerateException('test %s %s', 'a', 'b').message).toEqual('test a b');
    });
});
