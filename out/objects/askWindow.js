import { DialogWindow } from "./dialogWindow.js";
export class AskWindow extends DialogWindow {
    constructor(parent, text, darkTheme) {
        super(parent, "max-content", "120px", "150px", "120px");
        this.answer = false;
        this.createButtonCell = (text, answer) => {
            const cell = document.createElement("td");
            const button = document.createElement("button");
            button.innerText = text;
            button.addEventListener("click", () => {
                this.answer = answer;
                this.returnAnswer();
                this.close();
            });
            cell.appendChild(button);
            return cell;
        };
        if (darkTheme)
            this.setDarkTheme();
        const rowStyle = [{ property: "text-align", value: "center" }];
        const rowStyleColorize = rowStyle.slice(0, rowStyle.length);
        rowStyleColorize.push({ property: "background-color", value: "#ffc823" }, { property: "color", value: "black" });
        this.table.appendChild(this.createRow(rowStyle, [
            this.createCell(2, "Your action:", [], [])
        ]));
        this.table.appendChild(this.createRow(rowStyleColorize, [
            this.createCell(2, text, [], [])
        ]));
        this.table.appendChild(this.createRow(rowStyle, [
            this.createCell(2, "Are you sure?", [], [])
        ]));
        this.table.appendChild(this.createRow(rowStyle, [
            this.createButtonCell.bind(this)("Yes", true),
            this.createButtonCell.bind(this)("No", false),
        ]));
    }
    getAnswer() {
        return new Promise((resolve, reject) => {
            this.resolve = resolve;
        });
    }
}
