export class SettingsMenu
{
    private body: HTMLDivElement

    constructor(body: HTMLDivElement, width: number)
    {
        this.body = body;
        this.body.style.height = "calc(100% - 0px)";
        this.body.style.width = `${width}px`;
        this.body.style.backgroundColor = "lightblue";
        this.body.style.display = "inline-block";
    }
}