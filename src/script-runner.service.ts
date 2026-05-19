import { Injectable } from '@angular/core'
import { AppService, LogService } from 'tabby-core'
import { BaseTerminalTabComponent } from 'tabby-terminal'
import { Script, ScriptCommand } from './api'

/**
 * Service responsible for executing script commands on the active terminal.
 */
@Injectable()
export class ScriptRunnerService {
    constructor(
        private app: AppService,
        private log: LogService,
    ) {}

    /**
     * Get the currently active terminal tab, if any.
     */
    getActiveTerminal(): BaseTerminalTabComponent<any> | null {
        const tab = this.app.activeTab
        if (tab instanceof BaseTerminalTabComponent) {
            return tab
        }
        return null
    }

    /**
     * Execute a script on the active terminal tab.
     * Commands are sent sequentially with specified delays between them.
     */
    async executeScript(script: Script): Promise<void> {
        const terminal = this.getActiveTerminal()
        if (!terminal) {
            this.log.warn('ScriptRunner: No active terminal tab found')
            return
        }

        if (!terminal.session) {
            this.log.warn('ScriptRunner: Active terminal has no session')
            return
        }

        this.log.info(`ScriptRunner: Executing script "${script.name}" (${script.commands.length} commands)`)

        for (let i = 0; i < script.commands.length; i++) {
            const cmd = script.commands[i]
            await this.executeCommand(terminal, cmd, i)
        }

        this.log.info(`ScriptRunner: Script "${script.name}" completed`)
    }

    /**
     * Execute a single command on the given terminal.
     */
    private async executeCommand(
        terminal: BaseTerminalTabComponent<any>,
        cmd: ScriptCommand,
        index: number,
    ): Promise<void> {
        const commandText = cmd.command

        this.log.debug(`ScriptRunner: [${index + 1}] Sending: ${commandText}`)

        // Send the command text
        terminal.sendInput(commandText)

        // Send Enter if configured (default: true)
        if (cmd.sendEnter !== false) {
            // Determine the appropriate line ending based on platform/profile
            const newline = this.getNewline(terminal)
            terminal.sendInput(newline)
        }

        // Wait the specified delay before the next command
        if (cmd.delay > 0) {
            await this.sleep(cmd.delay)
        }
    }

    /**
     * Determine the newline character based on the terminal profile.
     * - Windows local shells (cmd, powershell): \r\n
     * - Everything else (Linux, macOS, SSH, WSL): \n
     */
    private getNewline(terminal: BaseTerminalTabComponent<any>): string {
        const profile = (terminal as any).profile
        if (process.platform === 'win32' && profile?.type === 'local') {
            return '\r\n'
        }
        return '\n'
    }

    /**
     * Simple sleep utility.
     */
    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms))
    }
}