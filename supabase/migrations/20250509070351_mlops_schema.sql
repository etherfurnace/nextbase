--- ----------------------------------------------------------------------------
--- 创建 schema（如果尚未存在）
--- ----------------------------------------------------------------------------
CREATE SCHEMA IF NOT EXISTS mlops;

--- ----------------------------------------------------------------------------
--- 增加应用权限定义
--- ----------------------------------------------------------------------------
ALTER TYPE app_permission ADD VALUE IF NOT EXISTS 'datasets.read';
ALTER TYPE app_permission ADD VALUE IF NOT EXISTS 'datasets.write';
ALTER TYPE app_permission ADD VALUE IF NOT EXISTS 'samples.read';
ALTER TYPE app_permission ADD VALUE IF NOT EXISTS 'samples.write';
ALTER TYPE app_permission ADD VALUE IF NOT EXISTS 'training_tasks.read';
ALTER TYPE app_permission ADD VALUE IF NOT EXISTS 'training_tasks.write';
ALTER TYPE app_permission ADD VALUE IF NOT EXISTS 'training_history.read';
ALTER TYPE app_permission ADD VALUE IF NOT EXISTS 'training_history.write';
