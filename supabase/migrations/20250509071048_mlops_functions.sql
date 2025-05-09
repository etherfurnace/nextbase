CREATE OR REPLACE FUNCTION mlops.trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION mlops.trigger_set_updated_at() IS '自动更新updated_at时间戳的触发器函数';


--- -----------------------------------------
--- 创建辅助函数，通过user_id找到tenant_id
--- -----------------------------------------
CREATE OR REPLACE FUNCTION mlops.get_tenant_id_by_user_id(user_uuid UUID) 
RETURNS BIGINT
LANGUAGE sql STABLE
AS $$
    SELECT tenant_id FROM tenant_members WHERE user_id = user_uuid LIMIT 1;
$$;

COMMENT ON FUNCTION mlops.get_tenant_id_by_user_id(UUID) IS '通过用户ID获取对应的租户ID';