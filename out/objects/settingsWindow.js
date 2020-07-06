import { DialogWindow } from "./dialogWindow.js";
export class SettingsWindow extends DialogWindow {
    constructor(parent, data, darkTheme) {
        super(parent, "max-content", "max-content", "150px", "140px");
        this.answer = false;
        this.inputs = [];
        this.createButton = (text, answer) => {
            const button = document.createElement("button");
            button.innerText = text;
            button.style.marginLeft = "10px";
            button.addEventListener("click", () => {
                this.setAnswer(answer);
            });
            return button;
        };
        if (darkTheme)
            this.setDarkTheme();
        const titleStyle = [
            { property: "text-align", value: "center" },
            { property: "font-size", value: "20px" }
        ];
        const rowStyle = [];
        const cellStyle = [];
        const buttonCellStyle = [{ property: "text-align", value: "right" }];
        this.table.appendChild(this.createRow(titleStyle, [
            this.createCell(2, "All options", [], []),
        ]));
        this.table.appendChild(this.createRow(rowStyle, [
            this.createCell(1, "", cellStyle, this.createOption("show separate line", "scheduleViewer-SettingsWindow-showSeparateLine", false, 5)),
            this.createCell(1, "", cellStyle, this.createOption("compact line placing", "scheduleViewer-SettingsWindow-compactLinePlacing", false, 2)),
        ]));
        this.table.appendChild(this.createRow(rowStyle, [
            this.createCell(1, "", cellStyle, this.createOption("change time input order", "scheduleViewer-SettingsWindow-revTimeInput", false, 0)),
            this.createCell(1, "", cellStyle, this.createOption("line align top", "scheduleViewer-SettingsWindow-compactPlacingAlignIsTop", false, 3)),
        ]));
        this.table.appendChild(this.createRow(rowStyle, [
            this.createCell(1, "", cellStyle, this.createOption("custom selection color", "scheduleViewer-SettingsWindow-selectionCustomColor", false, 4)),
            this.createCell(1, "", cellStyle, this.createOption("show real line after ending", "scheduleViewer-SettingsWindow-showRealLineAfterEnd", false, 1)),
        ]));
        this.table.appendChild(this.createRow(rowStyle, [
            this.createCell(1, "", cellStyle, this.createOption("show Y axis", "scheduleViewer-SettingsWindow-showYAxis", false, 6)),
            this.createCell(1, "", cellStyle, this.createOption("move names to line begin", "scheduleViewer-SettingsWindow-lineNamesOnStart", false, 7)),
        ]));
        this.table.appendChild(this.createRow(rowStyle, [
            this.createCell(1, "", cellStyle, this.createOption("dark theme", "scheduleViewer-SettingsWindow-darkTheme", false, 8)),
        ]));
        this.table.appendChild(this.createRow(rowStyle, [
            this.createCell(1, "", cellStyle, []),
            this.createCell(1, "", buttonCellStyle, [
                this.createButton("cancel", false),
                this.createButton("confirm", true),
            ])
        ]));
        this.setCurrentOptions(data);
    }
    getAnswer() {
        return new Promise((resolve, reject) => {
            this.resolve = resolve;
        });
    }
    setAnswer(answer) {
        if (answer) {
            const data = {
                revTimeInput: this.inputs[0].checked,
                showRealLineAfterEnd: this.inputs[1].checked,
                compactLinePlacing: this.inputs[2].checked,
                compactPlacingAlignIsTop: this.inputs[3].checked,
                selectionCustomColor: this.inputs[4].checked,
                showSeparateLine: this.inputs[5].checked,
                showYAxis: this.inputs[6].checked,
                lineNamesOnStart: this.inputs[7].checked,
                darkTheme: this.inputs[8].checked,
            };
            this.answer = data;
        }
        else {
            this.answer = false;
        }
        this.returnAnswer();
        this.close();
    }
    setCurrentOptions(data) {
        this.inputs[0].checked = data.revTimeInput;
        this.inputs[1].checked = data.showRealLineAfterEnd;
        this.inputs[2].checked = data.compactLinePlacing;
        this.inputs[3].checked = data.compactPlacingAlignIsTop;
        this.inputs[4].checked = data.selectionCustomColor;
        this.inputs[5].checked = data.showSeparateLine;
        this.inputs[6].checked = data.showYAxis;
        this.inputs[7].checked = data.lineNamesOnStart;
        this.inputs[8].checked = data.darkTheme;
    }
    createOption(text, id, checked, index) {
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
}
