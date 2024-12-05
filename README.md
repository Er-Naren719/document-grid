# Document Grid Application

## Overview
This is a React-based application for displaying and managing document cards with drag-and-drop functionality.

## Prerequisites
- Node.js (v14 or later)
- npm or yarn

## Setup and Installation 

## Without Docker:
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

## With Docker
1. Run docker container

2. To build docker image:
docker build -f Dockerfile.dev -t reactapp .

2. To check images:
docker images

3. To run docker image:
docker run -it -d --name reactApp -p 3000:3000 reactapp

## Features
- Grid display of document cards
- Drag and drop to re-order the cards
- Updated order is stored using local storage
- Fetch updated data using API integration(used MSW)
- Image loading with spinner
- Full image view on click
- ESC key closes image overlay
- Show last save time

## Architectural Decisions
- Used React Hooks for state management
- Implemented drag and drop
- Responsive grid layout
- Preloaded images for better performance
- Local storage to store the updated document data
- Mock Service Worker to mock the API

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
- Have included the docker file named Dockerfile.dev.
- Have also added crudHandlers.js which has code for hypothetical APIs for this project if you had to allow for adding, removing and  updating the elements.
