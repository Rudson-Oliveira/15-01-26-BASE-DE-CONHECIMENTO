import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';

interface ApiConfig {
  provider: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  docs_url: string;
  api_key: string;
  is_configured: boolean;
  is_active: boolean;
  status: 'active' | 'standby' | 'error' | 'unconfigured';
  status_label: string;
  last_tested: string | null;
  last_test_status: string | null;
  retry_count: number;
  next_retry: string | null;
}

interface CategoryInfo {
  [key: string]: string;
}

@Component({
  selector: 'app-api-config',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="api-config-container">
      <div class="header">
        <h2>Configuração de APIs</h2>
        <p class="subtitle">Gerencie suas integrações de IA, automação e serviços externos</p>
        <div class="header-actions">
          <button class="btn-retry-all" (click)="retryAllStandby()" [disabled]="isRetrying">
            <i class="fas fa-sync-alt" [class.fa-spin]="isRetrying"></i>
            Reconectar Pendentes
          </button>
        </div>
      </div>

      <!-- Status Summary -->
      <div class="status-summary">
        <div class="status-card active">
          <span class="count">{{ getCountByStatus('active') }}</span>
          <span class="label">Ativos</span>
        </div>
        <div class="status-card standby">
          <span class="count">{{ getCountByStatus('standby') }}</span>
          <span class="label">Aguardando</span>
        </div>
        <div class="status-card error">
          <span class="count">{{ getCountByStatus('error') }}</span>
          <span class="label">Com Erro</span>
        </div>
        <div class="status-card unconfigured">
          <span class="count">{{ getCountByStatus('unconfigured') }}</span>
          <span class="label">Não Configurados</span>
        </div>
      </div>

      <!-- Categories -->
      <div class="categories" *ngIf="apisByCategory">
        <div class="category-section" *ngFor="let cat of categoryOrder">
          <h3 class="category-title">
            <i [class]="getCategoryIcon(cat)"></i>
            {{ categoryLabels[cat] }}
          </h3>
          
          <div class="api-grid">
            <div class="api-card" 
                 *ngFor="let api of apisByCategory[cat]"
                 [class.active]="api.status === 'active'"
                 [class.standby]="api.status === 'standby'"
                 [class.error]="api.status === 'error'"
                 [class.unconfigured]="api.status === 'unconfigured'">
              
              <div class="api-header">
                <div class="api-icon">
                  <i [class]="'fas fa-' + api.icon"></i>
                </div>
                <div class="api-info">
                  <h4>{{ api.name }}</h4>
                  <p>{{ api.description }}</p>
                </div>
                <div class="api-status">
                  <span class="status-badge" [class]="api.status">
                    {{ api.status_label }}
                  </span>
                </div>
              </div>

              <div class="api-body">
                <div class="input-group">
                  <label>API Key</label>
                  <div class="input-with-button">
                    <input 
                      [type]="showKey[api.provider] ? 'text' : 'password'"
                      [(ngModel)]="editingKeys[api.provider]"
                      [placeholder]="api.is_configured ? api.api_key : 'Cole sua API key aqui...'"
                      class="api-key-input">
                    <button class="btn-toggle-visibility" (click)="toggleKeyVisibility(api.provider)">
                      <i [class]="showKey[api.provider] ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                    </button>
                  </div>
                </div>

                <div class="retry-info" *ngIf="api.status === 'standby' && api.next_retry">
                  <i class="fas fa-clock"></i>
                  Próxima tentativa: {{ formatDate(api.next_retry) }}
                  <span class="retry-count">(tentativa {{ api.retry_count + 1 }})</span>
                </div>

                <div class="api-actions">
                  <button class="btn-save" 
                          (click)="saveApiKey(api.provider)" 
                          [disabled]="!editingKeys[api.provider] || isSaving[api.provider]">
                    <i class="fas" [class.fa-save]="!isSaving[api.provider]" [class.fa-spinner]="isSaving[api.provider]" [class.fa-spin]="isSaving[api.provider]"></i>
                    {{ isSaving[api.provider] ? 'Salvando...' : 'Salvar' }}
                  </button>
                  <button class="btn-test" 
                          (click)="testConnection(api.provider)" 
                          [disabled]="!api.is_configured || isTesting[api.provider]">
                    <i class="fas" [class.fa-plug]="!isTesting[api.provider]" [class.fa-spinner]="isTesting[api.provider]" [class.fa-spin]="isTesting[api.provider]"></i>
                    {{ isTesting[api.provider] ? 'Testando...' : 'Testar' }}
                  </button>
                  <a class="btn-docs" [href]="api.docs_url" target="_blank">
                    <i class="fas fa-external-link-alt"></i>
                    Docs
                  </a>
                </div>
              </div>

              <div class="api-footer" *ngIf="api.last_tested">
                <small>Último teste: {{ formatDate(api.last_tested) }}</small>
              </div>
            </div>

            <!-- Add New API Button -->
            <div class="api-card add-new" (click)="showAddModal(cat)">
              <div class="add-icon">
                <i class="fas fa-plus"></i>
              </div>
              <span>Adicionar API</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div class="loading" *ngIf="isLoading">
        <i class="fas fa-spinner fa-spin"></i>
        <span>Carregando configurações...</span>
      </div>

      <!-- Toast Notifications -->
      <div class="toast-container">
        <div class="toast" *ngFor="let toast of toasts" [class]="toast.type">
          <i [class]="toast.type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'"></i>
          {{ toast.message }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .api-config-container {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .header {
      margin-bottom: 24px;
    }

    .header h2 {
      font-size: 24px;
      font-weight: 600;
      color: #1a1a2e;
      margin: 0;
    }

    .subtitle {
      color: #666;
      margin-top: 4px;
    }

    .header-actions {
      margin-top: 16px;
    }

    .btn-retry-all {
      background: #6366f1;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
    }

    .btn-retry-all:hover {
      background: #4f46e5;
    }

    .btn-retry-all:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .status-summary {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 32px;
    }

    .status-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      text-align: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      border-left: 4px solid;
    }

    .status-card.active { border-color: #10b981; }
    .status-card.standby { border-color: #f59e0b; }
    .status-card.error { border-color: #ef4444; }
    .status-card.unconfigured { border-color: #9ca3af; }

    .status-card .count {
      font-size: 32px;
      font-weight: 700;
      display: block;
    }

    .status-card.active .count { color: #10b981; }
    .status-card.standby .count { color: #f59e0b; }
    .status-card.error .count { color: #ef4444; }
    .status-card.unconfigured .count { color: #9ca3af; }

    .status-card .label {
      color: #666;
      font-size: 14px;
    }

    .category-section {
      margin-bottom: 32px;
    }

    .category-title {
      font-size: 18px;
      font-weight: 600;
      color: #1a1a2e;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .api-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 16px;
    }

    .api-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      border: 2px solid transparent;
      transition: all 0.2s;
    }

    .api-card:hover {
      box-shadow: 0 4px 16px rgba(0,0,0,0.12);
    }

    .api-card.active { border-color: #10b981; }
    .api-card.standby { border-color: #f59e0b; }
    .api-card.error { border-color: #ef4444; }

    .api-card.add-new {
      border: 2px dashed #d1d5db;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      min-height: 200px;
    }

    .api-card.add-new:hover {
      border-color: #6366f1;
      background: #f8fafc;
    }

    .add-icon {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: #e5e7eb;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 12px;
    }

    .add-icon i {
      font-size: 20px;
      color: #6b7280;
    }

    .api-header {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 16px;
    }

    .api-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .api-icon i {
      color: white;
      font-size: 18px;
    }

    .api-info {
      flex: 1;
    }

    .api-info h4 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #1a1a2e;
    }

    .api-info p {
      margin: 4px 0 0;
      font-size: 13px;
      color: #666;
    }

    .status-badge {
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
    }

    .status-badge.active {
      background: #d1fae5;
      color: #059669;
    }

    .status-badge.standby {
      background: #fef3c7;
      color: #d97706;
    }

    .status-badge.error {
      background: #fee2e2;
      color: #dc2626;
    }

    .status-badge.unconfigured {
      background: #f3f4f6;
      color: #6b7280;
    }

    .input-group {
      margin-bottom: 12px;
    }

    .input-group label {
      display: block;
      font-size: 13px;
      font-weight: 500;
      color: #374151;
      margin-bottom: 6px;
    }

    .input-with-button {
      display: flex;
      gap: 8px;
    }

    .api-key-input {
      flex: 1;
      padding: 10px 12px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 14px;
      font-family: monospace;
    }

    .api-key-input:focus {
      outline: none;
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }

    .btn-toggle-visibility {
      padding: 10px 12px;
      background: #f3f4f6;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      cursor: pointer;
    }

    .retry-info {
      background: #fef3c7;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 13px;
      color: #92400e;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .retry-count {
      opacity: 0.7;
    }

    .api-actions {
      display: flex;
      gap: 8px;
    }

    .btn-save, .btn-test, .btn-docs {
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      text-decoration: none;
    }

    .btn-save {
      background: #6366f1;
      color: white;
      border: none;
    }

    .btn-save:hover:not(:disabled) {
      background: #4f46e5;
    }

    .btn-test {
      background: #10b981;
      color: white;
      border: none;
    }

    .btn-test:hover:not(:disabled) {
      background: #059669;
    }

    .btn-docs {
      background: #f3f4f6;
      color: #374151;
      border: 1px solid #d1d5db;
    }

    .btn-docs:hover {
      background: #e5e7eb;
    }

    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .api-footer {
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid #e5e7eb;
    }

    .api-footer small {
      color: #9ca3af;
      font-size: 12px;
    }

    .loading {
      text-align: center;
      padding: 60px;
      color: #666;
    }

    .loading i {
      font-size: 32px;
      margin-bottom: 16px;
      color: #6366f1;
    }

    .toast-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 1000;
    }

    .toast {
      padding: 12px 20px;
      border-radius: 8px;
      margin-top: 8px;
      display: flex;
      align-items: center;
      gap: 8px;
      animation: slideIn 0.3s ease;
    }

    .toast.success {
      background: #10b981;
      color: white;
    }

    .toast.error {
      background: #ef4444;
      color: white;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `]
})
export class ApiConfigComponent implements OnInit, OnDestroy {
  apis: ApiConfig[] = [];
  apisByCategory: { [key: string]: ApiConfig[] } = {};
  categoryLabels: CategoryInfo = {};
  categoryOrder = ['llm', 'rpa', 'browser', 'remote', 'infra', 'code'];
  
  editingKeys: { [key: string]: string } = {};
  showKey: { [key: string]: boolean } = {};
  isSaving: { [key: string]: boolean } = {};
  isTesting: { [key: string]: boolean } = {};
  isLoading = true;
  isRetrying = false;
  
  toasts: { message: string; type: 'success' | 'error' }[] = [];
  
  private refreshSubscription?: Subscription;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadConfigs();
    // Auto-refresh every 30 seconds
    this.refreshSubscription = interval(30000).subscribe(() => {
      this.loadConfigs(true);
    });
  }

  ngOnDestroy(): void {
    this.refreshSubscription?.unsubscribe();
  }

  loadConfigs(silent = false): void {
    if (!silent) this.isLoading = true;
    
    this.http.get<any>('/api/config/apis').subscribe({
      next: (response) => {
        if (response.success) {
          this.apis = response.data;
          this.apisByCategory = response.by_category;
          this.categoryLabels = response.categories;
        }
        this.isLoading = false;
      },
      error: () => {
        this.showToast('Erro ao carregar configurações', 'error');
        this.isLoading = false;
      }
    });
  }

  getCountByStatus(status: string): number {
    return this.apis.filter(a => a.status === status).length;
  }

  getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      llm: 'fas fa-brain',
      rpa: 'fas fa-robot',
      browser: 'fas fa-globe',
      remote: 'fas fa-desktop',
      infra: 'fas fa-server',
      code: 'fas fa-code'
    };
    return icons[category] || 'fas fa-cog';
  }

  toggleKeyVisibility(provider: string): void {
    this.showKey[provider] = !this.showKey[provider];
  }

  saveApiKey(provider: string): void {
    const apiKey = this.editingKeys[provider];
    if (!apiKey) return;

    this.isSaving[provider] = true;

    this.http.put<any>(`/api/config/apis/${provider}`, {
      api_key: apiKey,
      is_active: true
    }).subscribe({
      next: (response) => {
        if (response.success) {
          this.showToast(`${provider}: ${response.message}`, 'success');
          this.editingKeys[provider] = '';
          this.loadConfigs(true);
        } else {
          this.showToast(response.error, 'error');
        }
        this.isSaving[provider] = false;
      },
      error: () => {
        this.showToast('Erro ao salvar configuração', 'error');
        this.isSaving[provider] = false;
      }
    });
  }

  testConnection(provider: string): void {
    this.isTesting[provider] = true;

    this.http.post<any>(`/api/config/apis/${provider}/test`, {}).subscribe({
      next: (response) => {
        if (response.success) {
          this.showToast(`${provider}: Conexão bem sucedida!`, 'success');
        } else {
          this.showToast(`${provider}: ${response.error}`, 'error');
        }
        this.loadConfigs(true);
        this.isTesting[provider] = false;
      },
      error: () => {
        this.showToast('Erro ao testar conexão', 'error');
        this.isTesting[provider] = false;
      }
    });
  }

  retryAllStandby(): void {
    this.isRetrying = true;

    this.http.post<any>('/api/config/apis/retry-all', {}).subscribe({
      next: (response) => {
        if (response.success) {
          const successCount = Object.values(response.results).filter(r => r).length;
          this.showToast(`${successCount} APIs reconectadas com sucesso`, 'success');
        }
        this.loadConfigs(true);
        this.isRetrying = false;
      },
      error: () => {
        this.showToast('Erro ao reconectar APIs', 'error');
        this.isRetrying = false;
      }
    });
  }

  showAddModal(category: string): void {
    // TODO: Implementar modal para adicionar nova API
    this.showToast('Funcionalidade em desenvolvimento', 'success');
  }

  formatDate(dateStr: string | null): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleString('pt-BR');
  }

  showToast(message: string, type: 'success' | 'error'): void {
    this.toasts.push({ message, type });
    setTimeout(() => {
      this.toasts.shift();
    }, 4000);
  }
}
