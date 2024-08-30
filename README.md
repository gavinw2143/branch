This will be challenging

Firstly, start on version control. Push to github

Ideas: 
- ResponseContainer map function on `responses` state to render Response components. 
Can render three or four at a time, with two being hidden offscreen. When changing span focus, change
rendered responses accordingly. Need to change up span focus state and event handlers firstly

1. Find a way to display output from left response followup in the right response
2. Find a way to switch back to the old output when clicking on the other span
3. Find a way to swap right to left when making a followup in the right response

Potential solutions (probably the first will do):
- Make a tree of Response components that go offscreen, show and hide them when necessary, animate sliding
- Keep two Response components, swap out text with spans (how to animate this?)