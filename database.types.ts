export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      alerta: {
        Row: {
          criado_em: string
          destinatario_id: string | null
          id: string
          lido: boolean
          mensagem: string | null
          notificacao_id: string | null
          tipo: Database["public"]["Enums"]["tipo_alerta"]
        }
        Insert: {
          criado_em?: string
          destinatario_id?: string | null
          id?: string
          lido?: boolean
          mensagem?: string | null
          notificacao_id?: string | null
          tipo: Database["public"]["Enums"]["tipo_alerta"]
        }
        Update: {
          criado_em?: string
          destinatario_id?: string | null
          id?: string
          lido?: boolean
          mensagem?: string | null
          notificacao_id?: string | null
          tipo?: Database["public"]["Enums"]["tipo_alerta"]
        }
        Relationships: []
      }
      avaliacao: {
        Row: {
          avaliado_por: string | null
          data: string
          evitou_recorrencia: boolean | null
          id: string
          notificacao_id: string
          observacoes: string | null
        }
        Insert: {
          avaliado_por?: string | null
          data?: string
          evitou_recorrencia?: boolean | null
          id?: string
          notificacao_id: string
          observacoes?: string | null
        }
        Update: {
          avaliado_por?: string | null
          data?: string
          evitou_recorrencia?: boolean | null
          id?: string
          notificacao_id?: string
          observacoes?: string | null
        }
        Relationships: []
      }
      evidencia: {
        Row: {
          arquivo_url: string
          criado_em: string
          enviado_por: string | null
          id: string
          nome: string | null
          plano_acao_id: string
          tipo: string | null
        }
        Insert: {
          arquivo_url: string
          criado_em?: string
          enviado_por?: string | null
          id?: string
          nome?: string | null
          plano_acao_id: string
          tipo?: string | null
        }
        Update: {
          arquivo_url?: string
          criado_em?: string
          enviado_por?: string | null
          id?: string
          nome?: string | null
          plano_acao_id?: string
          tipo?: string | null
        }
        Relationships: []
      }
      investigacao: {
        Row: {
          analisado_por: string | null
          analise_inicial: string | null
          causa_provavel: string | null
          dados: Json | null
          data: string
          fatores_contribuintes: string | null
          id: string
          metodo: Database["public"]["Enums"]["metodo_analise"] | null
          notificacao_id: string
        }
        Insert: {
          analisado_por?: string | null
          analise_inicial?: string | null
          causa_provavel?: string | null
          dados?: Json | null
          data?: string
          fatores_contribuintes?: string | null
          id?: string
          metodo?: Database["public"]["Enums"]["metodo_analise"] | null
          notificacao_id: string
        }
        Update: {
          analisado_por?: string | null
          analise_inicial?: string | null
          causa_provavel?: string | null
          dados?: Json | null
          data?: string
          fatores_contribuintes?: string | null
          id?: string
          metodo?: Database["public"]["Enums"]["metodo_analise"] | null
          notificacao_id?: string
        }
        Relationships: []
      }
      log_auditoria: {
        Row: {
          acao: string
          criado_em: string
          entidade: string
          entidade_id: string
          id: string
          usuario_id: string | null
          valor_anterior: Json | null
          valor_novo: Json | null
        }
        Insert: {
          acao: string
          criado_em?: string
          entidade: string
          entidade_id: string
          id?: string
          usuario_id?: string | null
          valor_anterior?: Json | null
          valor_novo?: Json | null
        }
        Update: {
          acao?: string
          criado_em?: string
          entidade?: string
          entidade_id?: string
          id?: string
          usuario_id?: string | null
          valor_anterior?: Json | null
          valor_novo?: Json | null
        }
        Relationships: []
      }
      notificacao: {
        Row: {
          atualizado_em: string
          categoria: string | null
          classificacao: Database["public"]["Enums"]["classificacao_evento"] | null
          criado_em: string
          data_evento: string | null
          data_notificacao: string
          descricao: string
          envolveu_paciente: boolean
          gravidade: Database["public"]["Enums"]["gravidade_evento"] | null
          id: string
          protocolo: string
          responsavel_id: string | null
          setor_id: string | null
          status: Database["public"]["Enums"]["status_notificacao"]
          tipo_evento: string | null
        }
        Insert: {
          atualizado_em?: string
          categoria?: string | null
          classificacao?: Database["public"]["Enums"]["classificacao_evento"] | null
          criado_em?: string
          data_evento?: string | null
          data_notificacao?: string
          descricao: string
          envolveu_paciente?: boolean
          gravidade?: Database["public"]["Enums"]["gravidade_evento"] | null
          id?: string
          protocolo?: string
          responsavel_id?: string | null
          setor_id?: string | null
          status?: Database["public"]["Enums"]["status_notificacao"]
          tipo_evento?: string | null
        }
        Update: {
          atualizado_em?: string
          categoria?: string | null
          classificacao?: Database["public"]["Enums"]["classificacao_evento"] | null
          criado_em?: string
          data_evento?: string | null
          data_notificacao?: string
          descricao?: string
          envolveu_paciente?: boolean
          gravidade?: Database["public"]["Enums"]["gravidade_evento"] | null
          id?: string
          protocolo?: string
          responsavel_id?: string | null
          setor_id?: string | null
          status?: Database["public"]["Enums"]["status_notificacao"]
          tipo_evento?: string | null
        }
        Relationships: []
      }
      plano_acao: {
        Row: {
          acao: string
          concluido_em: string | null
          criado_em: string
          id: string
          notificacao_id: string
          prazo: string | null
          responsavel_id: string | null
          status: Database["public"]["Enums"]["status_plano"]
        }
        Insert: {
          acao: string
          concluido_em?: string | null
          criado_em?: string
          id?: string
          notificacao_id: string
          prazo?: string | null
          responsavel_id?: string | null
          status?: Database["public"]["Enums"]["status_plano"]
        }
        Update: {
          acao?: string
          concluido_em?: string | null
          criado_em?: string
          id?: string
          notificacao_id?: string
          prazo?: string | null
          responsavel_id?: string | null
          status?: Database["public"]["Enums"]["status_plano"]
        }
        Relationships: []
      }
      setor: {
        Row: {
          ativo: boolean
          codigo: string | null
          criado_em: string
          id: string
          nome: string
        }
        Insert: {
          ativo?: boolean
          codigo?: string | null
          criado_em?: string
          id?: string
          nome: string
        }
        Update: {
          ativo?: boolean
          codigo?: string | null
          criado_em?: string
          id?: string
          nome?: string
        }
        Relationships: []
      }
      triagem: {
        Row: {
          data: string
          gravidade: Database["public"]["Enums"]["gravidade_evento"] | null
          id: string
          necessita_investigacao: boolean
          notificacao_id: string
          observacao: string | null
          triado_por: string | null
        }
        Insert: {
          data?: string
          gravidade?: Database["public"]["Enums"]["gravidade_evento"] | null
          id?: string
          necessita_investigacao?: boolean
          notificacao_id: string
          observacao?: string | null
          triado_por?: string | null
        }
        Update: {
          data?: string
          gravidade?: Database["public"]["Enums"]["gravidade_evento"] | null
          id?: string
          necessita_investigacao?: boolean
          notificacao_id?: string
          observacao?: string | null
          triado_por?: string | null
        }
        Relationships: []
      }
      usuario: {
        Row: {
          ativo: boolean
          criado_em: string
          email: string
          id: string
          nome: string
          perfil: Database["public"]["Enums"]["perfil_usuario"]
        }
        Insert: {
          ativo?: boolean
          criado_em?: string
          email: string
          id: string
          nome: string
          perfil?: Database["public"]["Enums"]["perfil_usuario"]
        }
        Update: {
          ativo?: boolean
          criado_em?: string
          email?: string
          id?: string
          nome?: string
          perfil?: Database["public"]["Enums"]["perfil_usuario"]
        }
        Relationships: []
      }
      usuario_setor: {
        Row: { setor_id: string; usuario_id: string }
        Insert: { setor_id: string; usuario_id: string }
        Update: { setor_id?: string; usuario_id?: string }
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: {
      registrar_notificacao: {
        Args: {
          p_descricao: string
          p_setor_id?: string | null
          p_tipo_evento?: string | null
          p_categoria?: string | null
          p_classificacao?: Database["public"]["Enums"]["classificacao_evento"] | null
          p_envolveu_paciente?: boolean
          p_data_evento?: string | null
        }
        Returns: string
      }
    }
    Enums: {
      classificacao_evento:
        | "sem_dano"
        | "circunstancia_risco"
        | "nao_conformidade"
        | "dano_leve"
        | "dano_moderado"
        | "dano_grave"
      gravidade_evento: "baixa" | "media" | "alta" | "critica"
      metodo_analise: "ishikawa" | "cinco_porques" | "protocolo_londres" | "5w2h"
      perfil_usuario: "admin_nsp" | "gestor"
      status_notificacao:
        | "nova"
        | "em_triagem"
        | "em_investigacao"
        | "em_analise"
        | "plano_acao"
        | "avaliacao_efetividade"
        | "concluida"
      status_plano: "pendente" | "em_andamento" | "concluido" | "atrasado"
      tipo_alerta:
        | "nova_notificacao"
        | "prazo_proximo"
        | "plano_atrasado"
        | "evento_grave"
        | "sem_analise"
        | "reincidencia"
    }
    CompositeTypes: { [_ in never]: never }
  }
}
