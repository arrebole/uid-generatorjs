import { WorkerNodeDAO } from '../dao/worker_node.dto';
import { createConnection, ConnectionOptions, Connection, ResultSetHeader } from 'mysql2';
import { WorkerNodeEntity } from '../entity/worker_node.entity';

export class MysqlWorkerNodeService implements WorkerNodeDAO {
    private connection: Connection;

    constructor(options: ConnectionOptions) {
        this.connection = createConnection(options);;
    }

    addWorkerNode(workerNodeEntity: WorkerNodeEntity): Promise<WorkerNodeEntity> {
        return new Promise((resolve, reject) =>{
            this.connection.execute(`INSERT INTO worker_nodes (hostname,port,type,launch_date) VALUES (?,?,?,?)`, 
            [
                workerNodeEntity.hostname,
                workerNodeEntity.port,
                workerNodeEntity.type,
                workerNodeEntity.launchDate,
            ], 
            (error, result: ResultSetHeader) => {
                if (error) return reject(error);
                workerNodeEntity.id = result.insertId;
                return resolve(workerNodeEntity);
            });
        })
    }
}

export class StaticWorkerNodeService implements WorkerNodeDAO {

    constructor(private readonly workerNodeId: number) {}

    addWorkerNode(workerNodeEntity: WorkerNodeEntity): Promise<WorkerNodeEntity> {
        workerNodeEntity.id = this.workerNodeId;
        return Promise.resolve(workerNodeEntity);
    }
}
