import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { SharedModuleModule } from '../../../shared/shared-module.module';

import { ConfigModuleRoutingModule } from './config-module-routing.module';
import { ConfigCompanyListComponent } from './components/config-company-list/config-company-list.component';
import { ConfigUserListComponent } from './components/config-user-list/config-user-list.component';
import { ConfigUserUpdateComponent } from './components/config-user-list/config-user-update/config-user-update.component';
import { ConfigUserCreateComponent } from './components/config-user-list/config-user-create/config-user-create.component';
import { ConfigAccessRouteComponent } from './components/config-user-list/config-access-route/config-access-route.component';
import { ConfigCompanyCreateComponent } from './components/config-company-create/config-company-create.component';
import { ApiConfigComponent } from '../../configuracoes/api-config/api-config.component';

@NgModule({
  declarations: [
    ConfigCompanyListComponent,
    ConfigUserListComponent,
    ConfigUserUpdateComponent,
    ConfigUserCreateComponent,
    ConfigAccessRouteComponent,
    ConfigCompanyCreateComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ConfigModuleRoutingModule,
    SharedModuleModule,
    ApiConfigComponent
  ],
  providers: []
})
export class ConfigModuleModule { }
