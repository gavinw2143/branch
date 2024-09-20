This will be challenging

Ideas: 
- ResponseContainer map function on `responses` state to render Response components. 
Can render three or four at a time, with two being hidden offscreen. When changing span focus, change
rendered responses accordingly. Need to change up span focus state and event handlers firstly

Might want to try using localStorage, see react.dev on resetting components

1. Back arrow and depth counter
    - Spans don't stay
    - Depth counter should come after handling spans, as they are dependent on them
2. Span event handlers
3. Animate

Home/dashboard page, then map, then learn


Potential solutions (probably the first will do):
- Make a tree of Response components that go offscreen, show and hide them when necessary, animate sliding
- Keep two Response components, swap out text with spans (how to animate this?)