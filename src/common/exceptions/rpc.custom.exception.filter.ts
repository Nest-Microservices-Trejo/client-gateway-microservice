import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';

import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';
import { RpcErrorShape } from '../interfaces/rpc-error-shape.interface';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const rpcError = exception.getError();

    if (isRpcErrorShape(rpcError)) {
      return response.status(rpcError.status).json(rpcError);
    }

    if (rpcError.toString().includes('Empty response'))
      return response.status(500).json({
        status: 500,
        message: rpcError
          .toString()
          .substring(0, rpcError.toString().indexOf('(') - 1),
      });

    response.status(400).json({
      status: 400,
      message: rpcError,
    });
  }
}

function isRpcErrorShape(error: unknown): error is RpcErrorShape {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    typeof error.status === 'number' &&
    'message' in error &&
    typeof error.message === 'string'
  );
}
