# Syn Todo

An Angular/Firebase task application with email/Google sign-in, task editing and completion, and an Angular Material table with sorting and pagination. This is a historical application, not a production SaaS reference.

## Architecture

Lazy-loaded feature modules contain the login, registration, home, and task screens. `TodoService` owns Firestore access and exposes typed task streams. Tasks live at `users/{uid}/todos/{id}`; client routing is a convenience, while Firestore rules enforce ownership. Components preserve table state between snapshots, dispose subscriptions, and report failed writes without clearing form input.

Angular 10, RxJS, reactive forms, Material, and Firebase reflect the original implementation. The repairs retain that stack to keep the change reviewable. Modern Angular migration remains separate work; this repository should not be presented as a modern Angular flagship yet.

## Local setup

1. Use a disposable Firebase development project. Enable Firestore and the sign-in providers you intend to use.
2. Replace the public Firebase configuration in `src/environments/environment.ts` with your development project's config. Never use an employer or production project for review.
3. Run `npm ci --legacy-peer-deps` and `npm start`.
4. Apply the reviewed rules to your disposable project separately, or configure local Firebase emulators. Nothing in these changes deploys rules or migrates data automatically.

The legacy webpack toolchain needs `NODE_OPTIONS=--openssl-legacy-provider` on newer Node versions. Local checks used Node 24 with that flag. This compatibility measure is not a dependency/security modernization.

Weather is optional. `environment.weatherUrl` is blank by default; the card shows an unavailable state. To enable it, provide a same-origin backend proxy returning the shape in `core/interfaces/weather.ts`. Keep provider secrets on that backend. The previously embedded weather credential must be rotated by its owner if still active; removing it here does not erase Git history.

## Validation

```sh
NODE_OPTIONS=--openssl-legacy-provider npm run build -- --aot
NODE_OPTIONS=--openssl-legacy-provider npm test -- --watch=false --browsers=ChromeHeadless
cd rules-tests
npm ci
npm test
```

The rules suite requires Java 21+ and starts local Firestore, Realtime Database, and Storage emulators with project ID `demo-syn-todo`. Its seven tests cover Firestore owner access, cross-user denial, anonymous denial, field validation, rejection of the old shared collection, and owner-only access in Realtime Database and Storage. The 20 Angular component/service tests cover failed writes, cancellation, subscription cleanup, and auth failures. No deployed Firebase project is used by these rules tests.

## Data migration before deployment

The old shared `/todos` documents contain no proven owner. Do not guess ownership or automatically make those documents available to every signed-in user. Back up the database, obtain an explicit owner mapping, copy verified documents into each user's path using an administrative migration, compare counts/content, and coordinate the client/rules release. Unmapped records stay inaccessible under the proposed rules. No existing records were deleted or migrated here.

Realtime Database and Storage paths now follow `/users/{uid}/...`; review any external consumers before deployment. Registration no longer waits for an undocumented metadata-writing process.

## Trade-offs and next steps

The whole task collection is loaded for client-side sorting/pagination, appropriate for a small personal task list. Large datasets need measured query pagination. The fixes do not establish production readiness, exhaustive accessibility conformance, or dependency vulnerability clearance. Add a verified screenshot and modernize the framework before considering a profile pin.
