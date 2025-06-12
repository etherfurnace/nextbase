import { MetricItem, ListItem, ColumnItem } from "@/types";
import { useLocalizedTime } from "@/hooks/useLocalizedTime";
import dayjs from "dayjs";

// 判断一个字符串是否是字符串的数组
export const isStringArray = (input: string): boolean => {
  try {
    if (typeof input !== 'string') {
      return false;
    }
    const parsed = JSON.parse(input);
    if (!Array.isArray(parsed)) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
};

// 根据指标枚举获取值
export const getEnumValue = (metric: MetricItem, id: number | string) => {
  const { unit: input = '', name } = metric || {};
  if (!id && id !== 0) return '--';
  if (isStringArray(input)) {
    return (
      JSON.parse(input).find((item: ListItem) => item.id === id)?.name || id
    );
  }
  return isNaN(+id)
    ? id
    : (+id).toFixed(2);
};

// 获取随机颜色
export const generateUniqueRandomColor = (() => {
  const generatedColors = new Set<string>();
  return (): string => {
    const letters = '0123456789ABCDEF';
    let color;
    do {
      color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
    } while (generatedColors.has(color));
    generatedColors.add(color);
    return color;
  };
})();

// 图标中x轴的时间回显处理
export const useFormatTime = () => {
  const { convertToLocalizedTime } = useLocalizedTime();
  const formatTime = (timestamp: number, minTime: number, maxTime: number) => {
    const totalTimeSpan = maxTime - minTime;
    const time = new Date(timestamp * 1000) + '';
    if (totalTimeSpan === 0) {
      return convertToLocalizedTime(time, 'YYYY-MM-DD HH:mm:ss');
    }
    if (totalTimeSpan <= 24 * 60 * 60) {
      // 如果时间跨度在一天以内，显示小时分钟
      return convertToLocalizedTime(time, 'HH:mm:ss');
    }
    if (totalTimeSpan <= 30 * 24 * 60 * 60) {
      // 如果时间跨度在一个月以内，显示月日
      return convertToLocalizedTime(time, 'MM-DD HH:mm');
    }
    if (totalTimeSpan <= 365 * 24 * 60 * 60) {
      // 如果时间跨度在一年以内，显示年月日
      return convertToLocalizedTime(time, 'YYYY-MM-DD');
    }
    // 否则显示年月
    return convertToLocalizedTime(time, 'YYYY-MM');
  };
  return { formatTime };
};

// 柱形图或者折线图单条线时，获取其最大值、最小值、平均值和最新值、和
export const calculateMetrics = (data: any[], key = 'value1') => {
  if (!data || data.length === 0) return {};
  const values = data.map((item) => item[key]);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const sumValue = values.reduce((sum, value) => sum + value, 0);
  const avgValue = sumValue / values.length;
  const latestValue = values[values.length - 1];
  return {
    maxValue,
    minValue,
    avgValue,
    sumValue,
    latestValue,
  };
};

// 导出文件为csv
export const exportToCSV = (data: any[], columns: ColumnItem[], filename = 'export.csv') => {
  // 1. 生成表头
  const headers = columns.map(col => col.dataIndex).join(',');
  console.log(headers)
  // 2. 生成数据行
  const rows = data.map(row =>
    columns.map(col => {
      let value = row[col.dataIndex] || 0;
      if (col.dataIndex === 'timestamp' && value) {
        // 支持秒或毫秒时间戳
        value = dayjs(
          typeof value === 'number'
            ? (value.toString().length === 10 ? value * 1000 : value)
            : value
        ).format('YYYY-MM-DD HH:mm:ss');
      }
      // 处理逗号、引号等特殊字符
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value ?? '';
    }).join(',')
  );
  // 3. 合并为完整 CSV 字符串
  const csvContent = [headers, ...rows].join('\n');

  // 4. 创建 Blob 并下载
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  return blob;
  // const url = URL.createObjectURL(blob);
  // const a = document.createElement('a');
  // a.href = url;
  // a.download = filename;
  // document.body.appendChild(a);
  // a.click();
  // document.body.removeChild(a);
  // URL.revokeObjectURL(url);
};