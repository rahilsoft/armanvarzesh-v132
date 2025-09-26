import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { API_ROUTES } from '../../common/http/routes';
import { AuthUseCase } from '../../lib/domain';
import { LoginDto, RefreshDto } from '../dto/auth.dto';
import { SanitizePipe } from '../../common/security/sanitize.pipe';

/** REST Auth endpoints */
@Controller()
export class AuthController {
  constructor(private readonly auth: AuthUseCase) {}

/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
  @Post(API_ROUTES.AUTH.LOGIN)
  @UsePipes(new SanitizePipe(), new ValidationPipe({ whitelist: true, transform: true }))
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.username, dto.password);
  }
/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */

  @Post(API_ROUTES.AUTH.REFRESH)
  @UsePipes(new SanitizePipe(), new ValidationPipe({ whitelist: true, transform: true }))
  refresh(@Body() dto: RefreshDto) {
    return this.auth.refresh(dto.token);
  }
}