import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import { AuthenticatedUser } from './jwt.stategy'

export const CurrentUser = createParamDecorator((_: never, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest()

  return request.user as AuthenticatedUser
})
