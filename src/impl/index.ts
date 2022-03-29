import { DefaultUidGenerator } from './default_uid_generator';
import { MysqlWorkerNodeService } from '../worker/service/worke_node_service';
import { DisposableWorkerIdAssigner } from '../worker/disposable_workerId_assigner';
import { WorkerNodeDAO } from '../worker/dao/worker_node.dto';
import { ConnectionOptions } from 'mysql2';

interface CreateUIDGeneratorOptions {
    timeBits: number;
    workerBits: number;
    seqBits: number;
    epoch: string;
    workerNodeOptions: MysqlWorkerNodeOptions;
}

interface MysqlWorkerNodeOptions extends ConnectionOptions {
    strategy: 'mysql'
}

export async function createUIDGenerator(options: CreateUIDGeneratorOptions) {

    // select workernode id Generation strategy
    let workNodeSerevice: WorkerNodeDAO;
    switch(options.workerNodeOptions.strategy){
        case 'mysql':
            workNodeSerevice = new MysqlWorkerNodeService(options.workerNodeOptions);
            break
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
