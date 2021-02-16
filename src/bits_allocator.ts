import * as assert from 'assert';

export class BitsAllocator {
    /**
     * Total 64 bits
     */
    static readonly TOTAL_BITS = 1 << 6;

    /**
     * Bits for [sign-> second-> workId-> sequence]
     */
    private readonly signBits: number = 1;
    private readonly timestampBits: number;
    private readonly workerIdBits: number;
    private readonly sequenceBits: number;

    /**
     * Max value for workId & sequence
     */
    private readonly maxDeltaSeconds: number;
    private readonly maxWorkerId: number;
    private readonly maxSequence: number;

    /**
     * Shift for timestamp & workerId
     */
    private readonly timestampShift: number;
    private readonly workerIdShift: number;

    /**
     * Constructor with timestampBits, workerIdBits, sequenceBits<br>
     * The highest bit used for sign, so <code>63</code> bits for timestampBits, workerIdBits, sequenceBits
     */
    public constructor(timestampBits: number, workerIdBits: number, sequenceBits: number) {
        // make sure allocated 64 bits
        const allocateTotalBits = this.signBits + timestampBits + workerIdBits + sequenceBits;
        assert.ok(allocateTotalBits == BitsAllocator.TOTAL_BITS, 'allocate not enough 64 bits');

        // initialize bits
        this.timestampBits = timestampBits;
        this.workerIdBits = workerIdBits;
        this.sequenceBits = sequenceBits;

        // initialize max value
        this.maxDeltaSeconds = ~(-1 << timestampBits);
        this.maxWorkerId = ~(-1 << workerIdBits);
        this.maxSequence = ~(-1 << sequenceBits);

        // initialize shift
        this.timestampShift = workerIdBits + sequenceBits;
        this.workerIdShift = sequenceBits;
    }

    /**
     * Allocate bits for UID according to delta seconds & workerId & sequence<br>
     * <b>Note that: </b>The highest bit will always be 0 for sign
     *
     * @param deltaSeconds
     * @param workerId
     * @param sequence
     * @return
     */
    public allocate(deltaSeconds: number, workerId: number, sequence: number) {
        const totalBitly = (n: bigint) => BigInt.asIntN(BitsAllocator.TOTAL_BITS, n)
        return(
            totalBitly(totalBitly(BigInt(deltaSeconds)) << BigInt(this.timestampShift)) |
            totalBitly(totalBitly(BigInt(workerId)) << BigInt(this.workerIdShift)) |
            totalBitly(BigInt(sequence))
        ).toString();
    }

    public getMaxWorkerId() {
        return this.maxWorkerId;
    }

    public getMaxSequence() {
        return this.maxSequence;
    }

    public getMaxDeltaSeconds() {
        return this.maxDeltaSeconds;
    }
}
