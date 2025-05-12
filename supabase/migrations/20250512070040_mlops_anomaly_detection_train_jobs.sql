-- 异常检测训练任务

-- 添加权限
ALTER TYPE app_permission ADD VALUE IF NOT EXISTS 'anomaly_detection_train_jobs.read';
ALTER TYPE app_permission ADD VALUE IF NOT EXISTS 'anomaly_detection_train_jobs.write';

-- 创建表


CREATE TABLE mlops.anomaly_detection_train_jobs (
    id             BIGSERIAL PRIMARY KEY,
    tenant_id      BIGINT REFERENCES tenants ON DELETE CASCADE NOT NULL,
    name           TEXT NOT NULL,
    description    TEXT,
    dataset_id     BIGINT REFERENCES mlops.anomaly_detection_datasets(id) ON DELETE SET NULL,
    created_at     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    user_id        UUID REFERENCES auth.users(id) NOT NULL,
    UNIQUE         (tenant_id, name)
);
COMMENT ON TABLE mlops.anomaly_detection_train_jobs IS '异常检测训练任务';

-- 创建触发器
DROP TRIGGER IF EXISTS update_anomaly_detection_train_jobs_timestamp ON mlops.anomaly_detection_train_jobs;
CREATE TRIGGER update_anomaly_detection_train_jobs_timestamp
    BEFORE UPDATE ON mlops.anomaly_detection_train_jobs
    FOR EACH ROW EXECUTE FUNCTION mlops.trigger_set_updated_at();

-- 启用RLS
ALTER TABLE IF EXISTS mlops.anomaly_detection_train_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow (scoped) read access on 'anomaly_detection_train_jobs' to users with permissions 'anomaly_detection_train_jobs.read'"
    ON mlops.anomaly_detection_train_jobs
    FOR SELECT
    USING (
        jwt_tenant_id() = tenant_id AND
        jwt_has_permission('anomaly_detection_train_jobs.read')
    );

CREATE POLICY "Allow (scoped) insert, update, delete access to 'anomaly_detection_train_jobs' to users with permissions 'anomaly_detection_train_jobs.write'"
    ON mlops.anomaly_detection_train_jobs
    FOR ALL
    USING (
        jwt_tenant_id() = tenant_id AND
        jwt_has_permission('anomaly_detection_train_jobs.write')
    )
    WITH CHECK (
        jwt_tenant_id() = tenant_id AND
        jwt_has_permission('anomaly_detection_train_jobs.write')
    );