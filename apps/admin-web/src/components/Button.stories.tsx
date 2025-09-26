import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Button } from 'antd';

const meta: Meta<typeof Button> = { title: 'Ant/Button', component: Button };
export default meta;
export const Primary: StoryObj<typeof Button> = { args: { children: 'تأیید', type: 'primary' } };
