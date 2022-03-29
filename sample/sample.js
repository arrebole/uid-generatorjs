const { createUIDGenerator } = require('../dist/impl/index');

createUIDGenerator({
    timeBits: 31,       // 时间位数
    workerBits: 20,     // 工作节点编号
    seqBits: 12,         // 序列号位数
    epoch: '2021-02-05',  // 时间的起始
    workerNodeOptions: {
        strategy: 'mysql',
        host: '10.0.5.58',
        port: 3306,
        username: 'root',
        password: 'password',
        database: 'uid_generator'
    },
}).then(uidGenerator => {
    const SIZE = 10000;
    const queue = new Set();

    console.time()
    for (let i = 0; i< SIZE; i++) {
        // Generate UID
        const id = uidGenerator.getUID();
        console.log(id);
        queue.add(id);
    }
    console.timeEnd();
    if (queue.size != SIZE) {
        console.error('重复id');
    }
});