export class CreateTransacaoDto {
  descricao: string;
  valor: number;
  tipo: 'receita' | 'despesa';
  categoria: string;
  consumoConsciente: boolean;
}