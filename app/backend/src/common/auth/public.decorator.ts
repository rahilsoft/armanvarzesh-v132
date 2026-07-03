import { SetMetadata } from '@nestjs/common';

/** Metadata key marking a route as publicly accessible (JwtAuthGuard skips it). */
export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Marks a route (or controller) as public so a controller-level
 * `@UseGuards(JwtAuthGuard)` still allows unauthenticated access to it —
 * used for PSP webhooks (authenticated by signature, not a bearer token) and
 * genuinely public reads (catalog/search/browse).
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
