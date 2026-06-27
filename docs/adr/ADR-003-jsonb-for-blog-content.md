# ADR-003: JSONB para el contenido de blog (block model)

**Status:** Accepted  
**Date:** 2026-06-27

## Context

El contenido de cada post de blog no es texto plano: es una secuencia heterogénea de bloques (párrafos, headings, listas de bullets) que ya existe en el JSON actual del proyecto. Se necesita decidir cómo almacenar esta estructura en la base de datos.

Las opciones evaluadas fueron:

- **Markdown** en un campo `TEXT` — simple, portable, requiere un parser en el cliente.
- **Tabla relacional `content_blocks`** — rows separados por bloque, ordenados con un campo `position`.
- **JSONB** — campo único que almacena el array de bloques como JSON nativo de PostgreSQL.
- **CMS headless** (Contentful, Sanity) — el contenido lo gestiona un sistema externo.

## Decision

Se usa un campo **`content JSONB`** que almacena un array de bloques tipados:

```json
[
  { "type": "paragraph", "text": "..." },
  { "type": "heading", "level": 2, "text": "..." },
  { "type": "bullet_list", "items": ["...", "..."] }
]
```

El tipo TypeScript `ContentBlock` actúa como contrato entre la base de datos y el renderizador.

## Rationale

- La estructura de bloques ya existe en el JSON local del proyecto (`blogs.json`). JSONB es la migración directa sin transformar el modelo de datos.
- JSONB permite leer el array completo en una sola query, sin `JOIN` a una tabla de bloques. Para el volumen esperado (posts leídos uno a la vez) esto es óptimo.
- El admin block editor serializa/deserializa el array en el cliente — la base de datos no necesita entender la estructura interna de cada bloque.
- Agregar un nuevo tipo de bloque (ej. `code_snippet`) solo requiere actualizar el tipo TypeScript y el renderizador; el schema de la base de datos no cambia.

## Consequences

**Positivo:**
- Schema simple: una tabla, un campo, sin relaciones adicionales.
- Extensible sin migraciones: nuevos tipos de bloque son aditivos.
- El array completo viaja en un solo campo — sin N+1 queries.

**Negativo:**
- No se puede hacer queries dentro del contenido de un bloque (ej. buscar posts que contengan una palabra en un párrafo) sin usar operadores JSONB específicos de PostgreSQL (`@>`, `#>>`).
- Sin validación de schema en la base de datos — un bloque malformado pasa la constraint `JSONB`. La validación recae en el formulario del admin y en el tipo TypeScript.
- Si el volumen de posts crece y se necesita búsqueda full-text dentro del contenido, se requerirá un índice GIN o integrar Supabase's `pg_trgm`.
