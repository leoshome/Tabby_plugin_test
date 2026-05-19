import { ConfigProvider } from 'tabby-core'
import { ScriptRunnerPluginConfig, ScriptGroup } from './api'

export class ScriptRunnerConfigProvider extends ConfigProvider {
    defaults: { scriptRunnerPlugin: ScriptRunnerPluginConfig } = {
        scriptRunnerPlugin: {
            groups: [
                {
                    id: 'default',
                    name: 'My Scripts',
                    expanded: true,
                    scripts: [
                        {
                            id: 'example-hello',
                            name: 'Hello World',
                            icon: 'fa-solid fa-terminal',
                            commands: [
                                { command: 'echo "Hello from Script Runner!"', delay: 0, sendEnter: true },
                            ],
                        },
                        {
                            id: 'example-sysinfo',
                            name: 'System Info',
                            icon: 'fa-solid fa-circle-info',
                            commands: [
                                { command: 'uname -a', delay: 500, sendEnter: true },
                                { command: 'uptime', delay: 500, sendEnter: true },
                                { command: 'free -h', delay: 0, sendEnter: true },
                            ],
                        },
                    ],
                },
            ],
        },
    }
}