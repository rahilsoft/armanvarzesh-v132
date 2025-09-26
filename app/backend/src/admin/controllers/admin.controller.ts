
import { Controller, Get, Param } from '@nestjs/common';
import { AdminService } from '../admin.service';
import { Admin } from '../entities/admin.entity';

@Controller('admins')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
  @Get()
  async findAll(): Promise<Admin[]> {
    return this.adminService.findAll();
  }
/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Admin> {
    return this.adminService.findOne(Number(id));
  }
}