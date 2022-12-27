/* eslint-disable curly */
import * as vscode from 'vscode';
import { createATS, createSQL } from './gmf_main';

export function activate(context: vscode.ExtensionContext) {
	//현재 보고 있는 에디터 내의 쿼리에 대해 포매팅
	//Formatting for queries within the editor you are currently viewing
	let disposable = vscode.commands.registerCommand('gm-sql-formatter.gmformat', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor)
			vscode.window.showErrorMessage('No current editor to format');
		else
		{
			const doc = editor.document;
			const sel = editor.selection;
			let text: string = '';
			if (!sel || (sel.start.line === sel.end.line && sel.start.character === sel.end.character))
				text = doc.getText();
			else
				text = doc.getText(sel);

			let ast: any = createATS(text);
			if (ast === null)
				vscode.window.showErrorMessage("Cannot parse current text as SQL");
			else
			{
				const set = { language : 'sql', content : createSQL(ast) };
				const newDoc = await vscode.workspace.openTextDocument(set);
				vscode.window.showTextDocument(newDoc);
			}
		}
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
