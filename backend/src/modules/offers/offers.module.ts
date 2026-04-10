import { AuthModule } from '../auth/auth.module';
import { Module, forwardRef } from '@nestjs/common';
import { OffersController } from './offers.controller';
import { OffersService } from './offers.service';
import { CurrencyModule } from '../currency/currency.module';

@Module({
  controllers: [OffersController],
  providers: [OffersService],
  exports: [OffersService],
})
export class OffersModule {}
