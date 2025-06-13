import { Button, Drawer } from "antd";
import { ColumnItem, TableDataItem } from "@/types";
import CustomTable from "@/components/custom-table";
import { useTranslation } from "@/utils/i18n";
import { useState } from "react";

const TrainTaskDrawer = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [tableData, setTableData] = useState<TableDataItem[]>([
    {
      key: '1',
      started_at: '2024-01-15 14:30:25',
      status: '已完成',
      score: 0.95
    },
    {
      key: '2',
      started_at: '2024-01-14 09:15:10',
      status: '运行中',
      score: 0.87
    },
    {
      key: '3',
      started_at: '2024-01-13 16:45:33',
      status: '已完成',
      score: 0.92
    },
    {
      key: '4',
      started_at: '2024-01-12 11:20:45',
      status: '失败',
      score: 0.0
    },
    {
      key: '5',
      started_at: '2024-01-11 13:55:12',
      status: '已完成',
      score: 0.89
    }
  ]);
  const columns: ColumnItem[] = [
    {
      title: t('traintask.executionTime'),
      dataIndex: 'started_at',
      key: 'started_at'
    },
    {
      title: t('traintask.executionStatus'),
      dataIndex: 'status',
      key: 'status'
    },
    {
      title: t('traintask.executionScore'),
      dataIndex: 'score',
      key: 'score'
    },
    {
      title: t('common.action'),
      key: 'action',
      dataIndex: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => {
        return (
          <>
            <Button type="link">{t('common.detail')}</Button>
          </>
        )
      },
    }
  ];

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Drawer
        title={t('traintask.history')}
        open={open}
      >
        <CustomTable
          columns={columns}
          dataSource={tableData}
        />
      </Drawer>
    </>
  )
};

export default TrainTaskDrawer;