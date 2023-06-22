# ballr-frontend

This is the frontend for the ballr project - a part of bachelor of engineering thesis. It is using the Next.js framework.

Application is available under:
  - [https://ballr.pl](https://ballr.pl)

## How to run dev
1. Install Node.js
2. Install dependencies `npm install`
3. Run dev server `npm run dev`

## How to run analyze
1. Install Node.js
2. Install dependencies `npm install`
3. Run analyze `ANALYZE=true next build`

## How to get a Firebase user token
1. Open developer tools in your browser
2. Go to Application tab
3. Expand IndexedDB
4. Expand `firebaseLocalStorageDb`
5. Search for `accessToken` key (should be under `value.stsTokenManager.accessToken`)

## Commits
This project uses [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for commit messages.
Common types:
* feat: A new feature
* fix: A bug fix
* docs: Documentation only changes
* style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
* refactor: A code change that neither fixes a bug or adds a feature
* perf: A code change that improves performance
* test: Adding missing tests
* chore: Changes to the build process or auxiliary tools and libraries such as documentation generation

## License

This project is licensed under the terms of the BSD license.
