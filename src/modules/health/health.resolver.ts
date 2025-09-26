import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class HealthResolver {
  @Query(() => String, { description: 'Simple health check' })
  health(): string {
    return 'OK';
  }
}
