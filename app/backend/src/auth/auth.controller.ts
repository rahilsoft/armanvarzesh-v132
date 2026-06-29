import { SanitizePipe } from '../common/security/sanitize.pipe';
import { API_ROUTES } from '../common/http/routes';
import { Body, Controller, HttpCode, HttpStatus, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';

@Controller('auth') // see API_ROUTES.auth
@UsePipes(new SanitizePipe(), new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }))
export class AuthController {
  constructor(private readonly auth: AuthService) {}

/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDto) {
    const tokens = await this.auth.login(body);
    return { ok: true, data: tokens };
  }
/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() body: RefreshDto) {
    const tokens = await this.auth.refresh(body.refreshToken);
    return { ok: true, data: tokens };
  }
/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout() {
    // stateless logout — clients should delete tokens; optional server-side blacklist could be added later
    return { ok: true };
  }
}