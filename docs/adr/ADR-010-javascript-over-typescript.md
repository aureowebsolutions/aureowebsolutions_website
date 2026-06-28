# ADR-010: JavaScript (JSDoc) en lugar de TypeScript

**Status:** Accepted  
**Date:** 2026-06-27

## Context

El SPEC especifica TypeScript (`src/lib/supabase.ts`, `src/types/index.ts`, `src/context/AuthContext.tsx`, etc.) y todos los snippets de código del spec usan sintaxis TypeScript. Sin embargo, el proyecto existente es Create React App con JavaScript puro (`.jsx`, `.js`) — no hay `tsconfig.json`, no hay `@types/*` instalados, y todos los componentes existentes usan `.jsx`.

Migrar a TypeScript a mitad de un proyecto CRA requiere:
1. Instalar `typescript` y todos los `@types/*` de las dependencias existentes.
2. Renombrar todos los archivos `.jsx` → `.tsx` y `.js` → `.ts`.
3. Añadir anotaciones de tipo a todo el código existente (Navbar, Header, Footer, etc.).
4. Resolver errores de compilación en dependencias que no tienen tipos.

## Decision

Se mantiene el proyecto en **JavaScript**. Los tipos del spec se implementan como **JSDoc `@typedef`** en `src/lib/types.js`. Todos los archivos nuevos usan `.jsx` y `.js`.

```js
// En lugar de:
// export interface Blog { id: string; title: string; ... }

// Se usa:
/**
 * @typedef {Object} Blog
 * @property {string} id
 * @property {string} title
 * ...
 */
```

Los editores modernos (VS Code) leen JSDoc y proveen autocompletado e inferencia de tipos sin compilador TypeScript.

## Rationale

- Convertir el proyecto existente a TypeScript requeriría tipar ~30 archivos existentes antes de poder añadir una sola línea de código nuevo — el costo es desproporcionado al beneficio en este contexto.
- CRA soporta TypeScript pero requiere renombrar archivos; hacerlo incrementalmente genera un proyecto mezclado `.jsx`/`.tsx` que es difícil de mantener.
- JSDoc provee suficiente contrato entre la capa de datos y la UI para el tamaño del proyecto. Los IDEs modernos infieren tipos desde JSDoc sin compilación.
- La consecuencia negativa del spec ("TypeScript compiles with no errors") no aplica — se reemplaza por "ESLint pasa sin errores".

## Consequences

**Positivo:**
- Cero fricción de migración — el código nuevo se integra directamente con el código existente.
- Sin paso de compilación adicional — CRA funciona igual.
- JSDoc es suficiente para documentar los tres tipos principales (`Blog`, `Work`, `ContentBlock`).

**Negativo:**
- Sin verificación de tipos en tiempo de compilación — errores de tipo solo se detectan en runtime o en el editor.
- Los snippets del spec en TypeScript deben adaptarse manualmente al quitarles las anotaciones de tipo (`: string`, `interface`, `type`).
- Si en el futuro el proyecto migra a TypeScript, los JSDoc son una base sólida pero la migración sigue siendo necesaria.
- La checklist del spec dice "TypeScript compiles with no errors" — este criterio no puede verificarse; se sustituye por "ESLint sin errores".
