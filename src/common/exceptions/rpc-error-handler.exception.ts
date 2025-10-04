import { RpcException } from '@nestjs/microservices';

export const rpcErrorHandler = (err: string | object) => {
  throw new RpcException(err);
};
