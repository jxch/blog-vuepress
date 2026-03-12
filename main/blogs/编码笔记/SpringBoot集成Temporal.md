---
title: SpringBoot 集成 Temporal 
date: 2026/03/12
tags:
 - SpringBoot
 - Temporal
categories:
 - 编码笔记
---

## Docker 部署

```yml
services:
  temporal:
    image: temporalio/auto-setup
    ports:
      - "30015:7233"
    environment:
      - DB=mysql8
      - DB_PORT=3306
      - MYSQL_USER=root
      - MYSQL_PWD=password
      - MYSQL_SEEDS=host
      - DBNAME=temporal
      - BIND_ON_IP=0.0.0.0
  temporal-ui:
    image: temporalio/ui
    ports:
      - "30016:8080"
    environment:
      - TEMPORAL_ADDRESS=temporal:7233
```

```shell
# 创建 namespace （docker exec -it 进入容器）
temporal operator namespace create --namespace prod --retention 30d
```

:::warning
- temporal-server 和 temporal-ui 不提供单独的用户名密码登录功能。只能接入外部 OAth2 服务或使用 nginx 代理 temporal-ui 以及用 tls 模式接入 temporal-server
- 这里不做身份校验
:::

## SpringBoot 集成

```xml
        <dependency>
            <groupId>io.temporal</groupId>
            <artifactId>temporal-spring-boot-starter</artifactId>
            <version>1.33.0</version>
        </dependency>
```

```yml
spring:
    temporal:
        connection:
            target: temporal.local:30015
        namespace: prod
        workersAutoDiscovery:
            packages: com.jxch.temporal
        workers:
            - name: employee-adjustment-worker
              task-queue: employee-adjustment-task-queue
```

### WorkflowInterface

```java
@WorkflowInterface
public interface EmployeeAdjustmentWorkflow {

    @WorkflowMethod
    Object execute(EmployeeAdjustmentTaskParam param);

}


@Slf4j
@WorkflowImpl(workers = "employee-adjustment-worker")
public class EmployeeAdjustmentWorkflowImpl implements EmployeeAdjustmentWorkflow {

    private final EmployeeAdjustmentActivities activities = Workflow.newActivityStub(
            EmployeeAdjustmentActivities.class,
            ActivityOptions.newBuilder()
                    .setStartToCloseTimeout(Duration.ofMinutes(10))
                    .build());

    @Override
    public Object execute(EmployeeAdjustmentTaskParam param) {
        return activities.processAdjustment(param);
    }

    public static String upload(EmployeeAdjustmentTaskParam param) {
        String workflowId = "employee-adjustment-task-" + param.getTaskId();
        EmployeeAdjustmentWorkflow workflow = SpringUtil.getBean(WorkflowClient.class).newWorkflowStub(
                EmployeeAdjustmentWorkflow.class,
                WorkflowOptions.newBuilder()
                        .setWorkflowId(workflowId)
                        .setTaskQueue("employee-adjustment-task-queue")
                        .setStartDelay(param.getDuration())
                        .setWorkflowIdReusePolicy(
                                WorkflowIdReusePolicy.WORKFLOW_ID_REUSE_POLICY_TERMINATE_IF_RUNNING)
                        .build());

        WorkflowClient.start(workflow::execute, param);

        return workflowId;
    }

}
```

:::tip
- 注意设置Activity的失败重试时间
- `WorkflowImpl`只应该进行Activity的任务编排，不能引入任何复杂逻辑，包括链路追踪和日志，尽可能地降低workflow的复杂度
- 可以用`Saga`做逆流程的回放（适用于TCC等复杂流程）
:::

### ActivityInterface

```java
@ActivityInterface
public interface EmployeeAdjustmentActivities {

    @ActivityMethod
    Object processAdjustment(EmployeeAdjustmentTaskParam param);

}


@Slf4j
@Component
@ActivityImpl(workers = "employee-adjustment-worker")
public class EmployeeAdjustmentActivitiesImpl implements EmployeeAdjustmentActivities {

    @Autowired
    private StaffArchiveFteServiceImpl staffArchiveFteService;

    @NewSpan
    @Override
    public Object processAdjustment(EmployeeAdjustmentTaskParam param) {
        try {
            log.info("EmployeeAdjustmentActivitiesImpl: {}", JSON.toJSONString(param));
            Result result = staffArchiveFteService.initiateMobilizeUpdate(param.getEMobilize());
            result.getData().put("traceId", TraceUtil.getTraceId());
            return result;
        } catch (Throwable throwable) {
            log.error("EmployeeAdjustmentActivitiesImpl error", throwable);
            Result error = Result.error(throwable.getMessage());
            error.getData().put("traceId", TraceUtil.getTraceId());
            error.getData().put("stack", ExceptionUtil.stacktraceToString(throwable));
            error.getData().put("cause", ExceptionUtil.getRootCauseMessage(throwable));
            throw ApplicationFailure.newNonRetryableFailure(throwable.getMessage(), throwable.getClass().getSimpleName(), throwable, error);
        }
    }

}
```

:::tip
- 使用`ApplicationFailure.newNonRetryableFailure`避免抛出异常时触发Activity的重试机制
- 最好单独生成一个`TraceId`，不要一个`TraceId`贯穿整个workflow
:::

