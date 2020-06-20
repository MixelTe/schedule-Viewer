export class SettingsMenu
{
    private body: HTMLDivElement

    private toggleMenuEl: SVGSVGElement;
    private menuWidth: number
    private menuOpen = true;

    private titleDIV = document.createElement("div");
    private titlePrm = {height: 100};

    private settingsDIV = document.createElement("div");
    private showSepLine = true;
    private toggleSepLineEl: HTMLInputElement;
    private settingsPrm = {height: 100};

    private addingLinesDIV = document.createElement("div");
    private addingLinesPrm = { height: 340, inputsBorder: "1px solid grey" };
    private sympleLineInputs = {
        interval: {h: <HTMLInputElement>{}, m: <HTMLInputElement>{}, s: <HTMLInputElement>{}},
        duration: {h: <HTMLInputElement>{}, m: <HTMLInputElement>{}, s: <HTMLInputElement>{}},
        start: {h: <HTMLInputElement>{}, m: <HTMLInputElement>{}, s: <HTMLInputElement>{}},
        end: { h: <HTMLInputElement>{}, m: <HTMLInputElement>{}, s: <HTMLInputElement>{} },
        button: <HTMLButtonElement>{}
    };
    private realLineInputs = {
        interval: {h: <HTMLInputElement>{}, m: <HTMLInputElement>{}, s: <HTMLInputElement>{}},
        durations: <HTMLInputElement>{},
        start: {h: <HTMLInputElement>{}, m: <HTMLInputElement>{}, s: <HTMLInputElement>{}},
        end: { h: <HTMLInputElement>{}, m: <HTMLInputElement>{}, s: <HTMLInputElement>{} },
        button: <HTMLButtonElement>{}
    };



    constructor(body: HTMLDivElement, width: number, functions: FunctionsForMenu, open = true)
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

        if (!open) this.toggleMenu();
        this.body.style.transition = "width 1s";

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
            title.innerText = "Schedule viewer"
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

            this.toggleSepLineEl = document.createElement("input");
            this.toggleSepLineEl.type = "checkbox";
            this.toggleSepLineEl.checked = functions.SepLineIsActive();
            this.toggleSepLineEl.id = "scheduleViewer-SettingsMenu-sepLineInput";
            sepLine.appendChild(this.toggleSepLineEl);

            const sepLineLable = document.createElement("label");
            sepLineLable.style.height = "max-content";
            sepLineLable.style.fontSize = "16px";
            sepLineLable.htmlFor = "scheduleViewer-SettingsMenu-sepLineInput"
            sepLineLable.innerText = "show separate line";
            sepLine.appendChild(sepLineLable);



            // const empLine = document.createElement("div");
            // empLine.style.height = "max-content";
            // empLine.style.width = "max-content";
            // menu.appendChild(empLine);

            // const empLineInput = document.createElement("input");
            // empLineInput.type = "checkbox";
            // empLineInput.id = "scheduleViewer-SettingsMenu-empLineInput";
            // empLine.appendChild(empLineInput);

            // const empLineLable = document.createElement("label");
            // empLineLable.style.height = "max-content";
            // empLineLable.style.fontSize = "16px";
            // empLineLable.htmlFor = "scheduleViewer-SettingsMenu-empLineInput"
            // empLineLable.innerText = "show empty line";
            // empLine.appendChild(empLineLable);

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
                addSympleLine.innerText = "simple line"
                this.addingLinesDIV.appendChild(addSympleLine);

                const addSympleLineMenu = document.createElement("div");
                addSympleLineMenu.style.height = "100px";
                addSympleLineMenu.style.display = "flex";
                addSympleLineMenu.style.justifyContent = "space-evenly";
                addSympleLineMenu.style.alignItems = "center";
                addSympleLineMenu.style.flexWrap = "wrap"
                this.addingLinesDIV.appendChild(addSympleLineMenu);

                const sympleLineMenu = document.createElement("div");
                sympleLineMenu.style.height = "100px";
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
                    sympleLineInputIntervalh.style.border = `${this.addingLinesPrm.inputsBorder}`
                    sympleLineInputIntervalh.id = "scheduleViewer-SettingsMenu-sympleLineInputIntervalh";
                    sympleLineInterval.appendChild(sympleLineInputIntervalh);
                    this.sympleLineInputs.interval.h = sympleLineInputIntervalh;

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
                    sympleLineInputIntervalm.style.border = `${this.addingLinesPrm.inputsBorder}`
                    sympleLineInterval.appendChild(sympleLineInputIntervalm);
                    this.sympleLineInputs.interval.m = sympleLineInputIntervalm;

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
                    sympleLineInputIntervals.style.border = `${this.addingLinesPrm.inputsBorder}`
                    sympleLineInterval.appendChild(sympleLineInputIntervals);
                    this.sympleLineInputs.interval.s = sympleLineInputIntervals;

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
                    sympleLineInputDurationh.style.border = `${this.addingLinesPrm.inputsBorder}`
                    sympleLineDuration.appendChild(sympleLineInputDurationh);
                    this.sympleLineInputs.duration.h = sympleLineInputDurationh;

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
                    sympleLineInputDurationm.style.border = `${this.addingLinesPrm.inputsBorder}`
                    sympleLineDuration.appendChild(sympleLineInputDurationm);
                    this.sympleLineInputs.duration.m = sympleLineInputDurationm;

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
                    sympleLineInputDurations.style.border = `${this.addingLinesPrm.inputsBorder}`
                    sympleLineDuration.appendChild(sympleLineInputDurations);
                    this.sympleLineInputs.duration.s = sympleLineInputDurations;

                    const sepLineLableDurations = document.createElement("label");
                    sepLineLableDurations.style.height = "max-content";
                    sepLineLableDurations.style.marginRight = "3px";
                    sepLineLableDurations.style.fontSize = "16px";
                    sepLineLableDurations.htmlFor = "scheduleViewer-SettingsMenu-sympleLineInputDurations"
                    sepLineLableDurations.innerText = "s";
                    sympleLineDuration.appendChild(sepLineLableDurations);
                }

                {
                    const sympleLineStart = document.createElement("div");
                    sympleLineStart.style.height = "max-content";
                    sympleLineStart.style.width = "max-content";
                    // sympleLineInterval.style.marginRight = "30px";
                    sympleLineMenu.appendChild(sympleLineStart);

                    const sympleLineLableStart = document.createElement("label");
                    sympleLineLableStart.style.height = "max-content";
                    sympleLineLableStart.style.marginRight = "3px";
                    sympleLineLableStart.style.fontSize = "16px";
                    sympleLineLableStart.htmlFor = "scheduleViewer-SettingsMenu-sympleLineInputStarth"
                    sympleLineLableStart.innerText = "start";
                    sympleLineStart.appendChild(sympleLineLableStart);


                    const sympleLineInputStarth = document.createElement("input");
                    sympleLineInputStarth.type = "input";
                    sympleLineInputStarth.style.width = `${inputWidth}px`
                    sympleLineInputStarth.style.height = `${inputHeight}px`
                    sympleLineInputStarth.id = "scheduleViewer-SettingsMenu-sympleLineInputStarth";
                    sympleLineInputStarth.style.border = `${this.addingLinesPrm.inputsBorder}`
                    sympleLineStart.appendChild(sympleLineInputStarth);
                    this.sympleLineInputs.start.h = sympleLineInputStarth;

                    const sympleLineLableStarth = document.createElement("label");
                    sympleLineLableStarth.style.height = "max-content";
                    sympleLineLableStarth.style.marginRight = "3px";
                    sympleLineLableStarth.style.fontSize = "16px";
                    sympleLineLableStarth.htmlFor = "scheduleViewer-SettingsMenu-sympleLineInputStarth"
                    sympleLineLableStarth.innerText = "h";
                    sympleLineStart.appendChild(sympleLineLableStarth);


                    const sympleLineInputStartm = document.createElement("input");
                    sympleLineInputStartm.type = "input";
                    sympleLineInputStartm.style.width = `${inputWidth}px`
                    sympleLineInputStartm.style.height = `${inputHeight}px`
                    sympleLineInputStartm.id = "scheduleViewer-SettingsMenu-sympleLineInputStartm";
                    sympleLineInputStartm.style.border = `${this.addingLinesPrm.inputsBorder}`
                    sympleLineStart.appendChild(sympleLineInputStartm);
                    this.sympleLineInputs.start.m = sympleLineInputStartm;

                    const sympleLineLableStartm = document.createElement("label");
                    sympleLineLableStartm.style.height = "max-content";
                    sympleLineLableStartm.style.marginRight = "3px";
                    sympleLineLableStartm.style.fontSize = "16px";
                    sympleLineLableStartm.htmlFor = "scheduleViewer-SettingsMenu-sympleLineInputStartm"
                    sympleLineLableStartm.innerText = "m";
                    sympleLineStart.appendChild(sympleLineLableStartm);


                    const sympleLineInputStarts = document.createElement("input");
                    sympleLineInputStarts.type = "input";
                    sympleLineInputStarts.style.width = `${inputWidth}px`
                    sympleLineInputStarts.style.height = `${inputHeight}px`
                    sympleLineInputStarts.id = "scheduleViewer-SettingsMenu-sympleLineInputStarts";
                    sympleLineInputStarts.style.border = `${this.addingLinesPrm.inputsBorder}`
                    sympleLineStart.appendChild(sympleLineInputStarts);
                    this.sympleLineInputs.start.s = sympleLineInputStarts;

                    const sympleLineLableStarts = document.createElement("label");
                    sympleLineLableStarts.style.height = "max-content";
                    sympleLineLableStarts.style.marginRight = "3px";
                    sympleLineLableStarts.style.fontSize = "16px";
                    sympleLineLableStarts.htmlFor = "scheduleViewer-SettingsMenu-sympleLineInputStarts"
                    sympleLineLableStarts.innerText = "s";
                    sympleLineStart.appendChild(sympleLineLableStarts);
                }

                {
                    const sympleLineEnd = document.createElement("div");
                    sympleLineEnd.style.height = "max-content";
                    sympleLineEnd.style.width = "max-content";
                    // sympleLineInterval.style.marginRight = "30px";
                    sympleLineMenu.appendChild(sympleLineEnd);

                    const sympleLineLableEnd = document.createElement("label");
                    sympleLineLableEnd.style.height = "max-content";
                    sympleLineLableEnd.style.marginRight = "3px";
                    sympleLineLableEnd.style.fontSize = "16px";
                    sympleLineLableEnd.htmlFor = "scheduleViewer-SettingsMenu-sympleLineInputEndh"
                    sympleLineLableEnd.innerText = "end";
                    sympleLineEnd.appendChild(sympleLineLableEnd);


                    const sympleLineInputEndh = document.createElement("input");
                    sympleLineInputEndh.type = "input";
                    sympleLineInputEndh.style.width = `${inputWidth}px`
                    sympleLineInputEndh.style.height = `${inputHeight}px`
                    sympleLineInputEndh.id = "scheduleViewer-SettingsMenu-sympleLineInputEndh";
                    sympleLineInputEndh.style.border = `${this.addingLinesPrm.inputsBorder}`
                    sympleLineEnd.appendChild(sympleLineInputEndh);
                    this.sympleLineInputs.end.h = sympleLineInputEndh;

                    const sympleLineLableEndh = document.createElement("label");
                    sympleLineLableEndh.style.height = "max-content";
                    sympleLineLableEndh.style.marginRight = "3px";
                    sympleLineLableEndh.style.fontSize = "16px";
                    sympleLineLableEndh.htmlFor = "scheduleViewer-SettingsMenu-sympleLineInputEndh"
                    sympleLineLableEndh.innerText = "h";
                    sympleLineEnd.appendChild(sympleLineLableEndh);


                    const sympleLineInputEndm = document.createElement("input");
                    sympleLineInputEndm.type = "input";
                    sympleLineInputEndm.style.width = `${inputWidth}px`
                    sympleLineInputEndm.style.height = `${inputHeight}px`
                    sympleLineInputEndm.id = "scheduleViewer-SettingsMenu-sympleLineInputEndm";
                    sympleLineInputEndm.style.border = `${this.addingLinesPrm.inputsBorder}`
                    sympleLineEnd.appendChild(sympleLineInputEndm);
                    this.sympleLineInputs.end.m = sympleLineInputEndm;

                    const sympleLineLableEndm = document.createElement("label");
                    sympleLineLableEndm.style.height = "max-content";
                    sympleLineLableEndm.style.marginRight = "3px";
                    sympleLineLableEndm.style.fontSize = "16px";
                    sympleLineLableEndm.htmlFor = "scheduleViewer-SettingsMenu-sympleLineInputEndm"
                    sympleLineLableEndm.innerText = "m";
                    sympleLineEnd.appendChild(sympleLineLableEndm);


                    const sympleLineInputEnds = document.createElement("input");
                    sympleLineInputEnds.type = "input";
                    sympleLineInputEnds.style.width = `${inputWidth}px`
                    sympleLineInputEnds.style.height = `${inputHeight}px`
                    sympleLineInputEnds.id = "scheduleViewer-SettingsMenu-sympleLineInputEnds";
                    sympleLineInputEnds.style.border = `${this.addingLinesPrm.inputsBorder}`
                    sympleLineEnd.appendChild(sympleLineInputEnds);
                    this.sympleLineInputs.end.s = sympleLineInputEnds;

                    const sympleLineLableEnds = document.createElement("label");
                    sympleLineLableEnds.style.height = "max-content";
                    sympleLineLableEnds.style.marginRight = "3px";
                    sympleLineLableEnds.style.fontSize = "16px";
                    sympleLineLableEnds.htmlFor = "scheduleViewer-SettingsMenu-sympleLineInputEnds"
                    sympleLineLableEnds.innerText = "s";
                    sympleLineEnd.appendChild(sympleLineLableEnds);
                }

                const breakDiv = document.createElement("div");
                breakDiv.style.height = "0px";
                breakDiv.style.flexBasis = "100%"
                // sympleLineMenu.appendChild(breakDiv);

                const sympleLineButton = document.createElement("button");
                sympleLineButton.innerText = "add";
                addSympleLineMenu.appendChild(sympleLineButton);
                this.sympleLineInputs.button = sympleLineButton;
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
                addRealLineMenu.style.height = "100px";
                addRealLineMenu.style.display = "flex";
                addRealLineMenu.style.justifyContent = "space-evenly";
                addRealLineMenu.style.alignItems = "center";
                addRealLineMenu.style.flexWrap = "wrap"
                this.addingLinesDIV.appendChild(addRealLineMenu);

                const realLineMenu = document.createElement("div");
                realLineMenu.style.height = "100px";
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
                    realLineInputIntervalh.style.border = `${this.addingLinesPrm.inputsBorder}`
                    realLineInterval.appendChild(realLineInputIntervalh);
                    this.realLineInputs.interval.h = realLineInputIntervalh;

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
                    realLineInputIntervalm.style.border = `${this.addingLinesPrm.inputsBorder}`
                    realLineInterval.appendChild(realLineInputIntervalm);
                    this.realLineInputs.interval.m = realLineInputIntervalm;

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
                    realLineInputIntervals.style.border = `${this.addingLinesPrm.inputsBorder}`
                    realLineInterval.appendChild(realLineInputIntervals);
                    this.realLineInputs.interval.s = realLineInputIntervals;

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
                    realLineInputDuration.style.border = `${this.addingLinesPrm.inputsBorder}`
                    realLineDuration.appendChild(realLineInputDuration);
                    this.realLineInputs.durations = realLineInputDuration;

                    const realLineLableDurations = document.createElement("label");
                    realLineLableDurations.style.height = "max-content";
                    realLineLableDurations.style.marginRight = "3px";
                    realLineLableDurations.style.fontSize = "16px";
                    realLineLableDurations.htmlFor = "scheduleViewer-SettingsMenu-realLineInputDuration"
                    realLineLableDurations.innerText = "sec list";
                    realLineDuration.appendChild(realLineLableDurations);
                }

                {
                    const realLineStart = document.createElement("div");
                    realLineStart.style.height = "max-content";
                    realLineStart.style.width = "max-content";
                    // sympleLineStart.style.marginRight = "30px";
                    realLineMenu.appendChild(realLineStart);

                    const realLineLableStart = document.createElement("label");
                    realLineLableStart.style.height = "max-content";
                    realLineLableStart.style.marginRight = "3px";
                    realLineLableStart.style.fontSize = "16px";
                    realLineLableStart.htmlFor = "scheduleViewer-SettingsMenu-realLineInputStarth"
                    realLineLableStart.innerText = "start";
                    realLineStart.appendChild(realLineLableStart);


                    const realLineInputStarth = document.createElement("input");
                    realLineInputStarth.type = "input";
                    realLineInputStarth.style.width = `${inputWidth}px`
                    realLineInputStarth.style.height = `${inputHeight}px`
                    realLineInputStarth.id = "scheduleViewer-SettingsMenu-realLineInputStarth";
                    realLineInputStarth.style.border = `${this.addingLinesPrm.inputsBorder}`
                    realLineStart.appendChild(realLineInputStarth);
                    this.realLineInputs.start.h = realLineInputStarth;

                    const realLineLableStarth = document.createElement("label");
                    realLineLableStarth.style.height = "max-content";
                    realLineLableStarth.style.marginRight = "3px";
                    realLineLableStarth.style.fontSize = "16px";
                    realLineLableStarth.htmlFor = "scheduleViewer-SettingsMenu-realLineInputStarth"
                    realLineLableStarth.innerText = "h";
                    realLineStart.appendChild(realLineLableStarth);


                    const realLineInputStartm = document.createElement("input");
                    realLineInputStartm.type = "input";
                    realLineInputStartm.style.width = `${inputWidth}px`
                    realLineInputStartm.style.height = `${inputHeight}px`
                    realLineInputStartm.id = "scheduleViewer-SettingsMenu-realLineInputStartm";
                    realLineInputStartm.style.border = `${this.addingLinesPrm.inputsBorder}`
                    realLineStart.appendChild(realLineInputStartm);
                    this.realLineInputs.start.m = realLineInputStartm;

                    const realLineLableStartm = document.createElement("label");
                    realLineLableStartm.style.height = "max-content";
                    realLineLableStartm.style.marginRight = "3px";
                    realLineLableStartm.style.fontSize = "16px";
                    realLineLableStartm.htmlFor = "scheduleViewer-SettingsMenu-realLineInputStartm"
                    realLineLableStartm.innerText = "m";
                    realLineStart.appendChild(realLineLableStartm);


                    const realLineInputStarts = document.createElement("input");
                    realLineInputStarts.type = "input";
                    realLineInputStarts.style.width = `${inputWidth}px`
                    realLineInputStarts.style.height = `${inputHeight}px`
                    realLineInputStarts.id = "scheduleViewer-SettingsMenu-realLineInputStarts";
                    realLineInputStarts.style.border = `${this.addingLinesPrm.inputsBorder}`
                    realLineStart.appendChild(realLineInputStarts);
                    this.realLineInputs.start.s = realLineInputStarts;

                    const realLineLableStarts = document.createElement("label");
                    realLineLableStarts.style.height = "max-content";
                    realLineLableStarts.style.marginRight = "3px";
                    realLineLableStarts.style.fontSize = "16px";
                    realLineLableStarts.htmlFor = "scheduleViewer-SettingsMenu-realLineInputStarts"
                    realLineLableStarts.innerText = "s";
                    realLineStart.appendChild(realLineLableStarts);
                }

                {
                    const realLineEnd = document.createElement("div");
                    realLineEnd.style.height = "max-content";
                    realLineEnd.style.width = "max-content";
                    // sympleLineEnd.style.marginRight = "30px";
                    realLineMenu.appendChild(realLineEnd);

                    const realLineLableEnd = document.createElement("label");
                    realLineLableEnd.style.height = "max-content";
                    realLineLableEnd.style.marginRight = "3px";
                    realLineLableEnd.style.fontSize = "16px";
                    realLineLableEnd.htmlFor = "scheduleViewer-SettingsMenu-realLineInputEndh"
                    realLineLableEnd.innerText = "end";
                    realLineEnd.appendChild(realLineLableEnd);


                    const realLineInputEndh = document.createElement("input");
                    realLineInputEndh.type = "input";
                    realLineInputEndh.style.width = `${inputWidth}px`
                    realLineInputEndh.style.height = `${inputHeight}px`
                    realLineInputEndh.id = "scheduleViewer-SettingsMenu-realLineInputEndh";
                    realLineInputEndh.style.border = `${this.addingLinesPrm.inputsBorder}`
                    realLineEnd.appendChild(realLineInputEndh);
                    this.realLineInputs.end.h = realLineInputEndh;

                    const realLineLableEndh = document.createElement("label");
                    realLineLableEndh.style.height = "max-content";
                    realLineLableEndh.style.marginRight = "3px";
                    realLineLableEndh.style.fontSize = "16px";
                    realLineLableEndh.htmlFor = "scheduleViewer-SettingsMenu-realLineInputEndh"
                    realLineLableEndh.innerText = "h";
                    realLineEnd.appendChild(realLineLableEndh);


                    const realLineInputEndm = document.createElement("input");
                    realLineInputEndm.type = "input";
                    realLineInputEndm.style.width = `${inputWidth}px`
                    realLineInputEndm.style.height = `${inputHeight}px`
                    realLineInputEndm.id = "scheduleViewer-SettingsMenu-realLineInputEndm";
                    realLineInputEndm.style.border = `${this.addingLinesPrm.inputsBorder}`
                    realLineEnd.appendChild(realLineInputEndm);
                    this.realLineInputs.end.m = realLineInputEndm;

                    const realLineLableEndm = document.createElement("label");
                    realLineLableEndm.style.height = "max-content";
                    realLineLableEndm.style.marginRight = "3px";
                    realLineLableEndm.style.fontSize = "16px";
                    realLineLableEndm.htmlFor = "scheduleViewer-SettingsMenu-realLineInputEndm"
                    realLineLableEndm.innerText = "m";
                    realLineEnd.appendChild(realLineLableEndm);


                    const realLineInputEnds = document.createElement("input");
                    realLineInputEnds.type = "input";
                    realLineInputEnds.style.width = `${inputWidth}px`
                    realLineInputEnds.style.height = `${inputHeight}px`
                    realLineInputEnds.id = "scheduleViewer-SettingsMenu-realLineInputEnds";
                    realLineInputEnds.style.border = `${this.addingLinesPrm.inputsBorder}`
                    realLineEnd.appendChild(realLineInputEnds);
                    this.realLineInputs.end.s = realLineInputEnds;

                    const realLineLableEnds = document.createElement("label");
                    realLineLableEnds.style.height = "max-content";
                    realLineLableEnds.style.marginRight = "3px";
                    realLineLableEnds.style.fontSize = "16px";
                    realLineLableEnds.htmlFor = "scheduleViewer-SettingsMenu-realLineInputEnds"
                    realLineLableEnds.innerText = "s";
                    realLineEnd.appendChild(realLineLableEnds);
                }

                const breakDiv = document.createElement("div");
                breakDiv.style.height = "0px";
                breakDiv.style.flexBasis = "100%"
                // sympleLineMenu.appendChild(breakDiv);

                const sympleLineButton = document.createElement("button");
                sympleLineButton.innerText = "add";
                addRealLineMenu.appendChild(sympleLineButton);
                this.realLineInputs.button = sympleLineButton;
            }
        }


        this.toggleMenuEl.addEventListener("click", () => this.toggleMenu());
        this.toggleSepLineEl.addEventListener("change", functions.toggleSepLine);
        this.sympleLineInputs.button.addEventListener("click", () => this.addSympleLine(functions));
        this.realLineInputs.button.addEventListener("click", () => this.addRealLine(functions));
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
            this.menuOpen = false;
        }
        else
        {
            this.body.style.width = `${this.menuWidth}px`;
            this.body.style.minWidth = `${this.menuWidth}px`;
            this.titleDIV.style.visibility = "visible";
            this.settingsDIV.style.visibility = "visible";
            this.addingLinesDIV.style.visibility = "visible";
            this.menuOpen = true;
        }
    }

    private addSympleLine(functions: FunctionsForMenu)
    {
        const inputsData = {
            interval: {
                h: parseInt(this.sympleLineInputs.interval.h.value),
                m: parseInt(this.sympleLineInputs.interval.m.value),
                s: parseInt(this.sympleLineInputs.interval.s.value),
            },
            duration: {
                h: parseInt(this.sympleLineInputs.duration.h.value),
                m: parseInt(this.sympleLineInputs.duration.m.value),
                s: parseInt(this.sympleLineInputs.duration.s.value),
            },
            start: {
                h: parseInt(this.sympleLineInputs.start.h.value),
                m: parseInt(this.sympleLineInputs.start.m.value),
                s: parseInt(this.sympleLineInputs.start.s.value),
            },
            end: {
                h: parseInt(this.sympleLineInputs.end.h.value),
                m: parseInt(this.sympleLineInputs.end.m.value),
                s: parseInt(this.sympleLineInputs.end.s.value),
            },
        };
        if (this.isNumber(inputsData.interval.h)) this.markAsCorrect(this.sympleLineInputs.interval.h);
        else { this.markAsUncorrect(this.sympleLineInputs.interval.h); return; }
        if (this.isNumber(inputsData.interval.m)) this.markAsCorrect(this.sympleLineInputs.interval.m);
        else { this.markAsUncorrect(this.sympleLineInputs.interval.m); return; }
        if (this.isNumber(inputsData.interval.s)) this.markAsCorrect(this.sympleLineInputs.interval.s);
        else { this.markAsUncorrect(this.sympleLineInputs.interval.s); return; }

        if (this.isNumber(inputsData.duration.h)) this.markAsCorrect(this.sympleLineInputs.duration.h);
        else { this.markAsUncorrect(this.sympleLineInputs.duration.h); return; }
        if (this.isNumber(inputsData.duration.m)) this.markAsCorrect(this.sympleLineInputs.duration.m);
        else { this.markAsUncorrect(this.sympleLineInputs.duration.m); return; }
        if (this.isNumber(inputsData.duration.s)) this.markAsCorrect(this.sympleLineInputs.duration.s);
        else { this.markAsUncorrect(this.sympleLineInputs.duration.s); return; }

        if (this.isNumber(inputsData.start.h)) this.markAsCorrect(this.sympleLineInputs.start.h);
        else { this.markAsUncorrect(this.sympleLineInputs.start.h); return; }
        if (this.isNumber(inputsData.start.m)) this.markAsCorrect(this.sympleLineInputs.start.m);
        else { this.markAsUncorrect(this.sympleLineInputs.start.m); return; }
        if (this.isNumber(inputsData.start.s)) this.markAsCorrect(this.sympleLineInputs.start.s);
        else { this.markAsUncorrect(this.sympleLineInputs.start.s); return; }

        if (this.isNumber(inputsData.end.h)) this.markAsCorrect(this.sympleLineInputs.end.h);
        else { this.markAsUncorrect(this.sympleLineInputs.end.h); return; }
        if (this.isNumber(inputsData.end.m)) this.markAsCorrect(this.sympleLineInputs.end.m);
        else { this.markAsUncorrect(this.sympleLineInputs.end.m); return; }
        if (this.isNumber(inputsData.end.s)) this.markAsCorrect(this.sympleLineInputs.end.s);
        else { this.markAsUncorrect(this.sympleLineInputs.end.s); return; }

        this.UnmarkAndClear(this.sympleLineInputs.interval.h);
        this.UnmarkAndClear(this.sympleLineInputs.interval.m);
        this.UnmarkAndClear(this.sympleLineInputs.interval.s);
        this.UnmarkAndClear(this.sympleLineInputs.duration.h);
        this.UnmarkAndClear(this.sympleLineInputs.duration.m);
        this.UnmarkAndClear(this.sympleLineInputs.duration.s);
        this.UnmarkAndClear(this.sympleLineInputs.start.h);
        this.UnmarkAndClear(this.sympleLineInputs.start.m);
        this.UnmarkAndClear(this.sympleLineInputs.start.s);
        this.UnmarkAndClear(this.sympleLineInputs.end.h);
        this.UnmarkAndClear(this.sympleLineInputs.end.m);
        this.UnmarkAndClear(this.sympleLineInputs.end.s);

        this.checkNumber(inputsData.interval.h, "h");
        this.checkNumber(inputsData.interval.m, "m");
        this.checkNumber(inputsData.interval.s, "s");
        this.checkNumber(inputsData.duration.h, "h");
        this.checkNumber(inputsData.duration.m, "m");
        this.checkNumber(inputsData.duration.s, "s");
        this.checkNumber(inputsData.start.h, "h");
        this.checkNumber(inputsData.start.m, "m");
        this.checkNumber(inputsData.start.s, "s");
        this.checkNumber(inputsData.end.h, "h");
        this.checkNumber(inputsData.end.m, "m");
        this.checkNumber(inputsData.end.s, "s");

        console.log("Yee!!!");

        const interval = inputsData.interval.h * 60 * 60 + inputsData.interval.m * 60 + inputsData.interval.s;
        const duration = inputsData.duration.h * 60 * 60 + inputsData.duration.m * 60 + inputsData.duration.s;
        const start = inputsData.start.h * 60 * 60 + inputsData.start.m * 60 + inputsData.start.s;
        const end = inputsData.end.h * 60 * 60 + inputsData.end.m * 60 + inputsData.end.s;
        functions.addSympleLine(interval, duration, start, end);
        functions.recreate();
    }
    private addRealLine(functions: FunctionsForMenu)
    {
        const inputsData = {
            interval: {
                h: parseInt(this.realLineInputs.interval.h.value),
                s: parseInt(this.realLineInputs.interval.s.value),
                m: parseInt(this.realLineInputs.interval.m.value),
            },
            duration: this.realLineInputs.durations.value,
            start: {
                h: parseInt(this.realLineInputs.start.h.value),
                m: parseInt(this.realLineInputs.start.m.value),
                s: parseInt(this.realLineInputs.start.s.value),
            },
            end: {
                h: parseInt(this.realLineInputs.end.h.value),
                m: parseInt(this.realLineInputs.end.m.value),
                s: parseInt(this.realLineInputs.end.s.value),
            },
        };
        if (this.isNumber(inputsData.interval.h)) this.markAsCorrect(this.realLineInputs.interval.h);
        else { this.markAsUncorrect(this.realLineInputs.interval.h); return; }
        if (this.isNumber(inputsData.interval.m)) this.markAsCorrect(this.realLineInputs.interval.m);
        else { this.markAsUncorrect(this.realLineInputs.interval.m); return; }
        if (this.isNumber(inputsData.interval.s)) this.markAsCorrect(this.realLineInputs.interval.s);
        else { this.markAsUncorrect(this.realLineInputs.interval.s); return; }

        if (this.isNumber(inputsData.start.h)) this.markAsCorrect(this.realLineInputs.start.h);
        else { this.markAsUncorrect(this.realLineInputs.start.h); return; }
        if (this.isNumber(inputsData.start.m)) this.markAsCorrect(this.realLineInputs.start.m);
        else { this.markAsUncorrect(this.realLineInputs.start.m); return; }
        if (this.isNumber(inputsData.start.s)) this.markAsCorrect(this.realLineInputs.start.s);
        else { this.markAsUncorrect(this.realLineInputs.start.s); return; }

        if (this.isNumber(inputsData.end.h)) this.markAsCorrect(this.realLineInputs.end.h);
        else { this.markAsUncorrect(this.realLineInputs.end.h); return; }
        if (this.isNumber(inputsData.end.m)) this.markAsCorrect(this.realLineInputs.end.m);
        else { this.markAsUncorrect(this.realLineInputs.end.m); return; }
        if (this.isNumber(inputsData.end.s)) this.markAsCorrect(this.realLineInputs.end.s);
        else { this.markAsUncorrect(this.realLineInputs.end.s); return; }

        const durations = inputsData.duration.split(',').map(num =>
            {
                const newNum = Number(num);
            if (newNum / newNum == 1 || newNum == 0) return newNum;
            else
            {
                this.markAsUncorrect(this.realLineInputs.durations);
                throw new Error(`uncorrect value in duration: "${num}"`)
            };
            });

        this.UnmarkAndClear(this.realLineInputs.interval.h);
        this.UnmarkAndClear(this.realLineInputs.interval.m);
        this.UnmarkAndClear(this.realLineInputs.interval.s);
        this.UnmarkAndClear(this.realLineInputs.start.h);
        this.UnmarkAndClear(this.realLineInputs.start.m);
        this.UnmarkAndClear(this.realLineInputs.start.s);
        this.UnmarkAndClear(this.realLineInputs.end.h);
        this.UnmarkAndClear(this.realLineInputs.end.m);
        this.UnmarkAndClear(this.realLineInputs.end.s);

        this.checkNumber(inputsData.interval.h, "h");
        this.checkNumber(inputsData.interval.m, "m");
        this.checkNumber(inputsData.interval.s, "s");
        this.checkNumber(inputsData.start.h, "h");
        this.checkNumber(inputsData.start.m, "m");
        this.checkNumber(inputsData.start.s, "s");
        this.checkNumber(inputsData.end.h, "h");
        this.checkNumber(inputsData.end.m, "m");
        this.checkNumber(inputsData.end.s, "s");

        console.log("Yee!!!");

        const interval = inputsData.interval.h * 60 * 60 + inputsData.interval.m * 60 + inputsData.interval.s;
        const start = inputsData.start.h * 60 * 60 + inputsData.start.m * 60 + inputsData.start.s;
        const end = inputsData.end.h * 60 * 60 + inputsData.end.m * 60 + inputsData.end.s;
        functions.addRealLine(interval, durations, start, end);
        functions.recreate();
    }
    private isNumber(num: any)
    {
        if (typeof num == "number" && (num / num == 1 || num == 0)) return true;
        return false;
    }
    private markAsUncorrect(el: HTMLInputElement)
    {
        el.style.border = "1px solid red";
    }
    private markAsCorrect(el: HTMLInputElement)
    {
        el.style.border = "1px solid green";
    }
    private UnmarkAndClear(el: HTMLInputElement)
    {
        el.style.border = `${this.addingLinesPrm.inputsBorder}`;
        el.value = "";
    }
    private checkNumber(num: number, type: string)
    {
        if (num >= 0)
        {
            switch (type)
            {
                case "h":
                    if (num > 24) throw new Error("value is too large")
                    break;

                case "m":
                    if (num > 60) throw new Error("value is too large")
                    break;

                case "s":
                    if (num > 60) throw new Error("value is too large")
                    break;

                default:
                    break;
            }
        }
        else throw new Error("value is too small");
    }

}