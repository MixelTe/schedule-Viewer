import { scheduleViewer } from "./scheduleViewer.js";


const grafic = new scheduleViewer(getdiv("svgGrafic"), {openControlPanel: false});






function getdiv(id: string)
{
	const el = <unknown | null>document.getElementById(id);
	if (el == null) throw new Error(`${id} not found`);
	if (el instanceof HTMLDivElement) return el;
	throw new Error(`${id} element not Div`);
}
