export class AskWindow
{
	private body: HTMLDivElement
	private parent: HTMLElement
	private resolve: ((value?: boolean | PromiseLike<boolean> | undefined) => void) | undefined;
	private firstClick = true;

	constructor(parent: HTMLElement, text: string)
	{
		this.parent = parent;
		this.body = document.createElement("div");
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
		parent.appendChild(this.body);
		setTimeout(() => {
			this.body.style.backgroundColor = "rgba(0, 0, 0, 0.4)";
		}, 1);

		const tableDiv = document.createElement("div");
		tableDiv.style.width = "max-content";
		tableDiv.style.minWidth = "120px";
		tableDiv.style.height = "100px";
		tableDiv.style.backgroundColor = "lightgreen";
		tableDiv.style.borderRadius = "12px";
		tableDiv.style.border = "3px solid black";
		this.body.appendChild(tableDiv);


		const table = document.createElement("table");
		table.style.width = "100%";
		table.style.height = "100%";

		table.appendChild(createTextRow("Your action:"));
		table.appendChild(createTextRow(text, [{ property: "background-color", value: "#ffc823" }]));
		table.appendChild(createTextRow("Are you sure?"));

		const row = document.createElement("tr");
		row.style.textAlign = "center";

		const createButtonCell = (text: string, answer: boolean) =>
		{
			const cell = document.createElement("td");
			const button = document.createElement("button");
			button.innerText = text;
			button.addEventListener("click", () => this.userAnswer(answer));
			cell.appendChild(button);
			return cell;
		};
		row.appendChild(createButtonCell.bind(this)("Yes", true));
		row.appendChild(createButtonCell.bind(this)("No", false));

		table.appendChild(row);


		tableDiv.appendChild(table);
	}
	public getAnswer()
	{
		return new Promise<boolean>((resolve, reject) =>
        {
            this.resolve = resolve;
        });
	}
	private userAnswer(answer: boolean)
	{
		this.parent.removeChild(this.body);

		if (this.resolve != undefined)
		{
			this.resolve(answer);
			this.resolve = undefined;
		}
		else throw Error();
	}
}

function createTextRow (text: string, rowStyle?: { property: string, value: string }[])
{
	const row = document.createElement("tr");
	row.style.textAlign = "center";
	row.appendChild(function ()
	{
		const cell = document.createElement("td");
		cell.setAttribute("colspan", "2");
		cell.innerText = text;
		return cell;
	}());

	if (rowStyle != undefined)
	{
		rowStyle.forEach(el =>
		{
			row.style.setProperty(el.property, el.value);
		});
	}

	return row;
}