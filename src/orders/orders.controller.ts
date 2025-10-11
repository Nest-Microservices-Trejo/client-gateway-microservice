import { PaginationDto } from './../common/dto/pagination.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Inject,
  ParseUUIDPipe,
  Query,
  Patch,
} from '@nestjs/common';

import { ClientProxy } from '@nestjs/microservices';

import { CreateOrderDto, OrderPaginationDto } from './dto';
import { catchError } from 'rxjs';

import { StatusDto } from './dto/status.dto';
import { NATS_SERVICE } from '../config/services';
import { rpcErrorHandler } from '../common/exceptions/rpc-error-handler.exception';

@Controller('orders')
export class OrdersController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.client
      .send('createOrder', createOrderDto)
      .pipe(catchError(rpcErrorHandler));
  }

  @Get()
  findAll(@Query() paginationDto: OrderPaginationDto) {
    return this.client
      .send('findAllOrders', paginationDto)
      .pipe(catchError(rpcErrorHandler));
  }

  @Get('id/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.client
      .send('findOneOrder', { id })
      .pipe(catchError(rpcErrorHandler));
  }

  @Get('status/:status')
  findByStatus(
    @Param() statusDto: StatusDto,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.client
      .send('findAllOrders', { ...statusDto, ...paginationDto })
      .pipe(catchError(rpcErrorHandler));
  }

  @Patch(':id')
  changeStatusOrder(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusDto: StatusDto,
  ) {
    return this.client
      .send('changeOrderStatus', { ...statusDto, id })
      .pipe(catchError(rpcErrorHandler));
  }
}
