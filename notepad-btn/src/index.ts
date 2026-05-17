import { NgModule, Injectable } from '@angular/core'
import TabbyCoreModule, { ToolbarButtonProvider, ToolbarButton } from 'tabby-core'
import { TerminalDecorator, BaseTerminalTabComponent } from 'tabby-terminal'

let monitoring = false
let outputSub: any = null
let lastLineContent = ''
let trackedTab: any = null

@Injectable()
class TrackerDecorator extends TerminalDecorator {
    attach(tab: any): void {
        trackedTab = tab
    }
}

@Injectable()
class MonitorButtonProvider extends ToolbarButtonProvider {
    provide(): ToolbarButton[] {
        return [{
            icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z"/></svg>',
            title: monitoring ? 'Stop' : 'Start',
            weight: 10,
            click: () => {
                if (monitoring) {
                    this.stopMonitor()
                } else {
                    this.startMonitor()
                }
            },
        }]
    }

    private startMonitor(): void {
        if (!trackedTab) { alert('Open a terminal first'); return }
        if (!trackedTab.session) { alert('No session'); return }
        monitoring = true
        lastLineContent = ''
        outputSub = trackedTab.session.output$.subscribe((data: any) => {
            const text = data.toString()
            const lines = text.split('\n')
            if (lines.length > 0) lastLineContent = lines[lines.length - 1].trim()
            if (lastLineContent.toLowerCase().includes('c:')) {
                trackedTab.sendInput?.('echo hi\r\n')
                this.stopMonitor()
            }
        })
        alert('Monitoring... (will auto-stop after match)')
    }

    private stopMonitor(): void {
        monitoring = false
        if (outputSub) { outputSub.unsubscribe(); outputSub = null }
        alert('Stopped')
    }
}

@NgModule({
    imports: [TabbyCoreModule],
    providers: [
        { provide: TerminalDecorator, useClass: TrackerDecorator, multi: true },
        { provide: ToolbarButtonProvider, useClass: MonitorButtonProvider, multi: true },
    ],
})
export default class MonitorBtnModule {}