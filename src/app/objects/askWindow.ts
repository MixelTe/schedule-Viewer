export class AskWindow
{
	private mainWindow: HTMLDivElement
	private resolve: ((value?: boolean | PromiseLike<boolean> | undefined) => void) | undefined;
	private firstClick = true;

	constructor(x: number, y: number, text: string)
	{
		this.mainWindow = document.createElement("div");
		this.mainWindow.style.position = "absolute";
		this.mainWindow.style.width = "max-content";
		this.mainWindow.style.minWidth = "120px";
		this.mainWindow.style.height = "100px";
		this.mainWindow.style.backgroundColor = "lightgreen";
		this.mainWindow.style.borderRadius = "12px";
		this.mainWindow.style.border = "3px solid black";
		document.body.appendChild(this.mainWindow);

		const windowBCR = this.mainWindow.getBoundingClientRect();
		y -= windowBCR.height;
		y = Math.max(y, 0);
		x = Math.min(x, document.body.offsetWidth - windowBCR.width);
		x -= windowBCR.width / 2;
		this.mainWindow.style.top = `${y}px`;
		this.mainWindow.style.left = `${x}px`;

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


		this.mainWindow.appendChild(table);
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
		document.body.removeChild(this.mainWindow);

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