# Schedule viewer
## How to create schedule on your page

Create Div element on page

and set it's width and height

you can also set it's background and border
``` html
<div style="width: 100%; height: 800px; border: 1px solid black; background-color: beige;"></div>
```
Get this div in program and create new schedule
``` js
const schedule = new ScheduleViewer(HTMLDivElement);
```
### Set schedule options

``` js
const options = {
    "option": "value"
}
const schedule = new ScheduleViewer(HTMLDivElement, options);
```

### All options:
option                   | value type | default value | value
-------------------------|------------|---------------|--------
openControlPanel         | boolean    | true          | open control panel when schedule created
revTimeInput             | boolean    | false         | change time input order
showRealLineAfterEnd     | boolean    | false         | continue show real line after it's ending
compactLinePlacing       | boolean    | false         | place lines compact
compactPlacingAlignIsTop | boolean    | true          | vertical line align top or bottom when compact placing is active
selectionCustomColor     | boolean    | true          | selection color is same as line
showSeparateLine         | boolean    | true          | show vertical line on cursor
showYAxis                | boolean    | false         | show Y axis
lineNamesOnStart         | boolean    | true          | move names to line begin
darkTheme                | boolean    | false         | enable dark theme

### Save shcedule on page reload
``` js
let options = localStorage.getItem("options");
let lines = localStorage.getItem("lines");

const schedule = new ScheduleViewer(HTMLDivElement, options);
schedule.setLinesFromString(lines);

// saving options and lines every 500ms
setInterval(() => {
	localStorage.setItem("options", schedule.getOptionsString());
	localStorage.setItem("lines", schedule.getLinesString());
}, 500);
```

#

## How to create schedule with json
create json file

to add simple lines:
``` json5
{
    "simpleLines":
    [
        {
            "interval": "number",
            "duration": "number",
            "start": "number",
            "end": "number",
            "autoColor": "bolean",
            "color": "hsl(number, number%, number%)" //needed if autoColor is false
        }
    ]
}
```

to add real lines:
``` json5
{
    "realLines":
    [
        {
            "interval": "number",
            "durations": ["number"],
            "start": "number",
            "end": "number",
            "autoColor": "bolean",
            "color": "hsl(number, number%, number%)" //needed if autoColor is false
        }
    ]
}
```

### works example:

``` json
{
    "simleLines":
    [
        {
            "interval": 30,
            "duration": 15,
            "start": 0,
            "end": 84000,
            "autoColor": true
        },
        {
            "interval": 60,
            "duration": 20,
            "start": 3000,
            "end": 80000,
            "autoColor": false,
            "color": "hsl(165, 100%, 50%)"
        }
    ],

    "realLines":
    [
        {
            "interval": 30,
            "durations": [30, 40, 40, 230, 43, 65, 23, 54, 2, 54, 21, 2341, 43, 43, 5465, 21],
            "start": 0,
            "end": 84000
        }
    ]
}
```