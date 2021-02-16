import { WorkerNodeEntity } from '../entity/worker_node.entity';

/**
 * DAO for M_WORKER_NODE
 *
 */
export interface WorkerNodeDAO {
    /**
     * Add {@link WorkerNodeEntity}
     *
     * @param workerNodeEntity
     */
    addWorkerNode(workerNodeEntity: WorkerNodeEntity): Promise<WorkerNodeEntity>;
}
