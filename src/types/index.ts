import type { MenuProps } from 'antd';

export interface Option {
  label: string;
  value: string;
}

export interface EntityListProps<T> {
  data: T[];
  loading: boolean;
  searchSize?: 'large' | 'middle' | 'small';
  singleActionType?: 'button' | 'icon';
  filterOptions?: Option[];
  filter?: boolean;
  filterLoading?: boolean;
  operateSection?: React.ReactNode;
  infoText?: string | Function;
  menuActions?: (item: T) => MenuProps['items'];
  singleAction?: (item: T) => { text: string, onClick: (item: T) => void };
  openModal?: (item?: T) => void;
  onSearch?: (value: string) => void;
  onCardClick?: (item: T) => void;
  changeFilter?: (value: string[]) => void;
}
