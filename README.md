# ng2-prism website

## Installation

```
$ npm i
$ jspm i
```

## Development

Run the server and watch for changes:
```
$ gulp
```

## Files

```
├── app/                          * contains all angular code 
│   │
│   ├── app.component.ts          * main app component
│   │
│   ├── index.css                 * site-wide styles
│   │
│   └── main.ts                   * entry point, bootstraps the app
│
├── .editorconfig                 * common editor settings
│
├── .gitignore
│
├── README.md
│
├── bs-config.json                * browsersync settings
│
├── config.js                     * jspm configuration and dependencies
│
├── gulpfile.js                   * define tasks
│
├── index.html                    * site's index page
│
├── package.json                  * npm configuration and dependencies
│
└── tsconfig.json                 * typescript compilation settings 
```