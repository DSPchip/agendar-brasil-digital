
export interface BaseUser {
  id: string;
  nomeCompleto: string;
  email: string;
  telefone: string;
  senha?: string;
  tipo: 'paciente' | 'medico';
  dataCriacao: Date;
  dataAtualizacao: Date;
}

export interface Paciente extends BaseUser {
  tipo: 'paciente';
  dataNascimento: Date;
  genero: 'masculino' | 'feminino' | 'outro' | 'prefiro-nao-informar';
  historicoMedico?: string;
  planoSaude?: string;
  consultas: Consulta[];
  avaliacoes: AvaliacaoMedico[];
}

export interface Medico extends BaseUser {
  tipo: 'medico';
  crm: string;
  especialidade: string;
  anosExperiencia: number;
  biografia?: string;
  horariosAtendimento: HorarioAtendimento[];
  avaliacaoMedia: number;
  totalAvaliacoes: number;
  consultas: Consulta[];
}

export interface HorarioAtendimento {
  diaSemana: 'segunda' | 'terca' | 'quarta' | 'quinta' | 'sexta' | 'sabado' | 'domingo';
  horaInicio: string;
  horaFim: string;
  ativo: boolean;
}

export interface Consulta {
  id: string;
  pacienteId: string;
  medicoId: string;
  dataHora: Date;
  status: 'agendada' | 'confirmada' | 'concluida' | 'cancelada';
  observacoes?: string;
  prescricoes?: string;
  valor: number;
}

export interface AvaliacaoMedico {
  id: string;
  pacienteId: string;
  medicoId: string;
  nota: number;
  comentario?: string;
  dataAvaliacao: Date;
}

export interface CadastroFormData {
  tipo: 'paciente' | 'medico';
  nomeCompleto: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  telefone: string;
  // Campos específicos do paciente
  dataNascimento?: Date;
  genero?: 'masculino' | 'feminino' | 'outro' | 'prefiro-nao-informar';
  historicoMedico?: string;
  planoSaude?: string;
  // Campos específicos do médico
  crm?: string;
  especialidade?: string;
  anosExperiencia?: number;
  biografia?: string;
}
