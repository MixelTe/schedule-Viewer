import { Grafic } from "./objects/grafic.js";
import { SettingsMenu } from "./objects/settingsMenu.js";

export class scheduleViewer
{
	private body: HTMLDivElement;

	private graficBody = document.createElement("div");
	private grafic: Grafic

	private settingsMenuBody = document.createElement("div");
	private settingsMenu: SettingsMenu


	constructor(body: HTMLDivElement, options?: ScheduleOptions)
	{
		this.body = body;
		this.body.style.position = "relative";
		this.body.style.overflow = "hidden";
		this.body.style.display = "flex";
		this.body.style.userSelect = "none";

		{
			const settingsMenuWidth = 310;
			this.body.appendChild(this.graficBody);
			this.grafic = new Grafic(this.graficBody, settingsMenuWidth, options);

			this.body.appendChild(this.settingsMenuBody);
			this.settingsMenu = new SettingsMenu(this.settingsMenuBody, settingsMenuWidth, this.grafic.getFunctions(), options);

			this.grafic.setFunctionsForLines({ selectLine: this.settingsMenu.setInputsData.bind(this.settingsMenu) });
		}

		this.body.addEventListener("dragover", (e) => this.settingsMenu.mainBodyDragover.bind(this.settingsMenu)(e));
	}

	public getOptions(): ScheduleOptions
	{
		const settingsMenuOptions = this.settingsMenu.getOptions();
		const graficOptions = this.grafic.getOptions();
		return {
			openControlPanel: settingsMenuOptions.openControlPanel,
			revTimeInput: settingsMenuOptions.revTimeInput,
			showRealLineAfterEnd: graficOptions.showRealLineAfterEnd,
    		compactLinePlacing: graficOptions.compactLinePlacing,
    		selectionCustomColor: graficOptions.selectionCustomColor,
    		showSeparateLine: graficOptions.showSeparateLine,
		}
	}
}