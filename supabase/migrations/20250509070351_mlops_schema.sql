CREATE SCHEMA IF NOT EXISTS mlops;

-- 训练任务状态枚举
CREATE TYPE mlops.training_status AS ENUM (
    'not_started', -- 未开始
    'in_progress', -- 训练中
    'completed',   -- 已完成
    'failed'       -- 失败
);

-- 时间更新触发器
CREATE OR REPLACE FUNCTION mlops.trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
COMMENT ON FUNCTION mlops.trigger_set_updated_at() IS '自动更新updated_at时间戳的触发器函数';