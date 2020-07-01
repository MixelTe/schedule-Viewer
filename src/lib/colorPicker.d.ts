declare type PosY = "up" | "down";
declare type PosX = "left" | "center" | "right";
declare type EventNames = "input" | "changed" | "canceled" | "confirmed" | "opened" | "closed" | "reopened";
interface Options {
    buttonOk?: {
        background?: string;
        text?: string;
        borderColor?: string;
        borderWidth?: number;
    };
    buttonCancel?: {
        background?: string;
        text?: string;
        borderColor?: string;
        borderWidth?: number;
    };
    window?: {
        background?: string;
        text?: string;
        borderColor?: string;
        borderWidth?: number;
    };
    inputs?: {
        background?: string;
        text?: string;
        borderColor?: string;
        borderWidth?: number;
    };
    roundCorners?: boolean;
    pickedColorBackground?: boolean;
    pickedColorBorder?: boolean;
    zIndex?: number;
}
declare type ColorPickerEventHandler = (e: Coordinate | Color) => void;
export declare class ColorPicker {
    private menuWindow;
    private menuTop;
    private menu;
    private canva;
    private cursor;
    private curColorDiv;
    private rangeInputH;
    private inputH;
    private inputL;
    private inputS;
    private menuBottom;
    private closeButton;
    private okButton;
    private multiplyX;
    private multiplyX_;
    private multiplyY;
    private height;
    private width;
    private X;
    private Y;
    private clickHandler;
    private closeHandler;
    private canvaUpHandler;
    private ctx;
    private ctxCursor;
    private cursorX;
    private cursorY;
    private firstClick;
    private isOpen;
    private colorIsChanging;
    private changeBackground;
    private changeBorder;
    private segWidth;
    private colorH;
    private colorS;
    private colorL;
    private placement_side;
    private placement_align;
    private placement_strict;
    baseStyle: {
        buttonOk: {
            background: string;
            text: string;
            borderColor: string;
            borderWidth: number;
        };
        buttonCancel: {
            background: string;
            text: string;
            borderColor: string;
            borderWidth: number;
        };
        window: {
            background: string;
            text: string;
            borderColor: string;
            borderWidth: number;
        };
        inputs: {
            background: string;
            text: string;
            borderColor: string;
            borderWidth: number;
        };
        roundCorners: boolean;
        pickedColorBackground: boolean;
        pickedColorBorder: boolean;
        zIndex: number;
    };
    private eventsMap;
    private resolve;
    constructor(options?: Options);
    openMenu_onCoordinates(x: number, y: number): void;
    openMenu(rect: Rect, side?: PosY, align?: PosX, strict?: boolean): void;
    setColorHSL(h: number, s: number, l: number): void;
    setColorRGB(r: number, g: number, b: number): void;
    setPlacement(side: PosY, align?: PosX, strict?: boolean): void;
    getColor(): {
        h: number;
        s: number;
        l: number;
        colorHSL: string;
        r: number;
        g: number;
        b: number;
        colorRBG: string;
    };
    setStyle(options: Options): void;
    pick(rect: Rect, side?: PosY, align?: PosX, strict?: boolean): Promise<Color | undefined>;
    pick_onCoordinates(x: number, y: number): Promise<Color | undefined>;
    private moveMenuToCoordinates;
    private moveMenuAroundRect;
    private drawPalette;
    private getHSLColor;
    private drawCursor;
    private changeHColor;
    private changeSColor;
    private changeLColor;
    private displayColor;
    private calculateNewCurCords;
    private canvaClick;
    private canvaMouse;
    private buttonClickCancel;
    private buttonClickOk;
    private setPromiseResult;
    private inputs;
    private open;
    private close;
    private isInFocus;
    private clickIntersect;
    addEventListener(eventName: EventNames, f: ColorPickerEventHandler): void;
    removeEventListener(eventName: EventNames, f: ColorPickerEventHandler): void;
    private fireEvent;
    private createEventDetail;
    private drawCloseButton;
    private getEventData;
    private RGBToHSL;
    private HSLToRGB;
}
interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
}
interface Coordinate {
    x: number;
    y: number;
    eventName: EventNames;
}
interface Color {
    h: number;
    s: number;
    l: number;
    colorHSL: string;
    r: number;
    g: number;
    b: number;
    colorRBG: string;
}
export {};
