-- 数据集类型枚举
CREATE TYPE mlops.dataset_type AS ENUM (
    'anomaly_detection', 
    'time_series_forecast',
    'log_compression',
    'alert_root_cause_analysis'
);

-- 训练任务状态枚举
CREATE TYPE training_status AS ENUM (
    'not_started', -- 未开始
    'in_progress', -- 训练中
    'completed',   -- 已完成
    'failed'       -- 失败
);

--- ----------------------------------------------------------------------------
--- 数据集表
--- ----------------------------------------------------------------------------
CREATE TABLE mlops.datasets (
    id             BIGSERIAL PRIMARY KEY,
    name           TEXT NOT NULL,
    description    TEXT,
    dataset_type   mlops.dataset_type NOT NULL,
    created_at     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    user_id     UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL
);
COMMENT ON TABLE mlops.datasets IS '数据集';

--- ----------------------------------------------------------------------------
--- 数据集样本表
--- ----------------------------------------------------------------------------
CREATE TABLE mlops.dataset_samples (
    id             BIGSERIAL PRIMARY KEY,
    dataset_id     BIGINT REFERENCES mlops.datasets(id) ON DELETE CASCADE NOT NULL,
    name           TEXT NOT NULL,
    anomaly_points JSONB,
    storage_path   TEXT NOT NULL, -- 存储在Supabase Storage中的路径
    metadata       JSONB,
    created_at     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    user_id     UUID REFERENCES auth.users(id) NOT NULL
);
COMMENT ON TABLE mlops.dataset_samples IS '数据集样本表';

--- ----------------------------------------------------------------------------
--- 训练任务表
--- ----------------------------------------------------------------------------
CREATE TABLE mlops.training_jobs (
    id             BIGSERIAL PRIMARY KEY,
    name           TEXT NOT NULL,
    description    TEXT,
    dataset_id     BIGINT REFERENCES mlops.datasets(id) ON DELETE SET NULL,
    job_type       mlops.dataset_type NOT NULL,
    parameters     JSONB NOT NULL,
    status         training_status NOT NULL DEFAULT 'not_started',
    model_path     TEXT, -- 模型权重在Storage中的存储路径
    metrics        JSONB, -- 评价指标
    created_at     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    started_at     TIMESTAMP WITH TIME ZONE,
    completed_at   TIMESTAMP WITH TIME ZONE,
    user_id     UUID REFERENCES auth.users(id) NOT NULL
);
COMMENT ON TABLE mlops.training_jobs IS '训练任务表';