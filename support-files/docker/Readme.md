# 使用docker compose部署nextbase

## 部署要求

- docker >= 20.10.23
- docker-compose >=v2.27.0

## 安装部署

> cli是幂等的，多次运行不会对当前部署造成影响

```
git clone https://github.com/WeOps-Lab/nextbase.git
cd support-files/docker
./cli start
```

#### 端口映射说明

| 端口号 | 用途                                |
| ------ | ----------------------------------- |
| 8011   | kong默认端口，用于访问页面和调用api |

#### 如何干净卸载

> 需在support-files/docker目录下执行

```
#!/bin/bash
./cli destroy
```