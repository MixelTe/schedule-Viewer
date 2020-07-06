import { Grafic } from "./objects/grafic.js";
import { SettingsMenu } from "./objects/settingsMenu.js";

export class ScheduleViewer
{
	private body: HTMLDivElement;

	private graficBody = document.createElement("div");
	private grafic: Grafic

	private settingsMenuBody = document.createElement("div");
	private settingsMenu: SettingsMenu

	private version = "1.9.1";


	constructor(body: HTMLDivElement, options?: string | null | ScheduleOptions)
	{
		this.body = body;
		this.body.style.position = "relative";
		this.body.style.overflow = "hidden";
		this.body.style.display = "flex";
		this.body.style.userSelect = "none";

		let newOptions = undefined
		if (options != undefined)
		{
			if (typeof options == "string")
			{
				try {
					newOptions = JSON.parse(options);
				} catch (er)
				{
					console.error("uncorect options string");
				}
			}
			else
			{
				newOptions = options;
			}
		}

		{
			const settingsMenuWidth = 310;
			this.body.appendChild(this.graficBody);
			this.grafic = new Grafic(this.graficBody, settingsMenuWidth, newOptions);

			this.body.appendChild(this.settingsMenuBody);
			const functionsForMenu = this.grafic.getFunctions();
			this.settingsMenu = new SettingsMenu(this.settingsMenuBody, settingsMenuWidth, functionsForMenu, this.version, newOptions);

			this.grafic.setFunctionsForLines({
				selectLine: this.settingsMenu.setInputsData.bind(this.settingsMenu),
				unSelectLine: this.settingsMenu.unSelectLine.bind(this.settingsMenu, functionsForMenu),
			});
		}

		this.body.addEventListener("dragover", (e) => this.settingsMenu.mainBodyDragover.bind(this.settingsMenu)(e));
	}

	public getOptionsString()
	{
		const settingsMenuOptions = this.settingsMenu.getOptions();
		const graficOptions = this.grafic.getOptions();
		const options = {
			openControlPanel: settingsMenuOptions.openControlPanel,
			revTimeInput: settingsMenuOptions.revTimeInput,
			darkTheme: settingsMenuOptions.darkTheme,
			showRealLineAfterEnd: graficOptions.showRealLineAfterEnd,
    		compactLinePlacing: graficOptions.compactLinePlacing,
			compactPlacingAlignIsTop: graficOptions.compactPlacingAlignIsTop,
    		selectionCustomColor: graficOptions.selectionCustomColor,
    		showSeparateLine: graficOptions.showSeparateLine,
    		showYAxis: graficOptions.showYAxis,
			lineNamesOnStart: graficOptions.lineNamesOnStart,
		}
		return JSON.stringify(options);
	}
	public setLinesFromString(linesString: string | null)
	{
		if (linesString == null)
		{
			console.error("lines string is null");
			return;
		}
		let newLinesRaw;
		try {
			newLinesRaw = JSON.parse(linesString);
		} catch (er)
		{
			console.error("uncorect lines string");
			return;
		}
		const newLines: LineF[] = [];
		for (let i in newLinesRaw) {
			newLines.push(newLinesRaw[i]);
		}
		if (newLines.length > 1)
		{
			this.grafic.setLines(newLines);
			this.settingsMenu.linesIsChanged();
			this.settingsMenu.setLinesCount(this.grafic.getLinesCount());
		}
	}
	public getLinesString()
	{
		return JSON.stringify(this.grafic.getLines());
	}
}