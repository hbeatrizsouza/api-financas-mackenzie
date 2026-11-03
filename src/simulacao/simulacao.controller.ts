import { Controller, Post, Body } from '@nestjs/common';
import { SimulacaoService } from './simulacao.service.js';
import { CreateSimulacaoDto } from './dto/create-simulacao.dto.js';

@Controller('simulacao')
export class SimulacaoController {
  constructor(
    private readonly simulacaoService: SimulacaoService,
  ) {}

  @Post('renda-fixa')
  calcular(@Body() dto: CreateSimulacaoDto) {
    return this.simulacaoService.calcular(dto);
  }
}