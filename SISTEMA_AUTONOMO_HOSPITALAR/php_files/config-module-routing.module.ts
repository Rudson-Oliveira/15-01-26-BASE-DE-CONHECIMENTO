import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ConfigCompanyListComponent } from './components/config-company-list/config-company-list.component';
import { ConfigUserListComponent } from './components/config-user-list/config-user-list.component';
import { ApiConfigComponent } from '../../configuracoes/api-config/api-config.component';

const routes: Routes = [
  { path: 'empresa', component: ConfigCompanyListComponent },
  { path: 'usuario', component: ConfigUserListComponent },
  { path: 'api', component: ApiConfigComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigModuleRoutingModule { }
