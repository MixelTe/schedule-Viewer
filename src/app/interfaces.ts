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
	addSympleLine: (interval: number, duration: number, start: number, end: number, name: string, color?: string | undefined, autoColor?: boolean) => void,
	addRealLine: (interval: number, durations: number[], start: number, end: number, name: string, color?: string | undefined, autoColor?: boolean) => void,
	recreate: () => void,
	resetZoom: () => void,
	resetLines: () => void,
	getLines: () => LineF[],
	changeLine: (data: DataToLineChange, line: LineF) => void,
	removeLine: (line: LineF) => void,
	unselectLine: (line: LineF) => void,
	CustomSelectionColorIsActive: () => boolean,
	compactLinePlacingIsActive: () => boolean,
	setSettings: (data: ScheduleOptionsFull) => void,
}

interface FunctionsForLines
{
	selectLine: (line: LineF) => void,
	unSelectLine: (e: MouseEvent) => void,
}

interface DataToLineChange
{
	name: string,
	interval: number,
	duration: number | number[],
	start: number,
	end: number,
	color: string,
	autoColor: boolean,
	real: boolean
}

interface Schedule
{
	simpleLines:
	[
		{
			name: string,
			interval: number,
			duration: number,
			start: number,
			end: number,
			color: string,
			autoColor: boolean,
		}
	]
	realLines:
	[
		{
			name: string,
			interval: number,
			durations: number[],
			start: number,
			end: number,
			color: string,
			autoColor: boolean,
		}
	]
}

interface LineF
{
	color: string,
	name: string,
	width: number,
	dasharray: number[] | [number, number[]],
	real: boolean,
	start: number,
	end: number,
	autoColor: boolean,
	selected: boolean
}

interface ScheduleOptions
{
	openControlPanel?: boolean,
	revTimeInput?: boolean,
	showRealLineAfterEnd?: boolean,
	compactLinePlacing?: boolean,
	compactPlacingAlignIsTop?: boolean,
	selectionCustomColor?: boolean,
	showSeparateLine?: boolean,
	showYAxis?: boolean,
}

interface ScheduleOptionsFull
{
	openControlPanel: boolean,
	revTimeInput: boolean,
	showRealLineAfterEnd: boolean,
	compactLinePlacing: boolean,
	compactPlacingAlignIsTop: boolean,
	selectionCustomColor: boolean,
	showSeparateLine: boolean,
	showYAxis: boolean,
}