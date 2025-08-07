/**
 * Encode special characters in `value`.
 *
 * @param {string} value
 *   Value to encode.
 * @param {Options} [options]
 *   Configuration.
 * @returns {string}
 *   Encoded value.
 */
export function stringifyEntities(value: string, options?: Options | undefined): string;
/**
 * Encode special characters in `value` as hexadecimals.
 *
 * @param {string} value
 *   Value to encode.
 * @param {LightOptions} [options]
 *   Configuration.
 * @returns {string}
 *   Encoded value.
 */
export function stringifyEntitiesLight(value: string, options?: import(".pnpm/stringify-entities@4.0.4/node_modules/stringify-entities/lib/core.js").CoreOptions | undefined): string;
export type Options = import('.pnpm/stringify-entities@4.0.4/node_modules/stringify-entities/lib/core.js').CoreOptions & import('.pnpm/stringify-entities@4.0.4/node_modules/stringify-entities/lib/util/format-smart.js').FormatSmartOptions;
export type LightOptions = import('.pnpm/stringify-entities@4.0.4/node_modules/stringify-entities/lib/core.js').CoreOptions;
