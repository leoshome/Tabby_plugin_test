import { Injectable } from '@angular/core'
import { SettingsTabProvider } from 'tabby-settings'
import { ScriptRunnerSettingsTabComponent } from './settings-tab.component'

@Injectable()
export class ScriptRunnerSettingsTabProvider extends SettingsTabProvider {
    id = 'script-runner'
    icon = 'fa-solid fa-terminal'
    title = 'Script Runner'

    getComponentType(): any {
        return ScriptRunnerSettingsTabComponent
    }
}