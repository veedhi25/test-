import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ChannelListComponent } from './channelList.comonent';
import { ChannelComponent } from './channel.component';

const routes: Routes = [
    { path: '', component: ChannelListComponent },
    { path: 'add-chanel', component: ChannelComponent },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ChannnelRoutingModule { }
