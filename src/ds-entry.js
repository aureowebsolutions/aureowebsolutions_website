// Synthetic design-system entry — re-exports all UI components for design-sync
export { MemoryRouter } from 'react-router-dom';
export { default as Navbar } from './components/navbar/Navbar';
export { default as Brand } from './components/brand/Brand';
export { default as Cta } from './components/cta/Cta';
export { default as Feature } from './components/feature/Feature';
export { default as Article } from './components/article/Article';
export { default as Header } from './containers/header/Header';
export { default as Footer } from './containers/footer/Footer';
// Blog excluded — uses webpack-only require.context() for dynamic image loading
export { default as Features } from './containers/features/Features';
export { default as WhatAUREO } from './containers/whatAUREO/WhatAUREO';
export { default as Posibility } from './containers/posibility/Posibility';
