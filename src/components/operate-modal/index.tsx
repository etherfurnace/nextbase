import React from "react";
import { Modal, ModalProps } from "antd";
import customModalStyle from "./index.module.scss";

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
      className={customModalStyle.customModal}
      classNames={{
        body: customModalStyle.customModalBody,
        header: customModalStyle.customModalHeader,
        footer: customModalStyle.customModalFooter,
        content: customModalStyle.customModalContent,
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
