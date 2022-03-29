
/**
 * Entity for M_WORKER_NODE
 *
 */
export class WorkerNodeEntity {
    /**
     * Entity unique id (table unique)
     */
    public id: number;

    /**
     * Type of CONTAINER: HostName, ACTUAL : IP.
     */
    public hostname: string;

    /**
     * Type of CONTAINER: Port, ACTUAL : Timestamp + Random(0-10000)
     */
    public port: string;

    /**
     * type of {@link WorkerNodeType}
     */
    public type: number;

    /**
     * Worker launch date, default now
     */
    public launchDate: Date = new Date();

    /**
     * table name
     */
    public tableName = 'worker_nodes';
}
