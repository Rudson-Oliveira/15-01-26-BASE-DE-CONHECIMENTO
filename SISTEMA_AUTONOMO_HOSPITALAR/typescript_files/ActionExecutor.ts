/**
 * ActionExecutor.ts
 * 
 * Executor de ações baseado em comandos de linguagem natural
 * Interpreta mensagens do chat e executa ações no sistema
 * 
 * @author Manus AI
 * @date 17/01/2026
 */

import { BrowserController, ActionResult } from './browser-controller.service';

export interface ParsedCommand {
  action: string;
  entity: string;
  params: Record<string, any>;
  originalText: string;
  confidence: number;
}

export interface ExecutionResult {
  success: boolean;
  message: string;
  action: string;
  data?: any;
  executionTime: number;
}

export class ActionExecutor {
  private browserController: BrowserController;
  
  // Padrões de comandos reconhecidos
  private commandPatterns = {
    // Navegação
    navigate: [
      /^(?:ir para|navegar para|abrir|acessar)\s+(.+)$/i,
      /^(?:vá para|vai para|va para)\s+(.+)$/i,
      /^\/(?:ir|nav|go)\s+(.+)$/i
    ],
    
    // Cadastro de Paciente
    cadastrarPaciente: [
      /^(?:cadastrar?|criar|adicionar|novo)\s+(?:um\s+)?(?:novo\s+)?paciente\s+(.+)$/i,
      /^(?:cadastre|crie|adicione)\s+(?:o\s+)?paciente\s+(.+)$/i,
      /^\/paciente\s+(.+)$/i
    ],
    
    // Criar Orçamento
    criarOrcamento: [
      /^(?:criar|gerar|fazer|novo)\s+(?:um\s+)?(?:novo\s+)?or[çc]amento\s*(?:para\s+)?(.*)$/i,
      /^(?:crie|gere|fa[çc]a)\s+(?:um\s+)?or[çc]amento\s*(?:para\s+)?(.*)$/i,
      /^\/or[çc]amento\s*(.*)$/i
    ],
    
    // Buscar Paciente
    buscarPaciente: [
      /^(?:buscar?|procurar?|encontrar?|pesquisar?)\s+(?:o\s+)?paciente\s+(.+)$/i,
      /^(?:busque|procure|encontre|pesquise)\s+(?:o\s+)?paciente\s+(.+)$/i,
      /^\/buscar\s+(.+)$/i
    ],
    
    // Listar
    listar: [
      /^(?:listar?|mostrar?|exibir?|ver)\s+(?:todos\s+)?(?:os\s+)?(.+)$/i,
      /^(?:liste|mostre|exiba|veja)\s+(?:todos\s+)?(?:os\s+)?(.+)$/i,
      /^\/listar?\s+(.+)$/i
    ],
    
    // Relatórios
    relatorio: [
      /^(?:gerar?|criar?|ver|abrir)\s+(?:o\s+)?relat[óo]rio\s*(?:de\s+)?(.*)$/i,
      /^(?:gere|crie|veja|abra)\s+(?:o\s+)?relat[óo]rio\s*(?:de\s+)?(.*)$/i,
      /^\/relatorio\s*(.*)$/i
    ],
    
    // Financeiro
    financeiro: [
      /^(?:acessar?|abrir?|ver)\s+(?:o\s+)?financeiro$/i,
      /^(?:acesse|abra|veja)\s+(?:o\s+)?financeiro$/i,
      /^\/financeiro$/i
    ],
    
    // Configurações
    configuracoes: [
      /^(?:acessar?|abrir?|ver)\s+(?:as\s+)?configura[çc][õo]es$/i,
      /^(?:acesse|abra|veja)\s+(?:as\s+)?configura[çc][õo]es$/i,
      /^\/config(?:ura[çc][õo]es)?$/i
    ],
    
    // APIs
    apis: [
      /^(?:configurar?|ver|gerenciar?)\s+(?:as\s+)?apis?$/i,
      /^(?:configure|veja|gerencie)\s+(?:as\s+)?apis?$/i,
      /^\/apis?$/i
    ],
    
    // Ajuda
    ajuda: [
      /^(?:ajuda|help|socorro|comandos)$/i,
      /^\/(?:ajuda|help)$/i,
      /^o que voc[êe] (?:pode|sabe) fazer\??$/i
    ]
  };

  // Mapeamento de entidades para rotas
  private entityRoutes: Record<string, string> = {
    'pacientes': 'pacientes',
    'paciente': 'pacientes',
    'orçamentos': 'orcamentos',
    'orcamentos': 'orcamentos',
    'orçamento': 'orcamentos',
    'orcamento': 'orcamentos',
    'relatórios': 'relatorios',
    'relatorios': 'relatorios',
    'relatório': 'relatorios',
    'relatorio': 'relatorios',
    'financeiro': 'financeiro',
    'configurações': 'configuracoes',
    'configuracoes': 'configuracoes',
    'config': 'configuracoes',
    'apis': 'apiConfig',
    'api': 'apiConfig',
    'home': 'home',
    'início': 'home',
    'inicio': 'home',
    'dashboard': 'home'
  };

  constructor(browserController: BrowserController) {
    this.browserController = browserController;
  }

  /**
   * Parseia uma mensagem de texto e identifica o comando
   */
  parseCommand(text: string): ParsedCommand | null {
    const normalizedText = text.trim().toLowerCase();
    
    for (const [action, patterns] of Object.entries(this.commandPatterns)) {
      for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) {
          return {
            action,
            entity: match[1]?.trim() || '',
            params: this.extractParams(action, match[1] || ''),
            originalText: text,
            confidence: this.calculateConfidence(text, pattern)
          };
        }
      }
    }
    
    return null;
  }

  /**
   * Extrai parâmetros específicos baseado na ação
   */
  private extractParams(action: string, rawParams: string): Record<string, any> {
    const params: Record<string, any> = {};
    
    switch (action) {
      case 'cadastrarPaciente':
        // Tentar extrair nome, CPF, telefone, etc.
        params.nome = rawParams;
        
        // Extrair CPF se presente
        const cpfMatch = rawParams.match(/cpf[:\s]+(\d{3}\.?\d{3}\.?\d{3}-?\d{2})/i);
        if (cpfMatch) {
          params.cpf = cpfMatch[1];
          params.nome = rawParams.replace(cpfMatch[0], '').trim();
        }
        
        // Extrair telefone se presente
        const telMatch = rawParams.match(/(?:tel|telefone|fone)[:\s]+(\(?\d{2}\)?\s?\d{4,5}-?\d{4})/i);
        if (telMatch) {
          params.telefone = telMatch[1];
          params.nome = params.nome.replace(telMatch[0], '').trim();
        }
        
        // Extrair email se presente
        const emailMatch = rawParams.match(/(?:email|e-mail)[:\s]+([^\s]+@[^\s]+)/i);
        if (emailMatch) {
          params.email = emailMatch[1];
          params.nome = params.nome.replace(emailMatch[0], '').trim();
        }
        break;
        
      case 'criarOrcamento':
        params.pacienteNome = rawParams;
        break;
        
      case 'buscarPaciente':
        params.nome = rawParams;
        break;
        
      case 'navigate':
        params.destino = this.entityRoutes[rawParams.toLowerCase()] || rawParams;
        break;
        
      case 'listar':
        params.entidade = this.entityRoutes[rawParams.toLowerCase()] || rawParams;
        break;
    }
    
    return params;
  }

  /**
   * Calcula a confiança do match
   */
  private calculateConfidence(text: string, pattern: RegExp): number {
    const match = text.match(pattern);
    if (!match) return 0;
    
    // Quanto mais específico o match, maior a confiança
    const matchLength = match[0].length;
    const textLength = text.length;
    
    return Math.min(0.5 + (matchLength / textLength) * 0.5, 1);
  }

  /**
   * Executa um comando parseado
   */
  async execute(command: ParsedCommand): Promise<ExecutionResult> {
    const startTime = Date.now();
    let result: ActionResult;
    
    try {
      switch (command.action) {
        case 'navigate':
          result = await this.browserController.navigate(command.params.destino);
          break;
          
        case 'cadastrarPaciente':
          result = await this.browserController.cadastrarPaciente({
            nome: command.params.nome,
            cpf: command.params.cpf,
            telefone: command.params.telefone,
            email: command.params.email
          });
          break;
          
        case 'criarOrcamento':
          result = await this.browserController.criarOrcamento({
            pacienteNome: command.params.pacienteNome
          });
          break;
          
        case 'buscarPaciente':
          result = await this.browserController.buscarPaciente(command.params.nome);
          break;
          
        case 'listar':
          result = await this.browserController.navigate(command.params.entidade);
          break;
          
        case 'relatorio':
          result = await this.browserController.navigate('relatorios');
          break;
          
        case 'financeiro':
          result = await this.browserController.navigate('financeiro');
          break;
          
        case 'configuracoes':
          result = await this.browserController.navigate('configuracoes');
          break;
          
        case 'apis':
          result = await this.browserController.navigate('apiConfig');
          break;
          
        case 'ajuda':
          result = {
            success: true,
            message: this.getHelpMessage()
          };
          break;
          
        default:
          result = {
            success: false,
            message: `Ação não reconhecida: ${command.action}`
          };
      }
      
      return {
        success: result.success,
        message: result.message,
        action: command.action,
        data: result.data,
        executionTime: Date.now() - startTime
      };
      
    } catch (error: any) {
      return {
        success: false,
        message: `Erro ao executar ação: ${error.message}`,
        action: command.action,
        executionTime: Date.now() - startTime
      };
    }
  }

  /**
   * Processa uma mensagem de texto e executa a ação correspondente
   */
  async processMessage(text: string): Promise<ExecutionResult> {
    const command = this.parseCommand(text);
    
    if (!command) {
      return {
        success: false,
        message: 'Não entendi o comando. Digite /ajuda para ver os comandos disponíveis.',
        action: 'unknown',
        executionTime: 0
      };
    }
    
    if (command.confidence < 0.5) {
      return {
        success: false,
        message: `Não tenho certeza se entendi. Você quis dizer "${command.action}"?`,
        action: command.action,
        executionTime: 0
      };
    }
    
    return this.execute(command);
  }

  /**
   * Retorna mensagem de ajuda com comandos disponíveis
   */
  private getHelpMessage(): string {
    return `
**Comandos Disponíveis:**

**Navegação:**
- \`ir para [destino]\` - Navega para uma página
- \`/ir pacientes\` - Vai para lista de pacientes
- \`/ir orcamentos\` - Vai para lista de orçamentos

**Pacientes:**
- \`cadastrar paciente [nome]\` - Cadastra novo paciente
- \`/paciente João Silva CPF: 123.456.789-00\` - Cadastro completo
- \`buscar paciente [nome]\` - Busca um paciente

**Orçamentos:**
- \`criar orçamento para [paciente]\` - Cria novo orçamento
- \`/orcamento João Silva\` - Cria orçamento rápido

**Outros:**
- \`ver relatórios\` - Acessa relatórios
- \`acessar financeiro\` - Acessa módulo financeiro
- \`configurar apis\` - Gerencia configurações de API
- \`/ajuda\` - Mostra esta mensagem

**Dica:** Posso executar ações automaticamente no sistema!
    `.trim();
  }

  /**
   * Verifica se uma mensagem é um comando executável
   */
  isExecutableCommand(text: string): boolean {
    return this.parseCommand(text) !== null;
  }

  /**
   * Obtém sugestões de comandos baseado em texto parcial
   */
  getSuggestions(partialText: string): string[] {
    const suggestions: string[] = [];
    const normalized = partialText.toLowerCase();
    
    const commonCommands = [
      'cadastrar paciente',
      'criar orçamento',
      'buscar paciente',
      'ir para pacientes',
      'ir para orçamentos',
      'ver relatórios',
      'acessar financeiro',
      'configurar apis',
      '/ajuda'
    ];
    
    for (const cmd of commonCommands) {
      if (cmd.toLowerCase().includes(normalized)) {
        suggestions.push(cmd);
      }
    }
    
    return suggestions.slice(0, 5);
  }
}

// Factory function para criar instância
export function createActionExecutor(browserController: BrowserController): ActionExecutor {
  return new ActionExecutor(browserController);
}

export default ActionExecutor;
