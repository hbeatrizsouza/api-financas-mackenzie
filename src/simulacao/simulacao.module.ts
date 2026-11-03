import { Module } from '@nestjs/common';
import { SimulacaoService } from './simulacao.service.js';
import { SimulacaoController } from './simulacao.controller.js';

@Module({
  controllers: [SimulacaoController],
  providers: [SimulacaoService],
})
export class SimulacaoModule {}
