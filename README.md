# tabby-script-runner

A Tabby terminal plugin that adds XShell/SecureCRT-like script execution buttons.

## Features

- **Script Button Bar**: Adds a toolbar button with a dropdown menu for your scripts
- **Command Sequences**: Each script is a sequence of commands sent to the active terminal
- **Configurable Delays**: Set per-command delays (ms) for waiting between commands
- **Script Groups**: Organize scripts into named groups
- **Settings UI**: Manage all scripts through Tabby's built-in settings panel

## Installation

1. Build the plugin:
   ```bash
   npm install
   npm run build
   ```

2. Install into Tabby:
   ```bash
   npm install -g tabby-script-runner
   ```
   Or copy the `dist/` folder to Tabby's plugin directory.

3. Restart Tabby.

## Usage

1. Open Tabby Settings → **Script Runner** tab
2. Create script groups and add scripts with command sequences
3. Each script has a name, optional icon, and a list of commands
4. Each command has:
   - **Command**: The text to send to the terminal
   - **Delay (ms)**: Wait time after sending the command
   - **Send Enter**: Whether to press Enter after the command text
5. Click the **Scripts** button in the toolbar to execute any configured script

## Configuration

Scripts are stored in Tabby's config under `scriptRunnerPlugin.groups`. Example:

```json
{
  "scriptRunnerPlugin": {
    "groups": [
      {
        "id": "default",
        "name": "My Scripts",
        "scripts": [
          {
            "id": "hello",
            "name": "Hello World",
            "icon": "",
            "commands": [
              { "command": "echo Hello", "delay": 0, "sendEnter": true }
            ]
          }
        ]
      }
    ]
  }
}
```

## Development

```bash
npm install
npm run dev      # Watch mode
npm run build   # Production build
```

## License

MIT