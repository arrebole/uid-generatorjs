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
CREATE TABLE WORKER_NODE(
    id BIGINT NOT NULL AUTO_INCREMENT COMMENT 'auto increment id',
    host_name VARCHAR(64) NOT NULL COMMENT 'host name',
    port VARCHAR(64) NOT NULL COMMENT 'port',
    type INT NOT NULL COMMENT 'node type: ACTUAL or CONTAINER',
    launch_date DATE NOT NULL COMMENT 'launch date',
    modified TIMESTAMP NOT NULL COMMENT 'modified time',
    created TIMESTAMP NOT NULL COMMENT 'created time',
    PRIMARY KEY(ID)
) COMMENT='DB WorkerID Assigner for UID Generator',ENGINE = INNODB;
```

使用
```javascript
const { createUIDGenerator } = require('uid-generatorjs');

async function main() {
    createUIDGenerator({
        timeBits: 31,       // 时间位数
        workerBits: 23,     // 工作节点编号
        seqBits: 9,         // 序列号位数
        epoch: '2021-02-05',  // 时间的起始
        store: {
            type: 'mysql',
            host: '127.0.0.1',
            port: 3306,
        },
    }).then(uidGenerator => {
        // Generate UID
        const uid = uidGenerator.createUID();
    });
}
```
