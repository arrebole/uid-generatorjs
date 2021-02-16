import { UidGenerator } from '../uid_generator';
import { BitsAllocator } from '../bits_allocator';

import { WorkerIdAssigner } from '../worker/workerId_assigner';
import { UidGenerateException } from '../exception/uid_generate_exception';
import { DateUtils } from '../utils/date_utils';
/**
 * Represents an implementation of {@link UidGenerator}
 *
 * The unique id has 64bits (long), default allocated as blow:<br>
 * <li>sign: The highest bit is 0
 * <li>delta seconds: The next 28 bits, represents delta seconds since a customer epoch(2016-05-20 00:00:00.000).
 *                    Supports about 8.7 years until to 2024-11-20 21:24:16
 * <li>worker id: The next 22 bits, represents the worker's id which assigns based on database, max id is about 420W
 * <li>sequence: The next 13 bits, represents a sequence within the same second, max for 8192/s<br><br>
 *
 * The {@link DefaultUidGenerator#parseUID(long)} is a tool method to parse the bits
 *
 * <pre>{@code
 * +------+----------------------+----------------+-----------+
 * | sign |     delta seconds    | worker node id | sequence  |
 * +------+----------------------+----------------+-----------+
 *   1bit          28bits              22bits         13bits
 * }</pre>
 *
 * You can also specified the bits by Spring property setting.
 * <li>timeBits: default as 28
 * <li>workerBits: default as 22
 * <li>seqBits: default as 13
 * <li>epochStr: Epoch date string format 'yyyy-MM-dd'. Default as '2016-05-20'<p>
 *
 * <b>Note that:</b> The total bits must be 64 -1
 *
 */
export class DefaultUidGenerator implements UidGenerator {
    /** Bits allocate */
    protected timeBits = 28;
    protected workerBits = 22;
    protected seqBits = 13;

    /** Customer epoch, unit as second. For example 2016-05-20 (ms: 1463673600000)*/
    protected epochStr = '2016-05-20';
    protected epochSeconds = 1463673600;

    /** Stable fields after spring bean initializing */
    protected bitsAllocator: BitsAllocator;
    protected workerId: number;

    /** Volatile fields caused by nextId() */
    protected sequence = 0;
    protected lastSecond = -1;

    /** Spring property */
    protected workerIdAssigner: WorkerIdAssigner;

    public async afterPropertiesSet() {
        // initialize bits allocator
        this.bitsAllocator = new BitsAllocator(this.timeBits, this.workerBits, this.seqBits);

        // initialize worker id
        this.workerId = await this.workerIdAssigner.assignWorkerId();
        if (this.workerId > this.bitsAllocator.getMaxWorkerId()) {
            throw new Error('Worker id ' + this.workerId + ' exceeds the max ' + this.bitsAllocator.getMaxWorkerId());
        }

        console.info(
            `[${DefaultUidGenerator.name}] Initialized bits(1, ${this.timeBits}, ${this.workerBits}, ${this.seqBits}) for workerID: ${this.workerId}`,
        );
    }

    public getUID() {
        try {
            return this.nextId();
        } catch (e) {
            console.error('Generate unique id exception. ', e);
            throw new UidGenerateException(e);
        }
    }

    /**
     * Get UID
     *
     * @return UID
     * @throws UidGenerateException in the case: Clock moved backwards; Exceeds the max timestamp
     */
    protected nextId() {
        let currentSecond = this.getCurrentSecond();
        // Clock moved backwards, refuse to generate uid
        if (currentSecond < this.lastSecond) {
            const refusedSeconds = this.lastSecond - currentSecond;
            throw new UidGenerateException('Clock moved backwards. Refusing for %d seconds', refusedSeconds);
        }

        // At the same second, increase sequence
        if (currentSecond == this.lastSecond) {
            this.sequence = (this.sequence + 1) & this.bitsAllocator.getMaxSequence();
            // Exceed the max sequence, we wait the next second to generate uid
            if (this.sequence == 0) {
                currentSecond = this.getNextSecond(this.lastSecond);
            }
            // At the different second, sequence restart from zero
        } else {
            this.sequence = 0;
        }

        this.lastSecond = currentSecond;

        // Allocate bits for UID
        return this.bitsAllocator.allocate(currentSecond - this.epochSeconds, this.workerId, this.sequence).toString();
    }

    /**
     * Get next millisecond
     */
    private getNextSecond(lastTimestamp: number) {
        let timestamp = this.getCurrentSecond();
        while (timestamp <= lastTimestamp) {
            timestamp = this.getCurrentSecond();
        }
        return timestamp;
    }

    /**
     * Get current second
     */
    private getCurrentSecond() {
        const currentSecond = Math.ceil(Date.now() / 1000);
        if (currentSecond - this.epochSeconds > this.bitsAllocator.getMaxDeltaSeconds()) {
            throw new UidGenerateException('Timestamp bits is exhausted. Refusing UID generate. Now: ' + currentSecond);
        }
        return currentSecond;
    }

    /**
     * Setters for spring property
     */
    public setWorkerIdAssigner(workerIdAssigner: WorkerIdAssigner) {
        this.workerIdAssigner = workerIdAssigner;
    }

    public setTimeBits(timeBits: number) {
        if (timeBits > 0) {
            this.timeBits = timeBits;
        }
    }

    public setWorkerBits(workerBits: number) {
        if (workerBits > 0) {
            this.workerBits = workerBits;
        }
    }

    public setSeqBits(seqBits: number) {
        if (seqBits > 0) {
            this.seqBits = seqBits;
        }
    }

    public setEpochStr(epochStr: string) {
        if (epochStr) {
            this.epochStr = epochStr;
            this.epochSeconds = Math.ceil(DateUtils.parseDate(epochStr).getTime() / 1000);
        }
    }
}
