import * as vscode from 'vscode';

/**
 * CodelensProvider
 */
export class CodelensProviderForAllReq implements vscode.CodeLensProvider {
	private codeLenses: vscode.CodeLens[] = [];
	private regex: RegExp;
	private _onDidChangeCodeLenses: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
	public readonly onDidChangeCodeLenses: vscode.Event<void> = this._onDidChangeCodeLenses.event;

	constructor() {
		this.regex = /\brequests:/g;

		vscode.workspace.onDidChangeConfiguration((_) => {
			this._onDidChangeCodeLenses.fire();
		});
	}

	public provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.CodeLens[] | Thenable<vscode.CodeLens[]> {
		if (vscode.workspace.getConfiguration("extension").get("enableAPIrunner", true)) {
			this.codeLenses = [];
			const regex = new RegExp(this.regex);
			const text = document.getText();
			let matches;
			while ((matches = regex.exec(text)) !== null) {
				const line = document.lineAt(document.positionAt(matches.index).line);
				const indexOf = line.text.indexOf(matches[0]);
				const position = new vscode.Position(line.lineNumber, indexOf);
				const range = document.getWordRangeAtPosition(position, new RegExp(this.regex));
				if (range) {
					this.codeLenses.push(new vscode.CodeLens(range));
				}
			}

			return this.codeLenses;
		}
		return [];
	}

	public resolveCodeLens(codeLens: vscode.CodeLens, token: vscode.CancellationToken) {
		if (vscode.workspace.getConfiguration("extension").get("enableAPIrunner", true)) {
			codeLens.command = {
				title: "Run All Requests",
				tooltip: "Click to run all request",
				command: "extension.runAllRequests",
				arguments: ["Argument 1", false]
			};
			return codeLens;
		}
		return null;
	}
}
