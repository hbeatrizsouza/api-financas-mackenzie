import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Transacao, TransacaoDocument } from './schemas/transacao.schema.js';
import { CreateTransacaoDto } from './dto/create-transacao.dto.js';

@Injectable()
export class TransacoesService {
  constructor(
    @InjectModel(Transacao.name)
    private readonly transacaoModel: Model<TransacaoDocument>,
  ) {}

  async criar(dados: CreateTransacaoDto) {
    if (
      !dados ||
      typeof dados.descricao !== 'string' ||
      !dados.descricao.trim() ||
      typeof dados.categoria !== 'string' ||
      !dados.categoria.trim()
    ) {
      throw new BadRequestException(
        'Informe uma descrição e uma categoria válidas.',
      );
    }

    if (
      typeof dados.valor !== 'number' ||
      !Number.isFinite(dados.valor) ||
      dados.valor <= 0
    ) {
      throw new BadRequestException(
        'O valor deve ser um número maior que zero.',
      );
    }

    if (!['receita', 'despesa'].includes(dados.tipo)) {
      throw new BadRequestException(
        'O tipo deve ser receita ou despesa.',
      );
    }

    if (typeof dados.consumoConsciente !== 'boolean') {
      throw new BadRequestException(
        'consumoConsciente deve ser true ou false.',
      );
    }

    const transacao = new this.transacaoModel({
      ...dados,
      descricao: dados.descricao.trim(),
      categoria: dados.categoria.trim(),
    });

    return transacao.save();
  }

  async listar() {
  const historico = await this.transacaoModel
    .find()
    .sort({ createdAt: -1 })
    .exec();

  const receitas = historico
    .filter((transacao) => transacao.tipo === 'receita')
    .reduce((total, transacao) => total + transacao.valor, 0);

  const totalDespesas = historico
    .filter((transacao) => transacao.tipo === 'despesa')
    .reduce((total, transacao) => total + transacao.valor, 0);

  const totalGastoImpulso = historico
    .filter(
      (transacao) =>
        transacao.tipo === 'despesa' &&
        transacao.consumoConsciente === false,
    )
    .reduce((total, transacao) => total + transacao.valor, 0);

  const saldoTotal = receitas - totalDespesas;

  return {
    historico,
    metricas: {
      saldoTotal,
      totalDespesas,
      totalGastoImpulso,
    },
  };
}

}
