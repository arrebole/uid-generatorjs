const { 
    DefaultUidGenerator, 
    StaticWorkerNodeService, 
    DisposableWorkerIdAssigner,
} = require('../dist');


async function main(){
    const uidGenerator = await new DefaultUidGenerator()
        .setEpochStr('2021-03-29')
        .setSeqBits(12)
        .setTimeBits(31)
        .setWorkerBits(20)
        .setWorkerIdAssigner(new DisposableWorkerIdAssigner(new StaticWorkerNodeService(1)))
        .afterPropertiesSet();

    const SIZE = 100;
    const queue = new Set();

    console.time()
    for (let i = 0; i< SIZE; i++) {
        // Generate UID
        const id = uidGenerator.getUID();
        console.log(id);
        console.log(uidGenerator.parseUID(id));
        queue.add(id);
    }
    console.timeEnd();
    if (queue.size != SIZE) {
        console.error('重复id');
    } 
}

main();