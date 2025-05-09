CREATE OR REPLACE FUNCTION mlops.trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION mlops.trigger_set_updated_at() IS '自动更新updated_at时间戳的触发器函数';