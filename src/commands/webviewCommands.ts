/**
 * OpenCode Webview 相关命令注册
 */

import * as vscode from 'vscode';
import { OpencodeWebviewProvider } from '../views/webview/WebviewProvider';
import { OpenCodeManager } from '../core/OpenCodeManager';
import { l10n } from '../l10n';

/**
 * 注册 Webview 相关命令
 */
export function registerWebviewCommands(
  context: vscode.ExtensionContext,
  webviewProvider: OpencodeWebviewProvider,
  openCodeManager: OpenCodeManager
): void {
  // 在浏览器中打开
  context.subscriptions.push(
    vscode.commands.registerCommand('opencode-web.openInBrowser', () => {
      webviewProvider.openInBrowser();
    })
  );

  // 切换侧边栏
  context.subscriptions.push(
    vscode.commands.registerCommand('opencode-web.toggleSidebar', () => {
      webviewProvider.toggleSidebar();
    })
  );

  // 打开 TUI 终端
  context.subscriptions.push(
    vscode.commands.registerCommand('opencode-web.openTui', () => {
      openCodeManager.showTui();
    })
  );

  // 杀掉进程
  context.subscriptions.push(
    vscode.commands.registerCommand('opencode-web.killProcess', async () => {
      const confirmed = await vscode.window.showWarningMessage(
        l10n.t('message.killConfirm'),
        { modal: true },
        l10n.t('button.confirm')
      );

      if (confirmed === l10n.t('button.confirm')) {
        try {
          await openCodeManager.killProcess();
          // 事件系统会自动通知 WebviewProvider 更新状态
          // 不再需要显式的 showInformationMessage
        } catch (error) {
          vscode.window.showErrorMessage(l10n.t('message.killFailed', error));
        }
      }
    })
  );

  // 重启进程
  context.subscriptions.push(
    vscode.commands.registerCommand('opencode-web.restartProcess', async () => {
      const confirmed = await vscode.window.showWarningMessage(
        l10n.t('message.restartConfirm'),
        { modal: true },
        l10n.t('button.confirm')
      );

      if (confirmed === l10n.t('button.confirm')) {
        try {
          await openCodeManager.restartProcess();
          // 事件系统会自动通知 WebviewProvider 更新状态
          // 不再需要显式的 showInformationMessage
        } catch (error) {
          vscode.window.showErrorMessage(l10n.t('message.restartFailed', error));
        }
      }
    })
  );

  // 显示帮助
  context.subscriptions.push(
    vscode.commands.registerCommand('opencode-web.showHelp', () => {
      webviewProvider.showHelpPanel();
    })
  );

  // 刷新 Webview
  context.subscriptions.push(
    vscode.commands.registerCommand('opencode-web.refreshWebview', async () => {
      try {
        await webviewProvider.refreshWebview();
      } catch (error) {
        vscode.window.showErrorMessage(l10n.t('message.refreshFailed', error));
      }
    })
  );

  // 切换语言
  context.subscriptions.push(
    vscode.commands.registerCommand('opencode-web.changeLanguage', () => {
      vscode.commands.executeCommand('workbench.action.openSettings', 'opencode.language');
    })
  );

  // 调试：显示当前语言状态
  context.subscriptions.push(
    vscode.commands.registerCommand('opencode-web.debugLanguage', () => {
      const config = vscode.workspace.getConfiguration('opencode');
      const userLanguage = config.get<string>('language');
      const vscodeLang = vscode.env.language;
      const currentLang = l10n.getLanguage();
      const sampleTranslation = l10n.t('status.checkingStatus');

      const message = `
Language Debug Info:
- User config (opencode.language): ${userLanguage}
- VSCode display language: ${vscodeLang}
- Current active language: ${currentLang}
- Sample translation "status.checkingStatus": ${sampleTranslation}
      `.trim();

      console.log(message);
      vscode.window.showInformationMessage(message);
    })
  );
}
