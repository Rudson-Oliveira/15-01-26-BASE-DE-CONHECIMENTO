/**
 * BrowserController.ts
 * 
 * Controlador do navegador embutido (iframe) no VisionAI
 * Permite executar ações no sistema Hospitalar Saúde
 * 
 * @author Manus AI
 * @date 17/01/2026
 */

export interface BrowserAction {
  type: 'navigate' | 'click' | 'input' | 'scroll' | 'wait' | 'screenshot';
  target?: string;
  value?: string;
  timeout?: number;
}

export interface BrowserState {
  url: string;
  title: string;
  isLoading: boolean;
  lastAction: BrowserAction | null;
  lastError: string | null;
}

export interface ActionResult {
  success: boolean;
  message: string;
  data?: any;
  screenshot?: string;
}

export class BrowserController {
  private iframe: HTMLIFrameElement | null = null;
  private state: BrowserState;
  private actionQueue: BrowserAction[] = [];
  private isExecuting: boolean = false;
  private baseUrls = {
    dev: 'https://dev.hospitalarsaude.app.br',
    prod: 'https://hospitalarsaude.app.br'
  };
  private currentEnv: 'dev' | 'prod' = 'dev';

  // Mapeamento de rotas do sistema
  private routes = {
    home: '/#/dashboard/home',
    pacientes: '/#/dashboard/pacientes',
    novoPaciente: '/#/dashboard/pacientes/novo',
    orcamentos: '/#/dashboard/orcamentos',
    novoOrcamento: '/#/dashboard/orcamentos/novo',
    relatorios: '/#/dashboard/relatorios',
    financeiro: '/#/dashboard/financeiro',
    configuracoes: '/#/dashboard/configuracoes',
    apiConfig: '/#/dashboard/configuracoes/api'
  };

  // Seletores CSS para elementos comuns
  private selectors = {
    // Formulário de Paciente
    pacienteNome: 'input[formcontrolname="nome"], input[name="nome"]',
    pacienteCpf: 'input[formcontrolname="cpf"], input[name="cpf"]',
    pacienteDataNascimento: 'input[formcontrolname="dataNascimento"], input[name="dataNascimento"]',
    pacienteTelefone: 'input[formcontrolname="telefone"], input[name="telefone"]',
    pacienteEmail: 'input[formcontrolname="email"], input[name="email"]',
    
    // Formulário de Orçamento
    orcamentoPaciente: 'input[formcontrolname="paciente"], input[name="paciente"]',
    orcamentoDescricao: 'textarea[formcontrolname="descricao"], textarea[name="descricao"]',
    orcamentoValor: 'input[formcontrolname="valor"], input[name="valor"]',
    
    // Botões comuns
    btnSalvar: 'button[type="submit"], button.btn-primary:contains("Salvar")',
    btnCancelar: 'button.btn-secondary:contains("Cancelar")',
    btnNovo: 'button:contains("Novo"), button:contains("Adicionar")',
    
    // Menu lateral
    menuPacientes: 'a[href*="pacientes"], .menu-item:contains("Pacientes")',
    menuOrcamentos: 'a[href*="orcamentos"], .menu-item:contains("Orçamentos")',
    menuRelatorios: 'a[href*="relatorios"], .menu-item:contains("Relatórios")',
    menuFinanceiro: 'a[href*="financeiro"], .menu-item:contains("Financeiro")'
  };

  constructor() {
    this.state = {
      url: '',
      title: '',
      isLoading: false,
      lastAction: null,
      lastError: null
    };
  }

  /**
   * Inicializa o controller com referência ao iframe
   */
  init(iframeElement: HTMLIFrameElement): void {
    this.iframe = iframeElement;
    this.setupEventListeners();
    this.updateState();
  }

  /**
   * Configura listeners de eventos do iframe
   */
  private setupEventListeners(): void {
    if (!this.iframe) return;

    this.iframe.addEventListener('load', () => {
      this.state.isLoading = false;
      this.updateState();
      this.emitEvent('pageLoaded', this.state);
    });

    // Observar mudanças de URL
    const observer = new MutationObserver(() => {
      this.updateState();
    });

    if (this.iframe.contentDocument) {
      observer.observe(this.iframe.contentDocument, {
        childList: true,
        subtree: true
      });
    }
  }

  /**
   * Atualiza o estado atual do navegador
   */
  private updateState(): void {
    if (!this.iframe || !this.iframe.contentWindow) return;

    try {
      this.state.url = this.iframe.contentWindow.location.href;
      this.state.title = this.iframe.contentDocument?.title || '';
    } catch (e) {
      // Cross-origin restriction
      this.state.lastError = 'Não foi possível acessar o conteúdo do iframe (cross-origin)';
    }
  }

  /**
   * Emite evento customizado
   */
  private emitEvent(eventName: string, data: any): void {
    const event = new CustomEvent(`browserController:${eventName}`, { detail: data });
    window.dispatchEvent(event);
  }

  /**
   * Define o ambiente (DEV ou PROD)
   */
  setEnvironment(env: 'dev' | 'prod'): void {
    this.currentEnv = env;
  }

  /**
   * Obtém a URL base atual
   */
  getBaseUrl(): string {
    return this.baseUrls[this.currentEnv];
  }

  /**
   * Navega para uma rota específica
   */
  async navigate(route: keyof typeof this.routes | string): Promise<ActionResult> {
    const path = this.routes[route as keyof typeof this.routes] || route;
    const fullUrl = `${this.getBaseUrl()}${path}`;

    return this.executeAction({
      type: 'navigate',
      target: fullUrl
    });
  }

  /**
   * Clica em um elemento
   */
  async click(selector: string): Promise<ActionResult> {
    return this.executeAction({
      type: 'click',
      target: selector
    });
  }

  /**
   * Insere texto em um campo
   */
  async input(selector: string, value: string): Promise<ActionResult> {
    return this.executeAction({
      type: 'input',
      target: selector,
      value: value
    });
  }

  /**
   * Rola a página
   */
  async scroll(direction: 'up' | 'down', amount?: number): Promise<ActionResult> {
    return this.executeAction({
      type: 'scroll',
      target: direction,
      value: String(amount || 300)
    });
  }

  /**
   * Aguarda um tempo específico
   */
  async wait(ms: number): Promise<ActionResult> {
    return this.executeAction({
      type: 'wait',
      timeout: ms
    });
  }

  /**
   * Captura screenshot do iframe
   */
  async screenshot(): Promise<ActionResult> {
    return this.executeAction({
      type: 'screenshot'
    });
  }

  /**
   * Executa uma ação no navegador
   */
  private async executeAction(action: BrowserAction): Promise<ActionResult> {
    this.state.lastAction = action;
    this.state.lastError = null;

    try {
      switch (action.type) {
        case 'navigate':
          return await this.doNavigate(action.target!);
        
        case 'click':
          return await this.doClick(action.target!);
        
        case 'input':
          return await this.doInput(action.target!, action.value!);
        
        case 'scroll':
          return await this.doScroll(action.target as 'up' | 'down', parseInt(action.value || '300'));
        
        case 'wait':
          return await this.doWait(action.timeout || 1000);
        
        case 'screenshot':
          return await this.doScreenshot();
        
        default:
          return { success: false, message: `Ação desconhecida: ${action.type}` };
      }
    } catch (error: any) {
      this.state.lastError = error.message;
      return { success: false, message: error.message };
    }
  }

  /**
   * Implementação: Navegar
   */
  private async doNavigate(url: string): Promise<ActionResult> {
    if (!this.iframe) {
      return { success: false, message: 'Iframe não inicializado' };
    }

    this.state.isLoading = true;
    this.iframe.src = url;

    // Aguardar carregamento
    await new Promise<void>((resolve) => {
      const onLoad = () => {
        this.iframe?.removeEventListener('load', onLoad);
        resolve();
      };
      this.iframe?.addEventListener('load', onLoad);
      
      // Timeout de segurança
      setTimeout(resolve, 10000);
    });

    this.state.isLoading = false;
    return { 
      success: true, 
      message: `Navegou para: ${url}`,
      data: { url }
    };
  }

  /**
   * Implementação: Clicar
   */
  private async doClick(selector: string): Promise<ActionResult> {
    if (!this.iframe?.contentDocument) {
      return { success: false, message: 'Não foi possível acessar o documento do iframe' };
    }

    const element = this.iframe.contentDocument.querySelector(selector) as HTMLElement;
    if (!element) {
      return { success: false, message: `Elemento não encontrado: ${selector}` };
    }

    element.click();
    return { 
      success: true, 
      message: `Clicou em: ${selector}`,
      data: { selector }
    };
  }

  /**
   * Implementação: Inserir texto
   */
  private async doInput(selector: string, value: string): Promise<ActionResult> {
    if (!this.iframe?.contentDocument) {
      return { success: false, message: 'Não foi possível acessar o documento do iframe' };
    }

    const element = this.iframe.contentDocument.querySelector(selector) as HTMLInputElement;
    if (!element) {
      return { success: false, message: `Elemento não encontrado: ${selector}` };
    }

    // Limpar e inserir valor
    element.value = '';
    element.focus();
    
    // Simular digitação para Angular detectar mudanças
    for (const char of value) {
      element.value += char;
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }
    
    element.dispatchEvent(new Event('change', { bubbles: true }));
    element.blur();

    return { 
      success: true, 
      message: `Inseriu "${value}" em: ${selector}`,
      data: { selector, value }
    };
  }

  /**
   * Implementação: Rolar página
   */
  private async doScroll(direction: 'up' | 'down', amount: number): Promise<ActionResult> {
    if (!this.iframe?.contentWindow) {
      return { success: false, message: 'Não foi possível acessar a janela do iframe' };
    }

    const scrollAmount = direction === 'down' ? amount : -amount;
    this.iframe.contentWindow.scrollBy(0, scrollAmount);

    return { 
      success: true, 
      message: `Rolou ${direction} ${amount}px`,
      data: { direction, amount }
    };
  }

  /**
   * Implementação: Aguardar
   */
  private async doWait(ms: number): Promise<ActionResult> {
    await new Promise(resolve => setTimeout(resolve, ms));
    return { 
      success: true, 
      message: `Aguardou ${ms}ms`,
      data: { ms }
    };
  }

  /**
   * Implementação: Screenshot
   */
  private async doScreenshot(): Promise<ActionResult> {
    // Nota: Screenshot de iframe cross-origin requer abordagem diferente
    // Por enquanto, retornamos informação do estado atual
    return { 
      success: true, 
      message: 'Screenshot capturado (simulado)',
      data: { 
        url: this.state.url,
        title: this.state.title,
        timestamp: new Date().toISOString()
      }
    };
  }

  // ============================================
  // MÉTODOS DE ALTO NÍVEL (Ações do Sistema)
  // ============================================

  /**
   * Cadastrar um novo paciente
   */
  async cadastrarPaciente(dados: {
    nome: string;
    cpf?: string;
    dataNascimento?: string;
    telefone?: string;
    email?: string;
  }): Promise<ActionResult> {
    const results: ActionResult[] = [];

    // 1. Navegar para novo paciente
    results.push(await this.navigate('novoPaciente'));
    await this.wait(1000);

    // 2. Preencher nome (obrigatório)
    results.push(await this.input(this.selectors.pacienteNome, dados.nome));

    // 3. Preencher CPF (se fornecido)
    if (dados.cpf) {
      results.push(await this.input(this.selectors.pacienteCpf, dados.cpf));
    }

    // 4. Preencher data de nascimento (se fornecido)
    if (dados.dataNascimento) {
      results.push(await this.input(this.selectors.pacienteDataNascimento, dados.dataNascimento));
    }

    // 5. Preencher telefone (se fornecido)
    if (dados.telefone) {
      results.push(await this.input(this.selectors.pacienteTelefone, dados.telefone));
    }

    // 6. Preencher email (se fornecido)
    if (dados.email) {
      results.push(await this.input(this.selectors.pacienteEmail, dados.email));
    }

    // 7. Clicar em salvar
    results.push(await this.click(this.selectors.btnSalvar));

    // Verificar se todas as ações foram bem-sucedidas
    const allSuccess = results.every(r => r.success);
    const errors = results.filter(r => !r.success).map(r => r.message);

    return {
      success: allSuccess,
      message: allSuccess 
        ? `Paciente "${dados.nome}" cadastrado com sucesso!`
        : `Erro ao cadastrar paciente: ${errors.join(', ')}`,
      data: { dados, results }
    };
  }

  /**
   * Criar um novo orçamento
   */
  async criarOrcamento(dados: {
    pacienteId?: string;
    pacienteNome?: string;
    descricao?: string;
    itens?: Array<{ nome: string; valor: number }>;
  }): Promise<ActionResult> {
    const results: ActionResult[] = [];

    // 1. Navegar para novo orçamento
    results.push(await this.navigate('novoOrcamento'));
    await this.wait(1000);

    // 2. Selecionar/buscar paciente
    if (dados.pacienteNome) {
      results.push(await this.input(this.selectors.orcamentoPaciente, dados.pacienteNome));
      await this.wait(500);
    }

    // 3. Preencher descrição
    if (dados.descricao) {
      results.push(await this.input(this.selectors.orcamentoDescricao, dados.descricao));
    }

    // 4. Clicar em salvar
    results.push(await this.click(this.selectors.btnSalvar));

    const allSuccess = results.every(r => r.success);
    const errors = results.filter(r => !r.success).map(r => r.message);

    return {
      success: allSuccess,
      message: allSuccess 
        ? 'Orçamento criado com sucesso!'
        : `Erro ao criar orçamento: ${errors.join(', ')}`,
      data: { dados, results }
    };
  }

  /**
   * Buscar paciente por nome
   */
  async buscarPaciente(nome: string): Promise<ActionResult> {
    // 1. Navegar para lista de pacientes
    await this.navigate('pacientes');
    await this.wait(1000);

    // 2. Buscar no campo de pesquisa
    const searchSelector = 'input[type="search"], input[placeholder*="Buscar"], input[placeholder*="Pesquisar"]';
    await this.input(searchSelector, nome);
    await this.wait(500);

    return {
      success: true,
      message: `Buscando paciente: ${nome}`,
      data: { nome }
    };
  }

  /**
   * Obter estado atual do navegador
   */
  getState(): BrowserState {
    return { ...this.state };
  }

  /**
   * Obter rotas disponíveis
   */
  getRoutes(): typeof this.routes {
    return { ...this.routes };
  }

  /**
   * Obter seletores disponíveis
   */
  getSelectors(): typeof this.selectors {
    return { ...this.selectors };
  }
}

// Exportar instância singleton
export const browserController = new BrowserController();
export default browserController;
