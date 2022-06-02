import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// !service is part of the dependency injection system. we couldn't create a new service instance in the param decorators
// since it is outside of the DI system
// The use service makes use of the users repository and tht repository is set up only through dependency injection

// * make an interceptor to get the current user, then take the user that we find and expose to decorator
export const CurrentUser = createParamDecorator(
  // context is a wrapper for the incoming request, not only for HTTP  but also socket, grpc, graphQL and so on
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.currentUser;
  },
);
