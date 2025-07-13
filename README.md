# What are we making?

- Minimal html/js site
- that has the following button which map to the solidity smart contract
  - connect ✅
  - buy coffee ✅
    - Button to but coffee ✅
    - Call a function on a smart contract ✅
    - Have a test blockchain that we can call? ✅
  - get balance ✅
  - withdraw ✅
  - typescript ✅
  1. you cannot directly import the typescript into html file like we did a js file. for that we have to first compile the tyscript file into javascript file using this cmd `pnpm tsc path_of_the_file`, it will generate a new file with the same name but in .js formatted, that way the our frontend understands the typescript.
  2. another way is to use vite. vite is a bundler it does all the things in the behind and we donot need to compile the ts manually, and also we can pass the ts file in html, it will automatically covert it into js and run. To install vite `pnpm add vite` . and moving forward we'll use react and next.js that does all the things behind for us.
