import React from "react";
import { Modal, ModalProps } from "antd";

interface CustomModalProps
  extends Omit<ModalProps, "title" | "footer" | "centered" | "subTitle"> {
  title?: React.ReactNode;
  footer?: React.ReactNode;
  subTitle?: string;
  centered?: boolean;
}

const OperateModal: React.FC<CustomModalProps> = ({
  title,
  footer,
  centered = true,
  subTitle = "",
  ...modalProps
}) => {
  return (
    <Modal
      styles={{ body: { overflowY: 'auto', maxHeight: 'calc(80vh - 108px)' } }}
      className="bg-white rounded-lg shadow-lg"
      classNames={{
        body: "p-6 overflow-y-auto",
        header: "bg-gray-100 font-semibold text-lg h-15 flex items-center pl-5 mb-5",
        footer: "p-6",
        content: "pb-5",
      }}
      title={
        <>
          <span>{title}</span>
          {subTitle && (
            <span className="text-gray-500 text-sm font-normal">
              {" "}
              - {subTitle}
            </span>
          )}
        </>
      }
      footer={footer}
      centered={centered}
      {...modalProps}
    />
  );
};

export default OperateModal;
