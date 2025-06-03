//调用弹窗接口传入的类型
interface ModalConfig {
  type: string;
  title?: string;
  form?: any;
  key?: string;
  ids?: string[];
  selectedsystem?: string;
  nodes?: string[];
}

//调用弹窗的类型
interface ModalRef {
  showModal: (config: ModalConfig) => void;
}

interface AnomalyDataSet {
  id: number,
  tenant_id: number,
  description: string,
  has_labels: boolean,
  created_at: string,
  user_id: string,
  [key: string]: any
}

interface UserProfile {
  id: string,
  first_name: string,
  last_name: string
}

export type {
  ModalConfig,
  ModalRef,
  UserProfile,
  AnomalyDataSet
}