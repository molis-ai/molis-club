import openapi from './contracts/openapi.json' with { type: 'json' };
import schemaDocument from './contracts/schemas.json' with { type: 'json' };
import {
  validateNamed,
  validateWithDocument,
  type Schema,
  type SchemaDocument,
} from './contracts/validate.ts';
import { requireAccount } from './errors.ts';
export interface Parameter {
  name: string;
  in: string;
  required: boolean;
  schema: Schema;
}
export interface Operation {
  operationId: string;
  parameters: Parameter[];
  security: Record<string, string[]>[];
  requestBody?: { content: { 'application/json': { schema: Schema } } };
  responses: Record<
    string,
    { content: { 'application/json': { schema: Schema } } }
  >;
}
export interface OperationEntry {
  path: string;
  method: string;
  operation: Operation;
}
export const operations: readonly OperationEntry[] = Object.entries(
  openapi.paths,
).flatMap(([path, methods]) =>
  Object.entries(methods).map(([method, operation]) => ({
    path,
    method: method.toUpperCase(),
    operation: operation as Operation,
  })),
);
export function namedSchema(schema: Schema): string {
  const ref = schema.$ref;
  requireAccount(
    typeof ref === 'string' && ref.startsWith('./schemas.json#/$defs/'),
    503,
    'AUTH_UNAVAILABLE',
  );
  return ref.split('/').at(-1)!;
}
export function validParameter(parameter: Parameter, value: unknown): boolean {
  if (parameter.schema.$ref)
    return validateNamed(namedSchema(parameter.schema), value);
  return validateWithDocument(
    {
      ...schemaDocument,
      $defs: { ...schemaDocument.$defs, Parameter: parameter.schema },
    } as SchemaDocument,
    'Parameter',
    value,
  );
}
export function operationById(
  id: string,
  prefix: '/api/v2/' | '/api/account/',
): OperationEntry {
  const found = operations.find(
    (entry) =>
      entry.operation.operationId === id && entry.path.startsWith(prefix),
  );
  requireAccount(found, 404, 'NOT_FOUND');
  return found;
}
export function validateBody(operation: Operation, body: unknown): void {
  const schema = operation.requestBody?.content['application/json'].schema;
  requireAccount(
    schema ? validateNamed(namedSchema(schema), body) : body === undefined,
  );
}
export function resolveParameters(
  entry: OperationEntry,
  path: Record<string, unknown> = {},
  query: Record<string, unknown> = {},
): string {
  let resolved = entry.path;
  const params = new URLSearchParams();
  for (const [location, values] of [
    ['path', path],
    ['query', query],
  ] as const) {
    const declared = entry.operation.parameters.filter(
      (p) => p.in === location,
    );
    requireAccount(
      Object.keys(values).every((key) => declared.some((p) => p.name === key)),
    );
    for (const p of declared) {
      const value = values[p.name];
      requireAccount(
        value === undefined ? !p.required : validParameter(p, value),
      );
      if (value !== undefined) {
        requireAccount(typeof value === 'string' || typeof value === 'number');
        if (location === 'path')
          resolved = resolved.replace(
            `{${p.name}}`,
            encodeURIComponent(String(value)),
          );
        else params.set(p.name, String(value));
      }
    }
  }
  return resolved + (params.size ? `?${params.toString()}` : '');
}
