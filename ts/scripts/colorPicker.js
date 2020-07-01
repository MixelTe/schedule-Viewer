"use strict";
export class ColorPicker {
    constructor(options = {}) {
        this.height = 230;
        this.width = 190;
        this.X = 0;
        this.Y = 0;
        this.clickHandler = this.isInFocus.bind(this);
        this.closeHandler = this.close.bind(this);
        this.canvaUpHandler = this.canvaMouse.bind(this, "up");
        this.cursorX = 0;
        this.cursorY = 0;
        this.firstClick = false;
        this.isOpen = false;
        this.colorIsChanging = false;
        this.changeBackground = false;
        this.changeBorder = false;
        this.segWidth = 3;
        this.colorH = 0;
        this.colorS = 100;
        this.colorL = 50;
        this.placement_side = "up";
        this.placement_align = "left";
        this.placement_strict = false;
        this.baseStyle = {
            buttonOk: { background: "green", text: "black", borderColor: "black", borderWidth: 1 },
            buttonCancel: { background: "red", text: "black", borderColor: "black", borderWidth: 1 },
            window: { background: "lightgray", text: "black", borderColor: "black", borderWidth: 3 },
            inputs: { background: "white", text: "black", borderColor: "rgb(118, 118, 118)", borderWidth: 2 },
            roundCorners: true,
            pickedColorBackground: false,
            pickedColorBorder: false,
            zIndex: 10000000,
        };
        this.eventsMap = new Map();
        const topMenuHeight = 4;
        const bottomMenuHeight = 22;
        this.menuWindow = document.createElement("div");
        this.menuWindow.style.backgroundColor = "lightgray";
        this.menuWindow.style.border = "3px solid black";
        this.menuWindow.style.borderRadius = "5%";
        this.menuWindow.style.width = this.width + "px";
        this.menuWindow.style.height = this.height + "px";
        this.menuWindow.style.display = "block";
        this.menuWindow.style.position = "absolute";
        this.menuWindow.style.left = "40px";
        this.menuWindow.style.top = "40px";
        this.menuWindow.style.zIndex = "10000000";
        {
            this.menuTop = document.createElement("div");
            // this.menuTop.style.backgroundColor = "darkgray";
            this.menuTop.style.width = "100%";
            this.menuTop.style.height = topMenuHeight + "px";
            this.menuTop.style.display = "block";
            this.menuWindow.appendChild(this.menuTop);
        }
        {
            const canvaWidth = 184;
            const canvaHeight = 120;
            // const canvaWidth = 760;
            // const canvaHeight = 700;
            this.menu = document.createElement("div");
            // this.menu.style.backgroundColor = "lightgray";
            this.menu.style.borderRadius = "5%";
            this.menu.style.width = "100%";
            this.menu.style.height = this.height - topMenuHeight - bottomMenuHeight + "px";
            this.menu.style.display = "block";
            this.menuWindow.appendChild(this.menu);
            this.canva = document.createElement("canvas");
            this.canva.style.backgroundColor = "white";
            this.canva.style.border = "2px solid black";
            this.canva.style.boxSizing = "border-box";
            this.canva.style.borderRadius = "5px 5px 0px 0px";
            this.canva.style.width = canvaWidth + "px";
            this.canva.style.height = canvaHeight + "px";
            this.canva.width = canvaWidth;
            this.canva.height = canvaHeight;
            this.canva.style.display = "block";
            this.canva.style.marginLeft = "auto";
            this.canva.style.marginRight = "auto";
            this.menu.appendChild(this.canva);
            this.cursor = document.createElement("canvas");
            this.cursor.style.border = "2px solid transparent";
            this.cursor.style.boxSizing = "border-box";
            this.cursor.style.borderRadius = "5px 5px 0px 0px";
            this.cursor.style.width = canvaWidth + "px";
            this.cursor.style.height = canvaHeight + "px";
            this.cursor.width = canvaWidth;
            this.cursor.height = canvaHeight;
            this.cursor.style.display = "block";
            this.cursor.style.position = "absolute";
            this.cursor.style.top = topMenuHeight + "px";
            this.cursor.style.left = "3px";
            this.menu.appendChild(this.cursor);
            this.curColorDiv = document.createElement("div");
            this.curColorDiv.style.backgroundColor = this.getHSLColor();
            // this.curColorDiv.style.backgroundColor = "lightblue";
            this.curColorDiv.style.borderRadius = "0 0 5px 5px";
            this.curColorDiv.style.width = canvaWidth + "px";
            this.curColorDiv.style.height = "15px";
            this.curColorDiv.style.display = "block";
            this.curColorDiv.style.marginLeft = "auto";
            this.curColorDiv.style.marginRight = "auto";
            this.menu.appendChild(this.curColorDiv);
            const rangeInputHWidth = 180;
            const rangeInputHHeight = 25;
            let backgrounRangeInput;
            {
                const canva = document.createElement("canvas");
                canva.width = rangeInputHWidth;
                canva.height = rangeInputHHeight;
                const ctx = canva.getContext("2d");
                if (ctx != null) {
                    const segWidth = 2;
                    // const segWidth = rangeInputHWidth / 360;
                    const multiply = rangeInputHWidth / 360 / segWidth;
                    for (let i = 0; i < rangeInputHWidth / segWidth; i++) {
                        ctx.fillStyle = `hsl(${i / multiply}, 100%, 50%)`;
                        ctx?.fillRect(segWidth * i, 0, segWidth, rangeInputHHeight);
                    }
                }
                backgrounRangeInput = 'url(' + canva.toDataURL("image/png") + ')';
            }
            this.rangeInputH = document.createElement("input");
            this.rangeInputH.type = "range";
            this.rangeInputH.min = "0";
            this.rangeInputH.max = "360";
            this.rangeInputH.classList.toggle("ColorPickerHInput");
            this.rangeInputH.style.outline = "none";
            this.rangeInputH.style.webkitAppearance = "none";
            // this.rangeInputH.style.backgroundColor = "lightgreen";
            this.rangeInputH.style.backgroundImage = backgrounRangeInput;
            this.rangeInputH.style.borderRadius = "5px";
            this.rangeInputH.style.width = rangeInputHWidth + "px";
            this.rangeInputH.style.height = rangeInputHHeight + "px";
            this.rangeInputH.style.display = "block";
            this.rangeInputH.style.marginLeft = "auto";
            this.rangeInputH.style.marginRight = "auto";
            this.menu.appendChild(this.rangeInputH);
            {
                const inputWidth = 25;
                const inputHeight = 16;
                const divForInputs = document.createElement("table");
                divForInputs.style.width = "90%";
                divForInputs.style.height = "26px";
                divForInputs.style.marginLeft = "auto";
                divForInputs.style.marginRight = "auto";
                this.menu.appendChild(divForInputs);
                const divForInputsH = document.createElement("td");
                divForInputs.appendChild(divForInputsH);
                const textH = document.createElement("label");
                textH.style.display = "inline-block";
                textH.innerText = "H:";
                textH.htmlFor = "inputH";
                textH.style.userSelect = "none";
                divForInputsH.appendChild(textH);
                this.inputH = document.createElement("input");
                this.inputH.style.display = "inline-block";
                this.inputH.type = "text";
                this.inputH.id = "inputH";
                this.inputH.style.width = inputWidth + "px";
                this.inputH.style.height = inputHeight + "px";
                divForInputsH.appendChild(this.inputH);
                const divForInputsS = document.createElement("td");
                divForInputs.appendChild(divForInputsS);
                const textS = document.createElement("label");
                textS.style.display = "inline-block";
                textS.innerText = "S:";
                textS.htmlFor = "inputS";
                textS.style.userSelect = "none";
                divForInputsS.appendChild(textS);
                this.inputS = document.createElement("input");
                this.inputS.style.display = "inline-block";
                this.inputS.type = "text";
                this.inputS.id = "inputS";
                this.inputS.style.width = inputWidth + "px";
                this.inputS.style.height = inputHeight + "px";
                divForInputsS.appendChild(this.inputS);
                const divForInputsL = document.createElement("td");
                divForInputs.appendChild(divForInputsL);
                const textL = document.createElement("label");
                textL.style.display = "inline-block";
                textL.innerText = "L:";
                textL.htmlFor = "inputL";
                textL.style.userSelect = "none";
                divForInputsL.appendChild(textL);
                this.inputL = document.createElement("input");
                this.inputL.style.display = "inline-block";
                this.inputL.type = "text";
                this.inputL.id = "inputL";
                this.inputL.style.width = inputWidth + "px";
                this.inputL.style.height = inputHeight + "px";
                divForInputsL.appendChild(this.inputL);
            }
        }
        {
            this.menuBottom = document.createElement("div");
            // this.menuTop.style.backgroundColor = "darkgray";
            this.menuBottom.style.width = "100%";
            this.menuBottom.style.height = bottomMenuHeight + "px";
            this.menuBottom.style.display = "block";
            this.menuWindow.appendChild(this.menuBottom);
            const buttonDIV = document.createElement("div");
            // this.menuTop.style.backgroundColor = "darkgray";
            buttonDIV.style.width = "80px";
            buttonDIV.style.height = bottomMenuHeight + "px";
            buttonDIV.style.display = "block";
            buttonDIV.style.marginLeft = this.width - 80 + 8 + "px";
            this.menuBottom.appendChild(buttonDIV);
            const okButtonHeight = 17;
            this.closeButton = document.createElement("div");
            this.closeButton.style.borderRadius = "7px 0px 0px 7px";
            this.closeButton.style.boxSizing = "border-box";
            this.closeButton.style.backgroundColor = "red";
            this.closeButton.style.color = "black";
            this.closeButton.style.border = "1px solid black";
            this.closeButton.style.borderRightWidth = "0px";
            this.closeButton.style.width = "18px";
            this.closeButton.style.height = okButtonHeight + "px";
            this.closeButton.style.display = "table-cell";
            this.closeButton.style.cursor = "pointer";
            this.closeButton.style.backgroundImage = this.drawCloseButton();
            buttonDIV.appendChild(this.closeButton);
            this.okButton = document.createElement("div");
            this.okButton.style.borderRadius = "0px 7px 7px 0px";
            this.okButton.style.boxSizing = "border-box";
            this.okButton.style.backgroundColor = "green";
            this.okButton.style.color = "black";
            this.okButton.style.border = "1px solid black";
            this.okButton.style.borderLeftWidth = "0px";
            this.okButton.style.width = "42px";
            this.okButton.style.height = okButtonHeight + "px";
            this.okButton.style.display = "table-cell";
            this.okButton.style.cursor = "pointer";
            this.okButton.style.textAlign = "left";
            this.okButton.style.paddingLeft = "8px";
            this.okButton.style.marginTop = "8px";
            this.okButton.innerText = "OK";
            buttonDIV.appendChild(this.okButton);
        }
        this.multiplyX = this.canva.width / 100 / this.segWidth;
        this.multiplyX_ = this.canva.width / 50 / this.segWidth;
        this.multiplyY = this.canva.height / 50 / this.segWidth;
        const context2 = this.cursor.getContext("2d");
        if (context2 != null) {
            this.ctxCursor = context2;
        }
        else {
            throw new Error("canvas2 not found");
        }
        const context = this.canva.getContext("2d");
        if (context != null) {
            this.ctx = context;
            this.drawPalette();
            this.calculateNewCurCords();
            this.drawCursor();
        }
        else {
            throw new Error("canvas not found");
        }
        this.rangeInputH.value = `${this.colorH}`;
        this.inputH.value = `${this.colorH}`;
        this.inputS.value = `${this.colorS}`;
        this.inputL.value = `${this.colorL}`;
        this.setStyle(options);
    }
    openMenu_onCoordinates(x, y) {
        this.moveMenuToCoordinates(x, y);
        this.open();
    }
    openMenu(rect, side, align, strict) {
        this.firstClick = true;
        this.moveMenuAroundRect(rect, side, align, strict);
        this.displayColor();
        this.open();
    }
    setColorHSL(h, s, l) {
        this.colorH = Math.max(Math.min(h, 360), 0);
        this.colorS = Math.max(Math.min(s, 100), 0);
        this.colorL = Math.max(Math.min(l, 100), 0);
        this.rangeInputH.value = `${this.colorH}`;
        this.inputH.value = `${this.colorH}`;
        this.inputL.value = `${this.colorL}`;
        this.inputS.value = `${this.colorS}`;
        this.displayColor();
        this.calculateNewCurCords();
        this.drawPalette();
        this.drawCursor();
    }
    setColorRGB(r, g, b) {
        const hsl = this.RGBToHSL(r, g, b);
        this.colorH = Math.max(Math.min(hsl[0], 360), 0);
        this.colorS = Math.max(Math.min(hsl[1], 100), 0);
        this.colorL = Math.max(Math.min(hsl[2], 100), 0);
        this.rangeInputH.value = `${this.colorH}`;
        this.inputH.value = `${this.colorH}`;
        this.inputL.value = `${this.colorL}`;
        this.inputS.value = `${this.colorS}`;
        this.displayColor();
        this.calculateNewCurCords();
        this.drawPalette();
        this.drawCursor();
    }
    setPlacement(side, align, strict) {
        if (typeof side == "string") {
            switch (side) {
                case "up":
                case "down":
                    this.placement_side = side;
                    break;
                default: throw new Error(`positionY parameter invalid. It can be: 'up' or 'down'. Your value: '${side}'`);
            }
        }
        if (typeof align == "string") {
            switch (align) {
                case "left":
                case "center":
                case "right":
                    this.placement_align = align;
                    break;
                default: throw new Error(`positionX parameter invalid. It can be: 'left', 'center' or 'right'. Your value: '${align}'`);
            }
        }
        if (typeof strict == "boolean") {
            this.placement_strict = strict;
        }
    }
    getColor() {
        const rgb = this.HSLToRGB(this.colorH, this.colorH, this.colorL);
        return {
            h: this.colorH,
            s: this.colorH,
            l: this.colorL,
            colorHSL: this.getHSLColor(),
            r: rgb[0],
            g: rgb[1],
            b: rgb[2],
            colorRBG: `rbg(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
        };
    }
    setStyle(options) {
        if (typeof options.roundCorners == "boolean") {
            if (options.roundCorners) {
                this.menuWindow.style.borderRadius = "5%";
                this.menu.style.borderRadius = "5%";
                this.canva.style.borderRadius = "5px 5px 0px 0px";
                this.cursor.style.borderRadius = "5px 5px 0px 0px";
                this.curColorDiv.style.borderRadius = "0 0 5px 5px";
                this.rangeInputH.style.borderRadius = "5px";
                this.closeButton.style.borderRadius = "7px 0px 0px 7px";
                this.okButton.style.borderRadius = "0px 7px 7px 0px";
            }
            else {
                this.menuWindow.style.borderRadius = "0";
                this.menu.style.borderRadius = "0";
                this.canva.style.borderRadius = "0";
                this.cursor.style.borderRadius = "0";
                this.curColorDiv.style.borderRadius = "0";
                this.rangeInputH.style.borderRadius = "0";
                this.closeButton.style.borderRadius = "0";
                this.okButton.style.borderRadius = "0";
            }
        }
        if (typeof options.pickedColorBackground == "boolean") {
            this.changeBackground = options.pickedColorBackground;
        }
        if (typeof options.pickedColorBorder == "boolean") {
            this.changeBorder = options.pickedColorBorder;
        }
        if (typeof options.zIndex == "number") {
            this.menuWindow.style.zIndex = `${options.zIndex}`;
        }
        if (options.buttonOk != null) {
            if (options.buttonOk.text != null) {
                this.okButton.style.color = options.buttonOk.text;
            }
            if (options.buttonOk.background != null) {
                this.okButton.style.backgroundColor = options.buttonOk.background;
            }
            if (options.buttonOk.borderColor != null) {
                this.okButton.style.borderColor = options.buttonOk.borderColor;
            }
            if (options.buttonOk.borderWidth != null) {
                const w = options.buttonOk.borderWidth;
                this.okButton.style.borderWidth = `${w}px ${w}px ${w}px 0px`;
            }
        }
        if (options.buttonCancel != null) {
            if (options.buttonCancel.text != null) {
                this.closeButton.style.color = options.buttonCancel.text;
                this.closeButton.style.backgroundImage = "url()";
                this.closeButton.style.backgroundImage = this.drawCloseButton();
            }
            if (options.buttonCancel.background != null) {
                this.closeButton.style.backgroundColor = options.buttonCancel.background;
                this.closeButton.style.backgroundImage = "url()";
                this.closeButton.style.backgroundImage = this.drawCloseButton();
            }
            if (options.buttonCancel.borderColor != null) {
                this.closeButton.style.borderColor = options.buttonCancel.borderColor;
            }
            if (options.buttonCancel.borderWidth != null) {
                const w = options.buttonCancel.borderWidth;
                this.closeButton.style.borderWidth = `${w}px 0px ${w}px ${w}px`;
            }
        }
        if (options.window != null) {
            if (options.window.text != null) {
                this.menuWindow.style.color = options.window.text;
            }
            if (options.window.background != null) {
                this.menuWindow.style.backgroundColor = options.window.background;
            }
            if (options.window.borderColor != null) {
                this.menuWindow.style.borderColor = options.window.borderColor;
            }
            if (options.window.borderWidth != null) {
                this.menuWindow.style.borderWidth = options.window.borderWidth + "px";
            }
        }
        if (options.inputs != null) {
            if (options.inputs.text != null) {
                this.inputH.style.color = options.inputs.text;
                this.inputL.style.color = options.inputs.text;
                this.inputS.style.color = options.inputs.text;
            }
            if (options.inputs.background != null) {
                this.inputH.style.backgroundColor = options.inputs.background;
                this.inputL.style.backgroundColor = options.inputs.background;
                this.inputS.style.backgroundColor = options.inputs.background;
            }
            if (options.inputs.borderColor != null) {
                this.inputH.style.borderColor = options.inputs.borderColor;
                this.inputL.style.borderColor = options.inputs.borderColor;
                this.inputS.style.borderColor = options.inputs.borderColor;
            }
            if (options.inputs.borderWidth != null) {
                this.inputH.style.borderWidth = options.inputs.borderWidth + "px";
                this.inputL.style.borderWidth = options.inputs.borderWidth + "px";
                this.inputS.style.borderWidth = options.inputs.borderWidth + "px";
            }
        }
    }
    pick(rect, side, align, strict) {
        return new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.openMenu(rect, side, align, strict);
        });
    }
    pick_onCoordinates(x, y) {
        return new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.openMenu_onCoordinates(x, y);
        });
    }
    moveMenuToCoordinates(x, y) {
        let newY = y - this.height - parseInt(this.menuWindow.style.borderWidth, 10) * 2;
        if (newY < 0)
            newY = y;
        this.Y = newY;
        this.menuWindow.style.top = newY + "px";
        let newX = x - this.width / 2;
        newX = Math.max(Math.min(newX, document.body.offsetWidth - this.width - parseInt(this.menuWindow.style.borderWidth, 10) * 2), 0);
        this.X = newX;
        this.menuWindow.style.left = newX + "px";
    }
    moveMenuAroundRect(rect, side = this.placement_side, align = this.placement_align, strict = this.placement_strict) {
        if (typeof rect != "object")
            throw new Error(`rect parameter invalid. It must be object with parameters: x, y, width, height, where y is upper left corner. Your value: '${rect}'`);
        if (typeof rect.x != "number")
            throw new Error(`rect.x parameter invalid. It must be number. Your value: '${rect.x}'`);
        if (typeof rect.y != "number")
            throw new Error(`rect.y parameter invalid. It must be number that mean upper left corner of rect. Your value: '${rect.y}'`);
        if (typeof rect.width != "number")
            throw new Error(`rect.width parameter invalid. It must be number. Your value: '${rect.width}'`);
        if (typeof rect.height != "number")
            throw new Error(`rect.height parameter invalid. It must be number. Your value: '${rect.height}'`);
        switch (side) {
            case "up":
                {
                    let newY = rect.y - this.height - parseInt(this.menuWindow.style.borderWidth, 10) * 2;
                    if (!strict && newY < 0) {
                        newY = rect.y + rect.height;
                    }
                    this.Y = newY;
                    this.menuWindow.style.top = newY + "px";
                }
                break;
            case "down":
                {
                    let newY = rect.y + rect.height;
                    if (!strict && newY + this.height > document.body.offsetHeight && rect.y - this.height > 0) {
                        newY = rect.y - this.height - parseInt(this.menuWindow.style.borderWidth, 10) * 2;
                    }
                    this.Y = newY;
                    this.menuWindow.style.top = newY + "px";
                }
                break;
            default:
                throw new Error(`positionY parameter invalid. It can be: 'up' or 'down'. Your value: '${side}'`);
        }
        switch (align) {
            case "left":
                {
                    let newX = rect.x;
                    if (!strict && newX > document.body.offsetWidth - this.width) {
                        newX = rect.x + rect.width - this.width - parseInt(this.menuWindow.style.borderWidth, 10) * 2;
                    }
                    this.X = newX;
                    this.menuWindow.style.left = newX + "px";
                }
                break;
            case "center":
                {
                    let newX = rect.x + rect.width / 2 - this.width / 2;
                    if (!strict) {
                        newX = Math.max(Math.min(newX, document.body.offsetWidth - this.width), 0);
                    }
                    this.X = newX;
                    this.menuWindow.style.left = newX + "px";
                }
                break;
            case "right":
                {
                    let newX = rect.x + rect.width - this.width - parseInt(this.menuWindow.style.borderWidth, 10) * 2;
                    if (!strict && newX < document.body.offsetLeft) {
                        newX = rect.x;
                    }
                    this.X = newX;
                    this.menuWindow.style.left = newX + "px";
                }
                break;
            default:
                throw new Error(`positionX parameter invalid. It can be: 'left', 'center' or 'right'. Your value: '${align}'`);
        }
    }
    drawPalette() {
        for (let y = 0; y < this.canva.height / this.segWidth; y++) {
            for (let x = 0; x < this.canva.width / this.segWidth; x++) {
                const l = ((100 - x / this.multiplyX_) / 50) * (50 - y / this.multiplyY);
                this.ctx.fillStyle = `hsl(${this.colorH}, ${x / this.multiplyX}%, ${l}%)`;
                this.ctx.fillRect(this.segWidth * x, this.segWidth * y, this.segWidth, this.segWidth);
            }
        }
    }
    getHSLColor() {
        return `hsl(${this.colorH}, ${this.colorS}%, ${this.colorL}%)`;
    }
    drawCursor() {
        this.ctxCursor.clearRect(0, 0, this.cursor.width, this.cursor.height);
        this.ctxCursor.strokeStyle = `black`;
        this.ctxCursor.lineWidth = 3;
        this.ctxCursor.beginPath();
        this.ctxCursor.arc(this.cursorX + 1, this.cursorY + 1, 5, 1, 20);
        this.ctxCursor.stroke();
        this.ctxCursor.strokeStyle = `white`;
        this.ctxCursor.lineWidth = 1;
        this.ctxCursor.beginPath();
        this.ctxCursor.arc(this.cursorX + 1, this.cursorY + 1, 5, 1, 20);
        this.ctxCursor.stroke();
    }
    changeHColor(rangeInput) {
        if (rangeInput) {
            const value = parseInt(this.rangeInputH.value, 10);
            this.colorH = value;
            this.inputH.value = `${value}`;
            this.drawPalette();
        }
        else {
            let value = parseInt(this.inputH.value, 10);
            if (value - value == 0 && 0 <= value && value <= 360) {
                this.colorH = value;
                this.rangeInputH.value = `${value}`;
                this.drawPalette();
            }
            let valuestr = this.inputL.value;
            if (valuestr.length > 3) {
                this.inputH.value = valuestr.slice(0, 3);
            }
        }
        this.displayColor();
    }
    changeSColor() {
        let value = parseInt(this.inputS.value, 10);
        if (value - value == 0 && 0 <= value && value <= 100) {
            this.colorS = value;
            this.calculateNewCurCords();
            this.drawCursor();
        }
        let valuestr = this.inputL.value;
        if (valuestr.length > 3) {
            this.inputS.value = valuestr.slice(0, 3);
        }
        this.displayColor();
    }
    changeLColor() {
        let value = parseInt(this.inputL.value, 10);
        if (value - value == 0 && 0 <= value && value <= 100) {
            this.colorL = value;
            this.calculateNewCurCords();
            this.drawCursor();
        }
        let valuestr = this.inputL.value;
        if (valuestr.length > 3) {
            this.inputL.value = valuestr.slice(0, 3);
        }
        this.displayColor();
    }
    displayColor() {
        this.curColorDiv.style.backgroundColor = this.getHSLColor();
        if (this.changeBackground)
            this.menuWindow.style.backgroundColor = this.getHSLColor();
        if (this.changeBorder)
            this.menuWindow.style.borderColor = this.getHSLColor();
    }
    calculateNewCurCords() {
        let x = this.colorS * this.multiplyX;
        let y = -(50 * this.multiplyY * (this.multiplyX_ * (-100 + this.colorL) + x)) / (100 * this.multiplyX_ - x);
        if (y < 0) {
            x = x + y / this.multiplyX;
            y = 0;
        }
        x *= this.segWidth;
        y *= this.segWidth;
        x = Math.min(Math.max(x, 2), this.canva.width - 2);
        y = Math.min(Math.max(y, 2), this.canva.height - 2);
        this.cursorX = x;
        this.cursorY = y;
        // console.log(x, y);
    }
    canvaClick(e) {
        let x = Math.abs(e.offsetX);
        let y = Math.abs(e.offsetY);
        this.cursorX = x;
        this.cursorY = y;
        this.drawCursor();
        x = Math.floor(x / this.segWidth);
        y = Math.floor(y / this.segWidth);
        let s = x / this.multiplyX;
        let l = ((100 - x / this.multiplyX_) / 50) * (50 - y / this.multiplyY);
        s = Math.round(s);
        l = Math.round(l);
        this.colorS = s;
        this.colorL = l;
        this.inputS.value = `${s}`;
        this.inputL.value = `${l}`;
        this.displayColor();
    }
    canvaMouse(state, e) {
        switch (state) {
            case "down":
                this.colorIsChanging = true;
                this.canvaClick(e);
                break;
            case "move":
                if (this.colorIsChanging) {
                    this.canvaClick(e);
                    this.fireEvent("input");
                    // console.log(`color input: h:${this.colorH} s:${this.colorS} l:${this.colorL}`);
                }
                break;
            case "up":
                if (this.colorIsChanging) {
                    this.fireEvent("changed");
                    // console.log(`color changed: h:${this.colorH} s:${this.colorS} l:${this.colorL}`);
                }
                this.colorIsChanging = false;
                break;
        }
    }
    buttonClickCancel() {
        this.fireEvent("canceled");
        this.close();
        this.setPromiseResult(undefined);
    }
    buttonClickOk() {
        this.fireEvent("confirmed");
        this.close();
        this.setPromiseResult(this.getColor());
    }
    setPromiseResult(color) {
        if (this.resolve != null) {
            this.resolve(color);
            this.resolve = undefined;
        }
    }
    inputs(input) {
        switch (input) {
            case "colorHRange":
                this.changeHColor(true);
                break;
            case "colorH":
                this.changeHColor(false);
                break;
            case "colorS":
                this.changeSColor();
                break;
            case "colorL":
                this.changeLColor();
                break;
            default:
                break;
        }
        if (input == "changed") {
            this.fireEvent("changed");
            // console.log(`color changed: h:${this.colorH} s:${this.colorS} l:${this.colorL}`)
        }
        else {
            this.fireEvent("input");
            // console.log(`color input: h:${this.colorH} s:${this.colorS} l:${this.colorL}`)
        }
    }
    open() {
        if (!this.isOpen) {
            this.isOpen = true;
            document.body.appendChild(this.menuWindow);
            this.firstClick = true;
            document.addEventListener("click", this.clickHandler);
            window.addEventListener("resize", this.closeHandler);
            this.closeButton.addEventListener("click", () => this.buttonClickCancel());
            this.okButton.addEventListener("click", () => this.buttonClickOk());
            this.rangeInputH.addEventListener("input", () => this.inputs("colorHRange"));
            this.inputH.addEventListener("input", () => this.inputs("colorH"));
            this.inputS.addEventListener("input", () => this.inputs("colorS"));
            this.inputL.addEventListener("input", () => this.inputs("colorL"));
            this.rangeInputH.addEventListener("change", () => this.inputs("changed"));
            this.inputH.addEventListener("change", () => this.inputs("changed"));
            this.inputS.addEventListener("change", () => this.inputs("changed"));
            this.inputL.addEventListener("change", () => this.inputs("changed"));
            this.cursor.addEventListener("mousedown", (e) => this.canvaMouse("down", e));
            this.cursor.addEventListener("mousemove", (e) => this.canvaMouse("move", e));
            document.addEventListener("mouseup", this.canvaUpHandler);
            this.fireEvent("opened");
            // console.log("color picker open");
        }
        else {
            this.fireEvent("reopened");
        }
    }
    close() {
        if (this.isOpen) {
            this.isOpen = false;
            this.menuWindow.parentElement?.removeChild(this.menuWindow);
            document.removeEventListener("click", this.clickHandler);
            window.removeEventListener("resize", this.closeHandler);
            document.removeEventListener("mouseup", this.canvaUpHandler);
            this.fireEvent("closed");
            // console.log("color picker closed");
        }
    }
    isInFocus(e) {
        if (this.firstClick) {
            this.firstClick = false;
        }
        else {
            const y = e.pageY;
            const x = e.pageX;
            if (!this.clickIntersect(x, y)) {
                this.close();
                this.setPromiseResult(undefined);
            }
        }
    }
    clickIntersect(x, y) {
        return (x > this.X &&
            x < this.X + this.width &&
            y > this.Y &&
            y < this.Y + this.height);
    }
    addEventListener(eventName, f) {
        switch (eventName) {
            case "input":
            case "changed":
            case "canceled":
            case "confirmed":
            case "opened":
            case "reopened":
            case "closed":
                break;
            default: throw new Error(`Unexpected value: ${eventName}`);
        }
        let curentListenersFunctions = this.eventsMap.get(eventName);
        if (curentListenersFunctions == null) {
            curentListenersFunctions = [];
            this.eventsMap.set(eventName, curentListenersFunctions);
        }
        curentListenersFunctions.push(f);
    }
    removeEventListener(eventName, f) {
        switch (eventName) {
            case "input":
            case "changed":
            case "canceled":
            case "confirmed":
            case "opened":
            case "reopened":
            case "closed":
                break;
            default: throw new Error(`Unexpected value: ${eventName}`);
        }
        const curentListenersFunctions = this.eventsMap.get(eventName);
        if (curentListenersFunctions != null) {
            const index = curentListenersFunctions.indexOf(f);
            if (index >= 0)
                curentListenersFunctions.splice(index, 1);
        }
    }
    fireEvent(eventName) {
        let curentListenersFunctions = this.eventsMap.get(eventName);
        if (curentListenersFunctions != null && curentListenersFunctions.length > 0) {
            const detail = this.createEventDetail(eventName);
            curentListenersFunctions.forEach(handler => handler(detail));
        }
        // const e = new CustomEvent(eventName, { detail });
        // this.menuWindow.dispatchEvent(e);
    }
    createEventDetail(eventName) {
        switch (eventName) {
            case "input":
            case "changed":
            case "canceled":
            case "confirmed":
            case "closed":
                return this.getEventData(eventName);
            case "opened":
            case "reopened":
                return { x: this.X, y: this.Y, eventName };
            default: throw new Error(`Unexpected value: ${eventName}`);
        }
    }
    drawCloseButton() {
        {
            const canva = document.createElement("canvas");
            canva.width = 24;
            canva.height = 17;
            const ctx = canva.getContext("2d");
            if (ctx != null) {
                ctx.fillStyle = this.closeButton.style.backgroundColor;
                ctx.fillRect(0, 0, canva.width, canva.height);
                ctx.strokeStyle = this.closeButton.style.color;
                const a = 4;
                const shiftY = 1;
                const shiftX = 1;
                const width = 17;
                ctx.lineWidth = 2;
                ctx.beginPath;
                ctx.moveTo(a + shiftX, a + shiftY);
                ctx.lineTo(width - a + shiftX, width - a + shiftY);
                ctx.moveTo(width - a + shiftX, a + shiftY);
                ctx.lineTo(a + shiftX, width - a + shiftY);
                ctx.stroke();
            }
            return 'url(' + canva.toDataURL("image/png") + ')';
        }
    }
    getEventData(eventName) {
        const rgb = this.HSLToRGB(this.colorH, this.colorH, this.colorL);
        return {
            h: this.colorH,
            s: this.colorH,
            l: this.colorL,
            colorHSL: this.getHSLColor(),
            r: rgb[0],
            g: rgb[1],
            b: rgb[2],
            colorRBG: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`,
            eventName
        };
    }
    RGBToHSL(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        let cmin = Math.min(r, g, b), cmax = Math.max(r, g, b), delta = cmax - cmin, h = 0, s = 0, l = 0;
        if (delta == 0)
            h = 0;
        else if (cmax == r)
            h = ((g - b) / delta) % 6;
        else if (cmax == g)
            h = (b - r) / delta + 2;
        else
            h = (r - g) / delta + 4;
        h = Math.round(h * 60);
        if (h < 0)
            h += 360;
        l = (cmax + cmin) / 2;
        s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
        s = +(s * 100).toFixed(1);
        l = +(l * 100).toFixed(1);
        return [h, s, l];
    }
    HSLToRGB(h, s, l) {
        s /= 100;
        l /= 100;
        let c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = l - c / 2, r = 0, g = 0, b = 0;
        if (0 <= h && h < 60) {
            r = c;
            g = x;
            b = 0;
        }
        else if (60 <= h && h < 120) {
            r = x;
            g = c;
            b = 0;
        }
        else if (120 <= h && h < 180) {
            r = 0;
            g = c;
            b = x;
        }
        else if (180 <= h && h < 240) {
            r = 0;
            g = x;
            b = c;
        }
        else if (240 <= h && h < 300) {
            r = x;
            g = 0;
            b = c;
        }
        else if (300 <= h && h < 360) {
            r = c;
            g = 0;
            b = x;
        }
        r = Math.round((r + m) * 255);
        g = Math.round((g + m) * 255);
        b = Math.round((b + m) * 255);
        return [r, g, b];
    }
}
