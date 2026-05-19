import { Component } from '@angular/core'
import { ConfigService } from 'tabby-core'
import { ScriptGroup, Script, ScriptCommand, ScriptRunnerPluginConfig } from './api'
@Component({
    templateUrl: require('./settings-tab.component.html'),
    styles: [require('./settings-tab.component.scss')],
})
export class ScriptRunnerSettingsTabComponent {
    editingGroup: ScriptGroup | null = null
    editingScript: Script | null = null
    editingCommandIndex: number | null = null

    constructor(public config: ConfigService) {}

    get groups(): ScriptGroup[] {
        return this.config.store.scriptRunnerPlugin?.groups || []
    }

    save(): void {
        this.config.save()
    }

    // --- Group Management ---

    addGroup(): void {
        const newGroup: ScriptGroup = {
            id: this.generateId(),
            name: 'New Group',
            expanded: true,
            scripts: [],
        }
        this.groups.push(newGroup)
        this.save()
    }

    removeGroup(group: ScriptGroup): void {
        const idx = this.groups.indexOf(group)
        if (idx >= 0) {
            this.groups.splice(idx, 1)
            this.save()
        }
    }

    moveGroupUp(group: ScriptGroup): void {
        const idx = this.groups.indexOf(group)
        if (idx > 0) {
            this.groups.splice(idx, 1)
            this.groups.splice(idx - 1, 0, group)
            this.save()
        }
    }

    moveGroupDown(group: ScriptGroup): void {
        const idx = this.groups.indexOf(group)
        if (idx < this.groups.length - 1) {
            this.groups.splice(idx, 1)
            this.groups.splice(idx + 1, 0, group)
            this.save()
        }
    }

    // --- Script Management ---

    addScript(group: ScriptGroup): void {
        const newScript: Script = {
            id: this.generateId(),
            name: 'New Script',
            icon: '',
            commands: [
                { command: 'echo "Hello"', delay: 0, sendEnter: true },
            ],
        }
        group.scripts.push(newScript)
        this.save()
    }

    removeScript(group: ScriptGroup, script: Script): void {
        const idx = group.scripts.indexOf(script)
        if (idx >= 0) {
            group.scripts.splice(idx, 1)
            this.save()
        }
    }

    moveScriptUp(group: ScriptGroup, script: Script): void {
        const idx = group.scripts.indexOf(script)
        if (idx > 0) {
            group.scripts.splice(idx, 1)
            group.scripts.splice(idx - 1, 0, script)
            this.save()
        }
    }

    moveScriptDown(group: ScriptGroup, script: Script): void {
        const idx = group.scripts.indexOf(script)
        if (idx < group.scripts.length - 1) {
            group.scripts.splice(idx, 1)
            group.scripts.splice(idx + 1, 0, script)
            this.save()
        }
    }

    // --- Command Management ---

    addCommand(script: Script): void {
        script.commands.push({
            command: '',
            delay: 0,
            sendEnter: true,
        })
        this.save()
    }

    removeCommand(script: Script, index: number): void {
        script.commands.splice(index, 1)
        this.save()
    }

    moveCommandUp(script: Script, index: number): void {
        if (index > 0) {
            const cmd = script.commands.splice(index, 1)[0]
            script.commands.splice(index - 1, 0, cmd)
            this.save()
        }
    }

    moveCommandDown(script: Script, index: number): void {
        if (index < script.commands.length - 1) {
            const cmd = script.commands.splice(index, 1)[0]
            script.commands.splice(index + 1, 0, cmd)
            this.save()
        }
    }

    // --- Utility ---

    private generateId(): string {
        // Simple ID generation without external dependency
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    }

    trackById(index: number, item: { id: string }): string {
        return item.id
    }
}