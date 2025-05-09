--- -----------------------------------------
--- 启用 RLS
--- -----------------------------------------
ALTER TABLE IF EXISTS mlops.datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS mlops.dataset_samples ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS mlops.training_jobs ENABLE ROW LEVEL SECURITY;

--- -----------------------------------------
--- datasets 表策略
--- -----------------------------------------
CREATE POLICY "Allow (scoped) read access on 'datasets' to users with permissions 'datasets.read'"
    ON mlops.datasets
    FOR SELECT
    USING (
        jwt_tenant_id() = mlops.get_tenant_id_by_user_id(user_id) AND
        jwt_has_permission('datasets.read')
    );

CREATE POLICY "Allow (scoped) insert, update, delete access to 'datasets' to users with permissions 'datasets.write'"
    ON mlops.datasets
    FOR ALL
    USING (
        jwt_tenant_id() = mlops.get_tenant_id_by_user_id(user_id) AND
        jwt_has_permission('datasets.write')
    )
    WITH CHECK (
        jwt_tenant_id() = mlops.get_tenant_id_by_user_id(user_id) AND
        jwt_has_permission('datasets.write')
    );

--- -----------------------------------------
--- dataset_samples 表策略
--- -----------------------------------------
CREATE POLICY "Allow (scoped) read access on 'dataset_samples' to users with permissions 'samples.read'"
    ON mlops.dataset_samples
    FOR SELECT
    USING (
        jwt_tenant_id() = mlops.get_tenant_id_by_user_id(user_id) AND
        jwt_has_permission('samples.read')
    );

CREATE POLICY "Allow (scoped) insert, update, delete access to 'dataset_samples' to users with permissions 'samples.write'"
    ON mlops.dataset_samples
    FOR ALL
    USING (
        jwt_tenant_id() = mlops.get_tenant_id_by_user_id(user_id) AND
        jwt_has_permission('samples.write')
    )
    WITH CHECK (
        jwt_tenant_id() = mlops.get_tenant_id_by_user_id(user_id) AND
        jwt_has_permission('samples.write')
    );

--- -----------------------------------------
--- training_jobs 表策略
--- -----------------------------------------
CREATE POLICY "Allow (scoped) read access on 'training_jobs' to users with permissions 'training_tasks.read'"
    ON mlops.training_jobs
    FOR SELECT
    USING (
        jwt_tenant_id() = mlops.get_tenant_id_by_user_id(user_id) AND
        jwt_has_permission('training_tasks.read')
    );

CREATE POLICY "Allow (scoped) insert, update, delete access to 'training_jobs' to users with permissions 'training_tasks.write'"
    ON mlops.training_jobs
    FOR ALL
    USING (
        jwt_tenant_id() = mlops.get_tenant_id_by_user_id(user_id) AND
        jwt_has_permission('training_tasks.write')
    )
    WITH CHECK (
        jwt_tenant_id() = mlops.get_tenant_id_by_user_id(user_id) AND
        jwt_has_permission('training_tasks.write')
    );

--- -----------------------------------------
--- training_job_history 表策略
--- -----------------------------------------
ALTER TABLE IF EXISTS mlops.training_job_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow (scoped) read access on 'training_job_history' to users with permissions 'training_history.read'"
    ON mlops.training_job_history
    FOR SELECT
    USING (
        jwt_tenant_id() = mlops.get_tenant_id_by_user_id(user_id) AND
        jwt_has_permission('training_history.read')
    );

CREATE POLICY "Allow (scoped) insert, update, delete access to 'training_job_history' to users with permissions 'training_history.write'"
    ON mlops.training_job_history
    FOR ALL
    USING (
        jwt_tenant_id() = mlops.get_tenant_id_by_user_id(user_id) AND
        jwt_has_permission('training_history.write')
    )
    WITH CHECK (
        jwt_tenant_id() = mlops.get_tenant_id_by_user_id(user_id) AND
        jwt_has_permission('training_history.write')
    );
