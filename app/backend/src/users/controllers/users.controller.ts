
import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from '../users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
  @Get()
  async findAll(): Promise<any[]> {
    return this.usersService.findAll();
  }
/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<any> {
    return this.usersService.findOne(Number(id));
  }
}