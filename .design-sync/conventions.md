# AureoWebSolutions UI — Design Conventions

## Color System
- Dark navy background: `#031B34` (page/section backgrounds)
- Gradient accent: CSS class `gradient__bg` (yellow→purple→slate, used on hero and navbar)
- Primary CTA: `#FFD700` / golden yellow — buttons and highlights
- Text on dark: white / `#FFFFFF`
- Text on light: dark navy

## Typography
- Font: **Manrope** (Google Fonts, all weights)
- Headings: bold, sentence case
- Body: regular weight, generous line-height

## Layout Principles
- Full-width sections stacked vertically (no sidebar layout)
- Sections alternate: dark navy bg → gradient bg → dark navy
- Max-width content containers centered with padding

## Component Usage
- **Navbar**: always wraps content above the fold; the `gradient__bg` container provides the hero background
- **Header**: hero section — place immediately inside `gradient__bg` below Navbar
- **Features / WhatAUREO / Posibility**: standalone dark-bg sections; compose in order for the homepage
- **Footer**: always at page bottom
- **Brand**: small branding unit — use inside Navbar or footers
- **Cta**: call-to-action block — place between content sections
- **Feature**: individual feature card — used inside Features section
- **Article**: blog post card — used in blog listing pages; requires `blogId` for routing

## Router Requirement
All components that render links (Navbar, Article) require a React Router context. The design project provides `MemoryRouter` as the global provider automatically.
