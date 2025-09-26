import { Injectable } from '@nestjs/common'
@Injectable()
export class AnalyticsService {
  list(){ return [{id:'demo'}] }
  get(id:string){ return {id} }
  create(dto:any){ return {id:'new',...dto} }
  update(id:string,dto:any){ return {id,...dto} }
  remove(id:string){ return {id, removed:true} }
}