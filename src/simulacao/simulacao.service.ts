import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateSimulacaoDto } from './dto/create-simulacao.dto.js';

@Injectable()
export class SimulacaoService {
  calcular(dto: CreateSimulacaoDto) {
    const {
      aporteInicial,
      aporteMensal,
      taxaAnual,
      prazoMeses,
    } = dto;

    // Validar os dados recebidos
    if (
      !Number.isFinite(aporteInicial) ||
      !Number.isFinite(aporteMensal) ||
      !Number.isFinite(taxaAnual) ||
      !Number.isInteger(prazoMeses) ||
      aporteInicial < 0 ||
      aporteMensal < 0 ||
      taxaAnual <= -100 ||
      prazoMeses <= 0
    ) {
      throw new BadRequestException(
        'Informe valores válidos para a simulação.',
      );
    }

    // Converter a taxa anual percentual para taxa mensal
    const taxaMensal =
      Math.pow(1 + taxaAnual / 100, 1 / 12) - 1;

    // Começar com o aporte inicial
    let saldo = aporteInicial;
    let totalInvestido = aporteInicial;

    // Calcular a evolução do investimento mês a mês
    for (let mes = 1; mes <= prazoMeses; mes++) {
      // Adicionar o aporte mensal no início do mês
      saldo += aporteMensal;
      totalInvestido += aporteMensal;

      // Aplicar os juros compostos sobre o saldo
      saldo *= 1 + taxaMensal;
    }

    // Calcular os juros ganhos
    const totalJuros = saldo - totalInvestido;

    // Retornar os resultados
    return {
      resumo: {
        totalInvestido: Number(totalInvestido.toFixed(2)),
        totalJuros: Number(totalJuros.toFixed(2)),
        montanteBruto: Number(saldo.toFixed(2)),
      },
      parametrosUtilizados: {
        taxaMensalAplicada: Number(taxaMensal.toFixed(8)),
      },
    };
  }
}