import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import TabbyCoreModule, { ConfigProvider, ToolbarButtonProvider } from 'tabby-core'
import { TerminalDecorator } from 'tabby-terminal'
import { SettingsTabProvider } from 'tabby-settings'

import { ScriptRunnerConfigProvider } from './config.provider'
import { ScriptRunnerService } from './script-runner.service'
import { ScriptRunnerDecorator } from './decorator'
import { ScriptToolbarButtonProvider } from './toolbar-button.provider'
import { ScriptRunnerSettingsTabProvider } from './settings-tab.provider'
import { ScriptRunnerSettingsTabComponent } from './settings-tab.component'

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TabbyCoreModule,
    ],
    providers: [
        // Config defaults
        { provide: ConfigProvider, useClass: ScriptRunnerConfigProvider, multi: true },

        // Services
        ScriptRunnerService,

        // Toolbar button (script menu in toolbar)
        { provide: ToolbarButtonProvider, useClass: ScriptToolbarButtonProvider, multi: true },

        // Terminal decorator
        { provide: TerminalDecorator, useClass: ScriptRunnerDecorator, multi: true },

        // Settings tab
        { provide: SettingsTabProvider, useClass: ScriptRunnerSettingsTabProvider, multi: true },
    ],
    declarations: [
        ScriptRunnerSettingsTabComponent,
    ],
    entryComponents: [
        ScriptRunnerSettingsTabComponent,
    ],
})
export default class ScriptRunnerModule {}