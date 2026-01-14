---
title: SQL优化-MYSQL8的JSON索引列
date: 2026/01/14
tags:
 - MYSQL
categories:
 - 运维手册
---

:::tip
- 问题场景：存在CSV列的 `left join xxx on find_in_set` 式查询，导致全表扫描极慢，但又不想重构表结构建立关联表
- 解决方案：使用MySQL8新特性，json属性。使用触发器把csv列数据同步写到json列，并创建索引
:::

## 新建json列

```sql
ALTER TABLE crm_contract
  ADD COLUMN order_id_json JSON NULL COMMENT '[索引列，只读] 订单ID(JSON数字数组)，由order_id(逗号串)同步';
```

## 回填历史数据

```sql
UPDATE crm_contract
SET order_id_json =
        CASE
            WHEN order_id IS NULL OR order_id = '' THEN JSON_ARRAY()
            ELSE CAST(CONCAT('[', REPLACE(order_id, ' ', ''), ']') AS JSON)
        END;
```

## 建立 Multi-Valued 索引 

```sql
CREATE INDEX idx_crm_contract_order_id_mvi
ON crm_contract ((CAST(order_id_json AS UNSIGNED ARRAY)));
```

## 新增 insert/update 触发器

```sql
DELIMITER $$

CREATE TRIGGER trg_crm_contract_bi_order_id_json
BEFORE INSERT ON crm_contract
FOR EACH ROW
BEGIN
  IF NEW.order_id IS NULL OR NEW.order_id = '' THEN
    SET NEW.order_id_json = JSON_ARRAY();
  ELSE
    SET NEW.order_id_json =
      CAST(CONCAT('[', REPLACE(NEW.order_id, ' ', ''), ']') AS JSON);
  END IF;
END$$

CREATE TRIGGER trg_crm_contract_bu_order_id_json
BEFORE UPDATE ON crm_contract
FOR EACH ROW
BEGIN
  IF (NEW.order_id <> OLD.order_id) OR (NEW.order_id IS NULL XOR OLD.order_id IS NULL) THEN
    IF NEW.order_id IS NULL OR NEW.order_id = '' THEN
      SET NEW.order_id_json = JSON_ARRAY();
    ELSE
      SET NEW.order_id_json =
        CAST(CONCAT('[', REPLACE(NEW.order_id, ' ', ''), ']') AS JSON);
    END IF;
  END IF;
END$$

DELIMITER ;
```

## 查询方式

```sql
SELECT * FROM crm_contract
WHERE 537 MEMBER OF (order_id_json);
```

```sql
SELECT * FROM crm_contract
WHERE JSON_CONTAINS(order_id_json, CAST(537 AS JSON));
```

## left join json_table

```sql
    LEFT JOIN JSON_TABLE(contract.order_id_json, '$[*]' COLUMNS (oid BIGINT PATH '$') ) jt ON TRUE
    LEFT JOIN crm_order o ON o.order_id = jt.oid
```

:::warning
- `JSON_TABLE` 的方式，会导致展开成多行，需要注意
- `JSON_TABLE` 本省不会走索引，只是把json数组在运行时展开成一个派生表
:::
