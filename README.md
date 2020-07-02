# Schedule viewer
## How to create schedule with json
crete json file

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