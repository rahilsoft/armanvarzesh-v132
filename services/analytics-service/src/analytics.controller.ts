import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common'
import { AnalyticsService } from './analytics.service'
/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
@Controller()
export class AnalyticsController {
  constructor(private svc: AnalyticsService){}
/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
  @Get() list(){ return this.svc.list() }
/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
  @Get(':id') get(@Param('id') id:string){ return this.svc.get(id) }
  @Post() create(@Body() dto:any){ return this.svc.create(dto) }
  @Put(':id') update(@Param('id') id:string, @Body() dto:any){ return this.svc.update(id,dto) }
  @Delete(':id') remove(@Param('id') id:string){ return this.svc.remove(id) }
}