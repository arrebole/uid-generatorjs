import { DefaultUidGenerator } from './default_uid_generator';
import { MysqlWorkerNodeService, StaticWorkerNodeService } from '../worker/service/worke_node_service';
import { DisposableWorkerIdAssigner } from '../worker/disposable_workerId_assigner';
import { WorkerNodeDAO } from '../worker/dao/worker_node.dto';
import { ConnectionOptions } from 'mysql2';
import { UidGenerator } from '../uid_generator';

interface CreateUIDGeneratorOptions {
    timeBits: number;
    workerBits: number;
    seqBits: number;
    epoch: string;
    workerNodeOptions: MysqlWorkerNodeOptions | StaticWorkerNodeOptions;
}

interface MysqlWorkerNodeOptions extends ConnectionOptions {
    strategy: 'mysql'
}

interface StaticWorkerNodeOptions {
    strategy: 'static',
    workerNodeId: number,
}

export async function createUIDGenerator(options: CreateUIDGeneratorOptions): Promise<UidGenerator> {

    // select workernode id Generation strategy
    let workNodeSerevice: WorkerNodeDAO;
    switch(options.workerNodeOptions.strategy){
        case 'mysql':
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { strategy, ...connectOptions } = options.workerNodeOptions;
            workNodeSerevice = new MysqlWorkerNodeService(connectOptions);
            break
        case 'static':
            workNodeSerevice = new StaticWorkerNodeService(options.workerNodeOptions.workerNodeId);
            break;
        default:
            throw new Error('invalid id Generation strategy')
    }

    const uidGenerator = new DefaultUidGenerator()
        .setEpochStr(options.epoch)
        .setSeqBits(options.seqBits)
        .setTimeBits(options.timeBits)
        .setWorkerBits(options.workerBits)
        .setWorkerIdAssigner(new DisposableWorkerIdAssigner(workNodeSerevice));
    await uidGenerator.afterPropertiesSet();

    return uidGenerator;
}
