
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => String)
  async login(@Args('input') input: LoginInput) {
    const result = await this.authService.login(input);
    return result.accessToken;
  }

  @Mutation(() => String)
  async register(@Args('input') input: RegisterInput) {
    const result = await this.authService.register(input);
    return result.accessToken;
  }
}
