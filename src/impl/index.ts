import { DefaultUidGenerator } from './default_uid_generator';
import { WorkerNodeService } from '../worker/worke_node_service';
import { DisposableWorkerIdAssigner } from '../worker/disposable_workerId_assigner';
import { ConnectionOptions } from 'typeorm';

interface createUIDGeneratorOptions {
    timeBits: number;
    workerBits: number;
    seqBits: number;
    epoch: string;
    store: ConnectionOptions;
}

export async function createUIDGenerator(options: createUIDGeneratorOptions) {
    const uidGenerator = new DefaultUidGenerator();

    // set config
    uidGenerator.setEpochStr(options.epoch);
    uidGenerator.setSeqBits(options.seqBits);
    uidGenerator.setTimeBits(options.timeBits);
    uidGenerator.setWorkerBits(options.workerBits);

    // db connect
    const workNodeSerevice = new WorkerNodeService();
    await workNodeSerevice.connect(options.store);

    uidGenerator.setWorkerIdAssigner(new DisposableWorkerIdAssigner(workNodeSerevice));
    await uidGenerator.afterPropertiesSet();

    return uidGenerator;
}
