# ADR-005: Block editor custom en lugar de librería rica de texto

**Status:** Accepted  
**Date:** 2026-06-27

## Context

El admin panel necesita una interfaz para crear y editar el contenido de los posts de blog, cuya estructura es un array de bloques (`paragraph`, `heading`, `bullet_list`). Se necesita decidir entre un editor de texto enriquecido (WYSIWYG) y un editor por bloques construido a mano.

Las opciones evaluadas:

- **TipTap / ProseMirror** — editor WYSIWYG extensible, produce HTML o JSON.
- **Slate.js** — editor de texto enriquecido con modelo de datos basado en árboles JSON.
- **react-quill / Draft.js** — editores WYSIWYG maduros, producen HTML o estado propio.
- **Block editor custom** — lista de bloques con tipo selector + inputs específicos por tipo.

## Decision

Se implementa un **block editor custom** con la siguiente mecánica:

- Lista de bloques, cada uno con un selector de `type` (`paragraph` / `heading` / `bullet_list`).
- Inputs específicos por tipo: textarea para párrafos, `level` + text para headings, lista dinámica de inputs para bullet lists.
- Botones para agregar bloque, eliminar bloque, mover arriba/abajo.
- En save: el array de bloques se serializa directamente a JSONB.

## Rationale

- El modelo de contenido tiene solo 3 tipos de bloque con estructura fija y conocida. Un WYSIWYG completo (TipTap, Slate) agrega significativa complejidad para un caso de uso acotado.
- Las librerías ricas de texto generan HTML o su propio formato interno — ambos requieren transformación al formato de bloques del spec. El editor custom serializa directamente al contrato `ContentBlock` sin conversión.
- El editor custom no agrega dependencias externas pesadas ni sus estilos de UI propios, que entrarían en conflicto con el design system del admin panel.
- El único usuario del editor es el administrador del sitio, que conoce la estructura. No se requiere una experiencia de escritura fluida como la de un CMS orientado a redactores.

## Consequences

**Positivo:**
- La salida del editor es exactamente el tipo `ContentBlock[]` — sin parsing, sin transformación.
- Sin dependencias adicionales en el bundle.
- Fácil de extender: agregar un tipo de bloque nuevo implica agregar un `case` en el switch del editor y el renderer.

**Negativo:**
- La experiencia de escritura es menos fluida que un WYSIWYG. No hay shortcuts de teclado (Ctrl+B para bold, etc.) ni drag-and-drop de bloques.
- No soporta texto con formato inline (bold, italic, links dentro de un párrafo). Si se necesita en el futuro, requeriría reemplazar el editor por completo o agregar parsing de Markdown dentro del campo `text`.
- El mantenimiento del editor es responsabilidad del proyecto — no hay una comunidad que corrija bugs o agregue features.
