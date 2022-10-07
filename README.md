# Physics_Engine
Physics engine built within Javascript using p5.js framework for visuals
Capable of simulating collisions between rotated rectangles, forces on these rectangles, as well as springs.

[Video showcase](https://youtu.be/2t3RidaoUaE)

## Technical Details

**To run**
  - Run index.html as a local live server.
  
**Rectangle object**
  - Main object used for visualisation. 
  - Keeps track of important data about itself and contains function to move with respect to a given force.

**Collision detection and resolution**
  - Collision detection between rotated rectangles is achieved using SAT (Seperating Axis Theorem).
  - Once collision between two rectangles is detected, a vector along the minimum depth of the collision
    is found.
  - Each rectangle is moved along this vector at half the depth of the collision, in opposite directions.

**Collision Response**
  - Shapes are capable of rebounding off one another. This was achieved using collision formulae found online. 
    The relative velocities of the rectangles prior to the collision are taken into account to create a realistic velocity after collision.
  - The 'restitution' constant within the rectangle object can be adjusted to change how bouncy a rectangle is.
  
**Table object optimisation**
  - Every rectangle has to check with every other rectangle when checking for collisions. This algorithm has complexity O(n^2), which works
    well for small numbers of shapes, but can affect performance at higher numbers. 
  - A 'Table' object was implemented to reduce comparisons. An invisible grid is created across the canvas, and each rectangle stores its
    position within this grid. When a rectangle looks for collisions it only checks other rectangles within the same grid position.
  
**Spring Object**
  - The spring object allows for spring physics between two rectangles using Hooke's law. 

## Future Plans
  - Add angular momentum to objects for rotation after collision.
  - Create more generic 'shape' object for circles and other convex polygons.
  - Implement time step functionality for more accurate simulations.
  - Setup different scenarios so user can switch between easily.
