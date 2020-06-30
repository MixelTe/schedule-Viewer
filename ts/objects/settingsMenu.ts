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
    private revTimeInputEl: HTMLInputElement;
    private revTimeInput = false;
    private settingsPrm = {height: 100};

    private addingLinesDIV = document.createElement("div");
    private addingLinesPrm = { height: 200, inputsBorder: "1px solid grey", inputsBackground: "white", inputtitle: "time in format: hh or hh:mm or hh:mm:ss", inputplaceholder: "hh:mm" };
    private lineInputs = {
        radioReal: {input: <HTMLInputElement>{}, div: <HTMLDivElement>{}},
        radioSimple: {input: <HTMLInputElement>{}, div: <HTMLDivElement>{}},
        interval: <HTMLInputElement>{},
        duration: {input: <HTMLInputElement>{}, div: <HTMLDivElement>{}},
        durations: {input: <HTMLInputElement>{}, div: <HTMLDivElement>{}},
        start: <HTMLInputElement> {},
        end: <HTMLInputElement>{},
        buttonAdd: <HTMLButtonElement>{},
        buttonChange: <HTMLButtonElement>{},
        buttonRemove: <HTMLButtonElement>{},
    };
    private hintForLinesInputs: HTMLDivElement;

    private loadFilesDIV = document.createElement("div");
    private loadFilesPrm = { height: 80 };
    private filesInput: HTMLInputElement;

    private saveFileDIV = document.createElement("div");
    private saveFilesPrm = { height: 50 };
    private saveFileButton: HTMLButtonElement;


    private overDiv = document.createElement("div");
    private overDivText = document.createElement("div");
    private overDivPrm = { width: 0, height: 0, minusWidth: 0 };

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
            menu.style.flexWrap = "wrap";
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



            const revTime = document.createElement("div");
            revTime.style.height = "max-content";
            revTime.style.width = "max-content";
            menu.appendChild(revTime);

            this.revTimeInputEl = document.createElement("input");
            this.revTimeInputEl.type = "checkbox";
            this.revTimeInputEl.id = "scheduleViewer-SettingsMenu-showAfterEndInput";
            revTime.appendChild(this.revTimeInputEl);

            const revTimeLable = document.createElement("label");
            revTimeLable.style.height = "max-content";
            revTimeLable.style.fontSize = "16px";
            revTimeLable.htmlFor = "scheduleViewer-SettingsMenu-showAfterEndInput"
            revTimeLable.innerText = "reverse time input order";
            revTime.appendChild(revTimeLable);

        }

        {
            this.addingLinesDIV.style.height = `${this.addingLinesPrm.height}px`
            this.body.appendChild(this.addingLinesDIV);

            const title = document.createElement("div");
            title.style.height = "40px";
            title.style.fontSize = "25px"
            title.style.textAlign = "center"
            title.innerText = "Lines"
            this.addingLinesDIV.appendChild(title);

            const inputWidth = 60;
            const inputHeight = 15;

            {
                const addRealLineMenu = document.createElement("div");
                addRealLineMenu.style.height = "120px";
                addRealLineMenu.style.display = "flex";
                addRealLineMenu.style.justifyContent = "space-evenly";
                addRealLineMenu.style.alignItems = "center";
                addRealLineMenu.style.flexWrap = "wrap"
                this.addingLinesDIV.appendChild(addRealLineMenu);

                const realLineMenu = document.createElement("div");
                realLineMenu.style.height = "100%";
                realLineMenu.style.width = "235px";
                realLineMenu.style.display = "flex";
                realLineMenu.style.justifyContent = "space-around";
                realLineMenu.style.alignItems = "center";
                realLineMenu.style.flexWrap = "wrap"
                addRealLineMenu.appendChild(realLineMenu);



                {
                    const intervalDiv = document.createElement("div");
                    intervalDiv.style.height = "max-content";
                    intervalDiv.style.width = "max-content";
                    // sympleLineInterval.style.marginRight = "30px";
                    realLineMenu.appendChild(intervalDiv);

                    const intervalLable = document.createElement("label");
                    intervalLable.style.height = "max-content";
                    intervalLable.style.marginRight = "3px";
                    intervalLable.style.fontSize = "16px";
                    intervalLable.htmlFor = "scheduleViewer-SettingsMenu-realLineInputInterval"
                    intervalLable.innerText = "interval";
                    intervalDiv.appendChild(intervalLable);


                    const intervalInput = document.createElement("input");
                    intervalInput.type = "input";
                    intervalInput.style.width = `${inputWidth}px`
                    intervalInput.style.height = `${inputHeight}px`
                    intervalInput.id = "scheduleViewer-SettingsMenu-realLineInputInterval";
                    intervalInput.title = this.addingLinesPrm.inputtitle;
                    intervalInput.placeholder = this.addingLinesPrm.inputplaceholder;
                    intervalInput.style.border = `${this.addingLinesPrm.inputsBorder}`
                    intervalInput.style.backgroundColor = `${this.addingLinesPrm.inputsBackground}`
                    intervalDiv.appendChild(intervalInput);
                    this.lineInputs.interval = intervalInput;
                }

                {
                    const durationInputMenu = document.createElement("div");
                    durationInputMenu.style.height = "40px";
                    durationInputMenu.style.width = "100%";
                    durationInputMenu.style.display = "flex";
                    durationInputMenu.style.justifyContent = "space-around";
                    durationInputMenu.style.flexDirection = "column"
                    durationInputMenu.style.alignItems = "center";
                    durationInputMenu.style.flexWrap = "wrap"
                    realLineMenu.appendChild(durationInputMenu);

                    {
                        const typeDIV = document.createElement("div");
                        typeDIV.style.height = "max-content";
                        typeDIV.style.width = "64px";
                        durationInputMenu.appendChild(typeDIV);

                        {
                            const DIV = document.createElement("div");
                            DIV.style.height = "max-content";
                            DIV.style.width = "max-content";
                            typeDIV.appendChild(DIV);

                            const typeLable = document.createElement("label");
                            typeLable.style.height = "max-content";
                            typeLable.style.fontSize = "16px";
                            typeLable.htmlFor = "scheduleViewer-SettingsMenu-realType"
                            typeLable.innerText = "real";
                            DIV.appendChild(typeLable);

                            const type = document.createElement("input");
                            type.type = "radio";
                            type.name = "scheduleViewer-SettingsMenu-type";
                            type.id = "scheduleViewer-SettingsMenu-realType";
                            DIV.appendChild(type);
                            this.lineInputs.radioReal.input = type;
                            this.lineInputs.radioReal.div = DIV;
                        }
                        {
                            const DIV = document.createElement("div");
                            DIV.style.height = "max-content";
                            DIV.style.width = "max-content";
                            typeDIV.appendChild(DIV);

                            const typeLable = document.createElement("label");
                            typeLable.style.height = "max-content";
                            typeLable.style.fontSize = "16px";
                            typeLable.htmlFor = "scheduleViewer-SettingsMenu-sympleType"
                            typeLable.innerText = "simple";
                            DIV.appendChild(typeLable);

                            const type = document.createElement("input");
                            type.type = "radio";
                            type.name = "scheduleViewer-SettingsMenu-type";
                            type.id = "scheduleViewer-SettingsMenu-sympleType";
                            DIV.appendChild(type);
                            this.lineInputs.radioSimple.input = type;
                            this.lineInputs.radioSimple.div = DIV;
                        }
                    }
                    {
                        const durationDIV = document.createElement("div");
                        durationDIV.style.height = "max-content";
                        durationDIV.style.width = "max-content";
                        durationInputMenu.appendChild(durationDIV);

                        const durationLable = document.createElement("label");
                        durationLable.style.height = "max-content";
                        durationLable.style.marginRight = "3px";
                        durationLable.style.fontSize = "16px";
                        durationLable.htmlFor = "scheduleViewer-SettingsMenu-realLineInputDuration"
                        durationLable.innerText = "durations";
                        durationDIV.appendChild(durationLable);


                        const durationInput = document.createElement("input");
                        durationInput.type = "input";
                        durationInput.style.width = `${55}px`
                        durationInput.style.height = `${16}px`
                        durationInput.id = "scheduleViewer-SettingsMenu-realLineInputDuration";
                        durationInput.style.border = `${this.addingLinesPrm.inputsBorder}`
                        durationInput.style.backgroundColor = `${this.addingLinesPrm.inputsBackground}`
                        durationDIV.appendChild(durationInput);
                        this.lineInputs.durations.input = durationInput;
                        this.lineInputs.durations.div = durationDIV;

                        const durationLable2 = document.createElement("label");
                        durationLable2.style.height = "max-content";
                        durationLable2.style.marginRight = "3px";
                        durationLable2.style.fontSize = "16px";
                        durationLable2.htmlFor = "scheduleViewer-SettingsMenu-realLineInputDuration"
                        durationLable2.innerText = "sec list";
                        durationDIV.appendChild(durationLable2);
                    }

                    {
                        const durationDIV = document.createElement("div");
                        durationDIV.style.height = "max-content";
                        durationDIV.style.width = "max-content";
                        durationInputMenu.appendChild(durationDIV);

                        const durationLable = document.createElement("label");
                        durationLable.style.height = "max-content";
                        durationLable.style.marginRight = "3px";
                        durationLable.style.fontSize = "16px";
                        durationLable.htmlFor = "scheduleViewer-SettingsMenu-inputDuration"
                        durationLable.innerText = "duration:";
                        durationDIV.appendChild(durationLable);


                        const durationInput = document.createElement("input");
                        durationInput.type = "input";
                        durationInput.style.width = `${inputWidth}px`
                        durationInput.style.height = `${inputHeight}px`
                        durationInput.id = "scheduleViewer-SettingsMenu-inputDuration";
                        durationInput.title = this.addingLinesPrm.inputtitle;
                        durationInput.placeholder = this.addingLinesPrm.inputplaceholder;
                        durationInput.style.border = `${this.addingLinesPrm.inputsBorder}`
                        durationInput.style.backgroundColor = `${this.addingLinesPrm.inputsBackground}`
                        durationDIV.appendChild(durationInput);
                        this.lineInputs.duration.input = durationInput;
                        this.lineInputs.duration.div = durationDIV;
                    }
                }

                {
                    const startDIV = document.createElement("div");
                    startDIV.style.height = "max-content";
                    startDIV.style.width = "max-content";
                    // sympleLineStart.style.marginRight = "30px";
                    realLineMenu.appendChild(startDIV);

                    const startLable = document.createElement("label");
                    startLable.style.height = "max-content";
                    startLable.style.marginRight = "3px";
                    startLable.style.fontSize = "16px";
                    startLable.htmlFor = "scheduleViewer-SettingsMenu-realLineInputStarth"
                    startLable.innerText = "start:";
                    startDIV.appendChild(startLable);


                    const startInput = document.createElement("input");
                    startInput.type = "input";
                    startInput.style.width = `${inputWidth}px`
                    startInput.style.height = `${inputHeight}px`
                    startInput.id = "scheduleViewer-SettingsMenu-realLineInputStarth";
                    startInput.title = this.addingLinesPrm.inputtitle;
                    startInput.placeholder = this.addingLinesPrm.inputplaceholder;
                    startInput.style.border = `${this.addingLinesPrm.inputsBorder}`
                    startInput.style.backgroundColor = `${this.addingLinesPrm.inputsBackground}`
                    startDIV.appendChild(startInput);
                    this.lineInputs.start = startInput;
                }

                {
                    const endDIV = document.createElement("div");
                    endDIV.style.height = "max-content";
                    endDIV.style.width = "max-content";
                    // sympleLineEnd.style.marginRight = "30px";
                    realLineMenu.appendChild(endDIV);

                    const endLable = document.createElement("label");
                    endLable.style.height = "max-content";
                    endLable.style.marginRight = "3px";
                    endLable.style.fontSize = "16px";
                    endLable.htmlFor = "scheduleViewer-SettingsMenu-realLineInputEndh"
                    endLable.innerText = "end:";
                    endDIV.appendChild(endLable);


                    const endInput = document.createElement("input");
                    endInput.type = "input";
                    endInput.style.width = `${inputWidth}px`
                    endInput.style.height = `${inputHeight}px`
                    endInput.id = "scheduleViewer-SettingsMenu-realLineInputEndh";
                    endInput.title = this.addingLinesPrm.inputtitle;
                    endInput.placeholder = this.addingLinesPrm.inputplaceholder;
                    endInput.style.border = `${this.addingLinesPrm.inputsBorder}`
                    endInput.style.backgroundColor = `${this.addingLinesPrm.inputsBackground}`
                    endDIV.appendChild(endInput);
                    this.lineInputs.end = endInput;
                }

                const breakDiv = document.createElement("div");
                breakDiv.style.height = "0px";
                breakDiv.style.flexBasis = "100%"
                // sympleLineMenu.appendChild(breakDiv);

                const buttonsDIV = document.createElement("div");
                buttonsDIV.style.height = "100%";
                buttonsDIV.style.width = "70px";
                buttonsDIV.style.display = "flex";
                buttonsDIV.style.justifyContent = "space-around";
                buttonsDIV.style.alignItems = "center";
                buttonsDIV.style.flexWrap = "wrap"
                addRealLineMenu.appendChild(buttonsDIV);

                const buttonAdd = document.createElement("button");
                buttonAdd.innerText = "add";
                buttonsDIV.appendChild(buttonAdd);
                this.lineInputs.buttonAdd = buttonAdd;

                const buttonChange = document.createElement("button");
                buttonChange.innerText = "change";
                buttonsDIV.appendChild(buttonChange);
                this.lineInputs.buttonChange = buttonChange;

                const buttonRemove = document.createElement("button");
                buttonRemove.innerText = "remove";
                buttonsDIV.appendChild(buttonRemove);
                this.lineInputs.buttonRemove = buttonRemove;

                this.hintForLinesInputs = document.createElement("div");
                this.hintForLinesInputs.style.height = "15px";
                this.hintForLinesInputs.style.width = "100%";
                this.hintForLinesInputs.style.fontSize = "14px"
                this.hintForLinesInputs.style.textAlign = "center";
                this.hintForLinesInputs.innerText = this.addingLinesPrm.inputtitle;
                addRealLineMenu.appendChild(this.hintForLinesInputs);
            }
        }

        {
            this.loadFilesDIV.style.height = `${this.loadFilesPrm.height}px`
            this.loadFilesDIV.style.display = "flex";
            this.loadFilesDIV.style.justifyContent = "space-around";
            this.loadFilesDIV.style.alignItems = "center";
            this.loadFilesDIV.style.flexDirection = "column";
            this.body.appendChild(this.loadFilesDIV);

            const title = document.createElement("div");
            title.style.height = "max-content";
            title.style.width = "max-content";
            title.innerText = "Load schedule"
            title.style.fontSize = "20px";
            this.loadFilesDIV.appendChild(title);

            this.filesInput = document.createElement("input");
            this.filesInput.type = "file";
            this.filesInput.accept = ".json";
            this.loadFilesDIV.appendChild(this.filesInput);

            const text = document.createElement("div");
            text.style.height = "max-content";
            text.style.width = "max-content";
            text.innerText = "or drag'n'drop file"
            text.style.fontSize = "18px";
            this.loadFilesDIV.appendChild(text);
        }

        {
            this.saveFileDIV.style.height = `${this.saveFilesPrm.height}px`
            this.saveFileDIV.style.display = "flex";
            this.saveFileDIV.style.justifyContent = "space-around";
            this.saveFileDIV.style.alignItems = "center";
            this.saveFileDIV.style.flexDirection = "column";
            this.saveFileDIV.style.marginTop = "20px"
            this.body.appendChild(this.saveFileDIV);

            const title = document.createElement("div");
            title.style.height = "max-content";
            title.style.width = "max-content";
            title.innerText = "Save schedule"
            title.style.fontSize = "20px";
            this.saveFileDIV.appendChild(title);

            this.saveFileButton = document.createElement("button");
            this.saveFileButton.innerText = "Save";
            this.saveFileDIV.appendChild(this.saveFileButton);
        }

        {
            this.overDivPrm.minusWidth = width;
            this.overDivPrm.width = 260;
            this.overDivPrm.height = 100;
            this.overDiv.style.position = "absolute";
            this.overDiv.style.top = `calc(50% - ${this.overDivPrm.height / 2}px)`;
            this.overDiv.style.left = `calc((100% - ${width}px) / 2 - ${this.overDivPrm.width / 2}px)`;
            this.overDiv.style.display = "flex";
            this.overDiv.style.justifyContent = "center";
            this.overDiv.style.alignItems = "center";
            this.overDiv.style.height = `${this.overDivPrm.height}px`;
            this.overDiv.style.width = `${this.overDivPrm.width}px`;
            this.overDiv.style.visibility = "hidden";
            this.body.appendChild(this.overDiv);

            this.overDivText.innerText = "Drop file here";
            this.overDivText.style.fontSize = "40px"
            this.overDivText.classList.add("scheduleViewer_SVGoverText");
            this.overDiv.appendChild(this.overDivText);
        }


        this.toggleMenuEl.addEventListener("click", () => this.toggleMenu());
        this.toggleSepLineEl.addEventListener("change", functions.toggleSepLine);
        this.revTimeInputEl.addEventListener("change", () => this.toggleLineMenuRev());

        this.lineInputs.buttonAdd.addEventListener("click", () => this.lineMenuButtons("add", functions));
        this.lineInputs.buttonChange.addEventListener("click", () => this.lineMenuButtons("change", functions));
        this.lineInputs.buttonRemove.addEventListener("click", () => this.lineMenuButtons("remove", functions));
        this.lineInputs.radioReal.input.addEventListener("click", () => this.disableDuractionInput("real"));
        this.lineInputs.radioSimple.input.addEventListener("click", () => this.disableDuractionInput("simple"));

        this.filesInput.addEventListener("change", (e) => this.loadSchedule(e, functions))
        this.saveFileButton.addEventListener("click", () => this.saveSchedule(functions));

        this.menuSystem("noSelect");

        this.lineInputs.radioReal.input.checked = true;
        this.disableDuractionInput("real");
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
            this.loadFilesDIV.style.visibility = "hidden";
            this.saveFileDIV.style.visibility = "hidden";
            this.menuOpen = false;
        }
        else
        {
            this.body.style.width = `${this.menuWidth}px`;
            this.body.style.minWidth = `${this.menuWidth}px`;
            this.titleDIV.style.visibility = "visible";
            this.settingsDIV.style.visibility = "visible";
            this.addingLinesDIV.style.visibility = "visible";
            this.loadFilesDIV.style.visibility = "visible";
            this.saveFileDIV.style.visibility = "visible";
            this.menuOpen = true;
        }
    }

    private toggleLineMenuRev()
    {
        this.revTimeInput = !this.revTimeInput;
        if (this.revTimeInput)
        {
            const placeholder = "mm:ss";
            const title = "time in format: ss or mm:ss or hh:mm:ss";
            this.lineInputs.interval.placeholder = placeholder;
            this.lineInputs.interval.title = title;
            this.lineInputs.duration.input.placeholder = placeholder;
            this.lineInputs.duration.input.title = title;
            this.lineInputs.start.placeholder = placeholder;
            this.lineInputs.start.title = title;
            this.lineInputs.end.placeholder = placeholder;
            this.lineInputs.end.title = title;

            this.hintForLinesInputs.innerText = "time in format: ss or mm:ss or hh:mm:ss";
        }
        else
        {
            this.lineInputs.interval.placeholder = this.addingLinesPrm.inputplaceholder;
            this.lineInputs.interval.title = this.addingLinesPrm.inputtitle;
            this.lineInputs.duration.input.placeholder = this.addingLinesPrm.inputplaceholder;
            this.lineInputs.duration.input.title = this.addingLinesPrm.inputtitle;
            this.lineInputs.start.placeholder = this.addingLinesPrm.inputplaceholder;
            this.lineInputs.start.title = this.addingLinesPrm.inputtitle;
            this.lineInputs.end.placeholder = this.addingLinesPrm.inputplaceholder;
            this.lineInputs.end.title = this.addingLinesPrm.inputtitle;

            this.hintForLinesInputs.innerText = this.addingLinesPrm.inputtitle;
        }
    }

    private addLine(functions: FunctionsForMenu)
    {
        this.UnmarkAndClear(this.lineInputs.interval);
        if (this.lineInputs.radioSimple.input.checked)
        {
            this.UnmarkAndClear(this.lineInputs.duration.input);
        }
        else
        {
            this.UnmarkAndClear(this.lineInputs.durations.input);
        }
        this.UnmarkAndClear(this.lineInputs.start);
        this.UnmarkAndClear(this.lineInputs.end);

        const inputsData = {
            interval: this.lineInputs.interval.value,
            duration: this.lineInputs.duration.input.value,
            durations: this.lineInputs.duration.input.value,
            start: this.lineInputs.start.value,
            end: this.lineInputs.end.value,
        };

        let lineData;
        try {
            lineData = this.createLineData(inputsData);
        } catch (e)
        {
            if (e == "MyError") return;
            else throw e;
        }

        let inputsDataString;
        if (this.isNumber(inputsDataString.interval.h)) this.markAsCorrect(this.lineInputs.interval);
        else { this.markAsUncorrect(this.lineInputs.interval); return; }
        if (this.isNumber(inputsDataString.interval.m)) this.markAsCorrect(this.lineInputs.interval);
        else { this.markAsUncorrect(this.lineInputs.interval); return; }
        if (this.isNumber(inputsDataString.interval.s)) this.markAsCorrect(this.lineInputs.interval);
        else { this.markAsUncorrect(this.lineInputs.interval); return; }

        if (this.isNumber(inputsDataString.duration.h)) this.markAsCorrect(this.lineInputs.duration.input);
        else { this.markAsUncorrect(this.lineInputs.duration.input); return; }
        if (this.isNumber(inputsDataString.duration.m)) this.markAsCorrect(this.lineInputs.duration.input);
        else { this.markAsUncorrect(this.lineInputs.duration.input); return; }
        if (this.isNumber(inputsDataString.duration.s)) this.markAsCorrect(this.lineInputs.duration.input);
        else { this.markAsUncorrect(this.lineInputs.duration.input); return; }

        if (this.isNumber(inputsDataString.start.h)) this.markAsCorrect(this.lineInputs.start);
        else { this.markAsUncorrect(this.lineInputs.start); return; }
        if (this.isNumber(inputsDataString.start.m)) this.markAsCorrect(this.lineInputs.start);
        else { this.markAsUncorrect(this.lineInputs.start); return; }
        if (this.isNumber(inputsDataString.start.s)) this.markAsCorrect(this.lineInputs.start);
        else { this.markAsUncorrect(this.lineInputs.start); return; }

        if (this.isNumber(inputsDataString.end.h)) this.markAsCorrect(this.lineInputs.end);
        else { this.markAsUncorrect(this.lineInputs.end); return; }
        if (this.isNumber(inputsDataString.end.m)) this.markAsCorrect(this.lineInputs.end);
        else { this.markAsUncorrect(this.lineInputs.end); return; }
        if (this.isNumber(inputsDataString.end.s)) this.markAsCorrect(this.lineInputs.end);
        else { this.markAsUncorrect(this.lineInputs.end); return; }

        this.UnmarkAndClear(this.lineInputs.interval);
        if (this.lineInputs.radioSimple.input.checked)
        {
            this.UnmarkAndClear(this.lineInputs.duration.input);
        }
        else
        {
            this.UnmarkAndClear(this.lineInputs.durations.input);
        }
        this.UnmarkAndClear(this.lineInputs.start);
        this.UnmarkAndClear(this.lineInputs.end);

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
    private createLineData(rawData: {interval: string, duration: string, durations: string, start: string, end: string})
    {
        let interval;
        let duration;
        let start;
        let end;
        try { interval = this.turnStringToSeconds(rawData.interval); }
        catch (e) { this.markAsUncorrect(this.lineInputs.interval); throw "MyError";};
        this.markAsCorrect(this.lineInputs.interval);

        try { duration = this.turnStringToSeconds(rawData.duration); }
        catch (e) { this.markAsUncorrect(this.lineInputs.duration.input); throw "MyError";};
        this.markAsCorrect(this.lineInputs.duration.input);

        try { start = this.turnStringToSeconds(rawData.start); }
        catch (e) { this.markAsUncorrect(this.lineInputs.start); throw "MyError";};
        this.markAsCorrect(this.lineInputs.start);

        try { end = this.turnStringToSeconds(rawData.end); }
        catch (e) { this.markAsUncorrect(this.lineInputs.end); throw "MyError";};
        this.markAsCorrect(this.lineInputs.end);

        return {
            interval: interval,
            duration: duration,
            start: start,
            end: end,
            durations: 0,
        };
    }
    private turnStringToSeconds(string: string)
    {
        const array = string.split(":");
        if (this.revTimeInput)
        {
            if (array[0] == undefined || array[0] == "") throw new Error();
            let h = 0;
            let m = 0;
            let s = 0;
            if (array.length == 1)
            {
                s = parseInt(array[0]);
                if (!this.isNumber(s)) throw new Error();
            }
            else if (array.length == 2)
            {
                m = parseInt(array[0]);
                if (!this.isNumber(m)) throw new Error();
                s = parseInt(array[1]);
                if (!this.isNumber(s)) throw new Error();
            }
            else if (array.length == 3)
            {
                h = parseInt(array[0]);
                if (!this.isNumber(h)) throw new Error();
                m = parseInt(array[1]);
                if (!this.isNumber(m)) throw new Error();
                s = parseInt(array[2]);
                if (!this.isNumber(s)) throw new Error();
            }
            else
            {

            }
            const allTime = h * 60 * 60 + m * 60 + s;
            // console.log(allTime);
            return allTime;
        }
        else
        {
            const strH = array[0];
            const strM = array[1];
            const strS = array[2];
            if (strH == undefined || strH == "") throw new Error();
            const h = parseInt(strH);
            const m = parseInt(strM);
            const s = parseInt(strS);
            if (!this.isNumber(h)) throw new Error();
            let allTime = h * 60 * 60;
            if (strM != undefined)
            {
                if (!this.isNumber(m)) throw new Error();
                allTime += m * 60;
            }
            if (strS != undefined)
            {
                if (!this.isNumber(s)) throw new Error();
                allTime += s;
            }
            // console.log(allTime);
            return allTime;
        }
    }
    private isNumber(num: any)
    {
        if (typeof num == "number" && (num / num == 1 || num == 0)) return true;
        return false;
    }
    private markAsUncorrect(el: HTMLInputElement)
    {
        el.style.border = "1px solid red";
        el.style.backgroundColor = "rgb(255, 180, 180)";
    }
    private markAsCorrect(el: HTMLInputElement)
    {
        el.style.border = "1px solid green";
        el.style.backgroundColor = "lightgreen";
    }
    private UnmarkAndClear(el: HTMLInputElement)
    {
        el.style.border = `${this.addingLinesPrm.inputsBorder}`;
        el.style.backgroundColor = this.addingLinesPrm.inputsBackground;
        // el.value = "";
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

    private lineMenuButtons(button: "change" | "remove" | "add", functions: FunctionsForMenu)
    {
        switch (button) {
            case "add":
                this.addLine(functions);
                break;

            case "change":

                break;

            case "remove":

                break;

            default: throw new Error();
        }
    }

    private menuSystem(state: "noSelect" | "simple" | "real")
    {
        switch (state) {
            case "noSelect":
                this.lineInputs.buttonAdd.disabled = false;
                this.lineInputs.buttonChange.disabled = true;
                this.lineInputs.buttonRemove.disabled = true;

                this.lineInputs.radioSimple.div.style.color = "black";
                this.lineInputs.radioReal.div.style.color = "black";
                this.lineInputs.radioSimple.input.disabled = false;
                this.lineInputs.radioReal.input.disabled = false;

                this.disableDuractionInput("none");
                break;

            case "simple":
                this.lineInputs.buttonAdd.disabled = true;
                this.lineInputs.buttonChange.disabled = false;
                this.lineInputs.buttonRemove.disabled = false;

                this.lineInputs.radioSimple.div.style.color = "gray";
                this.lineInputs.radioReal.div.style.color = "gray";
                this.lineInputs.radioSimple.input.disabled = true;
                this.lineInputs.radioReal.input.disabled = true;

                this.lineInputs.radioSimple.input.checked = true;
                this.disableDuractionInput("simple");
                break;

            case "real":
                this.lineInputs.buttonAdd.disabled = true;
                this.lineInputs.buttonChange.disabled = true;
                this.lineInputs.buttonRemove.disabled = true;

                this.lineInputs.radioSimple.div.style.color = "gray";
                this.lineInputs.radioReal.div.style.color = "gray";
                this.lineInputs.radioSimple.input.disabled = true;
                this.lineInputs.radioReal.input.disabled = true;

                this.lineInputs.radioReal.input.checked = true;
                this.disableDuractionInput("real");
                break;

            default: throw new Error();
        }
    }
    private disableDuractionInput(type: "simple" | "real" | "none")
    {
        switch (type) {
            case "none":
                this.lineInputs.duration.input.disabled = false;
                this.lineInputs.durations.input.disabled = false;

                this.lineInputs.duration.input.style.backgroundColor = this.addingLinesPrm.inputsBackground;
                this.lineInputs.durations.input.style.backgroundColor = this.addingLinesPrm.inputsBackground;

                this.lineInputs.duration.div.style.color = "black";
                this.lineInputs.durations.div.style.color = "black";
                break;

            case "simple":
                this.lineInputs.duration.input.disabled = false;
                this.lineInputs.durations.input.disabled = true;

                this.lineInputs.duration.input.style.backgroundColor = this.addingLinesPrm.inputsBackground;
                this.lineInputs.durations.input.style.backgroundColor = "lightgray";

                this.lineInputs.duration.div.style.color = "black";
                this.lineInputs.durations.div.style.color = "gray";
                break;

            case "real":
                this.lineInputs.duration.input.disabled = true;
                this.lineInputs.durations.input.disabled = false;

                this.lineInputs.duration.input.style.backgroundColor = "lightgray";
                this.lineInputs.durations.input.style.backgroundColor = this.addingLinesPrm.inputsBackground;

                this.lineInputs.duration.div.style.color = "gray";
                this.lineInputs.durations.div.style.color = "black";
                break;
            default: throw new Error();
        }
    }

    private async loadSchedule(e: Event, functions: FunctionsForMenu)
    {
        const eTarget = <HTMLInputElement>e.target;
        if (eTarget == null) return;
        const filesList = eTarget.files;
        if (filesList == null) return;
        const fileText = await filesList[0].text();
        this.addLinesFromFile(fileText, functions);
    }

    public mainBodyDragleave()
    {
        this.overDiv.style.visibility = "hidden";
        this.overDivText.classList.remove("scheduleViewer_SVGoverTextShow");
    }
    public mainBodyDragover(e: DragEvent)
    {
        e.stopPropagation();
        e.preventDefault();
        this.overDiv.style.visibility = "visible";
        this.overDivText.classList.add("scheduleViewer_SVGoverTextShow");
        const dragData = e.dataTransfer;
        if (dragData == null) return;
        dragData.dropEffect = 'copy';
    }

    public async mainBodyDrop(e: DragEvent, functions: FunctionsForMenu)
    {
        e.stopPropagation();
        e.preventDefault();
        this.overDiv.style.visibility = "hidden";
        const dragData = e.dataTransfer;
        if (dragData == null) return;
        const filesList = dragData.files;
        if (filesList == null) return;
        const fileText = await filesList[0].text();
        this.addLinesFromFile(fileText, functions);
    }
    private addLinesFromFile(fileText: string, functions: FunctionsForMenu)
    {
        const newSchedule = <Schedule>JSON.parse(fileText);
        // console.log(newSchedule);
        functions.resetLines();

        for (let i = 0; i < newSchedule.simpleLines.length; i++) {
            const el = newSchedule.simpleLines[i];
            functions.addSympleLine(el.interval, el.duration, el.start, el.end);
        }
        for (let i = 0; i < newSchedule.realLines.length; i++) {
            const el = newSchedule.realLines[i];
            functions.addRealLine(el.interval, el.durations, el.start, el.end);
        }
        functions.recreate();
    }


    private saveSchedule(functions: FunctionsForMenu)
    {
        const scheduleRaw = functions.getLines();
        const scheduleSave = <Schedule><unknown>{ simpleLines: [], realLines: [] };
        for (let i = 1; i < scheduleRaw.length; i++) {
            const el = scheduleRaw[i];
            if (el.real)
            {
                const newEl = {
                    interval: el.dasharray[0],
                    durations: <number[]>el.dasharray[1],
                    start: el.start,
                    end: el.end,
                };
                scheduleSave.realLines.push(newEl);
            }
            else
            {
                const newEl = {
                    interval: el.dasharray[0],
                    duration: <number>el.dasharray[1],
                    start: el.start,
                    end: el.end,
                };
                scheduleSave.simpleLines.push(newEl);
            }
        }
        const scheduleText = JSON.stringify(scheduleSave, undefined, "  ");
        // console.log(scheduleRaw);
        // console.log(scheduleSave);
        const scheduleTextSimplify = scheduleText.replace(/\n        /g, "");
        const codeArea = document.getElementById("codeArea");
        if (codeArea != null) codeArea.innerText = scheduleTextSimplify;

        this.downloadFile("schedule.json", scheduleTextSimplify);
    }

    private downloadFile(filename: string, text: string) {
        var el = document.createElement('a');
        el.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        el.setAttribute('download', filename);

        el.style.display = 'none';
        document.body.appendChild(el);

        el.click();

        document.body.removeChild(el);
      }
}