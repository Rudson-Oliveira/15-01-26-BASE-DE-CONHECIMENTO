/**
 * VisionAI Chat Component
 * 
 * Componente de chat inteligente que executa ações no sistema
 * Integra BrowserController e ActionExecutor para automação
 * 
 * @author Manus AI
 * @date 17/01/2026
 */

import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BrowserController, createBrowserController } from './browser-controller.service';
import { ActionExecutor, createActionExecutor, ExecutionResult } from './action-executor.service';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant' | 'system' | 'action';
  content: string;
  timestamp: Date;
  action?: {
    type: string;
    status: 'pending' | 'executing' | 'success' | 'error';
    result?: ExecutionResult;
  };
}

interface QuickAction {
  label: string;
  icon: string;
  command: string;
  color: string;
}

@Component({
  selector: 'app-visionai-chat',
  template: `
    <div class="visionai-container">
      <!-- Header -->
      <div class="visionai-header">
        <div class="header-title">
          <span class="icon">🤖</span>
          <h2>VisionAI Assistente</h2>
          <span class="status" [class.online]="isConnected">
            {{ isConnected ? 'Online' : 'Offline' }}
          </span>
        </div>
        <div class="header-actions">
          <button class="btn-icon" (click)="toggleEnvironment()" [title]="isDev ? 'Ambiente DEV' : 'Ambiente PROD'">
            {{ isDev ? '🔧' : '🚀' }}
          </button>
          <button class="btn-icon" (click)="clearChat()" title="Limpar chat">🗑️</button>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <button 
          *ngFor="let action of quickActions" 
          class="quick-action-btn"
          [style.background-color]="action.color"
          (click)="executeQuickAction(action)">
          <span class="action-icon">{{ action.icon }}</span>
          <span class="action-label">{{ action.label }}</span>
        </button>
      </div>

      <!-- Chat Messages -->
      <div class="chat-messages" #chatContainer>
        <div 
          *ngFor="let message of messages" 
          class="message"
          [class.user]="message.type === 'user'"
          [class.assistant]="message.type === 'assistant'"
          [class.system]="message.type === 'system'"
          [class.action]="message.type === 'action'">
          
          <div class="message-content">
            <!-- Action Status -->
            <div *ngIf="message.action" class="action-status">
              <span class="status-icon" [class]="message.action.status">
                <span *ngIf="message.action.status === 'pending'">⏳</span>
                <span *ngIf="message.action.status === 'executing'">⚙️</span>
                <span *ngIf="message.action.status === 'success'">✅</span>
                <span *ngIf="message.action.status === 'error'">❌</span>
              </span>
              <span class="action-type">{{ message.action.type }}</span>
            </div>
            
            <div class="message-text" [innerHTML]="formatMessage(message.content)"></div>
            
            <div class="message-time">
              {{ message.timestamp | date:'HH:mm' }}
            </div>
          </div>
        </div>
        
        <!-- Typing Indicator -->
        <div *ngIf="isTyping" class="message assistant typing">
          <div class="typing-indicator">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>

      <!-- Suggestions -->
      <div *ngIf="suggestions.length > 0" class="suggestions">
        <button 
          *ngFor="let suggestion of suggestions" 
          class="suggestion-btn"
          (click)="useSuggestion(suggestion)">
          {{ suggestion }}
        </button>
      </div>

      <!-- Input Area -->
      <div class="chat-input">
        <input 
          type="text" 
          [(ngModel)]="inputText"
          (keyup.enter)="sendMessage()"
          (input)="onInputChange()"
          placeholder="Digite um comando ou pergunta..."
          [disabled]="isProcessing">
        <button 
          class="send-btn" 
          (click)="sendMessage()"
          [disabled]="isProcessing || !inputText.trim()">
          {{ isProcessing ? '⏳' : '➤' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .visionai-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: #1a1a2e;
      color: #eee;
      font-family: 'Segoe UI', sans-serif;
    }

    .visionai-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background: #16213e;
      border-bottom: 1px solid #0f3460;
    }

    .header-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .header-title h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }

    .header-title .icon {
      font-size: 24px;
    }

    .status {
      font-size: 12px;
      padding: 2px 8px;
      border-radius: 12px;
      background: #ff4444;
    }

    .status.online {
      background: #00c853;
    }

    .header-actions {
      display: flex;
      gap: 8px;
    }

    .btn-icon {
      background: transparent;
      border: none;
      font-size: 18px;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 4px;
      transition: background 0.2s;
    }

    .btn-icon:hover {
      background: rgba(255,255,255,0.1);
    }

    .quick-actions {
      display: flex;
      gap: 8px;
      padding: 12px 16px;
      overflow-x: auto;
      background: #16213e;
    }

    .quick-action-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 12px;
      border: none;
      border-radius: 20px;
      color: white;
      font-size: 13px;
      cursor: pointer;
      white-space: nowrap;
      transition: transform 0.2s, opacity 0.2s;
    }

    .quick-action-btn:hover {
      transform: scale(1.05);
      opacity: 0.9;
    }

    .action-icon {
      font-size: 16px;
    }

    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .message {
      max-width: 80%;
      padding: 10px 14px;
      border-radius: 12px;
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .message.user {
      align-self: flex-end;
      background: #0f3460;
    }

    .message.assistant {
      align-self: flex-start;
      background: #1a1a2e;
      border: 1px solid #0f3460;
    }

    .message.system {
      align-self: center;
      background: #2d2d44;
      font-size: 12px;
      color: #aaa;
    }

    .message.action {
      align-self: flex-start;
      background: #1e3a5f;
      border-left: 3px solid #00c853;
    }

    .message.action .action-status {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 6px;
      font-size: 12px;
      color: #aaa;
    }

    .message.action .status-icon.pending { color: #ffeb3b; }
    .message.action .status-icon.executing { color: #2196f3; }
    .message.action .status-icon.success { color: #00c853; }
    .message.action .status-icon.error { color: #ff4444; }

    .message-text {
      line-height: 1.5;
    }

    .message-text code {
      background: rgba(0,0,0,0.3);
      padding: 2px 6px;
      border-radius: 4px;
      font-family: 'Fira Code', monospace;
    }

    .message-time {
      font-size: 10px;
      color: #888;
      margin-top: 4px;
      text-align: right;
    }

    .typing-indicator {
      display: flex;
      gap: 4px;
      padding: 8px;
    }

    .typing-indicator span {
      width: 8px;
      height: 8px;
      background: #666;
      border-radius: 50%;
      animation: bounce 1.4s infinite ease-in-out;
    }

    .typing-indicator span:nth-child(1) { animation-delay: 0s; }
    .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
    .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

    @keyframes bounce {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1); }
    }

    .suggestions {
      display: flex;
      gap: 8px;
      padding: 8px 16px;
      overflow-x: auto;
      background: #16213e;
    }

    .suggestion-btn {
      padding: 6px 12px;
      background: #0f3460;
      border: 1px solid #1a4a7a;
      border-radius: 16px;
      color: #ddd;
      font-size: 12px;
      cursor: pointer;
      white-space: nowrap;
      transition: background 0.2s;
    }

    .suggestion-btn:hover {
      background: #1a4a7a;
    }

    .chat-input {
      display: flex;
      gap: 8px;
      padding: 12px 16px;
      background: #16213e;
      border-top: 1px solid #0f3460;
    }

    .chat-input input {
      flex: 1;
      padding: 10px 14px;
      background: #1a1a2e;
      border: 1px solid #0f3460;
      border-radius: 20px;
      color: #eee;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s;
    }

    .chat-input input:focus {
      border-color: #1a4a7a;
    }

    .chat-input input::placeholder {
      color: #666;
    }

    .send-btn {
      width: 44px;
      height: 44px;
      background: #0f3460;
      border: none;
      border-radius: 50%;
      color: #eee;
      font-size: 18px;
      cursor: pointer;
      transition: background 0.2s, transform 0.2s;
    }

    .send-btn:hover:not(:disabled) {
      background: #1a4a7a;
      transform: scale(1.05);
    }

    .send-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class VisionAIChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  messages: ChatMessage[] = [];
  inputText = '';
  isProcessing = false;
  isTyping = false;
  isConnected = true;
  isDev = true;
  suggestions: string[] = [];

  private browserController!: BrowserController;
  private actionExecutor!: ActionExecutor;
  private shouldScrollToBottom = false;

  quickActions: QuickAction[] = [
    { label: 'Novo Paciente', icon: '👤', command: 'ir para pacientes/novo', color: '#2196f3' },
    { label: 'Criar Orçamento', icon: '💰', command: 'ir para orcamentos/novo', color: '#4caf50' },
    { label: 'Relatórios', icon: '📊', command: 'ir para relatorios', color: '#ff9800' },
    { label: 'Financeiro', icon: '💳', command: 'ir para financeiro', color: '#9c27b0' },
    { label: 'Configurar APIs', icon: '⚙️', command: 'ir para apiConfig', color: '#607d8b' }
  ];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Inicializar controladores
    const baseUrl = this.isDev ? 'http://localhost:8888' : 'https://hospitalar.com.br';
    this.browserController = createBrowserController(baseUrl);
    this.actionExecutor = createActionExecutor(this.browserController);

    // Mensagem de boas-vindas
    this.addMessage({
      type: 'assistant',
      content: `Olá! Sou o **VisionAI**, seu assistente executivo. 

Posso **executar ações** no sistema para você:
- 👤 Cadastrar pacientes
- 💰 Criar orçamentos
- 🔍 Buscar informações
- 📊 Gerar relatórios

Digite um comando ou use os botões acima. Digite \`/ajuda\` para ver todos os comandos.`
    });
  }

  ngOnDestroy(): void {
    // Cleanup se necessário
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  private scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private addMessage(msg: Partial<ChatMessage>): ChatMessage {
    const message: ChatMessage = {
      id: this.generateId(),
      type: msg.type || 'assistant',
      content: msg.content || '',
      timestamp: new Date(),
      action: msg.action
    };
    this.messages.push(message);
    this.shouldScrollToBottom = true;
    return message;
  }

  formatMessage(content: string): string {
    // Converter markdown básico para HTML
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>');
  }

  async sendMessage(): Promise<void> {
    const text = this.inputText.trim();
    if (!text || this.isProcessing) return;

    this.inputText = '';
    this.suggestions = [];
    this.isProcessing = true;

    // Adicionar mensagem do usuário
    this.addMessage({ type: 'user', content: text });

    // Verificar se é um comando executável
    if (this.actionExecutor.isExecutableCommand(text)) {
      await this.executeCommand(text);
    } else {
      // Processar como pergunta normal (pode integrar com LLM)
      await this.processQuestion(text);
    }

    this.isProcessing = false;
  }

  private async executeCommand(text: string): Promise<void> {
    // Adicionar mensagem de ação pendente
    const actionMessage = this.addMessage({
      type: 'action',
      content: 'Executando ação...',
      action: {
        type: 'Processando comando',
        status: 'executing'
      }
    });

    try {
      const result = await this.actionExecutor.processMessage(text);
      
      // Atualizar mensagem com resultado
      actionMessage.content = result.message;
      actionMessage.action = {
        type: result.action,
        status: result.success ? 'success' : 'error',
        result
      };

      if (result.success) {
        this.addMessage({
          type: 'assistant',
          content: `✅ Ação executada com sucesso em ${result.executionTime}ms`
        });
      }
    } catch (error: any) {
      actionMessage.content = `Erro: ${error.message}`;
      actionMessage.action = {
        type: 'error',
        status: 'error'
      };
    }
  }

  private async processQuestion(text: string): Promise<void> {
    this.isTyping = true;

    // Simular delay de processamento
    await new Promise(resolve => setTimeout(resolve, 1000));

    this.isTyping = false;

    // Resposta padrão (pode integrar com LLM)
    this.addMessage({
      type: 'assistant',
      content: `Entendi sua pergunta: "${text}"

Para executar ações no sistema, use comandos como:
- \`cadastrar paciente João Silva\`
- \`criar orçamento para Maria\`
- \`ir para relatórios\`

Ou use os botões de ação rápida acima.`
    });
  }

  executeQuickAction(action: QuickAction): void {
    this.inputText = action.command;
    this.sendMessage();
  }

  onInputChange(): void {
    if (this.inputText.length > 2) {
      this.suggestions = this.actionExecutor.getSuggestions(this.inputText);
    } else {
      this.suggestions = [];
    }
  }

  useSuggestion(suggestion: string): void {
    this.inputText = suggestion;
    this.suggestions = [];
  }

  toggleEnvironment(): void {
    this.isDev = !this.isDev;
    const baseUrl = this.isDev ? 'http://localhost:8888' : 'https://hospitalar.com.br';
    this.browserController = createBrowserController(baseUrl);
    this.actionExecutor = createActionExecutor(this.browserController);
    
    this.addMessage({
      type: 'system',
      content: `Ambiente alterado para ${this.isDev ? 'DESENVOLVIMENTO' : 'PRODUÇÃO'}`
    });
  }

  clearChat(): void {
    this.messages = [];
    this.addMessage({
      type: 'system',
      content: 'Chat limpo'
    });
  }
}
