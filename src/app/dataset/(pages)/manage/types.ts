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

export type {
  ModalConfig,
  ModalRef
}