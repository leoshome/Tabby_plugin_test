import { Injectable } from '@angular/core'
import { ToolbarButtonProvider, ToolbarButton, ConfigService } from 'tabby-core'
import { ScriptRunnerService } from './script-runner.service'
import { ScriptGroup } from './api'

/** Inline SVG icon for the script runner toolbar button */
const SCRIPT_ICON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13zM8.5 13.5l1.5 1.5-1.5 1.5L7 15l-1.5 1.5L4 15l1.5-1.5L4 12l1.5-1.5L7 12l1.5-1.5L10 12l-1.5 1.5zm7 6l-1.5-1.5 1.5-1.5L17 15l1.5 1.5L20 15l1.5 1.5L20 18l-1.5 1.5L17 18l-1.5 1.5z"/></svg>'

/**
 * Provides toolbar buttons for script groups.
 * Each group becomes a toolbar button with a submenu listing its scripts.
 */
@Injectable()
export class ScriptToolbarButtonProvider extends ToolbarButtonProvider {
    constructor(
        private scriptRunner: ScriptRunnerService,
        private config: ConfigService,
    ) {
        super()
    }

    provide(): ToolbarButton[] {
        const groups: ScriptGroup[] = this.config.store.scriptRunnerPlugin?.groups

        if (!groups || groups.length === 0) {
            return []
        }

        // If there's only one group, show its scripts directly as a submenu
        if (groups.length === 1) {
            const group = groups[0]
            return [{
                icon: SCRIPT_ICON,
                title: group.name || 'Scripts',
                weight: 5,
                submenu: async () => this.buildScriptMenuItems(group),
            }]
        }

        // Multiple groups: show a "Scripts" button with group submenus
        return [{
            icon: SCRIPT_ICON,
            title: 'Scripts',
            weight: 5,
            submenu: async () => this.buildGroupMenuItems(groups),
        }]
    }

    /**
     * Build menu items for a single group's scripts.
     */
    private buildScriptMenuItems(group: ScriptGroup): ToolbarButton[] {
        if (!group.scripts || group.scripts.length === 0) {
            return [{
                title: '(No scripts)',
                weight: 0,
                click: () => {},
            }]
        }

        return group.scripts.map((script, index) => ({
            title: script.name,
            weight: index,
            click: () => {
                this.scriptRunner.executeScript(script)
            },
        }))
    }

    /**
     * Build menu items for multiple groups, each as a submenu.
     */
    private buildGroupMenuItems(groups: ScriptGroup[]): ToolbarButton[] {
        return groups.map((group, index) => ({
            title: group.name,
            weight: index,
            submenu: async () => this.buildScriptMenuItems(group),
        }))
    }
}