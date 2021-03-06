'use strict';


import * as vscode from 'vscode';
import { UI } from './extension/ui/app';
import { ToolManager } from './iar/tools/manager';
import { Settings } from './extension/settings';
import { SettingsMonitor } from './extension/settingsmonitor';
import { IarTaskProvider } from './extension/task/provider';

export function activate(context: vscode.ExtensionContext) {
    UI.init(context, IarVsc.toolManager);

    SettingsMonitor.monitorWorkbench(UI.getInstance().workbench.model);
    SettingsMonitor.monitorCompiler(UI.getInstance().compiler.model);
    SettingsMonitor.monitorProject(UI.getInstance().project.model);
    SettingsMonitor.monitorConfiguration(UI.getInstance().config.model);
    UI.getInstance().show();

    let roots = Settings.getIarInstallDirectories();

    roots.forEach(path => {
        IarVsc.toolManager.collectFrom(path);
    });

    IarTaskProvider.register();
}

export function deactivate() {
    IarTaskProvider.unregister();
}

namespace IarVsc {
    export let toolManager = ToolManager.createIarToolManager();
}
