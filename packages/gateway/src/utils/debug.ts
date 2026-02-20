/**
 * Re-exports from `@vivero/stoma-core`.
 *
 * The debug module lives in `packages/core` and is shared across all Stoma
 * packages. This file exists so that gateway-internal imports
 * (`../utils/debug`) continue to resolve without a 12-file refactor.
 *
 * @module debug
 */
export {
  createDebugFactory,
  createDebugger,
  type DebugLogger,
  matchNamespace,
  noopDebugLogger,
} from "@vivero/stoma-core";
