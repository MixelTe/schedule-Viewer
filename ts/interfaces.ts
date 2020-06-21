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
    addSympleLine: (interval: number, duration: number, start: number, end: number) => void,
    addRealLine: (interval: number, durations: number[], start: number, end: number) => void,
    recreate: () => void,
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