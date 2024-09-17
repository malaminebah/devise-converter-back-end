import { Controller, Get, Query } from '@nestjs/common';
import { CurrencyService } from './currency.service';

@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get('convert')
  async convertCurrency(
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('amount') amount: number,
  ) {
    const rate = await this.currencyService.getExchangeRate(from, to);
    const convertedAmount = amount * rate;
    return {
      from,
      to,
      amount,
      convertedAmount,
      rate,
    };
  }

  @Get('euro-rates')
  async getEuroExchangeRates() {
    return this.currencyService.getEuroExchangeRates();
  }
}
