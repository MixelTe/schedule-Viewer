export class SettingsMenu
{
    private body: HTMLDivElement

    private toggleMenuEl: SVGSVGElement;
    private menuWidth: number
    private menuOpen = true;

    private titleDIV = document.createElement("div");
    private titlePrm = {height: 100};

    private settingsDIV = document.createElement("div");
    private settingsPrm = {height: 100};

    private addingLinesDIV = document.createElement("div");
    private addingLinesPrm = {height: 260};


    constructor(body: HTMLDivElement, width: number)
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

        this.body.style.transition = "width 1s, border 1s";

        {
            const toggleMenuDiv = document.createElement("div");
            toggleMenuDiv.style.height = `${40}px`
            toggleMenuDiv.style.position = "absolute";
            toggleMenuDiv.style.top = `${2}px`;
            toggleMenuDiv.style.right = `${2}px`;
            toggleMenuDiv.style.display = "block";
            toggleMenuDiv.style.width = "100%";
            toggleMenuDiv.style.textAlign = "right";
            this.body.appendChild(toggleMenuDiv);

            this.toggleMenuEl = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            this.toggleMenuEl.setAttribute("width", `${40}`);
            this.toggleMenuEl.setAttribute("height", `${40}`);
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
            title.innerText = "Shedule viewer"
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
            menu.style.height = "50px";
            menu.style.display = "flex";
            menu.style.justifyContent = "space-around";
            menu.style.alignItems = "center";
            this.settingsDIV.appendChild(menu);

            const sepLine = document.createElement("div");
            sepLine.style.height = "max-content";
            sepLine.style.width = "max-content";
            menu.appendChild(sepLine);

            const sepLineInput = document.createElement("input");
            sepLineInput.type = "checkbox";
            sepLineInput.id = "scheduleViewer-SettingsMenu-sepLineInput";
            sepLine.appendChild(sepLineInput);

            const sepLineLable = document.createElement("label");
            sepLineLable.style.height = "max-content";
            sepLineLable.style.fontSize = "16px";
            sepLineLable.htmlFor = "scheduleViewer-SettingsMenu-sepLineInput"
            sepLineLable.innerText = "show separate line";
            sepLine.appendChild(sepLineLable);



            const empLine = document.createElement("div");
            empLine.style.height = "max-content";
            empLine.style.width = "max-content";
            menu.appendChild(empLine);

            const empLineInput = document.createElement("input");
            empLineInput.type = "checkbox";
            empLineInput.id = "scheduleViewer-SettingsMenu-empLineInput";
            empLine.appendChild(empLineInput);

            const empLineLable = document.createElement("label");
            empLineLable.style.height = "max-content";
            empLineLable.style.fontSize = "16px";
            empLineLable.htmlFor = "scheduleViewer-SettingsMenu-empLineInput"
            empLineLable.innerText = "show empty line";
            empLine.appendChild(empLineLable);

        }

        {
            this.addingLinesDIV.style.height = `${this.addingLinesPrm.height}px`
            this.body.appendChild(this.addingLinesDIV);

            const title = document.createElement("div");
            title.style.height = "40px";
            title.style.fontSize = "25px"
            title.style.textAlign = "center"
            title.innerText = "Add line"
            this.addingLinesDIV.appendChild(title);

            const inputWidth = 25;
            const inputHeight = 15;

            {
                const addSympleLine = document.createElement("div");
                addSympleLine.style.height = "max-content";
                addSympleLine.style.fontSize = "21px"
                addSympleLine.style.textAlign = "center"
                addSympleLine.innerText = "symle line"
                this.addingLinesDIV.appendChild(addSympleLine);

                const addSympleLineMenu = document.createElement("div");
                addSympleLineMenu.style.height = "60px";
                addSympleLineMenu.style.display = "flex";
                addSympleLineMenu.style.justifyContent = "space-evenly";
                addSympleLineMenu.style.alignItems = "center";
                addSympleLineMenu.style.flexWrap = "wrap"
                this.addingLinesDIV.appendChild(addSympleLineMenu);

                const sympleLineMenu = document.createElement("div");
                sympleLineMenu.style.height = "60px";
                sympleLineMenu.style.width = "200px";
                sympleLineMenu.style.display = "flex";
                sympleLineMenu.style.justifyContent = "space-around";
                sympleLineMenu.style.alignItems = "center";
                sympleLineMenu.style.flexWrap = "wrap"
                addSympleLineMenu.appendChild(sympleLineMenu);



                {
                    const sympleLineInterval = document.createElement("div");
                    sympleLineInterval.style.height = "max-content";
                    sympleLineInterval.style.width = "max-content";
                    // sympleLineInterval.style.marginRight = "30px";
                    sympleLineMenu.appendChild(sympleLineInterval);

                    const sympleLineLableInterval = document.createElement("label");
                    sympleLineLableInterval.style.height = "max-content";
                    sympleLineLableInterval.style.marginRight = "3px";
                    sympleLineLableInterval.style.fontSize = "16px";
                    sympleLineLableInterval.htmlFor = "scheduleViewer-SettingsMenu-sympleLineInputIntervalh"
                    sympleLineLableInterval.innerText = "interval";
                    sympleLineInterval.appendChild(sympleLineLableInterval);


                    const sympleLineInputIntervalh = document.createElement("input");
                    sympleLineInputIntervalh.type = "input";
                    sympleLineInputIntervalh.style.width = `${inputWidth}px`
                    sympleLineInputIntervalh.style.height = `${inputHeight}px`
                    sympleLineInputIntervalh.id = "scheduleViewer-SettingsMenu-sympleLineInputIntervalh";
                    sympleLineInterval.appendChild(sympleLineInputIntervalh);

                    const sympleLineLableIntervalh = document.createElement("label");
                    sympleLineLableIntervalh.style.height = "max-content";
                    sympleLineLableIntervalh.style.marginRight = "3px";
                    sympleLineLableIntervalh.style.fontSize = "16px";
                    sympleLineLableIntervalh.htmlFor = "scheduleViewer-SettingsMenu-sympleLineInputIntervalh"
                    sympleLineLableIntervalh.innerText = "h";
                    sympleLineInterval.appendChild(sympleLineLableIntervalh);


                    const sympleLineInputIntervalm = document.createElement("input");
                    sympleLineInputIntervalm.type = "input";
                    sympleLineInputIntervalm.style.width = `${inputWidth}px`
                    sympleLineInputIntervalm.style.height = `${inputHeight}px`
                    sympleLineInputIntervalm.id = "scheduleViewer-SettingsMenu-sympleLineInputIntervalm";
                    sympleLineInterval.appendChild(sympleLineInputIntervalm);

                    const sympleLineLableIntervalm = document.createElement("label");
                    sympleLineLableIntervalm.style.height = "max-content";
                    sympleLineLableIntervalm.style.marginRight = "3px";
                    sympleLineLableIntervalm.style.fontSize = "16px";
                    sympleLineLableIntervalm.htmlFor = "scheduleViewer-SettingsMenu-sympleLineInputIntervalm"
                    sympleLineLableIntervalm.innerText = "m";
                    sympleLineInterval.appendChild(sympleLineLableIntervalm);


                    const sympleLineInputIntervals = document.createElement("input");
                    sympleLineInputIntervals.type = "input";
                    sympleLineInputIntervals.style.width = `${inputWidth}px`
                    sympleLineInputIntervals.style.height = `${inputHeight}px`
                    sympleLineInputIntervals.id = "scheduleViewer-SettingsMenu-sympleLineInputIntervals";
                    sympleLineInterval.appendChild(sympleLineInputIntervals);

                    const sympleLineLableIntervals = document.createElement("label");
                    sympleLineLableIntervals.style.height = "max-content";
                    sympleLineLableIntervals.style.marginRight = "3px";
                    sympleLineLableIntervals.style.fontSize = "16px";
                    sympleLineLableIntervals.htmlFor = "scheduleViewer-SettingsMenu-sympleLineInputIntervals"
                    sympleLineLableIntervals.innerText = "s";
                    sympleLineInterval.appendChild(sympleLineLableIntervals);
                }

                {
                    const sympleLineDuration = document.createElement("div");
                    sympleLineDuration.style.height = "max-content";
                    sympleLineDuration.style.width = "max-content";
                    sympleLineMenu.appendChild(sympleLineDuration);

                    const sympleLineLableDuration = document.createElement("label");
                    sympleLineLableDuration.style.height = "max-content";
                    sympleLineLableDuration.style.marginRight = "3px";
                    sympleLineLableDuration.style.fontSize = "16px";
                    sympleLineLableDuration.htmlFor = "scheduleViewer-SettingsMenu-sympleLineInputDurationh"
                    sympleLineLableDuration.innerText = "duration";
                    sympleLineDuration.appendChild(sympleLineLableDuration);


                    const sympleLineInputDurationh = document.createElement("input");
                    sympleLineInputDurationh.type = "input";
                    sympleLineInputDurationh.style.width = `${inputWidth}px`
                    sympleLineInputDurationh.style.height = `${inputHeight}px`
                    sympleLineInputDurationh.id = "scheduleViewer-SettingsMenu-sympleLineInputDurationh";
                    sympleLineDuration.appendChild(sympleLineInputDurationh);

                    const sepLineLableDurationh = document.createElement("label");
                    sepLineLableDurationh.style.height = "max-content";
                    sepLineLableDurationh.style.marginRight = "3px";
                    sepLineLableDurationh.style.fontSize = "16px";
                    sepLineLableDurationh.htmlFor = "scheduleViewer-SettingsMenu-sympleLineInputDurationh"
                    sepLineLableDurationh.innerText = "h";
                    sympleLineDuration.appendChild(sepLineLableDurationh);


                    const sympleLineInputDurationm = document.createElement("input");
                    sympleLineInputDurationm.type = "input";
                    sympleLineInputDurationm.style.width = `${inputWidth}px`
                    sympleLineInputDurationm.style.height = `${inputHeight}px`
                    sympleLineInputDurationm.id = "scheduleViewer-SettingsMenu-sympleLineInputDurationm";
                    sympleLineDuration.appendChild(sympleLineInputDurationm);

                    const sepLineLableDurationm = document.createElement("label");
                    sepLineLableDurationm.style.height = "max-content";
                    sepLineLableDurationm.style.marginRight = "3px";
                    sepLineLableDurationm.style.fontSize = "16px";
                    sepLineLableDurationm.htmlFor = "scheduleViewer-SettingsMenu-sympleLineInputDurationm"
                    sepLineLableDurationm.innerText = "m";
                    sympleLineDuration.appendChild(sepLineLableDurationm);


                    const sympleLineInputDurations = document.createElement("input");
                    sympleLineInputDurations.type = "input";
                    sympleLineInputDurations.style.width = `${inputWidth}px`
                    sympleLineInputDurations.style.height = `${inputHeight}px`
                    sympleLineInputDurations.id = "scheduleViewer-SettingsMenu-sympleLineInputDurations";
                    sympleLineDuration.appendChild(sympleLineInputDurations);

                    const sepLineLableDurations = document.createElement("label");
                    sepLineLableDurations.style.height = "max-content";
                    sepLineLableDurations.style.marginRight = "3px";
                    sepLineLableDurations.style.fontSize = "16px";
                    sepLineLableDurations.htmlFor = "scheduleViewer-SettingsMenu-sympleLineInputDurations"
                    sepLineLableDurations.innerText = "s";
                    sympleLineDuration.appendChild(sepLineLableDurations);
                }

                const breakDiv = document.createElement("div");
                breakDiv.style.height = "0px";
                breakDiv.style.flexBasis = "100%"
                // sympleLineMenu.appendChild(breakDiv);

                const sympleLineButton = document.createElement("button");
                sympleLineButton.innerText = "add";
                addSympleLineMenu.appendChild(sympleLineButton);
            }

            {
                const addRealLine = document.createElement("div");
                addRealLine.style.height = "max-content";
                addRealLine.style.marginTop = "20px"
                addRealLine.style.fontSize = "21px"
                addRealLine.style.textAlign = "center"
                addRealLine.innerText = "real line"
                this.addingLinesDIV.appendChild(addRealLine);

                const addRealLineMenu = document.createElement("div");
                addRealLineMenu.style.height = "60px";
                addRealLineMenu.style.display = "flex";
                addRealLineMenu.style.justifyContent = "space-evenly";
                addRealLineMenu.style.alignItems = "center";
                addRealLineMenu.style.flexWrap = "wrap"
                this.addingLinesDIV.appendChild(addRealLineMenu);

                const realLineMenu = document.createElement("div");
                realLineMenu.style.height = "60px";
                realLineMenu.style.width = "200px";
                realLineMenu.style.display = "flex";
                realLineMenu.style.justifyContent = "space-around";
                realLineMenu.style.alignItems = "center";
                realLineMenu.style.flexWrap = "wrap"
                addRealLineMenu.appendChild(realLineMenu);



                {
                    const realLineInterval = document.createElement("div");
                    realLineInterval.style.height = "max-content";
                    realLineInterval.style.width = "max-content";
                    // sympleLineInterval.style.marginRight = "30px";
                    realLineMenu.appendChild(realLineInterval);

                    const realLineLableInterval = document.createElement("label");
                    realLineLableInterval.style.height = "max-content";
                    realLineLableInterval.style.marginRight = "3px";
                    realLineLableInterval.style.fontSize = "16px";
                    realLineLableInterval.htmlFor = "scheduleViewer-SettingsMenu-realLineInputIntervalh"
                    realLineLableInterval.innerText = "interval";
                    realLineInterval.appendChild(realLineLableInterval);


                    const realLineInputIntervalh = document.createElement("input");
                    realLineInputIntervalh.type = "input";
                    realLineInputIntervalh.style.width = `${inputWidth}px`
                    realLineInputIntervalh.style.height = `${inputHeight}px`
                    realLineInputIntervalh.id = "scheduleViewer-SettingsMenu-realLineInputIntervalh";
                    realLineInterval.appendChild(realLineInputIntervalh);

                    const realLineLableIntervalh = document.createElement("label");
                    realLineLableIntervalh.style.height = "max-content";
                    realLineLableIntervalh.style.marginRight = "3px";
                    realLineLableIntervalh.style.fontSize = "16px";
                    realLineLableIntervalh.htmlFor = "scheduleViewer-SettingsMenu-realLineInputIntervalh"
                    realLineLableIntervalh.innerText = "h";
                    realLineInterval.appendChild(realLineLableIntervalh);


                    const realLineInputIntervalm = document.createElement("input");
                    realLineInputIntervalm.type = "input";
                    realLineInputIntervalm.style.width = `${inputWidth}px`
                    realLineInputIntervalm.style.height = `${inputHeight}px`
                    realLineInputIntervalm.id = "scheduleViewer-SettingsMenu-realLineInputIntervalm";
                    realLineInterval.appendChild(realLineInputIntervalm);

                    const realLineLableIntervalm = document.createElement("label");
                    realLineLableIntervalm.style.height = "max-content";
                    realLineLableIntervalm.style.marginRight = "3px";
                    realLineLableIntervalm.style.fontSize = "16px";
                    realLineLableIntervalm.htmlFor = "scheduleViewer-SettingsMenu-realLineInputIntervalm"
                    realLineLableIntervalm.innerText = "m";
                    realLineInterval.appendChild(realLineLableIntervalm);


                    const realLineInputIntervals = document.createElement("input");
                    realLineInputIntervals.type = "input";
                    realLineInputIntervals.style.width = `${inputWidth}px`
                    realLineInputIntervals.style.height = `${inputHeight}px`
                    realLineInputIntervals.id = "scheduleViewer-SettingsMenu-realLineInputIntervals";
                    realLineInterval.appendChild(realLineInputIntervals);

                    const realLineLableIntervals = document.createElement("label");
                    realLineLableIntervals.style.height = "max-content";
                    realLineLableIntervals.style.marginRight = "3px";
                    realLineLableIntervals.style.fontSize = "16px";
                    realLineLableIntervals.htmlFor = "scheduleViewer-SettingsMenu-realLineInputIntervals"
                    realLineLableIntervals.innerText = "s";
                    realLineInterval.appendChild(realLineLableIntervals);
                }

                {
                    const realLineDuration = document.createElement("div");
                    realLineDuration.style.height = "max-content";
                    realLineDuration.style.width = "max-content";
                    realLineMenu.appendChild(realLineDuration);

                    const realLineLableDuration = document.createElement("label");
                    realLineLableDuration.style.height = "max-content";
                    realLineLableDuration.style.marginRight = "3px";
                    realLineLableDuration.style.fontSize = "16px";
                    realLineLableDuration.htmlFor = "scheduleViewer-SettingsMenu-realLineInputDuration"
                    realLineLableDuration.innerText = "durations";
                    realLineDuration.appendChild(realLineLableDuration);


                    const realLineInputDuration = document.createElement("input");
                    realLineInputDuration.type = "input";
                    realLineInputDuration.style.width = `${55}px`
                    realLineInputDuration.style.height = `${16}px`
                    realLineInputDuration.id = "scheduleViewer-SettingsMenu-realLineInputDuration";
                    realLineDuration.appendChild(realLineInputDuration);

                    const realLineLableDurations = document.createElement("label");
                    realLineLableDurations.style.height = "max-content";
                    realLineLableDurations.style.marginRight = "3px";
                    realLineLableDurations.style.fontSize = "16px";
                    realLineLableDurations.htmlFor = "scheduleViewer-SettingsMenu-realLineInputDuration"
                    realLineLableDurations.innerText = "sec list";
                    realLineDuration.appendChild(realLineLableDurations);
                }

                const breakDiv = document.createElement("div");
                breakDiv.style.height = "0px";
                breakDiv.style.flexBasis = "100%"
                // sympleLineMenu.appendChild(breakDiv);

                const sympleLineButton = document.createElement("button");
                sympleLineButton.innerText = "add";
                addRealLineMenu.appendChild(sympleLineButton);
            }
        }


        this.toggleMenuEl.addEventListener("click", () => this.toggleMenu());
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
            this.body.style.borderLeftColor = `transparent`;
            this.menuOpen = false;
        }
        else
        {
            this.body.style.width = `${this.menuWidth}px`;
            this.body.style.minWidth = `${this.menuWidth}px`;
            this.titleDIV.style.visibility = "visible";
            this.settingsDIV.style.visibility = "visible";
            this.addingLinesDIV.style.visibility = "visible";
            this.body.style.borderLeftColor = `black`;
            this.menuOpen = true;
        }
    }
}