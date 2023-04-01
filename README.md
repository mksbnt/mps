# MPS

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.4.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Design patterns

**Component pattern:** The `MapComponent` is an Angular component that encapsulates the functionality of creating and managing the Leaflet map. It defines the component metadata using the `@Component` decorator, which specifies the selector, template and style files, and any dependencies.

**Singleton pattern:** The `points$` property is a BehaviorSubject that acts as a centralized store for the list of points in the map. It is initialized with an empty array, and its value is updated using the `next()` method whenever a new point is added, deleted, or edited. By using a BehaviorSubject, the `MapComponent` can subscribe to changes in the list of points and react accordingly, without having to pass the list as input or output to child components.

**Observer pattern:** The `MapComponent` subscribes to changes in the list of points using the `subscribe()` method of the `points$` BehaviorSubject. Whenever a new list of points is emitted, the `MapComponent` generates a new map and polylines using the `generateScheme()` method.

**Factory pattern:** The `drawPolyline()` method is a factory method that creates a new `L.Polyline` object with the specified locations and options. It also adds arrowheads to the polyline using the leaflet-arrowheads plugin. By encapsulating the creation of the polyline in a factory method, the `MapComponent` can reuse this logic for different polylines with different options.

**Decorator pattern:** The `@ViewChild` decorator is used to get a reference to the Leaflet map component in the `MapComponent` template. This allows the `MapComponent` to interact with the map and its markers and polylines using the Leaflet API.

**Pipe pattern:** The `UpdatePointNumbersPipe`, `IncrementPipe`, and `LocationsPipe` are custom Angular pipes that transform the list of points in various ways. The `UpdatePointNumbersPipe` updates the number property of each point based on its index in the list, so that the points are numbered sequentially. The `IncrementPipe` increments a number by 1, which is used to generate the number property of new points. The `LocationsPipe` maps the list of points to an array of Leaflet `LatLng` objects, which is used to create the polylines.

**Template method pattern:** The MapComponent class provides a template method `generateScheme()` that is used to draw the map elements (polylines and markers) based on the input data (points). This method defines the basic algorithm for drawing the map elements, but the details of the implementation are left to the Leaflet library.

**Strategy pattern:** The Leaflet library is used for displaying the map and handling the map-related operations. The code uses the Leaflet API to draw polylines, markers, and other map elements. This can be seen as an implementation of the strategy pattern because the Leaflet library provides a set of algorithms (strategies) for drawing the map elements, and the code uses these strategies to achieve the desired functionality.
