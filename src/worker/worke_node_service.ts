import { WorkerNodeDAO } from './dao/worker_node.dto';
import { createConnection, ConnectionOptions, Repository } from 'typeorm';
import { WorkerNodeEntity } from './entity/worker_node.entity';

export class WorkerNodeService implements WorkerNodeDAO {
    private repos: Repository<WorkerNodeEntity>;

    connect(options: ConnectionOptions) {
        const connectionOptions: ConnectionOptions = {
            ...options,
            synchronize: false,
            logging: ['error', 'warn'],
            entities: [WorkerNodeEntity],
        };
        return createConnection(connectionOptions).then((conn) => (this.repos = conn.getRepository(WorkerNodeEntity)));
    }

    addWorkerNode(workerNodeEntity: WorkerNodeEntity) {
        return this.repos.save(workerNodeEntity);
    }
}
