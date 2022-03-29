
export interface ParseUIDResult {
    UID: bigint,
    date: string,
    timestamp: number,
    workerId: number,
    sequence: number,
}

export interface UidGenerator {
    /**
     * Get a unique ID
     *
     * @return UID
     */
    getUID(): bigint;

    /**
     * Parse the UID into elements which are used to generate the UID.
     * Such as timestamp & workerId & sequence...
     *
     * @param uid
     * @return Parsed info
     */
    parseUID(uid: bigint): ParseUIDResult;
}
