import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [OrdersController],
  providers: [],
  imports: [NatsModule],
  //   imports: [
  //     ClientsModule.register([
  //       {
  //         name: ORDER_SERVICE,
  //         transport: Transport.TCP,
  //         options: {
  //           host: 'localhost',
  //           port: 3003,
  //         },
  //       },
  //     ]),
  //   ],
})
export class OrdersModule {}
