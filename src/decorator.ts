import { Injectable, Injector } from '@angular/core'
import { BaseTerminalTabComponent, TerminalDecorator } from 'tabby-terminal'

/**
 * Decorator that attaches to terminal tabs.
 * Currently a no-op placeholder - can be extended to track active terminals
 * or inject per-session middleware if needed in the future.
 */
@Injectable()
export class ScriptRunnerDecorator extends TerminalDecorator {
    constructor(protected injector: Injector) {
        super()
    }

    attach(tab: BaseTerminalTabComponent<any>): void {
        // Future: could inject per-session tracking or middleware here
        // For now, the ScriptRunnerService uses AppService.activeTab directly
    }
}