import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface ApiProvider {
  provider: string;
  name: string;
  description: string;
  icon: string;
  docs_url: string;
  api_key: string;
  is_configured: boolean;
  is_active: boolean;
  last_tested: string | null;
  last_test_status: string | null;
  editing?: boolean;
  newApiKey?: string;
  testing?: boolean;
  saving?: boolean;
}

@Component({
  selector: 'app-api-config',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="api-config-container">
      <div class="header">
        <h2>
          <i class="fas fa-key"></i>
          Configuração de APIs de IA
        </h2>
        <p class="subtitle">Gerencie as chaves de API dos provedores de Inteligência Artificial</p>
      </div>

      <div class="providers-grid">
        <div *ngFor="let provider of providers" 
             class="provider-card"
             [class.configured]="provider.is_configured"
             [class.active]="provider.is_active">
          
          <div class="provider-header">
            <div class="provider-icon">
              <i [class]="'fas fa-' + provider.icon"></i>
            </div>
            <div class="provider-info">
              <h3>{{ provider.name }}</h3>
              <p>{{ provider.description }}</p>
            </div>
            <div class="provider-status">
              <span *ngIf="provider.is_configured" class="badge success">
                <i class="fas fa-check"></i> Configurado
              </span>
              <span *ngIf="!provider.is_configured" class="badge warning">
                <i class="fas fa-exclamation"></i> Não configurado
              </span>
            </div>
          </div>

          <div class="provider-body">
            <div class="api-key-section">
              <label>API Key:</label>
              <div class="api-key-input">
                <input 
                  *ngIf="!provider.editing"
                  type="password" 
                  [value]="provider.api_key || ''"
                  readonly
                  placeholder="Não configurada"
                />
                <input 
                  *ngIf="provider.editing"
                  type="text" 
                  [(ngModel)]="provider.newApiKey"
                  placeholder="Cole sua API key aqui"
                />
                <button 
                  *ngIf="!provider.editing"
                  class="btn-edit"
                  (click)="startEdit(provider)">
                  <i class="fas fa-edit"></i>
                </button>
                <button 
                  *ngIf="provider.editing"
                  class="btn-save"
                  [disabled]="provider.saving"
                  (click)="saveApiKey(provider)">
                  <i class="fas" [class.fa-save]="!provider.saving" [class.fa-spinner]="provider.saving" [class.fa-spin]="provider.saving"></i>
                </button>
                <button 
                  *ngIf="provider.editing"
                  class="btn-cancel"
                  (click)="cancelEdit(provider)">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>

            <div class="provider-actions">
              <button 
                class="btn-test"
                [disabled]="!provider.is_configured || provider.testing"
                (click)="testConnection(provider)">
                <i class="fas" [class.fa-plug]="!provider.testing" [class.fa-spinner]="provider.testing" [class.fa-spin]="provider.testing"></i>
                {{ provider.testing ? 'Testando...' : 'Testar Conexão' }}
              </button>
              
              <label class="toggle-switch">
                <input 
                  type="checkbox" 
                  [(ngModel)]="provider.is_active"
                  [disabled]="!provider.is_configured"
                  (change)="toggleActive(provider)"
                />
                <span class="slider"></span>
                <span class="label">{{ provider.is_active ? 'Ativo' : 'Inativo' }}</span>
              </label>

              <a [href]="provider.docs_url" target="_blank" class="btn-docs">
                <i class="fas fa-external-link-alt"></i>
                Documentação
              </a>
            </div>

            <div *ngIf="provider.last_tested" class="last-test">
              <small>
                Último teste: {{ provider.last_tested | date:'dd/MM/yyyy HH:mm' }}
                <span [class]="'status-' + provider.last_test_status">
                  {{ provider.last_test_status === 'success' ? '✓ OK' : '✗ Falhou' }}
                </span>
              </small>
            </div>
          </div>
        </div>
      </div>

      <div class="info-box">
        <i class="fas fa-info-circle"></i>
        <div>
          <strong>Hierarquia de Fallback:</strong>
          O sistema tenta primeiro os provedores locais (Ollama, Jan), depois os APIs na ordem de prioridade configurada.
          Se um provedor falhar, o próximo é acionado automaticamente.
        </div>
      </div>
    </div>
  `,
  styles: [`
    .api-config-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      margin-bottom: 32px;
    }

    .header h2 {
      font-size: 24px;
      color: #1a1a2e;
      margin-bottom: 8px;
    }

    .header h2 i {
      margin-right: 12px;
      color: #667eea;
    }

    .subtitle {
      color: #6b7280;
      font-size: 14px;
    }

    .providers-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 20px;
      margin-bottom: 24px;
    }

    .provider-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      border: 2px solid #e5e7eb;
      transition: all 0.3s ease;
    }

    .provider-card:hover {
      box-shadow: 0 4px 16px rgba(0,0,0,0.12);
    }

    .provider-card.configured {
      border-color: #10b981;
    }

    .provider-card.configured.active {
      border-color: #667eea;
    }

    .provider-header {
      display: flex;
      align-items: center;
      padding: 16px;
      border-bottom: 1px solid #f3f4f6;
    }

    .provider-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 20px;
      margin-right: 16px;
    }

    .provider-info {
      flex: 1;
    }

    .provider-info h3 {
      font-size: 16px;
      font-weight: 600;
      color: #1a1a2e;
      margin-bottom: 4px;
    }

    .provider-info p {
      font-size: 12px;
      color: #6b7280;
    }

    .badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 500;
    }

    .badge.success {
      background: #d1fae5;
      color: #059669;
    }

    .badge.warning {
      background: #fef3c7;
      color: #d97706;
    }

    .provider-body {
      padding: 16px;
    }

    .api-key-section {
      margin-bottom: 16px;
    }

    .api-key-section label {
      display: block;
      font-size: 12px;
      font-weight: 500;
      color: #374151;
      margin-bottom: 8px;
    }

    .api-key-input {
      display: flex;
      gap: 8px;
    }

    .api-key-input input {
      flex: 1;
      padding: 10px 12px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 14px;
      font-family: monospace;
    }

    .api-key-input input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .api-key-input button {
      padding: 10px 12px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-edit {
      background: #f3f4f6;
      color: #374151;
    }

    .btn-edit:hover {
      background: #e5e7eb;
    }

    .btn-save {
      background: #10b981;
      color: white;
    }

    .btn-save:hover {
      background: #059669;
    }

    .btn-cancel {
      background: #ef4444;
      color: white;
    }

    .btn-cancel:hover {
      background: #dc2626;
    }

    .provider-actions {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    .btn-test {
      padding: 8px 16px;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-test:hover:not(:disabled) {
      background: #5a67d8;
    }

    .btn-test:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-docs {
      padding: 8px 12px;
      background: #f3f4f6;
      color: #374151;
      border-radius: 8px;
      font-size: 12px;
      text-decoration: none;
      transition: all 0.2s;
    }

    .btn-docs:hover {
      background: #e5e7eb;
    }

    .toggle-switch {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
    }

    .toggle-switch input {
      display: none;
    }

    .toggle-switch .slider {
      width: 40px;
      height: 22px;
      background: #d1d5db;
      border-radius: 11px;
      position: relative;
      transition: all 0.3s;
    }

    .toggle-switch .slider::after {
      content: '';
      position: absolute;
      width: 18px;
      height: 18px;
      background: white;
      border-radius: 50%;
      top: 2px;
      left: 2px;
      transition: all 0.3s;
    }

    .toggle-switch input:checked + .slider {
      background: #10b981;
    }

    .toggle-switch input:checked + .slider::after {
      left: 20px;
    }

    .toggle-switch .label {
      font-size: 12px;
      color: #6b7280;
    }

    .last-test {
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid #f3f4f6;
    }

    .last-test small {
      color: #6b7280;
      font-size: 11px;
    }

    .status-success {
      color: #10b981;
      margin-left: 8px;
    }

    .status-failed {
      color: #ef4444;
      margin-left: 8px;
    }

    .info-box {
      display: flex;
      gap: 12px;
      padding: 16px;
      background: #eff6ff;
      border-radius: 12px;
      border: 1px solid #bfdbfe;
    }

    .info-box i {
      color: #3b82f6;
      font-size: 20px;
    }

    .info-box div {
      font-size: 13px;
      color: #1e40af;
    }
  `]
})
export class ApiConfigComponent implements OnInit {
  providers: ApiProvider[] = [];
  private apiUrl = '/api/config/apis';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadProviders();
  }

  loadProviders() {
    this.http.get<any>(this.apiUrl).subscribe({
      next: (response) => {
        if (response.success) {
          this.providers = response.data;
        }
      },
      error: (err) => console.error('Erro ao carregar provedores:', err)
    });
  }

  startEdit(provider: ApiProvider) {
    provider.editing = true;
    provider.newApiKey = '';
  }

  cancelEdit(provider: ApiProvider) {
    provider.editing = false;
    provider.newApiKey = '';
  }

  saveApiKey(provider: ApiProvider) {
    if (!provider.newApiKey || provider.newApiKey.length < 10) {
      alert('API key inválida');
      return;
    }

    provider.saving = true;
    this.http.put<any>(`${this.apiUrl}/${provider.provider}`, {
      api_key: provider.newApiKey,
      is_active: true
    }).subscribe({
      next: (response) => {
        provider.saving = false;
        if (response.success) {
          provider.editing = false;
          provider.is_configured = true;
          provider.is_active = true;
          provider.api_key = provider.newApiKey!.substring(0, 4) + '****' + provider.newApiKey!.slice(-4);
          provider.newApiKey = '';
        }
      },
      error: (err) => {
        provider.saving = false;
        alert('Erro ao salvar API key');
      }
    });
  }

  testConnection(provider: ApiProvider) {
    provider.testing = true;
    this.http.post<any>(`${this.apiUrl}/${provider.provider}/test`, {}).subscribe({
      next: (response) => {
        provider.testing = false;
        provider.last_tested = new Date().toISOString();
        provider.last_test_status = response.success ? 'success' : 'failed';
        alert(response.success ? 'Conexão bem sucedida!' : 'Falha: ' + response.error);
      },
      error: (err) => {
        provider.testing = false;
        provider.last_test_status = 'failed';
        alert('Erro ao testar conexão');
      }
    });
  }

  toggleActive(provider: ApiProvider) {
    this.http.patch<any>(`${this.apiUrl}/${provider.provider}/toggle`, {
      is_active: provider.is_active
    }).subscribe();
  }
}
