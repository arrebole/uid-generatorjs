import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * Entity for M_WORKER_NODE
 *
 */
@Entity('worker_nodes')
export class WorkerNodeEntity {
    /**
     * Entity unique id (table unique)
     */
    @PrimaryGeneratedColumn()
    public id: number;

    /**
     * Type of CONTAINER: HostName, ACTUAL : IP.
     */
    @Column({
        name: 'host_name',
    })
    public hostName: string;

    /**
     * Type of CONTAINER: Port, ACTUAL : Timestamp + Random(0-10000)
     */
    @Column()
    public port: string;

    /**
     * type of {@link WorkerNodeType}
     */
    @Column()
    public type: number;

    /**
     * Worker launch date, default now
     */
    @Column({
        name: 'launch_date',
    })
    public launchDate: Date = new Date();

    /**
     * Created time
     */
    @CreateDateColumn()
    public created: Date;

    /**
     * Last modified
     */
    @UpdateDateColumn()
    public modified: Date;
}
