export interface UidGenerator {
    /**
     * Get a unique ID
     *
     * @return UID
     */
    getUID(): string;

    /**
     * Parse the UID into elements which are used to generate the UID.
     * Such as timestamp & workerId & sequence...
     *
     * @param uid
     * @return Parsed info
     */
    // parseUID(uid: string): string;
}
