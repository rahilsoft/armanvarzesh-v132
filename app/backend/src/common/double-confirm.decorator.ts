import { SetMetadata } from '@nestjs/common';
export const DOUBLE_CONFIRM = 'double_confirm';
export const DoubleConfirm = () => SetMetadata(DOUBLE_CONFIRM, true);
