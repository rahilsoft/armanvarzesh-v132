import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
import { RefreshInput } from './dto/refresh.input';
import { AuthTokens } from './entities/auth-tokens.entity';
import { User } from './entities/user.entity';

/**
 * GraphQL resolver exposing authentication operations. Provides
 * register, login and refresh mutations.
 */
@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => User)
  async register(@Args('input') input: RegisterInput) {
    return this.authService.register(input);
  }

  @Mutation(() => AuthTokens)
  async login(@Args('input') input: LoginInput) {
    return this.authService.login(input);
  }

  @Mutation(() => AuthTokens)
  async refresh(@Args('input') input: RefreshInput) {
    return this.authService.refresh(input.refreshToken);
  }
}