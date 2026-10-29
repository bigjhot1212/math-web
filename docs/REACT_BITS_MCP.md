# React Bits MCP for Math Hunters

Configured on 29 October 2026 using the [official React Bits setup](https://reactbits.dev/get-started/mcp) and [shadcn MCP documentation](https://ui.shadcn.com/docs/mcp).

## Configuration

- `components.json` registers `@react-bits` at `https://reactbits.dev/r/{name}.json`.
- `.codex/config.toml` launches the project's already-installed shadcn CLI as a stdio MCP server named `shadcn`, with its working directory fixed to `math-web`.
- The current Codex workspace is the parent `math-hunter` directory. Its `.codex/config.toml` links to this app's configuration so the server loads from that already-trusted workspace. No user-wide MCP server or trust settings were changed.
- The Node and project paths are local to this Mac. Update those paths if the checkout or Node installation moves. Run `npm ci` to restore the project's existing dependencies in a fresh checkout.

Restart Codex and reopen the `math-hunter` workspace to load the new tools. Codex loads project configuration only for trusted projects; opening the nested `math-web` repository as a separate workspace requires that workspace to be trusted as well. See [official OpenAI documentation](https://learn.chatgpt.com/docs/extend/mcp?surface=cli).

## Use

Example prompts:

- “Search @react-bits for animated cards.”
- “Show the TypeScript and Tailwind variants of TiltedCard.”
- “Compare the dependencies of these components before adding one to Math Hunters.”

The server exposes project-registry discovery, listing, search, item details, examples, add-command generation, and an audit checklist. Item details provide metadata; full component source can also be inspected with the existing CLI:

```sh
npx --no-install shadcn view @react-bits/TiltedCard-TS-TW
```

Keep the application's approved Motion engine, reduced-motion behaviour, accessibility, and React Bits attribution when integrating components. Setup does not install any component or add an animation runtime.

## Verified

- Bundled Codex CLI recognises `shadcn` as enabled from the current `math-hunter` workspace.
- A real MCP stdio handshake succeeds and lists seven tools.
- `get_project_registries` returns `@shadcn` and `@react-bits`.
- `search_items_in_registries` finds `TiltedCard-TS-TW`.
- `view_items_in_registries` returns the component details.
- The CLI fetches its TypeScript source successfully (one file, over 26,000 characters).

The running chat's tool catalogue has not been reloaded; restart the client before expecting these tools here. No app build, deployment, dependency update, or UI change was needed for this setup.

## Catalogue exploration and application

The follow-up pass queried the complete live catalogue through MCP and applied Gradient ASCII to exploration scenes. See [the complete catalogue audit](REACT_BITS_COMPONENT_AUDIT.md) and [visual review](../design-review/simulation/README.md). The ASCII renderer uses browser WebGL directly; it adds no package dependency.
