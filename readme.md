## Scenario
------------------------------------------
You are a data analyst whose job is to create and correct annotations that come out of the machine-learning platform.  Your tasks include reviewing the annotations made by the system,  removing any unnecessary or incorrect annotations - hey, it's not always 100% accurate - as well as adding annotations to text that was missed by the system.  Basically, if the system says that "The White House", e.g., is a PERSON, you can delete that annotation.  If the system did not tag "The White House" as a LOCATION you can apply that annotation to the text.  All annotations will need to be visible at one time (excluding documents that scroll, of course).

There are only 3 categories of annotations: 'PERSON', 'LOCATION', and 'ORGANIZATION'.  As a developer, you will need to provide a simple web interface that displays the document in full with the text of the annotations highlighted.  You will also need to provide a simple mechanism that allows the analyst to delete incorrect annotations and add annotations at will.  Lastly, there will be a "save" button that, when clicked, will spit out a JSON representation of the annotations to the browser console.  The data can be retrieved in any manner but would be great if it was loaded via AJAX.

## Constraints
-------------------------------------------
- The application should work in Chrome 45+
- CSS, if used, must be separated into css files (i.e., no in-line CSS where it makes sense to segment).
- If you choose to load the files via content-type text/xml, an external XML parser library may be used - but give credit if you do.

## Evaluation Criteria
--------------------------------------------
- Your solution will be judged on the following criteria, with the most important listed first.
- 100% coverage of all features and constraints listed above.
- Code legibility.  This includes formatting, commenting, naming, and adherence to solid design patterns.
- Usability.  It doesn't need a fancy user interface, but ease of use will be a factor.
- Choice of technology - or lack thereof (libraries, frameworks, helpers, etc.)
- Error checking and error handling.
- Amount of time taken to return the assignment.
- Packaging and submission style.  You may submit this assignment via Git, JSfiddle, a tarball or zip, GitHub pages or any other means of submission you feel appropriate (though it is an evaluation criteria item).
- If you're feeling ambitious, I have the other 12 chapters' worth of docs at your request.  Allowing the user to switch chapters is powerful but not required for this assignment.

### To-Do
--------------------------------------------
1. Clicking the add annotation button will enter "add mode"
2. Organize code and functions logically
3. Explain choices and steps in comments
4. Recheck everything
5. Request the other chapters

