import { WorkerNodeEntity } from '../entity/worker_node.entity';

/**
 * DAO for M_WORKER_NODE
 *
 */
export interface WorkerNodeDAO {

    /**
     * Get {@link WorkerNodeEntity} by node host
     * 
     * @param host
     * @param port
     * @return
     */
    // getWorkerNodeByHostPort(host: string, port: string): Promise<WorkerNodeEntity>

    /**
     * Add {@link WorkerNodeEntity}
     *
     * @param workerNodeEntity
     */
    addWorkerNode(workerNodeEntity: WorkerNodeEntity): Promise<WorkerNodeEntity>;
}
