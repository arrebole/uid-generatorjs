## UIDGenerator

分布式主键生成的一个 `nodejs` 实现方案。参考 [baidu/uid-generator](https://github.com/baidu/uid-generator)

## Snowflake
![Snowflake](docs/snowflake.png)

## install
```bash
npm install uid-generatorjs mysql2
```

## Usage
创建`mysql`数据库表
```sql
CREATE TABLE `worker_nodes`(
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT 'auto increment id',
    `host_name` VARCHAR(64) NOT NULL COMMENT 'host name',
    `port` VARCHAR(64) NOT NULL COMMENT 'port',
    `type` INT NOT NULL COMMENT 'node type: ACTUAL or CONTAINER',
    `launch_date` DATE NOT NULL COMMENT 'launch date',
    `created_at` TIMESTAMP NOT NULL default CURRENT_TIMESTAMP COMMENT 'created time',
    PRIMARY KEY(ID)
) COMMENT='DB WorkerID Assigner for UID Generator',ENGINE = INNODB;
```

## 使用静态 WorkerNodeId
> 在单机下可以绑定 workerNodeId

```javascript
const {
    DefaultUidGenerator, 
    StaticWorkerNodeService, 
    DisposableWorkerIdAssigner,
} = require('uid-generatorjs');

async function main() {
    const uidGenerator = await new DefaultUidGenerator()
        .setEpochStr('2021-03-29')
        .setSeqBits(12)
        .setTimeBits(31)
        .setWorkerBits(20)
        .setWorkerIdAssigner(new DisposableWorkerIdAssigner(new StaticWorkerNodeService(1)))
        .afterPropertiesSet();

    // Generate UID
    // 154875708945051743n
    const id = uidGenerator.getUID();
    // {
    //     UID: 154875708945051743n,
    //     date: '2022-03-29 16:36:51',
    //     timestamp: 1648543011,
    //     workerId: 1,
    //     sequence: 95
    // }
    console.log(uidGenerator.parseUID(id));
}
```

## 使用动态 WorkerNodeId
> 在多实例下使用 mysq 生成 workerNodeId

```javascript
const { 
    DefaultUidGenerator, 
    MysqlWorkerNodeService,
    DisposableWorkerIdAssigner,
} = require('uid-generatorjs');

async function main() {
    const uidGenerator = await new DefaultUidGenerator()
        .setEpochStr('2021-03-29')
        .setSeqBits(12)
        .setTimeBits(31)
        .setWorkerBits(20)
        .setWorkerIdAssigner(new DisposableWorkerIdAssigner(new MysqlWorkerNodeService({
            host: '10.0.5.58',
            port: 3306,
            user: 'root',
            password: 'password',
            database: 'uid_generator',
        })))
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
```