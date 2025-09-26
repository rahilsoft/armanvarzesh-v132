
import type { Meta, StoryObj } from '@storybook/react';
import { TileCard } from '../TileCard';

const meta: Meta<typeof TileCard> = {
  title: 'Vitrine/TileCard',
  component: TileCard,
};
export default meta;
type Story = StoryObj<typeof TileCard>;

export const ImageTile: Story = {
  args: {
    tile: {
      id:'user-app',
      type:'showcase',
      title:{ fa:'اپ کاربر', en:'User App' },
      subtitle:{ fa:'تمرین، تغذیه و AI', en:'Workouts & AI' },
      cta:{ href:'#', label:{ fa:'ببین', en:'Explore' } },
      media:{ kind:'image', src:'/hero.jpg' },
      variant:'A'
    },
    locale:'fa',
    orderIndex:0
  }
};

export const VideoTile: Story = {
  args: {
    tile: {
      id:'coach-app',
      type:'showcase',
      title:{ fa:'اپ مربی', en:'Coach App' },
      subtitle:{ fa:'رزرو و درآمد', en:'Bookings & Earnings' },
      cta:{ href:'#', label:{ fa:'برای مربیان', en:'For Coaches' } },
      media:{ kind:'video', src:'https://www.w3schools.com/html/mov_bbb.mp4' },
      variant:'B'
    },
    locale:'fa',
    orderIndex:1
  }
};
