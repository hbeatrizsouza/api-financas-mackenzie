import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TransacoesController } from './transacoes.controller.js';
import { TransacoesService } from './transacoes.service.js';
import { Transacao, TransacaoSchema } from './schemas/transacao.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transacao.name, schema: TransacaoSchema },
    ]),
  ],
  controllers: [TransacoesController],
  providers: [TransacoesService],
})
export class TransacoesModule {}
