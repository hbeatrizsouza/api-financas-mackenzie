import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { SimulacaoModule } from './simulacao/simulacao.module.js';
import { TransacoesModule } from './transacoes/transacoes.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
    }),

    SimulacaoModule,

    TransacoesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}