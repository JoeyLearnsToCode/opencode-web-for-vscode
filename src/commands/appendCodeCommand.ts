import * as vscode from 'vscode';
import { OpenCodeManager } from '../core/OpenCodeManager';
import { l10n } from '../l10n';

/**
 * 添加代码到 OpenCode 命令
 */
export function registerAppendCodeCommand(
  context: vscode.ExtensionContext,
  manager: OpenCodeManager
): vscode.Disposable {
  return vscode.commands.registerCommand('opencode-web.appendCode', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showWarningMessage(l10n.t('message.noActiveEditor'));
      return;
    }

    // 获取选中的代码
    const data = manager.getFileReference(editor);
    if (!data) {
      vscode.window.showWarningMessage(l10n.t('message.pleaseSelectCode'));
      return;
    }

    const { selectedText, absolutePath, startLine, endLine } = data;
    let lineRange = '';
    if (startLine) {
      lineRange = `${startLine}`
      if (endLine) {
        lineRange += `-${endLine}`
      }
    }

    const text = `${selectedText ? "```\n" + removeCommonIndent(selectedText) + "\n```\n\n" : ""}File: ${absolutePath}${lineRange ? "\nLine: " + lineRange : ""}`;

    console.log("Append prompt to OpenCode TUI:", text);
    await manager.appendPromptToTUI(text);
  });
}

/**
 * 移除多行字符串的公共缩进
 * @param selectedText 选中的多行文本
 * @returns 移除公共缩进后的文本
 */
function removeCommonIndent(selectedText: string): string {
  if (!selectedText) return selectedText;

  // 1. 将文本按行分割 (兼容 \n 和 \r\n)
  const lines = selectedText.split('\n');

  // 2. 找到所有非空行的前导空白字符（空格或tab）的长度
  const indents = lines
    .filter(line => line.trim().length > 0) // 忽略纯空行，否则空行的0缩进会影响计算
    .map(line => {
      const match = line.match(/^[ \t]*/);
      return match ? match[0].length : 0;
    });

  // 3. 计算最小公共缩进量
  // 如果全是空行（indents.length === 0），则缩进量为 0
  const minIndent = indents.length > 0 ? Math.min(...indents) : 0;

  // 如果没有公共缩进，直接返回原字符串
  if (minIndent === 0) {
    return selectedText;
  }

  // 4. 移除每行的公共缩进并重新拼接
  const result = lines.map(line => {
    // 对于纯空白行，直接清空即可，避免残留无用的空格
    if (line.trim().length === 0) {
      // 保留可能存在的 \r (针对 Windows 换行符 \r\n)
      return line.endsWith('\r') ? '\r' : '';
    }
    // 截取掉公共部分的缩进
    return line.slice(minIndent);
  });

  return result.join('\n');
}
