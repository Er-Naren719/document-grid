# Document Grid Application

## Overview
This is a React-based application for displaying and managing document cards with drag-and-drop functionality.

## Prerequisites
- Node.js (v14 or later)
- npm or yarn

## Setup and Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or 
yarn start
```

## Features
- Grid display of document cards
- Drag and drop reordering
- Image loading with spinner
- Full image view on click
- ESC key closes image overlay

## Architectural Decisions
- Used React Hooks for state management
- Implemented react-beautiful-dnd for drag and drop
- Responsive grid layout
- Preloaded images for better performance

## Future Improvements
- Add persistent storage
- Implement backend API integration

## Part 1: Front End
- As per requirement, the five cards are displayed in grid system i.e first row has 3 cards and second row has 2 cards.
- Drag and drop functionality is achieved as requested so that we can easily shuffle cards.
- On click of any card image opens up in modal and closes on escape key press or outer click.

## Part 2: Making the call
- As a frontend developer I've skipped the backend part and have created the local service which mocks server, using Mock Service Worker.
- Refered it's official document here: https://mswjs.io/docs/getting-started.
- After the drag and drop, the updated document sequence is stored using local storage(check variable with name updatedDocumentSequence).
- API then fetches this data from browser storage and passes it to frontend.

## Part 3: Tying it up!
- Using API, the gid now shows the updated sequence of documents(without local storage data the document sequence resets to existing one).
- The logic to call API every five seconds implemented.
- The logic to check last saved implemented using previousDocumentsRef. It will check it against current documents, if it has changed then only it will save data.

## Part 4: Deployment
- Have included the docker file named Dockerfile.dev