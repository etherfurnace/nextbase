-- 异常检测训练任务历史


-- 添加权限
ALTER TYPE app_permission ADD VALUE IF NOT EXISTS 'anomaly_detection_train_history.read';
ALTER TYPE app_permission ADD VALUE IF NOT EXISTS 'anomaly_detection_train_history.write';

-- 创建表

CREATE TABLE anomaly_detection_train_history (
    id             BIGSERIAL PRIMARY KEY,
    tenant_id      BIGINT REFERENCES tenants ON DELETE CASCADE NOT NULL,
    job_id         BIGINT REFERENCES anomaly_detection_train_jobs(id) ON DELETE CASCADE NOT NULL,
    train_data_id  BIGINT REFERENCES anomaly_detection_train_data(id) ON DELETE CASCADE NOT NULL,
    parameters     JSONB NOT NULL, -- 训练参数
    status         training_status NOT NULL DEFAULT 'not_started',
    model_path     TEXT, -- 模型权重在Storage中的存储路径
    metrics        JSONB, -- 评价指标
    
    created_at     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    started_at     TIMESTAMP WITH TIME ZONE,
    completed_at   TIMESTAMP WITH TIME ZONE,
    user_id        UUID REFERENCES auth.users(id) NOT NULL
);
COMMENT ON TABLE anomaly_detection_train_jobs IS '训练任务历史记录表';

-- 创建函数
CREATE OR REPLACE FUNCTION update_anomaly_detection_training_job_latest_run()
RETURNS TRIGGER AS $$
BEGIN
    -- 更新训练任务表中的最新状态和最新运行ID
    UPDATE anomaly_detection_train_jobs
    SET latest_status = NEW.status,
        latest_run_id = NEW.id,
        updated_at = now()
    WHERE id = NEW.job_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
COMMENT ON FUNCTION update_anomaly_detection_training_job_latest_run() IS '更新训练任务的最新运行状态';  

-- 创建触发器
DROP TRIGGER IF EXISTS update_training_job_latest_run ON anomaly_detection_train_jobs;
CREATE TRIGGER update_training_job_latest_run
    BEFORE UPDATE ON anomaly_detection_train_jobs
    FOR EACH ROW EXECUTE FUNCTION update_anomaly_detection_training_job_latest_run();


-- 启用RLS
ALTER TABLE IF EXISTS anomaly_detection_train_history ENABLE ROW LEVEL SECURITY;    

CREATE POLICY "Allow (scoped) read access on 'anomaly_detection_train_history' to users with permissions 'anomaly_detection_train_history.read'"
    ON anomaly_detection_train_history
    FOR SELECT
    USING (
        jwt_tenant_id() = tenant_id AND
        jwt_has_permission('anomaly_detection_train_history.read')
    );

CREATE POLICY "Allow (scoped) insert, update, delete access to 'anomaly_detection_train_history' to users with permissions 'anomaly_detection_train_history.write'"
    ON anomaly_detection_train_history
    FOR ALL
    USING (
        jwt_tenant_id() = tenant_id AND
        jwt_has_permission('anomaly_detection_train_history.write')
    )
    WITH CHECK (
        jwt_tenant_id() = tenant_id AND
        jwt_has_permission('anomaly_detection_train_history.write')
    );
