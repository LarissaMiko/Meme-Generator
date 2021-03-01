# Meme-Generator Frontend

Welcome to the Meme-Generator Frontend. This React project was created with `create-react-app`

## Start the project locally

```
npm start
```

Run automated tests:

```
npm test
```

Check test-coverage:

```
npm run test -- --coverage --watchAll=false
```

## Project-structure

This Application is build using React and React-Router for navigation. Furthermore it uses local-storage and the Context.API to keep state attributes like the user-login-status in memory.

```
|--frontend/
|  |--public/
|  |--src/
|  |  |--components/                 # →  React-Components
|  |  |  |--MemeCarousel             # →  Meme-Slideshow shown when click on Meme-Tile
|  |  |  |--MemeCommentSection       # →  Comment Section shown in Meme-Carousel and Single-View
|  |  |  |--MemeGenerator            # →  WYSIWYG Generator + Upload/Download functionality
|  |  |  |--MemeSingleView           # →  Single-view of a meme with own route (e.g. for sharing link)
|  |  |  |--MemeTile                 # →  Tile to display single meme in gallery
|  |  |  |--MenuBar                  # →  Menubar
|  |  |  |--MyMemes                  # →  Gallery for private memes of a user
|  |  |  |--SignIn                   # →  Login using existing account
|  |  |  |--SignUp                   # →  Create new account
|  |  |  |--Statistics               # →  Overview which templates were selected and used for generated memes
|  |  |--context/
|  |  |  |--auth.js                  # →  React-Context used for authentication
|  |  |--utils/                      # →  helper funcions e.g. for canvas
|  |  |--App.css
|  |  |--App.js                      # →  Main-Component, contains Router-Setup
|  |  |--config.js                   # →  global variables e.g. API-URL
|  |  |--index.css
|  |  |--index.js
|  |  |--PrivateRoute.js             # →  Special-Case of React-Router-Route that is only rendered, if user is logged in
|  |  |--setupTests.js               # →  Testing setup with jest and enzyme-adapter
|  |--.gitignore                     # →  Gitignore
|  |--jest.config.json               # →  Jest-configuration
|  |--package.lock.json
|  |--package.json                   # →  Node.js dependencies and scripts
|  |--README.md


```

## How the Meme-Generator works

#### Meme-Generator

The Meme-Generator provides an WYSIWYG editor to create custom memes. As a basis for the meme the user can choose between various templates from the database or the IMG-Flip-API , upload own images, provide an own URL or even use a device-camera to take a picture and edit it.
Two or more titles can be placed freely on the image and be adjusted in font, color,... They can either be typed in the corresponding inputs or dictated via voice control.
The user can furthermore choose an optional title and categories for the meme.
The size of the meme-canvas can be adapted freely and there is the option to add an additional image to the meme.
Once the user is happy with the result, the meme can either be downloaded locally or uploaded to the Meme-Gallery. It can also be shared via common social networks. The Filesize of the meme can be adjusted freely.
If the user is logged in, the meme can be declared as private before uploading it. It will then only be visible to the user in his private gallery.

#### Meme-Gallery

The Meme-Gallery provides an overview of all (public) uploaded Memes by all users. Each meme is displayed in a Tile that provides more information like title, views, votes and categories. The user can also interact with the meme by up-/ or down-voting sharing or downloading. The title can be played as audio.
The memes can be filtered by categories or sorted by several attributes like generation, title, popularity or used template.
The meme gallery provides the option to download all or selected memes via the API in the backend. It is possible to select single memes by hand for downloading or download the whole or filtered gallery. Also a maximum amount of memes for the download can be determined.
A click on a meme opens the Slide-Show-View. The user can click through all memes, autoplay (also randomly).
The comment-section for each meme can also be found in the Slide-Show-View. If the user is logged in, he can write new comments, otherwise he can only read the existing ones.

#### My-Memes

If a user is logged-in this is where all his memes (public and private) are displayed similarly to the Meme-Gallery.
If the user is not logged in, the corresponding Route is redirected to the login-/signup-pages.

#### Authentication/Login

The user can create an own account and is then authenticated by e-mail and password. A logged in user can create private memes, write comments. Also up-/ and down-votes are bound to the account and displayed in the future for the corresponding memes.
