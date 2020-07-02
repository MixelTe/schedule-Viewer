export class AskWindow
{
	private mainWindow: HTMLDivElement
	private resolve: ((value?: boolean | PromiseLike<boolean> | undefined) => void) | undefined;
	private listeners: { el: HTMLElement, event: string, function: () => any }[]
	private firstClick = true;

	constructor(x: number, y: number, text: string)
	{
		const height = 100;
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

		this.listeners = [{el: document.body, event: "click", function: <() => any>this.clickOnPage.bind(this)}];
		this.mainWindow.appendChild(function (this: AskWindow, text: string)
		{
			const table = document.createElement("table");
			table.style.width = "100%";
			table.style.height = "100%";

			const createTextRow = (text: string, rowStyle?: {property: string, value: string}[]) =>
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

			table.appendChild(createTextRow("Your action:"));
			table.appendChild(createTextRow(text, [{ property: "background-color", value: "#ffc823" }]));
			table.appendChild(createTextRow("Are you sure?"));

			table.appendChild(function (this: AskWindow)
			{
				const row = document.createElement("tr");
				row.style.textAlign = "center";

				const createButtonCell = function (this: AskWindow, text: string, answer: boolean)
				{
					const cell = document.createElement("td");
					const button = document.createElement("button");
					button.innerText = text;
					const listener = {el: button, event: "click", function: this.userAnswer.bind(this, answer)}
					this.listeners.push(listener);
					cell.appendChild(button);
					return cell;
				};
				row.appendChild(createButtonCell.bind(this)("Yes", true));
				row.appendChild(createButtonCell.bind(this)("No", false));

				return row;
			}.bind(this)())

			return table;
		}.bind(this)(text));

		this.listeners.forEach(listener =>
		{
			listener.el.addEventListener(listener.event, listener.function);
		});
	}
	public getAnswer()
	{
		return new Promise<boolean>((resolve, reject) =>
        {
            this.resolve = resolve;
        });
	}
	private clickOnPage(e: MouseEvent)
	{
		if (this.firstClick) this.firstClick = false;
        else
        {
            const y = e.pageY;
            const x = e.pageX;
            if (!this.clickIntersect(x, y))
			{
				this.userAnswer(false);
            }
        }
	}
	private clickIntersect(x: number, y: number)
    {
		const windowBCR = this.mainWindow.getBoundingClientRect();
        return (
            x > windowBCR.x &&
            x < windowBCR.x + windowBCR.width &&
            y > windowBCR.y &&
            y < windowBCR.y + windowBCR.height
        );
    }
	private userAnswer(answer: boolean)
	{
		this.listeners.forEach(listener =>
		{
			listener.el.removeEventListener(listener.event, listener.function);
		});
		document.body.removeChild(this.mainWindow);

		if (this.resolve != undefined)
		{
			this.resolve(answer);
			this.resolve = undefined;
		}
		else throw Error();
	}
}