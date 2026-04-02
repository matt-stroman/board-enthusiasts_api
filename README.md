# board-enthusiasts_api

API-first contract artifacts for the maintained Board Enthusiasts surface.

## Scope

These tracked API artifacts now describe the maintained Cloudflare Workers + Supabase surface only.

Maintained areas:

- API metadata and health probes
- public browse helpers, catalog browse, and public studio/title detail
- current-user bootstrap, profile, notifications, Board profile, and developer enrollment
- player library, wishlist, and title-report flows
- developer studio CRUD, studio link CRUD, studio media upload, title CRUD, metadata, media, releases, and report threads
- moderation developer verification and title-report review flows

Historical planning drafts were removed during MVP cleanup, so the maintained executable contract lives under [`postman/`](./postman/) and the route-wide smoke coverage lives in the root `tests/contract-smoke` harness.

## Source Of Truth

- OpenAPI spec: [`postman/specs/board-enthusiasts-api.v1.openapi.yaml`](./postman/specs/board-enthusiasts-api.v1.openapi.yaml)
- Contract collection: [`postman/collections/board-enthusiasts-api.contract-tests.postman_collection.json`](./postman/collections/board-enthusiasts-api.contract-tests.postman_collection.json)
- Public docs collection: [`postman/collections/board-enthusiasts-api.public-docs.postman_collection.json`](./postman/collections/board-enthusiasts-api.public-docs.postman_collection.json)
- Mock admin collection: [`postman/collections/postman-admin.board-enthusiasts-mock-provisioning.postman_collection.json`](./postman/collections/postman-admin.board-enthusiasts-mock-provisioning.postman_collection.json)
- Local environment: [`postman/environments/board-enthusiasts_local.postman_environment.json`](./postman/environments/board-enthusiasts_local.postman_environment.json)
- Mock environment: [`postman/environments/board-enthusiasts_mock.postman_environment.json`](./postman/environments/board-enthusiasts_mock.postman_environment.json)
- Mock admin environment: [`postman/environments/board-enthusiasts_mock-admin.postman_environment.json`](./postman/environments/board-enthusiasts_mock-admin.postman_environment.json)

## Local Workflow

Use the root CLI from the solution repository. Do not treat `api/scripts/*` as the primary entrypoint for routine work.

Recommended local contract run:

```bash
python ./scripts/dev.py api-test --start-workers
```

That flow is intended to:

- start or reuse local Supabase services
- reseed deterministic local Supabase auth/data/storage fixtures
- start the local Workers API
- fetch seeded developer and moderator bearer tokens
- run the Postman contract collection against `http://127.0.0.1:8787`

Recommended route-wide maintained-surface smoke:

```bash
python ./scripts/dev.py contract-smoke --start-workers
```

If you need the raw API-only helper instead of the root CLI:

```powershell
./scripts/run-postman-contract-tests.ps1 -BaseUrl http://127.0.0.1:8787
```

## Environment Variables

The committed local and mock environments intentionally keep only the maintained variables:

- `baseUrl`
- `contractExecutionMode`
- `developerAccessToken`
- `moderatorAccessToken`
- `expectedServiceName`
- readiness expectation variables

The committed environment templates keep only the variables needed by the maintained contract surface.

## Public Documentation Publishing

Use the dedicated public docs collection when publishing BE's public API documentation:

- [`postman/collections/board-enthusiasts-api.public-docs.postman_collection.json`](./postman/collections/board-enthusiasts-api.public-docs.postman_collection.json)

That curated collection is the intended public-facing surface and currently includes:

- public catalog, title, studio, genre, and age-rating browse routes
- authenticated player library and wishlist read/write routes
- authenticated developer studio, title, metadata, and release management routes

Do not publish the maintained contract-test collection directly. It intentionally contains:

- broader internal and contract-test-only authenticated workflow routes
- moderator-only routes
- mock/test-only helpers
- contract-test-specific request structure that is not intended as the public consumer-facing documentation surface

## Mock Workflow

The Postman admin collection still provisions mocks from the tracked contract collection and syncs the runtime mock environment `baseUrl`.

The provisioning validation checks for the maintained routes and saved examples in the current contract collection.

Normal mock validation path:

1. Provision the mock with the admin collection or root automation.
2. Run the tracked contract collection against the mock environment.
3. Use the `Mock Validation` folder to force the saved `503` readiness example when needed.

## Working Rules

- Keep exactly one maintained Git-tracked contract collection.
- Keep the tracked OpenAPI spec aligned to the maintained Workers surface.
- Do not reintroduce endpoints or variables that are not part of the maintained collection/environment templates.
- Keep Postman Cloud provisioning requests in the separate admin collection.
- Keep the supported developer entrypoint rooted at `python ./scripts/dev.py ...`.
