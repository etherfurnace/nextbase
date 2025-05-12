-- 单指标异常检测数据集

-- 添加权限
ALTER TYPE app_permission ADD VALUE IF NOT EXISTS 'anomaly_detection_datasets.read';
ALTER TYPE app_permission ADD VALUE IF NOT EXISTS 'anomaly_detection_datasets.write';


-- 创建表
CREATE TABLE mlops.anomaly_detection_datasets (
    id             BIGSERIAL PRIMARY KEY,
    tenant_id      BIGINT REFERENCES tenants ON DELETE CASCADE NOT NULL,
    name           TEXT NOT NULL,
    description    TEXT,
    has_labels     BOOLEAN NOT NULL DEFAULT FALSE,
    created_at     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    user_id     UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    UNIQUE         (tenant_id, name)
);
COMMENT ON TABLE mlops.anomaly_detection_datasets IS '异常检测数据集';

-- 创建触发器
DROP TRIGGER IF EXISTS update_anomaly_detection_datasets_timestamp ON mlops.anomaly_detection_datasets;
CREATE TRIGGER update_anomaly_detection_datasets_timestamp
    BEFORE UPDATE ON mlops.anomaly_detection_datasets
    FOR EACH ROW EXECUTE FUNCTION mlops.trigger_set_updated_at();

-- 启用RLS
ALTER TABLE IF EXISTS mlops.anomaly_detection_datasets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow (scoped) read access on 'anomaly_detection_datasets' to users with permissions 'anomaly_detection_datasets.read'"
    ON mlops.anomaly_detection_datasets
    FOR SELECT
    USING (
        jwt_tenant_id() = tenant_id AND
        jwt_has_permission('anomaly_detection_datasets.read')
    );

CREATE POLICY "Allow (scoped) insert, update, delete access to 'anomaly_detection_datasets' to users with permissions 'anomaly_detection_datasets.write'"
    ON mlops.anomaly_detection_datasets
    FOR ALL
    USING (
        jwt_tenant_id() = tenant_id AND
        jwt_has_permission('anomaly_detection_datasets.write')
    )
    WITH CHECK (
        jwt_tenant_id() = tenant_id AND
        jwt_has_permission('anomaly_detection_datasets.write')
    );