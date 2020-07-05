export class DialogWindow
{
	private body = document.createElement("div");
	private parent: HTMLElement;
	protected table = document.createElement("table");
	protected resolve: ((value?: any) => void) | undefined;
	protected answer: any = undefined;

	private width: string;
	private height: string;
	private minWidth: string;
	private minHeight: string;


	constructor(parent: HTMLElement, width: string, height: string, minWidth: string, minHeight: string)
	{
		this.width = width;
		this.height = height;
		this.minWidth = minWidth;
		this.minHeight = minHeight;
		this.parent = parent;
		this.createDialog();
	}
	private createDialog()
	{
		this.body.style.position = "absolute";
		this.body.style.top = "0px";
		this.body.style.left = "0px";
		this.body.style.display = "flex";
		this.body.style.justifyContent = "center";
		this.body.style.alignItems = "center";
		this.body.style.height = "100%";
		this.body.style.width = "100%";
		this.body.style.backgroundColor = "transparent";
		this.body.style.transition = "background-Color 250ms ease-in-out"
		this.parent.appendChild(this.body);
		setTimeout(() => {
			this.body.style.backgroundColor = "rgba(0, 0, 0, 0.4)";
		}, 1);

		const tableDiv = document.createElement("div");
		tableDiv.style.width = this.width;
		tableDiv.style.height = this.height;
		tableDiv.style.minWidth = this.minWidth;
		tableDiv.style.minHeight = this.minHeight;
		tableDiv.style.backgroundColor = "lightgreen";
		tableDiv.style.borderRadius = "12px";
		tableDiv.style.border = "3px solid black";
		this.body.appendChild(tableDiv);


		this.table.style.width = "100%";
		this.table.style.height = "100%";

		tableDiv.appendChild(this.table);
	}
	public getAnswer()
	{
		return new Promise((resolve, reject) =>
        {
            this.resolve = resolve;
        });
	}
	protected returnAnswer()
	{
		if (this.resolve != undefined)
		{
			this.resolve(this.answer);
			this.resolve = undefined;
		}
		else throw Error();
	}
	protected close()
	{
		this.parent.removeChild(this.body);
	}
	protected createRow(style: { property: string, value: string }[], innerHtml: HTMLElement[])
	{
		const row = document.createElement("tr");
		style.forEach(el =>
		{
			row.style.setProperty(el.property, el.value);
		});
		innerHtml.forEach(el => {
			row.appendChild(el);
		});
		return row;
	}
	protected createCell(colspan: number, text: string, style: { property: string, value: string }[], innerHtml: HTMLElement[])
	{
		const cell = document.createElement("td");
		cell.setAttribute("colspan", `${colspan}`);
		cell.innerText = text;
		style.forEach(el =>
		{
			cell.style.setProperty(el.property, el.value);
		});
		innerHtml.forEach(el =>
		{
			cell.appendChild(el);
		});
		return cell;
	}
}