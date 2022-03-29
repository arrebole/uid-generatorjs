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

使用
```javascript
const { createUIDGenerator } = require('uid-generatorjs');

createUIDGenerator({
    // 时间位数
    timeBits: 31,       

    // 工作节点编号
    workerBits: 23,     

    // 序列号位数
    seqBits: 9,         

    // 时间的起始
    epoch: '2021-02-05',  

    // 工作节点生成策略
    workerNodeOptions: { 
        strategy: 'mysql',
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: 'password',
        database: 'database',
    },
}).then(uidGenerator => {
    // Generate UID
    const uid = uidGenerator.createUID();
});
```
