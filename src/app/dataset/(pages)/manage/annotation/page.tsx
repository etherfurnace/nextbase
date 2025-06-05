"use client";
import { supabase } from "@/utils/supabaseClient";
import Aside from "./components/aside";
import sideMenuStyle from './components/index.module.scss';
import Icon from '@/components/icon';
import { ColumnItem } from '@/types';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from "react";
import LineChart from "@/components/charts/lineChart";
import CustomTable from "@/components/custom-table";
import { useLocalizedTime } from "@/hooks/useLocalizedTime";
import { Button, Spin, TablePaginationConfig } from "antd";
import '@ant-design/v5-patch-for-react-19';

const AnnotationPage = () => {
  const searchParams = useSearchParams();
  const file_id = searchParams.get('id');
  const folder_name = searchParams.get('folder_name');
  const { convertToLocalizedTime } = useLocalizedTime();
  const [menuItems, setMenuItems] = useState<any>([]);
  const [tableData, setTableData] = useState<any>([]);
  const [pagedData, setPageData] = useState<any>([]);
  const [currentFileData, setCurrentFileData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [chartLoading, setChartLoading] = useState<boolean>(false);
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    total: 0,
    pageSize: 20,
  });

  const AnnotationIntro = () => {
    const name = '数据集';
    return (
      <div className="flex h-[58px] flex-col items-center justify-center">
        <div className='flex justify-center mb-2'>
          <Icon
            type="shiyongwendang"
            className="mr-2"
            style={{ height: '22px', width: '22px', color: 'blue' }}
          ></Icon>
          <h1 className="text-center text-lg font-bold leading-[24px]">{name}</h1>
        </div>
      </div>
    );
  };

  const Topsection = () => {
    const getTitle = () => {
      return '文档列表';
    };
    return (
      <div className="flex flex-col h-[90px] p-4 overflow-hidden">
        <h1 className="text-lg">{getTitle()}</h1>
        <p className="text-sm overflow-hidden w-full min-w-[1000px] mt-[8px]">
          {'支持上传时序数据，并为这些数据进行打标，以便后续进行模型训练。'}
        </p>
      </div>
    );
  };

  const colmuns: ColumnItem[] = [
    {
      title: '时间',
      key: 'timestamp',
      dataIndex: 'timestamp',
      width: 150,
      align: 'center',
      render: (_, record) => {
        const time = new Date(record.timestamp * 1000).toISOString();
        return <p>{convertToLocalizedTime(time.toString(), 'YYYY-MM-DD HH:mm:ss')}</p>;
      },
    },
    {
      title: '值',
      key: 'value',
      dataIndex: 'value',
      align: 'center',
      render: (_, record) => {
        const value = Number(record.value).toFixed(2);
        return <p>{value}</p>
      }
    },
    {
      title: '标注结果',
      key: 'label',
      dataIndex: 'label',
      width: 100,
      align: 'center'
    },
    {
      title: '操作',
      key: 'action',
      dataIndex: 'action',
      align: 'center',
      render: () => {
        return(
          <Button color="danger" variant="link">
            删除
          </Button>
        )
      }
    }
  ]

  useEffect(() => {
    getCurrentFileData();
  }, [searchParams]);

  useEffect(() => {
    setTableLoading(true);
    if (tableData.length) {
      const _pageData = tableData.slice(
        (pagination.current! - 1) * pagination.pageSize!,
        pagination.current! * pagination.pageSize!
      );
      setPageData(_pageData);
    } else {
      setPageData([]);
    }
    setTableLoading(false);
  }, [pagination?.current, pagination?.pageSize, tableData])

  const fileReader = (text: string) => {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',');
    const data = lines.slice(1).map(line => {
      const values = line.split(',');
      return headers.reduce((obj: Record<string, any>, key, idx) => {
        obj[key] = key === 'timestamp' ? new Date(values[idx]).getTime() / 1000 : Number(values[idx]);
        return obj;
      }, {});
    });
    if (headers.includes('label')) {
      const _data = data.filter((item) => item.label === 1);
      setTableData(_data);
      setPagination((prev) => {
        return {
          ...prev,
          total: _data.length
        }
      })
    } else {
      setTableData([]);
      setPagination({
        current: 1,
        total: 0,
        pageSize: 20
      })
    }
    return data;
  }

  const getCurrentFileData = async () => {
    setLoading(true);
    setChartLoading(true);
    setTableLoading(true);
    const id = searchParams.get('id');
    const fileList = await supabase.from('anomaly_detection_train_data').select();
    if (fileList.data) {
      const item = fileList.data.find((k: any) => k.id == id);
      const fileData = await supabase.storage.from('datasets').download(item.storage_path);
      setMenuItems(fileList.data);
      setLoading(false);
      const text = await fileData.data?.text();
      const data = fileReader(text as string);
      setCurrentFileData(data);
      setChartLoading(false);
      setTableLoading(false);
    }
  };

  const onXRangeChange = (data: any[]) => {
    setChartLoading(true);
    const minTime = data[0].unix();
    const maxTime = data[1].unix();
    if(minTime === maxTime) {
      const target =  currentFileData.find((item: any) => item.timestamp === minTime);
      target.label = 1;
    } else {
      const _data = currentFileData.map((item: any) => {
        if( item.timestamp >= minTime &&  item.timestamp <= maxTime ) {
          return {
            ...item,
            label: 1
          }
        }
        return item;
      });
      console.log(_data)
      const _tableData = _data.filter((item: any) => item.label === 1);
      console.log(_tableData)
      setCurrentFileData(_data);
      setTableData(_tableData);
    }
    setChartLoading(false);
  };

  const handleChange = (value: any) => {
    setPagination((prev) => {
      console.log(prev)
      return {
        current: value.current,
        pageSize: value.pageSize,
        total: prev.total,
      }
    })
  };

  return (
    <div className={`flex w-full h-full text-sm p-[10px] ${sideMenuStyle.sideMenuLayout} grow`}>
      <>
        <div className="w-full flex grow flex-1 h-full">
          <Aside
            loading={loading}
            menuItems={menuItems}
          >
            <AnnotationIntro />
          </Aside>
          <section className="flex-1 flex flex-col overflow-hidden">
            <div className={`mb-4 w-full rounded-md ${sideMenuStyle.sectionContainer}`}>
              <Topsection />
            </div>
            <div className={`p-4 flex-1 rounded-md overflow-auto ${sideMenuStyle.sectionContainer} ${sideMenuStyle.sectionContext}`}>
              <Spin className="w-full" spinning={chartLoading}>
                <div className="flex">
                  <div className="w-[60%]" style={{ height: `calc(100vh - 320px)` }}>
                    <LineChart
                      data={currentFileData}
                      showDimensionTable
                      showDimensionFilter
                      onXRangeChange={onXRangeChange}
                    />
                  </div>
                  <div className="w-[40%]" style={{ height: `calc(100vh - 320px)` }}>
                    <CustomTable
                      size="small"
                      rowKey="timestamp"
                      scroll={{ y: 'calc(100vh - 420px)' }}
                      columns={colmuns}
                      dataSource={pagedData}
                      loading={tableLoading}
                      pagination={pagination}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <Button className="mr-4">取消</Button>
                  <Button type="primary">保存</Button>
                </div>
              </Spin>
            </div>
          </section>
        </div>
      </>
    </div>
  )
};

export default AnnotationPage;