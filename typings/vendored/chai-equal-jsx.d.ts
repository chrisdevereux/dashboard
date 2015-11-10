declare module Chai {
  interface Assertion {
    equalJSX(element: any): this;
    includeJSX(element: any): this;
  }
}