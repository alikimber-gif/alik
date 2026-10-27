# Logging truck route map

An interactive map showing a logging truck travelling from Marsden Valley to Port Nelson.
Built with Leaflet (free, open source). No API key needed.

## How to use it

1. Upload `index.html` to your web server, for example `https://www.nelson.govt.nz/maps/logging-truck/`.
2. Paste this code into the web page where you want the map:

```html
<iframe
  src="https://www.nelson.govt.nz/maps/logging-truck/index.html"
  title="Animated map of the logging truck route from Marsden Valley to Port Nelson"
  width="100%" height="560" style="border:0; max-width:1000px;"
  loading="lazy"></iframe>
```

## What people can do

- Play, pause and restart the truck.
- Drag the Journey slider to move the truck to any point.
- Change the speed.
- Switch between satellite and street map.
- Click to enable scroll-zoom (stops the map hijacking page scrolling).

The animation does not autoplay for visitors who have "reduce motion" turned on.

## Changing the route

The route is the `route` list near the top of the script, as `[latitude, longitude]` pairs.
The current points were traced by hand from the planning map, so they follow the roads closely
but not exactly. For a precise line, ask GIS for the route as GeoJSON or a list of coordinates
and paste them in.
