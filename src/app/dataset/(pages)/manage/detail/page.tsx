import { MenuItem } from '@/types';
import MainLayout from '../mainlayout/layout'

const Detail = () => {
  const items: MenuItem[] = [
    {
      name: 'test',
      url: 'test',
      title: 'test',
      icon: 'caijiqi',
      operation: ['null']
    }
  ]
  return (
    <MainLayout menuItems={items}>
      <h1 className='text-red-400'>1111</h1>
    </MainLayout>
  )
};

export default Detail;