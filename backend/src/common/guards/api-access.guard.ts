import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const REQUIRES_API_ACCESS_KEY = 'requires_api_access';

/**
 * Decorator to mark endpoints that require API access (Business plan only)
 */
export const RequiresApiAccess = () => {
  return (target: any, key?: string, descriptor?: PropertyDescriptor) => {
    if (descriptor) {
      Reflect.defineMetadata(REQUIRES_API_ACCESS_KEY, true, descriptor.value);
    } else {
      Reflect.defineMetadata(REQUIRES_API_ACCESS_KEY, true, target);
    }
    return descriptor || target;
  };
};

/**
 * Guard that checks if user has API access based on their subscription plan
 * Only Business plan users have API access
 */
@Injectable()
export class ApiAccessGuard implements CanActivate {
  private readonly logger = new Logger(ApiAccessGuard.name);

  constructor(
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if this route requires API access
    const requiresApiAccess = this.reflector.getAllAndOverride<boolean>(REQUIRES_API_ACCESS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If route doesn't require API access, allow through
    if (!requiresApiAccess) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Get user ID from JWT payload
    const userId = user.sub || user.userId;
    if (!userId) {
      throw new ForbiddenException('Invalid user token');
    }

    // In open-source self-hosted version, all features are available
    this.logger.debug(`User ${userId} granted API access`);
    return true;
  }
}
