import { IsEnum, IsOptional } from 'class-validator';

import { OrderStatus, OrderStatusList } from '../enum/order.enum';
import { PaginationDto } from '../../common/dto';

export class OrderPaginationDto extends PaginationDto {
  @IsOptional()
  @IsEnum(OrderStatusList, {
    message: `Valid status are: ${OrderStatusList.join(', ')}`,
  })
  status: OrderStatus;
}
