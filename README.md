# MPS

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.4.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Design patterns

Observer pattern: The points$ BehaviorSubject is used to notify the subscribers about the changes in the points data. The subscribe method is used to register the observers, and the next method is used to notify the observers about the changes.

Template method pattern: The MapComponent class provides a template method generateScheme that is used to draw the map elements (polylines and markers) based on the input data (points). This method defines the basic algorithm for drawing the map elements, but the details of the implementation are left to the Leaflet library. This can be seen as an implementation of the template method pattern.

Strategy pattern: The Leaflet library is used for displaying the map and handling the map-related operations. The code uses the Leaflet API to draw polylines, markers, and other map elements. This can be seen as an implementation of the strategy pattern because the Leaflet library provides a set of algorithms (strategies) for drawing the map elements, and the code uses these strategies to achieve the desired functionality.
