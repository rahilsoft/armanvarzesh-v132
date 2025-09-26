
import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { TileCard } from '../TileCard';

const meta: Meta<typeof TileCard> = {
  title: 'Vitrine/TileCard.Interactions',
  component: TileCard,
};
export default meta;
type Story = StoryObj<typeof TileCard>;

export const ClickCTA: Story = {
  args: {
    tile: {
      id:'user-app',
      type:'showcase',
      title:{ fa:'اپ کاربر', en:'User App' },
      subtitle:{ fa:'...', en:'...' },
      cta:{ href:'#', label:{ fa:'ببین', en:'Explore' } },
      media:{ kind:'image', src:'/hero.jpg' },
      variant:'A'
    },
    locale:'fa'
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const cta = await c.findByText('ببین');
    await userEvent.click(cta);
    expect(cta).toBeInTheDocument();
  }
};
