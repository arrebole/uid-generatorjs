import { format } from 'util';

export class UidGenerateException extends Error {
    /**
     * Default constructor
     */
    constructor();

    /**
     * Constructor with message
     */
    constructor(message: string);

    /**
     * Constructor with message format
     */
    constructor(msgFormat: string, ...args: any[]);

    /**
     * implement constructor
     */
    constructor(msgOrFormat?: string, ...args: any[]) {
        // Default
        if (!msgOrFormat && args.length === 0) super();
        // with message
        else if (msgOrFormat && args.length === 0) super(msgOrFormat);
        // with message format
        else if (msgOrFormat && args.length > 0) super(format(msgOrFormat, ...args));
        // error args
        else throw new Error('UidGenerateException args Error');

        this.name = UidGenerateException.name;
    }
}
