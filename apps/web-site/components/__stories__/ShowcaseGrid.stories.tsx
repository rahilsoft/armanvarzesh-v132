
import type { Meta, StoryObj } from '@storybook/react';
import { ShowcaseGrid } from '../ShowcaseGrid';

const meta: Meta<typeof ShowcaseGrid> = {
  title: 'Vitrine/ShowcaseGrid',
  component: ShowcaseGrid,
};
export default meta;
type Story = StoryObj<typeof ShowcaseGrid>;

export const Grid: Story = {
  args: {
    tiles: [
      { id:'user-app', type:'showcase', title:{fa:'اپ کاربر', en:'User'}, subtitle:{fa:'...', en:'...'}, cta:{href:'#', label:{fa:'ببین', en:'Explore'}}, media:{kind:'image', src:'/hero.jpg'}, variant:'A' },
      { id:'coach-app', type:'showcase', title:{fa:'اپ مربی', en:'Coach'}, subtitle:{fa:'...', en:'...'}, cta:{href:'#', label:{fa:'برای مربیان', en:'For Coaches'}}, media:{kind:'image', src:'/hero.jpg'}, variant:'B' },
      { id:'academy', type:'showcase', title:{fa:'آکادمی', en:'Academy'}, subtitle:{fa:'...', en:'...'}, cta:{href:'#', label:{fa:'دوره‌ها', en:'Courses'}}, media:{kind:'image', src:'/hero.jpg'}, variant:'A' },
      { id:'clubs', type:'showcase', title:{fa:'باشگاه‌ها', en:'Clubs'}, subtitle:{fa:'...', en:'...'}, cta:{href:'#', label:{fa:'باشگاه‌ها', en:'Clubs'}}, media:{kind:'image', src:'/hero.jpg'}, variant:'A' },
    ],
    locale:'fa'
  }
};
