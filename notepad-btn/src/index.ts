import { NgModule, Injectable } from '@angular/core'
import TabbyCoreModule, { ToolbarButtonProvider, ToolbarButton, LogService } from 'tabby-core'
import { TerminalDecorator } from 'tabby-terminal'
import { ElectronService } from 'tabby-electron'

const nativeRequire = typeof __non_webpack_require__ !== 'undefined' ? __non_webpack_require__ : eval('require')

let trackedTab: any = null

@Injectable()
class TrackerDecorator extends TerminalDecorator {
    attach(tab: any): void {
        trackedTab = tab
    }
}

@Injectable()
class ScriptButtonProvider extends ToolbarButtonProvider {
    constructor(
        private electron: ElectronService,
        private log: LogService,
    ) {
        super()
    }

    provide(): ToolbarButton[] {
        return [{
            icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13zM8.5 13.5l1.5 1.5-1.5 1.5L7 15l-1.5 1.5L4 15l1.5-1.5L4 12l1.5-1.5L7 12l1.5-1.5L10 12l-1.5 1.5zm7 6l-1.5-1.5 1.5-1.5L17 15l1.5 1.5L20 15l1.5 1.5L20 18l-1.5 1.5L17 18l-1.5 1.5z"/></svg>',
            title: 'Run Script',
            weight: 10,
            click: () => {
                this.openAndRunScript()
            },
        }]
    }

    private async openAndRunScript(): Promise<void> {
        if (!trackedTab) {
            alert('Open a terminal first')
            return
        }
        if (!trackedTab.session) {
            alert('No session')
            return
        }

        const result = await this.electron.dialog.showOpenDialog({
            title: 'Select Script File',
            filters: [{ name: 'JavaScript', extensions: ['js'] }],
            properties: ['openFile'],
        })

        if (result.canceled || result.filePaths.length === 0) {
            return
        }

        const scriptPath = result.filePaths[0]
        this.log.info('Running script: ' + scriptPath)

        try {
            const resolved = nativeRequire.resolve(scriptPath)
            delete nativeRequire.cache[resolved]
        } catch (_) {
        }

        let scriptFn: any
        try {
            scriptFn = nativeRequire(scriptPath)
        } catch (err: any) {
            alert('Failed to load script: ' + err.message)
            return
        }

        if (typeof scriptFn !== 'function') {
            alert('Script must export a function')
            return
        }

        const runner = {
            tab: trackedTab,
            sendInput: (text: string) => trackedTab.sendInput?.(text),
            alert: (msg: string) => alert(msg),
        }

        try {
            scriptFn(runner)
        } catch (err: any) {
            alert('Script error: ' + err.message)
        }
    }
}

@NgModule({
    imports: [TabbyCoreModule],
    providers: [
        { provide: TerminalDecorator, useClass: TrackerDecorator, multi: true },
        { provide: ToolbarButtonProvider, useClass: ScriptButtonProvider, multi: true },
    ],
})
export default class ScriptBtnModule {}
