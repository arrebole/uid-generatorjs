import { WorkerIdAssigner } from './workerId_assigner';
import { WorkerNodeDAO } from './dao/worker_node.dto';
import { WorkerNodeEntity } from './entity/worker_node.entity';
import { WorkerNodeType } from './worker_node_type';
import { DockerUtils } from '../utils/docker_utils';
import { NetUtils } from '../utils/net_utils';

/**
 * Represents an implementation of {@link WorkerIdAssigner},
 * the worker id will be discarded after assigned to the UidGenerator
 *
 */
export class DisposableWorkerIdAssigner implements WorkerIdAssigner {
    private workerNodeDAO: WorkerNodeDAO;

    constructor(workerNodeDAO: WorkerNodeDAO) {
        this.workerNodeDAO = workerNodeDAO;
    }

    /**
     * Assign worker id base on database.<p>
     * If there is host name & port in the environment, we considered that the node runs in Docker container<br>
     * Otherwise, the node runs on an actual machine.
     *
     * @return assigned worker id
     */
    public async assignWorkerId() {
        // add worker node for new (ignore the same IP + PORT)
        const workerNodeEntity = await this.workerNodeDAO.addWorkerNode(this.buildWorkerNode());
        console.info(`[${DisposableWorkerIdAssigner.name}] Add worker node: ${workerNodeEntity}`);

        return workerNodeEntity.id;
    }

    /**
     * Build worker node entity by IP and PORT
     */
    private buildWorkerNode() {
        const workerNodeEntity = new WorkerNodeEntity();
        if (DockerUtils.isDocker()) {
            workerNodeEntity.type = WorkerNodeType.CONTAINER;
            workerNodeEntity.hostname = DockerUtils.getDockerHost();
            workerNodeEntity.port = DockerUtils.getDockerPort();
        } else {
            workerNodeEntity.type = WorkerNodeType.ACTUAL;
            workerNodeEntity.hostname = NetUtils.localAddress;
            workerNodeEntity.port = Date.now() + '-' + Math.ceil(Math.random() * 100000);
        }

        return workerNodeEntity;
    }
}
