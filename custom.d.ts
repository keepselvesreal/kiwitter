// declarations.d.ts
// declare module '*.svg' {
//     import React = require('react');
//     export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
//     const src: string;
//     export default src;
//   }
  
declare module '*.svg' {
  const content: React.FC<React.SVGProps<SVGElement>>
  export default content
}