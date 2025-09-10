README
---

## BMI Simulator: https://a2-kensebastian.onrender.com/
Allows users to input their height and weight, and automatically calculates their BMI, and whether it's at a healthy level.

### Technical Achievements
- **Client/server communication:**
    - When a user adds an entry via the form, the server gets updated with the new data, and the client-side grid also reflects the update
    - Challenges
        - POST request implementation
        - Client-side grid update

- **Data modification:**
    - Allows a user to edit the name, weight, or height fields, and updates the calculated fields accordingly
    - Challenges
        - Separate classes and handling for editable cells
        - PUT request implementation

### Design/Evaluation Achievements
- **User Feedback (Olson):**
    -  Problems
        - Editing only works after pressing enter, (clicking out of the cell doesn't update the data)
    - Comments
        - Unclear initially that weight can be entered in lbs.
    - What he would change
        - Entering feet in decimal form is unintuitive, allowing feet + inches would be better for the user
        - The weight/height increment/decrement buttons are unnecessary
- **User Feedback (Sebastian):**
    -  Problems
        - None, completed the tasks easily
    - Comments
        - Dislikes that after entering units in lbs, it's converted to kg in the table
    - What he would change
        - Entering feet in decimal form is unintuitive, allowing feet + inches would be better for the user




### AI usage for this project
- Models:
    - GitHub Copilot
    - Google Gemini
- Uses:
    - Debugging assistant
    - Styling suggestions (colors, on-hover styles, etc)
