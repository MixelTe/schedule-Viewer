export class DialogWindow {
    constructor(parent, width, height, minWidth, minHeight) {
        this.body = document.createElement("div");
        this.tableDiv = document.createElement("div");
        this.table = document.createElement("table");
        this.answer = undefined;
        this.width = width;
        this.height = height;
        this.minWidth = minWidth;
        this.minHeight = minHeight;
        this.parent = parent;
        this.createDialog();
    }
    createDialog() {
        this.body.style.position = "absolute";
        this.body.style.top = "0px";
        this.body.style.left = "0px";
        this.body.style.display = "flex";
        this.body.style.justifyContent = "center";
        this.body.style.alignItems = "center";
        this.body.style.height = "100%";
        this.body.style.width = "100%";
        this.body.style.backgroundColor = "transparent";
        this.body.style.color = "black";
        this.body.style.transition = "background-Color 250ms ease-in-out";
        this.parent.appendChild(this.body);
        setTimeout(() => {
            this.body.style.backgroundColor = "rgba(0, 0, 0, 0.4)";
        }, 1);
        this.tableDiv.style.width = this.width;
        this.tableDiv.style.height = this.height;
        this.tableDiv.style.minWidth = this.minWidth;
        this.tableDiv.style.minHeight = this.minHeight;
        this.tableDiv.style.backgroundColor = "lightgreen";
        this.tableDiv.style.borderRadius = "12px";
        this.tableDiv.style.border = "3px solid black";
        this.body.appendChild(this.tableDiv);
        this.table.style.width = "100%";
        this.table.style.height = "100%";
        this.tableDiv.appendChild(this.table);
    }
    getAnswer() {
        return new Promise((resolve, reject) => {
            this.resolve = resolve;
        });
    }
    returnAnswer() {
        if (this.resolve != undefined) {
            this.resolve(this.answer);
            this.resolve = undefined;
        }
        else
            throw Error();
    }
    close() {
        this.parent.removeChild(this.body);
    }
    createRow(style, innerHtml) {
        const row = document.createElement("tr");
        style.forEach(el => {
            row.style.setProperty(el.property, el.value);
        });
        innerHtml.forEach(el => {
            row.appendChild(el);
        });
        return row;
    }
    createCell(colspan, text, style, innerHtml) {
        const cell = document.createElement("td");
        cell.setAttribute("colspan", `${colspan}`);
        cell.innerText = text;
        style.forEach(el => {
            cell.style.setProperty(el.property, el.value);
        });
        innerHtml.forEach(el => {
            cell.appendChild(el);
        });
        return cell;
    }
    setDarkTheme() {
        this.tableDiv.style.borderColor = "gray";
        this.tableDiv.style.backgroundColor = "black";
        this.tableDiv.style.color = "white";
    }
}
// class ExtendsDialogWindow extends DialogWindow
// {
// 	protected answer: boolean = false;
// 	protected resolve: ((value?: boolean | PromiseLike<boolean> | undefined) => void) | undefined;
// 	constructor(parent: HTMLElement)
// 	{
// 		super(parent, "max-content", "120px", "150px", "120px");
// 		const rowStyle = [{ property: "text-align", value: "center" }];
// 		this.table.appendChild(this.createRow(rowStyle, [
// 			this.createCell(2, "Some text", [], [])
// 		]));
// 	}
// 	public getAnswer()
// 	{
// 		return new Promise<boolean>((resolve, reject) =>
//         {
// 			this.resolve = resolve;
//         });
// 	}
// }
