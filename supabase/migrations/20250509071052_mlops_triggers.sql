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