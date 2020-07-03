import { Grafic } from "./objects/grafic.js";
import { SettingsMenu } from "./objects/settingsMenu.js";
export class scheduleViewer {
    constructor(body, options) {
        this.graficBody = document.createElement("div");
        this.settingsMenuBody = document.createElement("div");
        this.body = body;
        this.body.style.position = "relative";
        this.body.style.overflow = "hidden";
        this.body.style.display = "flex";
        this.body.style.userSelect = "none";
        let newOptions = undefined;
        if (options != undefined) {
            if (typeof options == "string") {
                try {
                    newOptions = JSON.parse(options);
                }
                catch (er) {
                    console.error("uncorect options string");
                }
            }
            else {
                newOptions = options;
            }
        }
        {
            const settingsMenuWidth = 310;
            this.body.appendChild(this.graficBody);
            this.grafic = new Grafic(this.graficBody, settingsMenuWidth, newOptions);
            this.body.appendChild(this.settingsMenuBody);
            this.settingsMenu = new SettingsMenu(this.settingsMenuBody, settingsMenuWidth, this.grafic.getFunctions(), newOptions);
            this.grafic.setFunctionsForLines({ selectLine: this.settingsMenu.setInputsData.bind(this.settingsMenu) });
        }
        this.body.addEventListener("dragover", (e) => this.settingsMenu.mainBodyDragover.bind(this.settingsMenu)(e));
    }
    getOptionsString() {
        const settingsMenuOptions = this.settingsMenu.getOptions();
        const graficOptions = this.grafic.getOptions();
        const options = {
            openControlPanel: settingsMenuOptions.openControlPanel,
            revTimeInput: settingsMenuOptions.revTimeInput,
            showRealLineAfterEnd: graficOptions.showRealLineAfterEnd,
            compactLinePlacing: graficOptions.compactLinePlacing,
            selectionCustomColor: graficOptions.selectionCustomColor,
            showSeparateLine: graficOptions.showSeparateLine,
        };
        return JSON.stringify(options);
    }
    setLinesFromString(linesString) {
        let newLinesRaw;
        try {
            newLinesRaw = JSON.parse(linesString);
        }
        catch (er) {
            console.error("uncorect lines string");
            return;
        }
        const newLines = [];
        for (let i in newLinesRaw) {
            newLines.push(newLinesRaw[i]);
        }
        if (newLines.length > 1) {
            this.grafic.setLines(newLines);
            this.settingsMenu.linesIsChanged();
        }
    }
    getLinesString() {
        return JSON.stringify(Object.assign({}, this.grafic.getLines()));
    }
}
