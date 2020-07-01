interface Rect
{
    x: number;
    y: number;
    width: number;
    height: number;
}

interface FunctionsForMenu
{
    toggleSepLine: () => void,
    SepLineIsActive: () => boolean,
    addSympleLine: (interval: number, duration: number, start: number, end: number, color?: string | undefined) => void,
    addRealLine: (interval: number, durations: number[], start: number, end: number) => void,
    recreate: () => void,
    resetLines: () => void,
    getLines: () => LineF[],
}

interface FunctionsForLines
{
    selectLine: (data: {interval: number, duration: number | number[], start: number, end: number, color: string, autoColor: boolean, real: boolean}, key: SVGPathElement) => void
}

interface Schedule
{
    simpleLines:
    [
        {
            interval: number,
            duration: number,
            start: number,
            end: number
        }
    ]
    realLines:
    [
        {
            interval: number,
            durations: number[],
            start: number,
            end: number
        }
    ]
}

interface LineF
{
    color: string,
    width: number,
    dasharray: number[] | [number, number[]],
    real: boolean,
    start: number,
    end: number,
    autoColor: boolean
}