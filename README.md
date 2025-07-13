# Buy Me a Coffee - dApp

A minimal HTML/JS site with a frontend that interacts with a Solidity smart contract.

## Features

The site has buttons that map to the following Solidity smart contract functions:

- [x] Connect Wallet
- [x] Buy Coffee
  - [x] A button to trigger the purchase.
  - [x] Calls a function on the smart contract.
  - [x] Works with a test blockchain.
- [x] Get Balance
- [x] Withdraw Funds
- [x] Written in TypeScript

## Notes on TypeScript Usage

1.  **Manual Compilation**:
    You cannot directly import a TypeScript (`.ts`) file into an HTML file as you would with a JavaScript (`.js`) file. It must first be compiled into JavaScript. You can do this with the TypeScript compiler:

    ```bash
    pnpm tsc path/to/your/file.ts
    ```

    This command generates a corresponding `.js` file that can be included in your HTML.

2.  **Using a Bundler (like Vite)**:
    A simpler approach is to use a modern build tool like Vite. Vite handles the TypeScript to JavaScript compilation automatically behind the scenes, allowing you to reference your `.ts` file directly in your HTML.
    To install Vite:
    ```bash
    pnpm add vite
    ```
    Frameworks like React and Next.js also provide this bundling functionality out of the box.
