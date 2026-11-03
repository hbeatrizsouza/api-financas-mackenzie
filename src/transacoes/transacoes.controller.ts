import { Body, Controller, Get, Post } from '@nestjs/common';
import { TransacoesService } from './transacoes.service.js';
import { CreateTransacaoDto } from './dto/create-transacao.dto.js';

@Controller('transacoes')
export class TransacoesController {
  constructor(
    private readonly transacoesService: TransacoesService,
  ) {}

  @Post()
  criar(@Body() dados: CreateTransacaoDto) {
    return this.transacoesService.criar(dados);
  }

  @Get()
  listar() {
    return this.transacoesService.listar();
  }
}