import { BitsAllocator } from './bits_allocator';

describe('BitsAllocator', () => {
    test('TOTAL_BITS', () => {
        expect(BitsAllocator.TOTAL_BITS).toEqual(64);
    });

    test('allocate', () => {
        expect(new BitsAllocator(29, 21, 13).allocate(1000, 4, 9)).toEqual('17179869216777');
        expect(new BitsAllocator(30, 20, 13).allocate(2000, 5, 9)).toEqual('17179869224969');
        expect(new BitsAllocator(29, 20, 14).allocate(1050, 4, 10)).toEqual('18038862708746');
    });
});
