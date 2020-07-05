import { ColorPicker } from "../../lib/colorPicker.js";
import { AskWindow } from "./askWindow.js";

export class SettingsMenu
{
	private body: HTMLDivElement

	private toggleMenuEl: SVGSVGElement;
	private menuWidth: number
	private menuOpen = true;

	private titleDIV = document.createElement("div");
	private titlePrm = { height: 100 };

	private settingsDIV = document.createElement("div");
	private toggleSepLineEl: HTMLInputElement;
	private revTimeInputEl: HTMLInputElement;
	private colorizeLineSelectionEl: HTMLInputElement;
	private compactLinePlacingEl: HTMLInputElement;
	private revTimeInput = false;
	private settingsPrm = { height: 140 };

	private addingLinesDIV = document.createElement("div");
	private addingLinesPrm = { height: 320, inputsBorder: "1px solid grey", inputsBackground: "white", inputtitle: "time in format: hh or hh:mm or hh:mm:ss", inputplaceholder: "hh:mm" };
	private lineInputs: {
		radioOnce: HTMLInputElement,
		radioRepeating: HTMLInputElement,
		freqenceRow: HTMLTableRowElement,
		interval: HTMLInputElement,
		duration: HTMLInputElement,
		start: HTMLInputElement,
		end: HTMLInputElement,
		buttonAdd: HTMLButtonElement,
		buttonChange: HTMLButtonElement,
		buttonRemove: HTMLButtonElement,
		buttonCancel: HTMLButtonElement,
		buttonRemoveAll: HTMLButtonElement,
		buttonResetZoom: HTMLButtonElement,
		buttonExample: HTMLButtonElement,
		checkBoxColor: HTMLInputElement,
		colorDiv: HTMLDivElement,
		color: string,
	}
	private lineToChange: LineF | undefined;
	private hintForLinesInputs: HTMLDivElement;
	private colorPicker = new ColorPicker();
	private linesChanged = false;
	private lineCount = 0;

	private loadFilesDIV = document.createElement("div");
	private loadFilesPrm = { height: 80 };
	private filesInput: HTMLInputElement;

	private saveFileDIV = document.createElement("div");
	private saveFilesPrm = { height: 50 };
	private saveFileButton: HTMLButtonElement;


	private overDiv = document.createElement("div");
	private overDivText = document.createElement("div");
	private overDivPrm = { width: 0, height: 0, minusWidth: 0 };

	constructor(body: HTMLDivElement, width: number, functions: FunctionsForMenu, options?: ScheduleOptions)
	{
		this.menuWidth = width;
		this.body = body;
		this.body.style.height = "calc(100% - 0px)";
		this.body.style.width = `${width}px`;
		this.body.style.minWidth = `${width}px`;
		this.body.style.backgroundColor = "lightblue";
		this.body.style.overflowY = "auto"
		this.body.style.overflowX = "hidden"
		this.body.style.display = "inline-block";
		this.body.style.borderLeft = `${2}px solid black`;
		this.body.style.transition = "width 1s";

		const lineInputs: {
			radioOnce?: HTMLInputElement,
			radioRepeating?: HTMLInputElement,
			freqenceRow?: HTMLTableRowElement,
			interval?: HTMLInputElement,
			duration?: HTMLInputElement,
			start?: HTMLInputElement,
			end?: HTMLInputElement,
			buttonAdd?: HTMLButtonElement,
			buttonChange?: HTMLButtonElement,
			buttonRemove?: HTMLButtonElement,
			buttonCancel?: HTMLButtonElement,
			buttonRemoveAll?: HTMLButtonElement,
			buttonResetZoom?: HTMLButtonElement,
			buttonExample?: HTMLButtonElement,
			checkBoxColor?: HTMLInputElement,
			colorDiv?: HTMLDivElement,
		} = {};
		{
			const scale = 40
			const toggleMenuDiv = document.createElement("div");
			toggleMenuDiv.style.height = `${scale}px`
			toggleMenuDiv.style.position = "absolute";
			toggleMenuDiv.style.top = `${2}px`;
			toggleMenuDiv.style.left = `calc(100% - ${scale + 2}px)`;
			toggleMenuDiv.style.display = "block";
			toggleMenuDiv.style.width = `${scale}px`;
			toggleMenuDiv.style.textAlign = "right";
			this.body.appendChild(toggleMenuDiv);

			this.toggleMenuEl = document.createElementNS("http://www.w3.org/2000/svg", "svg");
			this.toggleMenuEl.setAttribute("width", `${scale}`);
			this.toggleMenuEl.setAttribute("height", `${scale}`);
			this.toggleMenuEl.setAttribute("viewBox", `0 0 20 20`);
			toggleMenuDiv.appendChild(this.toggleMenuEl);
			const symbol = document.createElementNS("http://www.w3.org/2000/svg", "path");
			symbol.setAttribute("stroke", `black`);
			symbol.setAttribute("d", `M15.808,14.066H6.516v-1.162H5.354v1.162H4.193c-0.321,0-0.581,0.26-0.581,0.58s0.26,0.58,0.581,0.58h1.162
            v1.162h1.162v-1.162h9.292c0.32,0,0.58-0.26,0.58-0.58S16.128,14.066,15.808,14.066z M15.808,9.419h-1.742V8.258h-1.162v1.161
            h-8.71c-0.321,0-0.581,0.26-0.581,0.581c0,0.321,0.26,0.581,0.581,0.581h8.71v1.161h1.162v-1.161h1.742
            c0.32,0,0.58-0.26,0.58-0.581C16.388,9.679,16.128,9.419,15.808,9.419z M17.55,0.708H2.451c-0.962,0-1.742,0.78-1.742,1.742v15.1
            c0,0.961,0.78,1.74,1.742,1.74H17.55c0.962,0,1.742-0.779,1.742-1.74v-15.1C19.292,1.488,18.512,0.708,17.55,0.708z M18.13,17.551
            c0,0.32-0.26,0.58-0.58,0.58H2.451c-0.321,0-0.581-0.26-0.581-0.58v-15.1c0-0.321,0.26-0.581,0.581-0.581H17.55
            c0.32,0,0.58,0.26,0.58,0.581V17.551z M15.808,4.774H9.419V3.612H8.258v1.162H4.193c-0.321,0-0.581,0.26-0.581,0.581
            s0.26,0.581,0.581,0.581h4.065v1.162h1.161V5.935h6.388c0.32,0,0.58-0.26,0.58-0.581S16.128,4.774,15.808,4.774z`);
			this.toggleMenuEl.appendChild(symbol);
		}

		{
			this.titleDIV.style.height = `${this.titlePrm.height}px`
			this.titleDIV.style.display = "flex";
			this.titleDIV.style.justifyContent = "center";
			this.titleDIV.style.alignItems = "center";
			this.body.appendChild(this.titleDIV);

			const title = document.createElement("div");
			title.style.height = "max-content";
			title.style.width = "max-content";
			title.innerText = "Schedule viewer"
			title.style.fontSize = "34px"
			this.titleDIV.appendChild(title);


		}

		{
			this.settingsDIV.style.height = `${this.settingsPrm.height}px`
			this.body.appendChild(this.settingsDIV);

			const title = document.createElement("div");
			title.style.height = "max-content";
			title.style.fontSize = "25px"
			title.style.textAlign = "center"
			title.innerText = "Settings"
			this.settingsDIV.appendChild(title);

			const menu = document.createElement("div");
			menu.style.height = "90px";
			menu.style.display = "flex";
			menu.style.justifyContent = "space-around";
			menu.style.alignItems = "center";
			menu.style.flexWrap = "wrap";
			this.settingsDIV.appendChild(menu);

			const createSetting = (text: string, id: string, checked: boolean) =>
			{
				const div = document.createElement("div");
				div.style.height = "max-content";
				div.style.width = "max-content";
				menu.appendChild(div);

				const input = document.createElement("input");
				input.type = "checkbox";
				input.checked = checked;
				input.id = id;
				div.appendChild(input);

				const lable = document.createElement("label");
				lable.style.height = "max-content";
				lable.style.fontSize = "16px";
				lable.htmlFor = id;
				lable.innerText = text;
				div.appendChild(lable);

				return input;
			}

			this.toggleSepLineEl = createSetting("show separate line", "scheduleViewer-SettingsMenu-sepLineInput", functions.SepLineIsActive());
			this.revTimeInputEl = createSetting("change time input order", "scheduleViewer-SettingsMenu-showAfterEndInput", this.revTimeInput);
			this.colorizeLineSelectionEl = createSetting("colorize selection line", "scheduleViewer-SettingsMenu-colorizeSelectionInput", functions.CustomSelectionColorIsActive());
			this.compactLinePlacingEl = createSetting("compact line placing", "scheduleViewer-SettingsMenu-compactLinePlacingInput", functions.compactLinePlacingIsActive());

		}

		{
			this.addingLinesDIV.style.height = `${this.addingLinesPrm.height}px`
			this.body.appendChild(this.addingLinesDIV);

			const title = document.createElement("div");
			title.style.height = "40px";
			title.style.fontSize = "25px"
			title.style.textAlign = "center"
			title.innerText = "Events"
			this.addingLinesDIV.appendChild(title);

			const inputWidth = 100;
			const inputHeight = 15;
			const inputRadius = 3;

			const leftRowPadingRight = 10;

			{
				const linesMenuTableDIV = document.createElement("div");
				linesMenuTableDIV.style.width = "100%";
				linesMenuTableDIV.style.height = "160px";
				linesMenuTableDIV.style.display = "flex";
				linesMenuTableDIV.style.justifyContent = "center";
				this.addingLinesDIV.appendChild(linesMenuTableDIV);

				const linesMenuTable = document.createElement("table");
				linesMenuTable.style.width = "90%";
				linesMenuTable.style.height = "100%";
				linesMenuTableDIV.appendChild(linesMenuTable);


				{
					const tableRow = document.createElement("tr");
					linesMenuTable.appendChild(tableRow);

					{
						const tableCell = document.createElement("td");
						tableCell.style.textAlign = "right";
						tableCell.style.paddingRight = `${leftRowPadingRight}px`;
						tableRow.appendChild(tableCell);

						const startLable = document.createElement("label");
						// startLable.style.height = "max-content";
						// startLable.style.marginRight = "3px";
						startLable.style.fontSize = "16px";
						startLable.htmlFor = "scheduleViewer-SettingsMenu-realLineInputStarth"
						startLable.innerText = "Start:";
						tableCell.appendChild(startLable);
					}
					{
						const tableCell = document.createElement("td");
						tableRow.appendChild(tableCell);

						const startInput = document.createElement("input");
						startInput.type = "input";
						startInput.style.width = `${inputWidth}px`
						startInput.style.height = `${inputHeight}px`
						startInput.id = "scheduleViewer-SettingsMenu-realLineInputStarth";
						startInput.title = this.addingLinesPrm.inputtitle;
						startInput.placeholder = this.addingLinesPrm.inputplaceholder;
						startInput.style.border = `${this.addingLinesPrm.inputsBorder}`
						startInput.style.borderRadius = `${inputRadius}px`
						startInput.style.backgroundColor = `${this.addingLinesPrm.inputsBackground}`
						tableCell.appendChild(startInput);
						lineInputs.start = startInput;
					}

				}

				{
					const tableRow = document.createElement("tr");
					linesMenuTable.appendChild(tableRow);

					{
						const tableCell = document.createElement("td");
						tableCell.style.textAlign = "right";
						tableCell.style.paddingRight = `${leftRowPadingRight}px`;
						tableRow.appendChild(tableCell);

						const durationLable = document.createElement("label");
						// durationLable.style.height = "max-content";
						// durationLable.style.marginRight = "3px";
						durationLable.style.fontSize = "16px";
						durationLable.htmlFor = "scheduleViewer-SettingsMenu-inputDuration"
						durationLable.innerText = "Duration:";
						tableCell.appendChild(durationLable);

					}
					{
						const tableCell = document.createElement("td");
						tableRow.appendChild(tableCell);

						const durationInput = document.createElement("input");
						durationInput.type = "input";
						durationInput.style.width = `${inputWidth}px`
						durationInput.style.height = `${inputHeight}px`
						durationInput.id = "scheduleViewer-SettingsMenu-inputDuration";
						durationInput.title = this.addingLinesPrm.inputtitle;
						durationInput.placeholder = this.addingLinesPrm.inputplaceholder;
						durationInput.style.border = `${this.addingLinesPrm.inputsBorder}`
						durationInput.style.borderRadius = `${inputRadius}px`
						durationInput.style.backgroundColor = `${this.addingLinesPrm.inputsBackground}`
						tableCell.appendChild(durationInput);
						lineInputs.duration = durationInput;
						// lineInputs.duration.div = durationDIV;
					}

				}

				{
					const tableRow = document.createElement("tr");
					linesMenuTable.appendChild(tableRow);
					lineInputs.freqenceRow = tableRow;

					{
						const tableCell = document.createElement("td");
						tableCell.innerText = "Freqence:"
						tableCell.style.textAlign = "right";
						tableCell.style.paddingRight = `${leftRowPadingRight}px`;
						tableRow.appendChild(tableCell);
					}
					{
						const tableCell = document.createElement("td");
						tableRow.appendChild(tableCell);

						const typeO = document.createElement("input");
						typeO.type = "radio";
						typeO.name = "scheduleViewer-SettingsMenu-type";
						typeO.id = "scheduleViewer-SettingsMenu-realType";
						tableCell.appendChild(typeO);
						lineInputs.radioOnce = typeO;

						const typeLableO = document.createElement("label");
						typeLableO.style.height = "max-content";
						typeLableO.style.fontSize = "16px";
						typeLableO.htmlFor = "scheduleViewer-SettingsMenu-realType"
						typeLableO.innerText = "once";
						tableCell.appendChild(typeLableO);

						const typeR = document.createElement("input");
						typeR.type = "radio";
						typeR.name = "scheduleViewer-SettingsMenu-type";
						typeR.id = "scheduleViewer-SettingsMenu-sympleType";
						tableCell.appendChild(typeR);
						lineInputs.radioRepeating = typeR;

						const typeLableR = document.createElement("label");
						typeLableR.style.height = "max-content";
						typeLableR.style.fontSize = "16px";
						typeLableR.htmlFor = "scheduleViewer-SettingsMenu-sympleType"
						typeLableR.innerText = "repeat";
						tableCell.appendChild(typeLableR);
					}
				}

				{
					const tableRow = document.createElement("tr");
					linesMenuTable.appendChild(tableRow);

					{
						const tableCell = document.createElement("td");
						tableCell.style.textAlign = "right";
						tableCell.style.paddingRight = `${leftRowPadingRight}px`;
						tableRow.appendChild(tableCell);

						const intervalLable = document.createElement("label");
						// intervalLable.style.height = "max-content";
						// intervalLable.style.marginRight = "3px";
						intervalLable.style.fontSize = "16px";
						intervalLable.htmlFor = "scheduleViewer-SettingsMenu-realLineInputInterval"
						intervalLable.innerText = "Interval";
						tableCell.appendChild(intervalLable);

					}
					{
						const tableCell = document.createElement("td");
						tableRow.appendChild(tableCell);

						const intervalInput = document.createElement("input");
						intervalInput.type = "input";
						intervalInput.style.width = `${inputWidth}px`
						intervalInput.style.height = `${inputHeight}px`
						intervalInput.id = "scheduleViewer-SettingsMenu-realLineInputInterval";
						intervalInput.title = this.addingLinesPrm.inputtitle;
						intervalInput.placeholder = this.addingLinesPrm.inputplaceholder;
						intervalInput.style.border = `${this.addingLinesPrm.inputsBorder}`
						intervalInput.style.borderRadius = `${inputRadius}px`
						intervalInput.style.backgroundColor = `${this.addingLinesPrm.inputsBackground}`
						tableCell.appendChild(intervalInput);
						lineInputs.interval = intervalInput;
					}
				}

				{
					const tableRow = document.createElement("tr");
					linesMenuTable.appendChild(tableRow);

					{
						const tableCell = document.createElement("td");
						tableCell.style.textAlign = "right";
						tableCell.style.paddingRight = `${leftRowPadingRight}px`;
						tableRow.appendChild(tableCell);

						const endLable = document.createElement("label");
						// endLable.style.height = "max-content";
						// endLable.style.marginRight = "3px";
						endLable.style.fontSize = "16px";
						endLable.htmlFor = "scheduleViewer-SettingsMenu-realLineInputEndh"
						endLable.innerText = "End:";
						tableCell.appendChild(endLable);

					}
					{
						const tableCell = document.createElement("td");
						tableRow.appendChild(tableCell);

						const endInput = document.createElement("input");
						endInput.type = "input";
						endInput.style.width = `${inputWidth}px`
						endInput.style.height = `${inputHeight}px`
						endInput.id = "scheduleViewer-SettingsMenu-realLineInputEndh";
						endInput.title = this.addingLinesPrm.inputtitle;
						endInput.placeholder = this.addingLinesPrm.inputplaceholder;
						endInput.style.border = `${this.addingLinesPrm.inputsBorder}`
						endInput.style.borderRadius = `${inputRadius}px`
						endInput.style.backgroundColor = `${this.addingLinesPrm.inputsBackground}`
						tableCell.appendChild(endInput);
						lineInputs.end = endInput;
					}
				}

				{
					const tableRow = document.createElement("tr");
					linesMenuTable.appendChild(tableRow);

					{
						const tableCell = document.createElement("td");
						tableCell.style.textAlign = "right";
						tableCell.style.paddingRight = `${leftRowPadingRight}px`;
						tableRow.appendChild(tableCell);

						const endLable = document.createElement("label");
						// endLable.style.height = "max-content";
						// endLable.style.marginRight = "3px";
						endLable.style.fontSize = "16px";
						endLable.htmlFor = "scheduleViewer-SettingsMenu-realLineInputEndh"
						endLable.innerText = "Color:";
						tableCell.appendChild(endLable);

					}
					{
						const tableCell = document.createElement("td");
						tableRow.appendChild(tableCell);

						const colorDiv = document.createElement("div");
						colorDiv.style.display = "inline-block"
						colorDiv.style.width = "50px";
						colorDiv.style.height = "70%";
						colorDiv.style.backgroundColor = "lightgreen";
						colorDiv.style.border = "1px solid gray";
						tableCell.appendChild(colorDiv);
						lineInputs.colorDiv = colorDiv;

						const checkBox = document.createElement("input");
						checkBox.type = "checkBox";
						checkBox.checked = true;
						checkBox.id = "scheduleViewer-SettingsMenu-colorAuto";
						tableCell.appendChild(checkBox);
						lineInputs.checkBoxColor = checkBox;

						const radioLable = document.createElement("label");
						radioLable.style.height = "max-content";
						radioLable.style.fontSize = "16px";
						radioLable.htmlFor = "scheduleViewer-SettingsMenu-colorAuto"
						radioLable.innerText = "auto";
						tableCell.appendChild(radioLable);
					}
				}

				// {
				//     const tableRow = document.createElement("tr");
				//     linesMenuTable.appendChild(tableRow);

				//     {
				//         const tableCell = document.createElement("td");
				//         tableRow.appendChild(tableCell);
				//     }
				// }
			}

			this.hintForLinesInputs = document.createElement("div");
			this.hintForLinesInputs.style.height = "25px";
			this.hintForLinesInputs.style.width = "100%";
			this.hintForLinesInputs.style.fontSize = "14px"
			this.hintForLinesInputs.style.textAlign = "center";
			this.hintForLinesInputs.innerText = this.addingLinesPrm.inputtitle;
			this.addingLinesDIV.appendChild(this.hintForLinesInputs);

			const createButton = (text: string, parent: HTMLElement) =>
			{
				const button = document.createElement("button");
				button.innerText = text;
				parent.appendChild(button);
				return button;
			}

			{
				const buttonsDIV = document.createElement("div");
				buttonsDIV.style.height = "25px";
				buttonsDIV.style.width = "100%";
				buttonsDIV.style.display = "flex";
				buttonsDIV.style.justifyContent = "space-evenly";
				buttonsDIV.style.alignItems = "center";
				buttonsDIV.style.flexWrap = "wrap"
				this.addingLinesDIV.appendChild(buttonsDIV);

				lineInputs.buttonRemove = createButton("remove", buttonsDIV);
				lineInputs.buttonChange = createButton("change", buttonsDIV);
				lineInputs.buttonCancel = createButton("clear", buttonsDIV);
				lineInputs.buttonAdd = createButton("add", buttonsDIV);
			}

			this.addingLinesDIV.appendChild( function ()
			{

				const div = document.createElement("div");
				div.style.height = "2px";
				div.style.width = "100%";
				div.style.display = "flex";
				div.style.marginBottom = "5px";
				div.style.marginTop = "12px";
				div.style.justifyContent = "center";

				const div2 = document.createElement("div");
				div2.style.height = "2px";
				div2.style.width = "90%";
				div2.style.borderRadius = "4px";
				div2.style.backgroundColor = "hsl(195, 53%, 60%)";
				div.appendChild(div2);

				return div;
			}());

			{
				const buttonsDIV = document.createElement("div");
				buttonsDIV.style.height = "25px";
				buttonsDIV.style.width = "100%";
				buttonsDIV.style.display = "flex";
				buttonsDIV.style.justifyContent = "space-evenly";
				buttonsDIV.style.alignItems = "center";
				buttonsDIV.style.flexWrap = "wrap"
				this.addingLinesDIV.appendChild(buttonsDIV);

				lineInputs.buttonRemoveAll = createButton("remove All", buttonsDIV);
				lineInputs.buttonResetZoom = createButton("reset zoom", buttonsDIV);
				lineInputs.buttonExample = createButton("example", buttonsDIV);

				const link = document.createElement("a");
				link.href = "https://github.com/MixelTe/schedule-Viewer#readme";
				link.innerText = "Help";
				link.target = "_blank";
				buttonsDIV.appendChild(link);
			}
		}

		{
			this.loadFilesDIV.style.height = `${this.loadFilesPrm.height}px`
			this.loadFilesDIV.style.display = "flex";
			this.loadFilesDIV.style.justifyContent = "space-around";
			this.loadFilesDIV.style.alignItems = "center";
			this.loadFilesDIV.style.flexDirection = "column";
			this.body.appendChild(this.loadFilesDIV);

			const title = document.createElement("div");
			title.style.height = "max-content";
			title.style.width = "max-content";
			title.innerText = "Load schedule"
			title.style.fontSize = "20px";
			this.loadFilesDIV.appendChild(title);

			this.filesInput = document.createElement("input");
			this.filesInput.type = "file";
			this.filesInput.accept = ".json";
			this.loadFilesDIV.appendChild(this.filesInput);

			const text = document.createElement("div");
			text.style.height = "max-content";
			text.style.width = "max-content";
			text.innerText = "or drag'n'drop file"
			text.style.fontSize = "18px";
			this.loadFilesDIV.appendChild(text);
		}

		{
			this.saveFileDIV.style.height = `${this.saveFilesPrm.height}px`
			this.saveFileDIV.style.display = "flex";
			this.saveFileDIV.style.justifyContent = "space-around";
			this.saveFileDIV.style.alignItems = "center";
			this.saveFileDIV.style.flexDirection = "column";
			this.saveFileDIV.style.marginTop = "20px"
			this.body.appendChild(this.saveFileDIV);

			const title = document.createElement("div");
			title.style.height = "max-content";
			title.style.width = "max-content";
			title.innerText = "Save schedule"
			title.style.fontSize = "20px";
			this.saveFileDIV.appendChild(title);

			this.saveFileButton = document.createElement("button");
			this.saveFileButton.innerText = "Save";
			this.saveFileDIV.appendChild(this.saveFileButton);
		}

		{
			this.overDivPrm.minusWidth = width;
			this.overDivPrm.width = 260;
			this.overDivPrm.height = 100;
			this.overDiv.style.position = "absolute";
			this.overDiv.style.top = "0px";
			this.overDiv.style.left = "0px";
			this.overDiv.style.display = "flex";
			this.overDiv.style.justifyContent = "center";
			this.overDiv.style.alignItems = "center";
			this.overDiv.style.height = "100%";
			this.overDiv.style.width = "100%";
			this.overDiv.style.visibility = "hidden";
			this.overDiv.style.backgroundColor = "transparent";
			this.overDiv.style.transition = "background-Color 250ms ease-in-out"
			this.body.appendChild(this.overDiv);

			this.overDivText.innerText = "Drop file here";
			this.overDivText.style.position = "relative";
			this.overDivText.style.fontSize = "40px"
			this.overDivText.classList.add("scheduleViewer_SVGoverText");
			this.overDiv.appendChild(this.overDivText);
		}


		this.lineInputs = {
			color: "hsl(120, 73%, 75%)",
			radioOnce: lineInputs.radioOnce,
			radioRepeating: lineInputs.radioRepeating,
			freqenceRow: lineInputs.freqenceRow,
			interval: lineInputs.interval,
			duration: lineInputs.duration,
			start: lineInputs.start,
			end: lineInputs.end,
			buttonAdd: lineInputs.buttonAdd,
			buttonChange: lineInputs.buttonChange,
			buttonRemove: lineInputs.buttonRemove,
			buttonCancel: lineInputs.buttonCancel,
			buttonRemoveAll: lineInputs.buttonRemoveAll,
			buttonResetZoom: lineInputs.buttonResetZoom,
			buttonExample: lineInputs.buttonExample,
			checkBoxColor: lineInputs.checkBoxColor,
			colorDiv: lineInputs.colorDiv,
		}

		this.toggleMenuEl.addEventListener("click", () => this.toggleMenu());
		this.toggleSepLineEl.addEventListener("change", () => { functions.toggleSepLine(); this.toggleSepLineEl.checked = functions.SepLineIsActive(); });
		this.revTimeInputEl.addEventListener("change", () => { this.toggleLineMenuRev(); this.revTimeInputEl.checked = this.revTimeInput; });
		this.colorizeLineSelectionEl.addEventListener("change", () => { functions.toggleCustomSelectionColor(); this.colorizeLineSelectionEl.checked = functions.CustomSelectionColorIsActive(); });
		this.compactLinePlacingEl.addEventListener("change",  () => { this.toggleCompactLinePlacing(functions); this.compactLinePlacingEl.checked = functions.compactLinePlacingIsActive(); });

		this.lineInputs.buttonAdd.addEventListener("click", (e) => this.lineMenuButtons(e, "add", functions));
		this.lineInputs.buttonChange.addEventListener("click", (e) => this.lineMenuButtons(e, "change", functions));
		this.lineInputs.buttonRemove.addEventListener("click", (e) => this.lineMenuButtons(e, "remove", functions));
		this.lineInputs.buttonCancel.addEventListener("click", (e) => this.lineMenuButtons(e, "cancel", functions));
		this.lineInputs.radioOnce.addEventListener("click", () => this.disableInputs("once"));
		this.lineInputs.radioRepeating.addEventListener("click", () => this.disableInputs("repeating"));
		this.lineInputs.colorDiv.addEventListener("click", () => this.colorInputing("open"));
		this.lineInputs.checkBoxColor.addEventListener("change", () => this.colorInputing("toggleAuto"));

		this.lineInputs.buttonRemoveAll.addEventListener("click", (e) => this.lineMenuButtons(e, "removeAll", functions));
		this.lineInputs.buttonExample.addEventListener("click", (e) => this.lineMenuButtons(e, "example", functions));
		this.lineInputs.buttonResetZoom.addEventListener("click", (e) => this.lineMenuButtons(e, "resetZoom", functions));

		this.filesInput.addEventListener("change", (e) => this.loadSchedule(e, functions))
		this.saveFileButton.addEventListener("click", () => this.saveSchedule(functions));

		this.overDiv.addEventListener("drop", (e) => this.dragDrop(e, functions));
		this.overDiv.addEventListener("dragleave", () => this.dragleave());

		this.menuSystem("noSelect");

		this.lineInputs.radioOnce.checked = true;
		this.disableInputs("once");
		this.colorInputing("toggleAuto");

		this.setOptions(options);
	}
	private setOptions(options?: ScheduleOptions)
	{
		if (options?.openControlPanel != undefined && !options.openControlPanel) this.toggleMenu();
		if (options?.revTimeInput != undefined && typeof options.revTimeInput == "boolean")
		{
			this.revTimeInput = !options.revTimeInput;
			this.toggleLineMenuRev();
			this.revTimeInputEl.checked = this.revTimeInput;
		}
	}
	public getOptions()
	{
		return { openControlPanel: this.menuOpen, revTimeInput: this.revTimeInput };
	}

	private toggleMenu()
	{
		if (this.menuOpen)
		{
			this.body.style.width = `${0}px`;
			this.body.style.minWidth = `${0}px`;
			this.titleDIV.style.visibility = "hidden";
			this.settingsDIV.style.visibility = "hidden";
			this.addingLinesDIV.style.visibility = "hidden";
			this.loadFilesDIV.style.visibility = "hidden";
			this.saveFileDIV.style.visibility = "hidden";
			this.menuOpen = false;
		}
		else
		{
			this.body.style.width = `${this.menuWidth}px`;
			this.body.style.minWidth = `${this.menuWidth}px`;
			this.titleDIV.style.visibility = "visible";
			this.settingsDIV.style.visibility = "visible";
			this.addingLinesDIV.style.visibility = "visible";
			this.loadFilesDIV.style.visibility = "visible";
			this.saveFileDIV.style.visibility = "visible";
			this.menuOpen = true;
		}
	}
	private toggleCompactLinePlacing(functions: FunctionsForMenu)
	{
		functions.togglecompactLinePlacing();
		functions.recreate();
	}
	private toggleLineMenuRev()
	{
		this.revTimeInput = !this.revTimeInput;
		if (this.revTimeInput)
		{
			const placeholder = "mm:ss";
			const title = "time in format: ss or mm:ss or hh:mm:ss";
			this.lineInputs.interval.placeholder = placeholder;
			this.lineInputs.interval.title = title;
			this.lineInputs.duration.placeholder = placeholder;
			this.lineInputs.duration.title = title;
			this.lineInputs.start.placeholder = placeholder;
			this.lineInputs.start.title = title;
			this.lineInputs.end.placeholder = placeholder;
			this.lineInputs.end.title = title;

			this.hintForLinesInputs.innerText = "time in format: ss or mm:ss or hh:mm:ss";
		}
		else
		{
			this.lineInputs.interval.placeholder = this.addingLinesPrm.inputplaceholder;
			this.lineInputs.interval.title = this.addingLinesPrm.inputtitle;
			this.lineInputs.duration.placeholder = this.addingLinesPrm.inputplaceholder;
			this.lineInputs.duration.title = this.addingLinesPrm.inputtitle;
			this.lineInputs.start.placeholder = this.addingLinesPrm.inputplaceholder;
			this.lineInputs.start.title = this.addingLinesPrm.inputtitle;
			this.lineInputs.end.placeholder = this.addingLinesPrm.inputplaceholder;
			this.lineInputs.end.title = this.addingLinesPrm.inputtitle;

			this.hintForLinesInputs.innerText = this.addingLinesPrm.inputtitle;
		}
	}

	private addLine(functions: FunctionsForMenu)
	{
		let lineData;
		try
		{
			lineData = this.getLineData();
		} catch (e)
		{
			if (e == "MyError") return;
			else throw e;
		}

		// console.log("Yee!!!");
		const lineName = `Line ${this.lineCount += 1}`;
		if (lineData.interval != undefined && lineData.end != undefined && lineData.duration != undefined)
		{
			if (typeof lineData.duration == "object")
			{
				functions.addRealLine(lineData.interval, lineData.duration, lineData.start, lineData.end, lineName, this.lineInputs.color, this.lineInputs.checkBoxColor.checked);
			}
			else
			{
				functions.addSympleLine(lineData.interval, lineData.duration, lineData.start, lineData.end, lineName, this.lineInputs.color, this.lineInputs.checkBoxColor.checked);
			}
		}
		else
		{
			if (lineData.duration == undefined) throw new Error();
			if (typeof lineData.duration == "object")  throw new Error();
			functions.addSympleLine(1, lineData.duration, lineData.start, 0, lineName, this.lineInputs.color, this.lineInputs.checkBoxColor.checked);
		}
		functions.recreate();
	}
	private getLineData()
	{
		this.UnmarkAndClear(this.lineInputs.start);
		if (!this.lineToChange?.real) this.UnmarkAndClear(this.lineInputs.duration);
		if (this.lineInputs.radioRepeating.checked)
		{
			this.UnmarkAndClear(this.lineInputs.interval);
			this.UnmarkAndClear(this.lineInputs.end);
		}

		let lineData = this.createLineData();

		this.UnmarkAndClear(this.lineInputs.start);
		if (!this.lineToChange?.real) this.UnmarkAndClear(this.lineInputs.duration);
		if (this.lineInputs.radioRepeating.checked)
		{
			this.UnmarkAndClear(this.lineInputs.interval);
			this.UnmarkAndClear(this.lineInputs.end);
		}

		return lineData;
	}
	private createLineData()
	{
		let interval;
		let duration;
		let start;
		let end;

		let isError = false;
		try
		{
			start = this.getSecondsFromString(this.lineInputs.start, true);
		}
		catch (e) { if (e == "MyError") isError = true; else throw e };
		if (!this.lineToChange?.real)
		{
			try
			{
				duration = this.getSecondsFromString(this.lineInputs.duration);
			}
			catch (e) { if (e == "MyError") isError = true; else throw e };
		}
		else if (this.lineToChange != undefined)
		{
			duration = this.lineInputs.duration.value.split(",").map(el =>
			{
				const num = Number(el);
				if (Number.isNaN(num)) throw new Error("NaN");
				return num;
			});
		}

		if (this.lineInputs.radioRepeating.checked)
		{
			try
			{
				interval = this.getSecondsFromString(this.lineInputs.interval);
			}
			catch (e) { if (e == "MyError") isError = true; else throw e };
			try
			{
				end = this.getSecondsFromString(this.lineInputs.end);
			}
			catch (e) { if (e == "MyError") isError = true; else throw e };
		}
		if (isError) throw "MyError";

		if (typeof start != "number") throw new Error("NaN");
		if (!this.lineToChange?.real && typeof duration != "number") throw new Error("NaN");
		if (this.lineInputs.radioRepeating.checked)
		{
			if (typeof interval != "number") throw new Error("NaN");
			if (typeof end != "number") throw new Error("NaN");
		}

		return {
			interval: interval,
			duration: duration,
			start: start,
			end: end,
		};
	}
	private getSecondsFromString(field: HTMLInputElement, allowZero = false)
	{
		let seconds;
		try { seconds = this.turnStringToSeconds(field.value); }
		catch (e) { this.markAsUncorrect(field); throw "MyError"; };
		if (!this.checkNumber(seconds, allowZero)) { this.markAsUncorrect(field); throw "MyError"; };
		this.markAsCorrect(field);
		return seconds;
	}
	private turnStringToSeconds(string: string)
	{
		const array = string.split(":");
		if (this.revTimeInput)
		{
			if (array[0] == undefined || array[0] == "") throw new Error();
			let h = 0;
			let m = 0;
			let s = 0;
			if (array.length == 1)
			{
				s = parseInt(array[0], 10);
				if (!this.isNumber(s)) throw new Error();
			}
			else if (array.length == 2)
			{
				m = parseInt(array[0], 10);
				if (!this.isNumber(m)) throw new Error();
				s = parseInt(array[1], 10);
				if (!this.isNumber(s)) throw new Error();
			}
			else if (array.length == 3)
			{
				h = parseInt(array[0], 10);
				if (!this.isNumber(h)) throw new Error();
				m = parseInt(array[1], 10);
				if (!this.isNumber(m)) throw new Error();
				s = parseInt(array[2], 10);
				if (!this.isNumber(s)) throw new Error();
			}
			else
			{

			}
			const allTime = h * 60 * 60 + m * 60 + s;
			// console.log(allTime);
			return allTime;
		}
		else
		{
			const strH = array[0];
			const strM = array[1];
			const strS = array[2];
			if (strH == undefined || strH == "") throw new Error();
			const h = parseInt(strH, 10);
			const m = parseInt(strM, 10);
			const s = parseInt(strS, 10);
			if (!this.isNumber(h)) throw new Error();
			let allTime = h * 60 * 60;
			if (strM != undefined)
			{
				if (!this.isNumber(m)) throw new Error();
				allTime += m * 60;
			}
			if (strS != undefined)
			{
				if (!this.isNumber(s)) throw new Error();
				allTime += s;
			}
			// console.log(allTime);
			return allTime;
		}
	}
	private checkNumber(num: number, allowZero: boolean)
	{
		if (allowZero)
		{
			return (0 <= num && num <= 60 * 60 * 24);
		}
		else
		{
			return (0 < num && num <= 60 * 60 * 24);
		}
	}
	private isNumber(num: any)
	{
		if (typeof num == "number" && (num / num == 1 || num == 0)) return true;
		return false;
	}
	private markAsUncorrect(el: HTMLInputElement)
	{
		el.style.border = "1px solid red";
		el.style.backgroundColor = "rgb(255, 180, 180)";
	}
	private markAsCorrect(el: HTMLInputElement)
	{
		el.style.border = "1px solid green";
		el.style.backgroundColor = "lightgreen";
	}
	private UnmarkAndClear(el: HTMLInputElement)
	{
		el.style.border = `${this.addingLinesPrm.inputsBorder}`;
		el.style.backgroundColor = this.addingLinesPrm.inputsBackground;
		// el.value = "";
	}

	private async lineMenuButtons(e: MouseEvent, button: "change" | "remove" | "add" | "cancel" | "removeAll" | "example" | "resetZoom", functions: FunctionsForMenu)
	{
		const x = e.pageX;
		const y = e.pageY;
		switch (button)
		{
			case "add":
				this.addLine(functions);
				this.linesIsChanged();
				break;

			case "change":
				if (this.lineToChange == undefined) throw new Error();
				let lineData;
				try
				{
					lineData = this.getLineData();
				} catch (e)
				{
					if (e == "MyError") return;
					else throw e;
				}
				if (lineData.interval == undefined) lineData.interval = 1;
				if (lineData.end == undefined) lineData.end = 0;
				if (lineData.duration == undefined)
				{
					if (this.lineToChange.real) lineData.duration = 0;
					else throw new Error();
				}
				const newData = {
					interval: lineData.interval,
					duration: lineData.duration,
					start: lineData.start,
					end: lineData.end,
					color: this.lineInputs.color,
					autoColor: this.lineInputs.checkBoxColor.checked,
					real: this.lineToChange.real
				}
				functions.changeLine(newData, this.lineToChange);
				functions.recreate();
				this.linesIsChanged();
				break;

			case "remove":
				if (await new AskWindow(this.body, "remove line").getAnswer())
				{
					if (this.lineToChange == undefined) throw new Error();
					functions.removeLine(this.lineToChange)
					functions.recreate();
					this.lineMenuButtons(e, "cancel", functions);
					this.linesIsChanged();
				}
				break;

			case "cancel":
				this.lineInputs.start.value = "";
				this.lineInputs.duration.value = "";
				this.lineInputs.interval.value = "";
				this.lineInputs.end.value = "";
				this.menuSystem("noSelect");

				this.lineInputs.radioOnce.checked = true;
				this.disableInputs("once");

				this.lineInputs.checkBoxColor.checked = true;
				this.colorInputing("toggleAuto");
				if (this.lineToChange != undefined) functions.unselectLine(this.lineToChange);
				functions.recreate();
				this.lineToChange = undefined;
				break;

			case "removeAll":
				{
					let continueChange = false;
					if (this.linesChanged) continueChange = await new AskWindow(this.body, "remove all and show example").getAnswer();
					else continueChange = true;
					if (continueChange)
					{
						functions.resetLines();
						functions.recreate();
						this.linesChanged = false;
						this.lineMenuButtons(e, "cancel", functions);
					}
				}
				break;

			case "example":
				{
					let continueChange = false;
					if (this.linesChanged) continueChange = await new AskWindow(this.body, "remove all and show example").getAnswer();
					else continueChange = true;
					if (continueChange)
					{
						functions.resetLines();
						for (let i = 1; i <= 4; i++)
						{
							let lineName = `Line ${i*2 - 1}`;
							functions.addSympleLine(this.getRndInteger(1000, 2000), this.getRndInteger(1000, 9000), this.getRndInteger(0, 10000), this.getRndInteger(50000, 80000), lineName);
							// functions.addSympleLine(this.getRndInteger(40, 80), this.getRndInteger(10, 90), this.getRndInteger(0, 10000), this.getRndInteger(50000, 80000));

							lineName = `Line ${i*2}`;
							const duractions = []
							for (let i = 0; i < this.getRndInteger(600, 900); i++)
							{
								duractions.push(this.getRndInteger(40, 160));
							}
							functions.addRealLine(60, duractions, this.getRndInteger(0, 10000), this.getRndInteger(50000, 80000), lineName);
						}
						functions.recreate();
						this.linesChanged = false;
						this.lineMenuButtons(e, "cancel", functions);
					}
				}
				break;

			case "resetZoom":
				functions.resetZoom();
				functions.recreate();
				break;

			default: throw new Error();
		}
	}
	public linesIsChanged()
	{
		this.linesChanged = true;
		this.filesInput.value = "";
	}
	private getRndInteger(min: number, max: number)
	{
		return Math.floor(Math.random() * (max - min) + min);
	}
	private async colorInputing(action: "toggleAuto" | "open")
	{
		switch (action)
		{
			case "open":
				if (!this.lineInputs.checkBoxColor.checked)
				{
					const rect = this.lineInputs.colorDiv.getBoundingClientRect();
					rect.x += window.pageXOffset;
					rect.y += window.pageYOffset;
					const color = this.lineInputs.color;
					const h = parseInt(color.slice(color.indexOf("(") + 1, color.indexOf(",")));
					const s = parseInt(color.slice(color.indexOf(",") + 2, color.indexOf("%")));
					const l = parseInt(color.slice(color.lastIndexOf(",") + 2, color.lastIndexOf("%")));
					this.colorPicker.setColorHSL(h, s, l);
					const newColor = await this.colorPicker.pick(rect, "up", "center");
					if (newColor != undefined) this.lineInputs.color = newColor.colorHSL;
					this.lineInputs.colorDiv.style.backgroundColor = this.lineInputs.color;
				}
				break;

			case "toggleAuto":
				if (this.lineInputs.checkBoxColor.checked)
				{
					this.lineInputs.colorDiv.style.backgroundImage = "linear-gradient(to right, red, violet, blue, lime, yellow, red)";
				}
				else
				{
					this.lineInputs.colorDiv.style.backgroundImage = "";
					this.lineInputs.colorDiv.style.backgroundColor = this.lineInputs.color;
				}
				break;

			default: throw new Error();
		}

	}

	private menuSystem(state: "noSelect" | "selected" | "realSelected")
	{
		this.lineInputs.freqenceRow.style.color = "black";
		this.lineInputs.radioRepeating.disabled = false;
		this.lineInputs.radioOnce.disabled = false;
		switch (state)
		{
			case "noSelect":
				// this.lineInputs.buttonAdd.disabled = false;
				this.lineInputs.buttonChange.disabled = true;
				this.lineInputs.buttonRemove.disabled = true;
				this.disableInputs("none");
				break;


			case "realSelected":
				this.lineInputs.freqenceRow.style.color = "gray";
				this.lineInputs.radioRepeating.disabled = true;
				this.lineInputs.radioOnce.disabled = true;

				this.lineInputs.radioRepeating.checked = true;
				this.disableInputs("duration");
			case "selected":
				// this.lineInputs.buttonAdd.disabled = true;
				this.lineInputs.buttonChange.disabled = false;
				this.lineInputs.buttonRemove.disabled = false;
				break;

			default: throw new Error();
		}
		this.lineInputs.start.style.backgroundColor = this.addingLinesPrm.inputsBackground;
		this.lineInputs.duration.style.backgroundColor = this.addingLinesPrm.inputsBackground;
		this.lineInputs.start.style.border = this.addingLinesPrm.inputsBorder;
		this.lineInputs.duration.style.border = this.addingLinesPrm.inputsBorder;
	}
	private disableInputs(type: "once" | "repeating" | "none" | "duration")
	{
		switch (type)
		{
			case "none":
				this.lineInputs.interval.disabled = false;
				this.lineInputs.end.disabled = false;
				this.lineInputs.duration.disabled = false;
				this.lineInputs.interval.style.backgroundColor = this.addingLinesPrm.inputsBackground;
				this.lineInputs.end.style.backgroundColor = this.addingLinesPrm.inputsBackground;
				this.lineInputs.duration.style.backgroundColor = this.addingLinesPrm.inputsBackground;
				break;

			case "once":
				this.lineInputs.interval.disabled = true;
				this.lineInputs.end.disabled = true;
				this.lineInputs.interval.style.backgroundColor = "lightgray";
				this.lineInputs.end.style.backgroundColor = "lightgray";
				break;

			case "repeating":
				this.lineInputs.interval.disabled = false;
				this.lineInputs.end.disabled = false;
				this.lineInputs.interval.style.backgroundColor = this.addingLinesPrm.inputsBackground;
				this.lineInputs.end.style.backgroundColor = this.addingLinesPrm.inputsBackground;
				break;

			case "duration":
				this.lineInputs.duration.disabled = true;
				this.lineInputs.duration.style.backgroundColor = "lightgray";
				break;

			default: throw new Error();
		}
		this.lineInputs.interval.style.border = this.addingLinesPrm.inputsBorder;
		this.lineInputs.end.style.border = this.addingLinesPrm.inputsBorder;
	}

	private async loadSchedule(e: Event, functions: FunctionsForMenu)
	{
		const eTarget = <HTMLInputElement>e.target;
		if (eTarget == null) return;
		const filesList = eTarget.files;
		if (filesList == null) return;
		const fileText = await filesList[0].text();
		this.addLinesFromFile(fileText, functions);
	}

	public dragleave()
	{
		this.overDiv.style.visibility = "hidden";
		this.overDivText.classList.remove("scheduleViewer_SVGoverTextShow");
		this.overDiv.style.backgroundColor = "transparent";
	}
	public mainBodyDragover(e: DragEvent)
	{
		e.stopPropagation();
		e.preventDefault();
		this.overDiv.style.visibility = "visible";
		this.overDiv.style.backgroundColor = "rgba(0, 0, 0, 0.2)";
		this.overDivText.classList.add("scheduleViewer_SVGoverTextShow");
		const dragData = e.dataTransfer;
		if (dragData == null) return;
		dragData.dropEffect = 'copy';
	}

	public async dragDrop(e: DragEvent, functions: FunctionsForMenu)
	{
		e.stopPropagation();
		e.preventDefault();
		this.overDiv.style.visibility = "hidden";
		const dragData = e.dataTransfer;
		if (dragData == null) return;
		const filesList = dragData.files;
		if (filesList == null) return;
		if (filesList[0] == null) return;
		const fileText = await filesList[0].text();
		this.addLinesFromFile(fileText, functions);
	}
	private async addLinesFromFile(fileText: string, functions: FunctionsForMenu)
	{
		let newSchedule;
		try {
			newSchedule = <Schedule>JSON.parse(fileText);
		} catch (er)
		{
			this.filesInput.value = "";
			console.log("Uncorrect File");
			return;
		}
		// console.log(newSchedule);

		let continueChange = false;
		if (this.linesChanged) continueChange = await new AskWindow(this.body, "remove all and load file").getAnswer();
		else continueChange = true;
		if (!continueChange) return

		functions.resetLines();

		if (newSchedule.simpleLines != undefined)
		{
			for (let i = 0; i < newSchedule.simpleLines.length; i++)
			{
				const el = newSchedule.simpleLines[i];

				try
				{
					if (typeof el != "object")
					{
						const elJson = JSON.stringify(el, undefined, "   ");
						const re = new RegExp(elJson);
						let JSONdata = JSON.stringify(newSchedule.simpleLines, undefined, "   ").replace(/\n      /g, "").replace(re, "%c" + elJson + "%c");
						console.log("line not object \n" + JSONdata, "color: red", "");
						throw "MyError";
					}
					this.checkLineFromFile(el, true);
				} catch (er)
				{
					if (er == "MyError") continue
					else throw er;
				}

				functions.addSympleLine(el.interval, el.duration, el.start, el.end, el.color, el.autoColor);
			}
		}
		else console.log("simpleLines not found");
		if (newSchedule.realLines != undefined)
		{
			for (let i = 0; i < newSchedule.realLines.length; i++)
			{
				const el = newSchedule.realLines[i];

				try
				{
					if (typeof el != "object")
					{
						const elJson = JSON.stringify(el, undefined, "   ");
						const re = new RegExp(elJson);
						let JSONdata = JSON.stringify(newSchedule.realLines, undefined, "   ").replace(/\n      /g, "").replace(re, "%c" + elJson + "%c");
						console.log("line not object \n" + JSONdata, "color: red", "");
						throw "MyError";
					}
					this.checkLineFromFile(el, false);
				} catch (er)
				{
					if (er == "MyError") continue
					else throw er;
				}

				functions.addRealLine(el.interval, el.durations, el.start, el.end, el.color, el.autoColor);
			}
		}
		else console.log("realLines not found");

		functions.recreate();
	}
	private checkLineFromFile(el: {interval: any, duration?: any, durations?: any, start: any, end: any, autoColor: any, color: any}, simpleLine: boolean)
	{
		function createlog(text: string, wrongParametrName: "interval" | "duration" | "durations" | "start" | "end" | "autoColor" | "color" | undefined)
		{
			let JSONdata;
			if (wrongParametrName == undefined)
			{
				JSONdata = JSON.stringify(el, undefined, "   ").replace(/\n      /g, "");
			}
			else
			{
				const re = new RegExp(el[wrongParametrName]);
				JSONdata = JSON.stringify(el, undefined, "   ").replace(/\n      /g, "").replace(re, "%c" + el[wrongParametrName] + "%c");
			}
			console.log(text + "\n" + JSONdata, "color: red", "color: gray");
		}
		function createlogNotFound(text: string)
		{
			let JSONdata = JSON.stringify(el, undefined, "   ").replace(/\n      /g, "");
			console.log(text + "\n" + JSONdata, "color: red", "");
		}
		if (el.interval == undefined) { createlogNotFound("line %cinterval%c not found"); throw "MyError"; };
		if (simpleLine)
		{
			if (el.duration == undefined) { createlogNotFound("line %cduration%c not found"); throw "MyError"; };
		}
		else
		{
			if (el.durations == undefined) { createlogNotFound("line %cdurations%c not found"); throw "MyError"; };
		}
		if (el.start == undefined) { createlogNotFound("line %cstart%c not found"); throw "MyError"; };
		if (el.end == undefined) { createlogNotFound("line %cend%c not found"); throw "MyError"; };
		if (el.autoColor == undefined) { createlogNotFound("line %cautoColor%c not found"); throw "MyError"; };

		if (typeof el.interval != "number") { createlog("line interval is NaN", "interval"); throw "MyError"; };
		if (simpleLine)
		{
			if (typeof el.duration != "number") { createlog("line duration is NaN", "duration"); throw "MyError"; };
		}
		else
		{
			if (!Array.isArray(el.durations)) { createlog("line duration isn't array", "durations"); throw "MyError"; };
			let isError = false;
			el.durations = el.durations.map(el =>
			{
				if (typeof el != "number")
				{
					isError = true;
					return `%c${el}%c`;
				};
				return el;
			})
			if (isError)
			{
				createlog("line duration contains NaN", undefined);
				throw "MyError";
			}
		}
		if (typeof el.start != "number") { createlog("line start is NaN", "start"); throw "MyError"; };
		if (typeof el.end != "number") { createlog("line end is NaN", "end"); throw "MyError"; };
		if (typeof el.autoColor != "boolean") { createlog("line autoColor isn't boolean", "autoColor"); throw "MyError"; };
		if (!el.autoColor)
		{
			if (el.color == undefined) { createlogNotFound("line %ccolor%c not found"); throw "MyError"; };
			if (typeof el.color != "string") { createlog("line color isn't string", "color"); throw "MyError"; };
		}
	}


	public unSelectLine(functions: FunctionsForMenu, e: MouseEvent)
	{
		this.lineMenuButtons(e, "cancel", functions);
	}
	public setInputsData(line: LineF)
	{
		const data = {
			interval: line.dasharray[0],
			duration: line.dasharray[1],
			start: line.start,
			end: line.end,
			color: line.color,
			autoColor: line.autoColor,
			real: line.real,
		}
		this.lineInputs.start.value = this.turnSecondsToTime(data.start);
		if (typeof data.duration == "number") this.lineInputs.duration.value = this.turnSecondsToTime(data.duration);
		else this.lineInputs.duration.value = `${data.duration}`;
		this.lineInputs.interval.value = "";
		this.lineInputs.end.value = "";

		if (data.interval == 1 && data.end == 0)
		{
			this.disableInputs("once");
			this.lineInputs.radioOnce.checked = true;
			this.lineInputs.interval.value = this.turnSecondsToTime(1);
			this.lineInputs.end.value = this.turnSecondsToTime(0);
		}
		else
		{
			this.disableInputs("repeating");
			this.lineInputs.radioRepeating.checked = true;
			this.lineInputs.interval.value = this.turnSecondsToTime(data.interval);
			this.lineInputs.end.value = this.turnSecondsToTime(data.end);
		}
		if (data.real) this.menuSystem("realSelected");
		else this.menuSystem("selected");

		this.lineInputs.color = data.color;
		this.lineInputs.checkBoxColor.checked = data.autoColor;
		this.colorInputing("toggleAuto");

		this.lineToChange = line;
	}
	private turnSecondsToTime(secondsHMS: number)
	{
		const h = Math.floor(secondsHMS / 3600);
		const secondsMS = secondsHMS - h * 3600;
		const m = Math.floor(secondsMS / 60);
		const s = secondsMS - m * 60;

		return `${h}:${m}:${s}`;
	}


	private saveSchedule(functions: FunctionsForMenu)
	{
		const scheduleRaw = functions.getLines();
		const simpleLines = []
		const realLines = []
		for (let i = 1; i < scheduleRaw.length; i++)
		{
			const el = scheduleRaw[i];
			if (el.real)
			{
				if (typeof el.dasharray[1] == "number") throw new Error()
				const newEl = {
					interval: el.dasharray[0],
					durations: el.dasharray[1],
					start: el.start,
					end: el.end,
					color: el.color,
					autoColor: el.autoColor,
				};
				realLines.push(newEl);
			}
			else
			{
				if (typeof el.dasharray[1] != "number") throw new Error()
				const newEl = {
					interval: el.dasharray[0],
					duration: el.dasharray[1],
					start: el.start,
					end: el.end,
					color: el.color,
					autoColor: el.autoColor,
				};
				simpleLines.push(newEl);
			}
		}
		const scheduleSave = <Schedule>{ simpleLines, realLines };
		const scheduleText = JSON.stringify(scheduleSave, undefined, "  ");
		// console.log(scheduleRaw);
		// console.log(scheduleSave);
		const scheduleTextSimplify = scheduleText.replace(/\n        /g, "");
		const codeArea = document.getElementById("codeArea");
		if (codeArea != null) codeArea.innerText = scheduleTextSimplify;

		this.downloadFile("schedule.json", scheduleTextSimplify);
	}

	private downloadFile(filename: string, text: string)
	{
		var el = document.createElement('a');
		el.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
		el.setAttribute('download', filename);

		el.style.display = 'none';
		document.body.appendChild(el);

		el.click();

		document.body.removeChild(el);
	}
}