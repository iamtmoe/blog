---
date: 2021-10-27
tags: 
  - postgres
---

# pg查询优化

## 背景

上次谈到数据库压测证明线上并发连接压力导致数据库变慢了，这次谈谈怎么优化的。主要涉及到的查询是

`select * from tables where tables.columns = value limit 100 offset 0;`

数据库的优化可以从几个方面进行：

- 提升服务器硬件配置
- 更改数据库配置
- 建立合适的索引，代码配合使查询用到索引

这次主要是讲第三种

## index-only scan

index-only scan是指在索引中就能查到所需的数据，不需要查表，index-only scan要求select,where,order出现的字段都出现在索引里。所以建立组合索引

`create index index_tabels_on_fields1_and_fields_2 on schema.tables (field1, field2) [using btree] include (field3, field4)`

pg 默认使用btree索引所以可以省略, filed1, field2放到key上用于定位索引，field3、field4放到include里（只存在于叶子节点里），这样查询种如果只涉及着四个字段就可以使用index-only scan了。

但是我们的代码里要拿到所有的数据，所以查询做了变通

`select * from tables where tables.id in (select id from tables where tables.field1 = value limit 100 offset 0)`

这样子查询就可以使用index-only scan，分页后拿到第一页的id，再通过主键索引查到第一页的数据

以上基本上大部分查询慢的问题就解决了

## Elastic Search

有个需要模糊查询的文本字段，因为产品层面没做字数限制部分数据太大建不了索引，倒是可以建部分单列索引

`create index index_tables_on_fields on tables (field) where length(field) < 500;`

但是没什么卵用，单列索引还是慢，尝试使用插件

```sql
CREATE EXTENSION pg_trgm;
CREATE INDEX index_tables_on_field ON tables USING gin (field gin_trgm_ops);
```

依然没什么卵用，看查询计划pg根本不用它。
没办法最后通过`elastic search`查出id进行二次查询

`{ match: { field: value } }`

## json field

涉及表里的json字段搜索，有的枚举值数据分布很集中，单列索引不管用，json字段也放不到复合索引里，最后把这些字段同步到另一个mongo库里，查出id再进行二次查询

## 二次查询

```sql
explain analyze SELECT "tables".* FROM "tables" WHERE "tables"."id" IN (SELECT "tables"."id" FROM "tables" WHERE "tables"."field" = value AND "tables"."id" IN (ids) ORDER BY id DESC LIMIT 100 OFFSET 0) ORDER BY id DESC
```

这里的(ids)是第一次查询查出来的，本以为二次查询会走index-only scan，事实是当id数量很大的时候查询分析器对于子查询还是选择了`bitmap heap scan`(又回到最初的起点~:joy:)，试了一下`set enable_bitmapscan to off`，居然可以`index-only scan`了:tada:，所以最后在每次查询前先执行这一句。

## 总结

顶着压力各种hack暂时解决了问题。剑走偏锋，实属无奈之举;正奇相合，方为长久之道。

## 常用sql

```sql
-- 连接数
select count(*) as c, datname from pg_stat_activity group by datname order by c desc;
-- 慢查询
select distinct count(*), query from pg_stat_activity where state != 'idle' and  (now() - pg_stat_activity.query_start) > interval '2s' group by query;
-- 索引列表
select indexname, indexdef from pg_indexes where tablename = 'tables';
-- 索引大小
select pg_relation_size('index_tables_on_field')
-- 删除索引
drop index if exists index_tables_on_field;
-- 设置参数
set enable_bitmapscan to on;
-- json field创建部分索引
create index index_tables_on_field on tables ((jsondoc->>'field')) where tables.jsondoc->>'field' is not null;
-- 创建拓展
CREATE EXTENSION pg_trgm;
-- 查看上次vacuum
select relname,last_vacuum, last_autovacuum, last_analyze, last_autoanalyze from pg_stat_user_tables where relname = 'tables';
-- 查看查询计划
explain analyze select ...
-- 锁相关
select count(*) from pg_locks;
select 
    relname as relation_name, 
    query, 
    pg_locks.* 
from pg_locks
join pg_class on pg_locks.relation = pg_class.oid
join pg_stat_activity on pg_locks.pid = pg_stat_activity.pid;
```

## 参考链接

- <https://dba.stackexchange.com/questions/196721/bitmap-heapscan-is-slow>
- <https://www.cybertec-postgresql.com/en/postgresql-indexing-index-scan-vs-bitmap-scan-vs-sequential-scan-basics/>
- <https://pganalyze.com/docs/explain/scan-nodes/bitmap-index-scan>
- <https://stackoverflow.com/questions/3581294/index-key-column-vs-index-included-column>
- <https://use-the-index-luke.com/blog/2019-04/include-columns-in-btree-indexes>
- <https://www.postgresql.org/docs/12/runtime-config-autovacuum.html>
- <https://www.shanelynn.ie/postgresql-find-slow-long-running-and-blocked-queries/>
- <https://help.aliyun.com/document_detail/281785.html>
- <https://www.lob.com/blog/supercharge-your-postgresql-performance>
- <https://stackoverflow.com/questions/1566717/postgresql-like-query-performance-variations>
- <https://stackoverflow.com/questions/53583257/is-there-a-workaround-to-ensure-index-only-scan-on-jsondoc-equality-que>
