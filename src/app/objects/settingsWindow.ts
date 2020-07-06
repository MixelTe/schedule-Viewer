import { DialogWindow } from "./dialogWindow.js";

export class SettingsWindow extends DialogWindow
{
	protected answer: boolean | ScheduleOptionsFull = false;
	protected resolve: ((value?: boolean | ScheduleOptionsFull | PromiseLike<boolean | ScheduleOptionsFull> | undefined) => void) | undefined;
	private inputs: HTMLInputElement[] = []

	constructor(parent: HTMLElement, data: ScheduleOptionsFull)
	{
		super(parent, "max-content", "max-content", "150px", "140px");

		const titleStyle = [
			{ property: "text-align", value: "center" },
			{ property: "font-size", value: "20px" }
		];
		const rowStyle: { property: string; value: string; }[] = [];
		const cellStyle: { property: string; value: string; }[] = [];
		const buttonCellStyle = [{ property: "text-align", value: "right" }];

		this.table.appendChild(this.createRow(titleStyle, [
			this.createCell(2, "All options", [], []),
		]));
		this.table.appendChild(this.createRow(rowStyle, [
			this.createCell(1, "", cellStyle, this.createOption("change time input order", "scheduleViewer-SettingsWindow-revTimeInput", false, 0)),
			this.createCell(1, "", cellStyle, this.createOption("show real line after ending", "scheduleViewer-SettingsWindow-showRealLineAfterEnd", false, 1)),
		]));
		this.table.appendChild(this.createRow(rowStyle, [
			this.createCell(1, "", cellStyle, this.createOption("compact line placing", "scheduleViewer-SettingsWindow-compactLinePlacing", false, 2)),
			this.createCell(1, "", cellStyle, this.createOption("line align top", "scheduleViewer-SettingsWindow-compactPlacingAlignIsTop", false, 3)),
		]));
		this.table.appendChild(this.createRow(rowStyle, [
			this.createCell(1, "", cellStyle, this.createOption("custom selection color", "scheduleViewer-SettingsWindow-selectionCustomColor", false, 4)),
			this.createCell(1, "", cellStyle, this.createOption("show separate line", "scheduleViewer-SettingsWindow-showSeparateLine", false, 5)),
		]));
		this.table.appendChild(this.createRow(rowStyle, [
			this.createCell(1, "", cellStyle, this.createOption("show Y axis", "scheduleViewer-SettingsWindow-showYAxis", false, 6)),
		]));
		this.table.appendChild(this.createRow(rowStyle, [
			this.createCell(1, "", cellStyle, []),
			this.createCell(1, "", buttonCellStyle, [
				this.createButton("cancel", false),
				this.createButton("confirm", true),
			])
		]));

		this.setCurrentOptions(data)
	}

	public getAnswer()
	{
		return new Promise<boolean | ScheduleOptionsFull>((resolve, reject) =>
        {
			this.resolve = resolve;
        });
	}
	private setAnswer(answer: boolean)
	{
		if (answer)
		{
			const data = {
				revTimeInput: this.inputs[0].checked,
				showRealLineAfterEnd: this.inputs[1].checked,
				compactLinePlacing: this.inputs[2].checked,
				compactPlacingAlignIsTop: this.inputs[3].checked,
				selectionCustomColor: this.inputs[4].checked,
				showSeparateLine: this.inputs[5].checked,
				showYAxis: this.inputs[6].checked,
			}
			this.answer = data;
		}
		else
		{
			this.answer = false;
		}
		this.returnAnswer();
		this.close();
	}
	private setCurrentOptions(data: ScheduleOptionsFull)
	{
		this.inputs[0].checked = data.revTimeInput;
		this.inputs[1].checked = data.showRealLineAfterEnd;
		this.inputs[2].checked = data.compactLinePlacing;
		this.inputs[3].checked = data.compactPlacingAlignIsTop;
		this.inputs[4].checked = data.selectionCustomColor;
		this.inputs[5].checked = data.showSeparateLine;
		this.inputs[6].checked = data.showYAxis;
	}

	private createOption(text: string, id: string, checked: boolean, index: number)
	{
		const input = document.createElement("input");
		input.type = "checkbox";
		input.checked = checked;
		input.id = id;

		const lable = document.createElement("label");
		lable.style.height = "max-content";
		lable.style.fontSize = "16px";
		lable.htmlFor = id;
		lable.innerText = text;

		this.inputs[index] = input;
		return [input, lable];
	}
	private createButton = (text: string, answer: boolean) =>
	{
		const button = document.createElement("button");
		button.innerText = text;
		button.style.marginLeft = "10px";
		button.addEventListener("click", () =>
		{
			this.setAnswer(answer);
		});
		return button;
	};
}