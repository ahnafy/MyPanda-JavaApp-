import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {ResourcesComponent} from "./resources/resources.component";
import {GoalsComponent} from "./goals/goals.component";
import {ViewGoalComponent} from "./goals/view/view-goal.component";
import {JournalsComponent} from "./journals/journals.component";
import {ViewJournalComponent} from "./journals/view/view-journal.component";
import {SummaryListComponent} from "./summary/summary-list.component";
import {SettingsComponent} from "./settings/settings.component";

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'resources', component: ResourcesComponent},
    {path: 'goals', component: GoalsComponent},
    {path: 'goals/:_id', component: ViewGoalComponent},
    {path: 'journals', component: JournalsComponent},
    {path: 'journals/:_id', component: ViewJournalComponent},
    {path: 'summary', component: SummaryListComponent},
    {path: 'settings', component: SettingsComponent},

];

export const Routing: ModuleWithProviders = RouterModule.forRoot(routes,);
