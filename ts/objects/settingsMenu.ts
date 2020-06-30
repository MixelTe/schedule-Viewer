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
    private addingLinesPrm = { height: 200, inputsBorder: "1px solid grey" };
    private lineInputs = {
        radioReal: <HTMLInputElement>{},
        radioSimple: <HTMLInputElement>{},
        interval: <HTMLInputElement>{},
        duration: <HTMLInputElement>{},
        durations: <HTMLInputElement>{},
        start: <HTMLInputElement> {},
        end: <HTMLInputElement>{},
        buttonAdd: <HTMLButtonElement>{},
        buttonChange: <HTMLButtonElement>{},
        buttonRemove: <HTMLButtonElement>{},
    };
    private linesMenuState: "noSelect" | "simple" | "real";

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



            // const showAfterEnd = document.createElement("div");
            // showAfterEnd.style.height = "max-content";
            // showAfterEnd.style.width = "max-content";
            // menu.appendChild(showAfterEnd);

            // const showAfterEndInput = document.createElement("input");
            // showAfterEndInput.type = "checkbox";
            // showAfterEndInput.id = "scheduleViewer-SettingsMenu-showAfterEndInput";
            // showAfterEnd.appendChild(showAfterEndInput);

            // const showAfterEndLable = document.createElement("label");
            // showAfterEndLable.style.height = "max-content";
            // showAfterEndLable.style.fontSize = "16px";
            // showAfterEndLable.htmlFor = "scheduleViewer-SettingsMenu-showAfterEndInput"
            // showAfterEndLable.innerText = "hide after end";
            // showAfterEnd.appendChild(showAfterEndLable);

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
            const inputtitle = "time in format: hh or hh:mm or hh:mm:ss";
            const inputplaceholder = "hh:mm:ss";

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
                    intervalInput.title = inputtitle;
                    intervalInput.placeholder = inputplaceholder;
                    intervalInput.style.border = `${this.addingLinesPrm.inputsBorder}`
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
                            this.lineInputs.radioReal = type;
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
                            this.lineInputs.radioSimple = type;
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
                        durationDIV.appendChild(durationInput);
                        this.lineInputs.durations = durationInput;

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
                        durationInput.title = inputtitle;
                        durationInput.placeholder = inputplaceholder;
                        durationInput.style.border = `${this.addingLinesPrm.inputsBorder}`
                        durationDIV.appendChild(durationInput);
                        this.lineInputs.duration = durationInput;
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
                    startInput.title = inputtitle;
                    startInput.placeholder = inputplaceholder;
                    startInput.style.border = `${this.addingLinesPrm.inputsBorder}`
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
                    endInput.title = inputtitle;
                    endInput.placeholder = inputplaceholder;
                    endInput.style.border = `${this.addingLinesPrm.inputsBorder}`
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

        this.lineInputs.buttonAdd.addEventListener("click", () => this.addSympleLine(functions));
        this.lineInputs.buttonChange.addEventListener("click", () => this.sympleLineButtons("change", functions));
        this.lineInputs.buttonRemove.addEventListener("click", () => this.sympleLineButtons("remove", functions));

        this.filesInput.addEventListener("change", (e) => this.loadSchedule(e, functions))
        this.saveFileButton.addEventListener("click", () => this.saveSchedule(functions));

        this.linesMenuState = "noSelect";
        this.menuSystem();
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

    private sympleLineButtons(button: "change" | "remove", functions: FunctionsForMenu)
    {
        switch (button) {
            case "change":

                break;

            case "remove":

                break;

            default:
                break;
        }
    }

    private menuSystem()
    {
        switch (this.linesMenuState) {
            case "noSelect":
                this.lineInputs.buttonAdd.disabled = false;
                this.lineInputs.buttonChange.disabled = true;
                this.lineInputs.buttonRemove.disabled = true;

                this.lineInputs.duration.disabled = false;
                this.lineInputs.durations.disabled = false;
                break;

            case "simple":
                this.lineInputs.buttonAdd.disabled = true;
                this.lineInputs.buttonChange.disabled = false;
                this.lineInputs.buttonRemove.disabled = false;

                this.lineInputs.duration.disabled = false;
                this.lineInputs.durations.disabled = true;
                break;

            case "real":
                this.lineInputs.buttonAdd.disabled = true;
                this.lineInputs.buttonChange.disabled = true;
                this.lineInputs.buttonRemove.disabled = true;

                this.lineInputs.duration.disabled = true;
                this.lineInputs.durations.disabled = false;
                break;

            default:
                break;
        }
    }
    private lineTypeSelection(type: "simple" | "real")
    {
        switch (type) {
            case "simple":

                break;

            case "real":

                break;

            default:
                break;
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