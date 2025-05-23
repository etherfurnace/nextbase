-- 单指标异常检测数据集样本

-- 添加权限
ALTER TYPE app_permission ADD VALUE IF NOT EXISTS 'anomaly_detection_train_data.read';
ALTER TYPE app_permission ADD VALUE IF NOT EXISTS 'anomaly_detection_train_data.write';

-- 创建表

CREATE TABLE anomaly_detection_train_data (
    id             BIGSERIAL PRIMARY KEY,
    tenant_id      BIGINT REFERENCES tenants ON DELETE CASCADE NOT NULL,
    dataset_id     BIGINT REFERENCES anomaly_detection_datasets(id) ON DELETE CASCADE NOT NULL,
    name           TEXT NOT NULL,
    storage_path   TEXT NOT NULL,
    metadata       JSONB,
    created_at     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    latest_status  training_status NOT NULL DEFAULT 'not_started',  --触发器会自动更新这个值
    latest_run_id  BIGINT, -- 引用最新一次运行的ID，触发器会自动更新这个值
    user_id     UUID REFERENCES auth.users(id) NOT NULL
);
COMMENT ON TABLE anomaly_detection_train_data IS '异常检测数据集样本表';

-- 创建触发器
DROP TRIGGER IF EXISTS update_anomaly_detection_train_data_timestamp ON anomaly_detection_train_data;
CREATE TRIGGER update_anomaly_detection_train_data_timestamp
    BEFORE UPDATE ON anomaly_detection_train_data
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- 启用RLS
ALTER TABLE IF EXISTS anomaly_detection_train_data ENABLE ROW LEVEL SECURITY;    

CREATE POLICY "Allow (scoped) read access on 'anomaly_detection_train_data' to users with permissions 'anomaly_detection_train_data.read'"
    ON anomaly_detection_train_data
    FOR SELECT
    USING (
        jwt_tenant_id() = tenant_id AND
        jwt_has_permission('anomaly_detection_train_data.read')
    );

CREATE POLICY "Allow (scoped) insert, update, delete access to 'anomaly_detection_train_data' to users with permissions 'anomaly_detection_train_data.write'"
    ON anomaly_detection_train_data
    FOR ALL
    USING (
        jwt_tenant_id() = tenant_id AND
        jwt_has_permission('anomaly_detection_train_data.write')
    )
    WITH CHECK (
        jwt_tenant_id() = tenant_id AND
        jwt_has_permission('anomaly_detection_train_data.write')
    );