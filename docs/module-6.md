# Module 6

Scroll sets one number from 0 to 1. That number sets the progress of a GSAP timeline. The timeline holds the camera path.

`MathUtils.damp` eases the progress toward the scroll target. A hard snap jumps to the target. Reduced motion uses the hard snap. Off the index, the path returns to the start.

Each index plane gets a shallow z offset. The field has depth. The path has a start, a middle, and an end. It does not orbit.

When the field is active, the DOM frames fade. The title links stay in the document. They still receive the click.
