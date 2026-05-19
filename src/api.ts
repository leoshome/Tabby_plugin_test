import { BaseTerminalTabComponent } from 'tabby-terminal'

/**
 * A single command step within a script.
 */
export interface ScriptCommand {
    /** The text to send to the terminal */
    command: string
    /** Delay in milliseconds AFTER sending this command (0 = no delay, send next immediately) */
    delay: number
    /** Whether to append an Enter/Return keystroke after the command text (default: true) */
    sendEnter: boolean
}

/**
 * A script that can be executed as a button action.
 */
export interface Script {
    /** Unique identifier */
    id: string
    /** Display name shown on the button */
    name: string
    /** Optional FontAwesome icon class (e.g. 'fa-solid fa-play') */
    icon?: string
    /** List of commands to execute sequentially */
    commands: ScriptCommand[]
}

/**
 * A group of scripts displayed together in the toolbar dropdown.
 */
export interface ScriptGroup {
    /** Unique identifier */
    id: string
    /** Display name of the group */
    name: string
    /** Whether this group is expanded by default in the toolbar */
    expanded?: boolean
    /** Scripts in this group */
    scripts: Script[]
}

/**
 * Plugin configuration stored in Tabby's config store.
 */
export interface ScriptRunnerPluginConfig {
    /** All script groups */
    groups: ScriptGroup[]
}

/**
 * Extended terminal tab type with script runner metadata.
 */
export type ScriptRunnerEngagedTab = BaseTerminalTabComponent<any> & {
    _scriptRunnerRunning?: boolean
}