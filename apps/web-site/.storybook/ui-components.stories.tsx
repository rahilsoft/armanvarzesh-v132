import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@arman/ui-components';

const meta: Meta<typeof Button> = { title: 'UI/Button', component: Button };
export default meta;
export const Solid: StoryObj<typeof Button> = { args: { children: 'دکمه اصلی' } };
export const Ghost: StoryObj<typeof Button> = { args: { children: 'دکمه شبح', variant: 'ghost' } };
