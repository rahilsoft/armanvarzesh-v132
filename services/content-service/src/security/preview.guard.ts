
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { verifyPreview } from './preview.util';

/**
 * PreviewGuard:
 * - Allows includeDraft=true only if:
 *   a) X-Preview-Token is a valid signed token with unexpired `exp` (using PREVIEW_SIGNING_KEY), or
 *   b) request has Authorization Bearer (roles are enforced by RolesGuard elsewhere).
 */
@Injectable()
export class PreviewGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req: any = context.switchToHttp().getRequest?.() || context.getArgByIndex?.(2)?.req;
    const token = req?.headers?.['x-preview-token'];
    const key = process.env.PREVIEW_SIGNING_KEY;
    if (key && token) {
      const ok = verifyPreview(String(token), key);
      if (ok) return true;
    }
    const auth = req?.headers?.authorization || '';
    if (auth.startsWith('Bearer ')) return true;
    return false;
  }
}
