[screen-capture (9).webm](https://github.com/user-attachments/assets/9f9def7e-bbac-4067-8589-a123565df260)
# TodoApp V2 — Vanilla JavaScript Rebuild

TodoApp V2 is a vanilla JavaScript remake of a React todo app.

This project was not made because I wanted to build the most original todo app.  
I made it because I wanted to understand frontend structure better by rebuilding a React-style app without React.

Original project: [ReactJS-ToDoList by MatheusCavini](https://github.com/MatheusCavini/ReactJS-ToDoList)

## Why I Made This

I wanted to learn what React usually hides or simplifies:

- How state changes affect the UI
- How rendering works when there is no component system
- How task/category data should be stored and updated
- How UI events connect to application state
- How much CSS layout matters in a real interface
- Why frameworks like React are useful after writing everything manually

Instead of using React state, components, props, or styled-components, I rebuilt the app with:

- HTML
- CSS
- Vanilla JavaScript

## Demo

[screen-capture (9).webm](https://github.com/user-attachments/assets/f0a272e1-8d3a-48ba-a316-bff4e9f4fa29)

## What This App Does

The app includes basic todo app features:

- Add, edit, delete, and complete tasks
- Create and manage categories
- Assign tasks to categories
- Filter tasks by status
- Filter tasks by category
- Responsive sidebar layout
- Popup forms for task/category actions

The features matter, but the main purpose of the project was learning how to structure the logic behind them.

## What I Practiced

### State

I stored tasks and categories as JavaScript data, then used that data as the source for rendering the UI.

This helped me understand why state needs to be handled carefully.  
When the task data changes, the UI also needs to update correctly.

### Rendering

Since this project does not use React, I had to manually decide:

- When to clear old UI
- When to recreate task elements
- When to update only visible tasks
- How category changes should affect task rendering
- How filters should control what appears on screen

This made rendering feel less “magic” and helped me understand what React is doing in the background.

### Events

I practiced connecting UI actions to state changes:

- Clicking task buttons
- Opening and closing popups
- Selecting categories
- Filtering tasks
- Updating task completion state

The project helped me understand how event listeners, data updates, and rendering functions work together.

### CSS Layout

A big part of this version was refactoring the layout.

I worked on:

- Sidebar open/close behavior
- Responsive mobile sidebar
- Scrollable task list
- Popup layout
- Task item layout
- CSS variables
- Cleaner spacing and colors
- Gradient fade effects on scroll areas

## What I Learned

This project helped me understand that React is not just about writing JSX.

React solves real problems like:

- Keeping UI in sync with state
- Splitting UI into reusable parts
- Re-rendering when data changes
- Avoiding messy manual DOM updates
- Making large UI logic easier to organize

By rebuilding a React-style app in pure JavaScript, I got a better understanding of why frontend frameworks exist.

## Credits

Original React project by MatheusCavini:  
https://github.com/MatheusCavini/ReactJS-ToDoList

Menu icon source:  
https://www.svgrepo.com/svg/511065/menu-alt-02

## Status

This project is complete.

I may make a future version with cleaner state management, a more component-like rendering system, or eventually rebuild the same idea again using React.



