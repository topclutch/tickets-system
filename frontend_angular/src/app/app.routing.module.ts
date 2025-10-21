import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TicketListComponent } from './components/ticket-list/ticket-list';

const routes: Routes = [
{ path: '', redirectTo: 'tickets', pathMatch: 'full' },

{ path: 'tickets', component: TicketListComponent }
];

@NgModule({
imports: [RouterModule.forRoot(routes)],
exports: [RouterModule]
})
export class AppRoutingModule {}