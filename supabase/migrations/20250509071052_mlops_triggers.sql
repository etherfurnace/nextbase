DROP TRIGGER IF EXISTS update_datasets_timestamp ON mlops.datasets;
CREATE TRIGGER update_datasets_timestamp
    BEFORE UPDATE ON mlops.datasets
    FOR EACH ROW EXECUTE FUNCTION mlops.trigger_set_updated_at();

DROP TRIGGER IF EXISTS update_dataset_samples_timestamp ON mlops.dataset_samples;
CREATE TRIGGER update_dataset_samples_timestamp
    BEFORE UPDATE ON mlops.dataset_samples
    FOR EACH ROW EXECUTE FUNCTION mlops.trigger_set_updated_at();

DROP TRIGGER IF EXISTS update_training_jobs_timestamp ON mlops.training_jobs;
CREATE TRIGGER update_training_jobs_timestamp
    BEFORE UPDATE ON mlops.training_jobs
    FOR EACH ROW EXECUTE FUNCTION mlops.trigger_set_updated_at();

DROP TRIGGER IF EXISTS update_training_job_history_timestamp ON mlops.training_job_history;
CREATE TRIGGER update_training_job_history_timestamp
    BEFORE UPDATE ON mlops.training_job_history
    FOR EACH ROW EXECUTE FUNCTION mlops.trigger_set_updated_at();

CREATE OR REPLACE FUNCTION mlops.update_training_job_latest_run()
RETURNS TRIGGER AS $$
BEGIN
    -- 更新训练任务表中的最新状态和最新运行ID
    UPDATE mlops.training_jobs
    SET latest_status = NEW.status,
        latest_run_id = NEW.id,
        updated_at = now()
    WHERE id = NEW.job_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION mlops.update_training_job_latest_run() IS '更新训练任务的最新运行状态';

-- 创建触发器，在向训练历史表插入或更新记录时更新主表
DROP TRIGGER IF EXISTS update_training_job_latest_status ON mlops.training_job_history;
CREATE TRIGGER update_training_job_latest_status
    AFTER INSERT OR UPDATE OF status ON mlops.training_job_history
    FOR EACH ROW EXECUTE FUNCTION mlops.update_training_job_latest_run();
