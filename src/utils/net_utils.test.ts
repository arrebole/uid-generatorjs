import { NetUtils } from './net_utils';

describe('NetUtils', () => {
    test('getLocalAddress', () => {
        expect(NetUtils.localAddress).toBeTruthy();
    });

    test('getLocalInetAddress', () => {
        expect(NetUtils.getLocalInetAddress()).toBeTruthy();
        expect(NetUtils.getLocalInetAddress() === NetUtils.localAddress).toBeTruthy();
    });
});
