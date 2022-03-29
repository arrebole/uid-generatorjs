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
    //     workerId: 27,
    //     sequence: 95
    // }
    console.log(uidGenerator.parseUID(id));
}
```
