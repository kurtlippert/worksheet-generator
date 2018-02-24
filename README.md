# elm-ts-starter  
`npm / yarn start` to run  
  
**Features**  
* `webpack.config` written in ts
* tree-shaking support (all without having to use babel)
  
**Notes**
* `tsconfig` may have extraneous items (libs for example)
* `tsconfig.webpack.json` is what webpack will transpile ts into
  1. it receives the es5 code with es6 modules so it can tree-shake...
  2. then it transpiles again to es5 and commonjs modules for the browser
* `tslint` is a tad opinionated and can be modified per liking
