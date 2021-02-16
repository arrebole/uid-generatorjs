import * as os from 'os';

export class NetUtils {
    /**
     * Pre-loaded local address
     */
    public static localAddress: string;

    private static initialization = (() => {
        try {
            NetUtils.localAddress = NetUtils.getLocalInetAddress();
        } catch (e) {
            throw new Error('fail to get local ip.');
        }
    })();

    /**
     * Retrieve the first validated local ip address(the Public and LAN ip addresses are validated).
     *
     * @return the local address
     * @throws SocketException the socket exception
     */
    public static getLocalInetAddress() {
        // enumerates all network interfaces
        const nets = os.networkInterfaces();
        for (const name of Reflect.ownKeys(nets)) {
            if (name === 'lo') {
                continue;
            }
            for (const net of nets[name as string]) {
                // ignores all invalidated addresses
                if (!net.internal && net.family === 'IPv4') {
                    return net.address;
                }
            }
        }
        throw new Error('No validated local address!');
    }

    /**
     * Retrieve local address
     *
     * @return the string local address
     */
    public static getLocalAddress() {
        const result: string[] = [];

        const nets = os.networkInterfaces();
        for (const name of Reflect.ownKeys(nets)) {
            // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
            result.push(
                ...nets[name as string].filter((v) => v.family === 'IPv4' && !v.internal).map((u) => u.address),
            );
        }
        return result;
    }
}
