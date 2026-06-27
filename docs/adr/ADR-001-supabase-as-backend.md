# ADR-001: Supabase como backend de persistencia

**Status:** Accepted  
**Date:** 2026-06-27

## Context

El proyecto necesita persistir dos tipos de contenido (`blogs` y `works`) que hoy están hardcodeados en JSON y JSX respectivamente. Se requiere una solución que cubra base de datos, autenticación y almacenamiento de imágenes sin necesidad de un servidor backend propio, dado que el sitio está desplegado en Netlify como SPA.

Las opciones evaluadas fueron:

- **Firebase** (Firestore + Auth + Storage)
- **PlanetScale + Clerk** (MySQL + auth separada)
- **Supabase** (PostgreSQL + Auth + Storage)
- **Contentful / Sanity** (CMS headless)

## Decision

Se elige **Supabase** como plataforma única para base de datos, autenticación y storage de imágenes.

## Rationale

- El cliente Supabase (`@supabase/supabase-js`) expone base de datos, auth y storage desde un solo SDK, eliminando la necesidad de coordinar múltiples servicios.
- PostgreSQL permite usar `JSONB` para el campo `content` de blogs (bloques de contenido con estructura variable) y `TEXT[]` para tags, sin requerir tablas auxiliares.
- Las políticas de Row Level Security (RLS) se definen en la base de datos, no en el frontend — las reglas de acceso no dependen del código del cliente.
- El free tier de Supabase cubre el volumen esperado del sitio (contenido estático, bajo tráfico de escritura).
- La autenticación de Supabase es suficiente para el caso de uso: un único administrador, login por email/password, sin registro público.

## Consequences

**Positivo:**
- Un solo proveedor para DB + auth + storage → menos configuración y menos secrets a gestionar.
- PostgreSQL es más expresivo que Firestore para queries (filtros, orden, RLS granular).
- Si en el futuro se necesitan funciones serverless, Supabase Edge Functions está disponible en el mismo proyecto.

**Negativo:**
- El cliente de Supabase expone la `anon key` en el bundle del frontend. La seguridad recae completamente en las políticas RLS — si una política está mal configurada, los datos son accesibles públicamente.
- Vendor lock-in con Supabase. Migrar a otra base de datos requeriría reescribir la capa de acceso a datos.
- El free tier tiene límites de almacenamiento (500MB DB, 1GB storage) que pueden alcanzarse si el volumen de imágenes crece.
