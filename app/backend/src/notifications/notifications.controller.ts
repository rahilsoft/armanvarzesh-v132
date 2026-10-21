import { Body, Controller, Delete, HttpCode, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { IsIn, IsString, Matches, MaxLength } from 'class-validator';
import { Throttle } from '@nestjs/throttler';
import { NotificationsService, DEVICE_PLATFORMS, DevicePlatform } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CurrentUser, AuthPrincipal } from '../common/auth/current-user.decorator';

const EXPO_TOKEN_RE = /^(ExponentPushToken|ExpoPushToken)\[[^\]\s]+\]$/;

export class RegisterDeviceTokenDto {
  @IsString() @MaxLength(255) @Matches(EXPO_TOKEN_RE, { message: 'token must be an Expo push token' })
  token!: string;

  @IsIn(DEVICE_PLATFORMS as unknown as string[])
  platform!: DevicePlatform;
}

export class UnregisterDeviceTokenDto {
  @IsString() @MaxLength(255)
  token!: string;
}

/**
 * Device push-token registration for the authenticated user. The user id is
 * taken only from the verified JWT, never from the request body.
 */
@Controller('notifications/v1/device-tokens')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class NotificationsController {
  constructor(private readonly svc: NotificationsService) {}

  @Post()
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  async register(@CurrentUser() user: AuthPrincipal, @Body() dto: RegisterDeviceTokenDto) {
    return this.svc.registerToken(user.userId, dto.token, dto.platform);
  }

  @Delete()
  @HttpCode(200)
  async unregister(@CurrentUser() user: AuthPrincipal, @Body() dto: UnregisterDeviceTokenDto) {
    return this.svc.unregisterToken(user.userId, dto.token);
  }
}
