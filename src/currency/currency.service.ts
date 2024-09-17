// import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

interface ExchangeRateResponse {
  success: boolean;
  timestamp: number;
  base: string;
  date: string;
  rates: { [key: string]: number };
}

@Injectable()
export class CurrencyService {
  constructor(private configService: ConfigService) {}

  private readonly apiKey = this.configService.get<string>(
    'EXCHANGE_RATES_API_KEY',
  );
  private readonly baseUrl = this.configService.get<string>(
    'EXCHANGE_RATES_API_BASE_URL',
  );

  async getExchangeRate(from: string, to: string): Promise<number> {
    try {
      const response = await axios.get<ExchangeRateResponse>(
        `${this.baseUrl}/latest?access_key=${this.apiKey}&symbols=${from},${to}`,
      );

      if (response.data.success) {
        const euroToFrom = response.data.rates[from];
        const euroToTo = response.data.rates[to];
        return euroToTo / euroToFrom;
      } else {
        throw new HttpException(
          'Failed to fetch exchange rate',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      console.error('Error details:', error.response?.data || error.message);
      throw new HttpException(
        'Error fetching exchange rate',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getEuroExchangeRates(): Promise<{ [key: string]: number }> {
    try {
      const response = await axios.get<ExchangeRateResponse>(
        `${this.baseUrl}/latest?access_key=${this.apiKey}`,
      );

      if (response.data.success) {
        return response.data.rates;
      } else {
        throw new HttpException(
          'Failed to fetch Euro exchange rates',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      console.error('Error details:', error.response?.data || error.message);
      throw new HttpException(
        'Error fetching Euro exchange rates',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
