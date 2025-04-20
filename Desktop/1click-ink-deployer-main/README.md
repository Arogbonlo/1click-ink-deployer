# 1Click Ink! Contract Deployer

**Deploy ink! smart contracts to WASM-compatible Substrate chains (e.g. Astar, Aleph Zero) from your browser — or directly from GitHub Actions.** Upload your `.contract` file, connect your Polkadot wallet, choose a network, fill constructor args, and deploy in one click.

---

##  Project Overview

The **1Click Ink! Contract Deployer** is a lightweight, developer-focused tool built with **Next.js**, **TypeScript**, and **Polkadot.js** that simplifies the ink! smart contract deployment process on WASM-compatible Substrate chains.

This tool is especially useful for:
- Hackathon participants deploying fast
- DApp teams prototyping new contracts
- Web3 devs testing locally or remotely
- Builders integrating with Astar, Shiden, Aleph Zero, etc.

You can use the app through:
- A beautiful browser UI
- A CI/CD-friendly GitHub Actions workflow

---

##  Installation Instructions (Local Dev)

> Make sure you have `Node.js >= 18` installed.

1. **Clone the repo:**

```bash
git clone https://github.com/YOUR_USERNAME/1click-ink-deployer.git
cd 1click-ink-deployer
```

2. **Install dependencies:**

```bash
npm install
```

3. **Start the local dev server:**

```bash
npm run dev
```

4. Visit the app at [http://localhost:3000](http://localhost:3000)

---

##  Usage Guide

###  Uploading and Deploying Contracts via Browser

1. **Connect Wallet**  
   Connect via the Polkadot.js browser extension.

2. **Upload Contract**  
   Upload a `.contract` file (generated via `cargo contract build`).

3. **Select a Network**  
   Choose from the dropdown (e.g. Astar Shibuya, Aleph Zero Testnet).

4. **Fill Constructor Inputs**  
   Dynamically rendered from the metadata. All fields must be filled.

5. **Deploy**  
   Click “Deploy Contract” to instantiate and send the transaction.

6. **Verify**  
   Transaction status and explorer link will appear on success.

---

##  Deployment Instructions (Vercel)

You can deploy the frontend in one click using [Vercel](https://vercel.com):

1. Log in to Vercel
2. Click “New Project”
3. Import the GitHub repository
4. Ensure the following settings:
   - **Framework**: Next.js
   - **Root Directory**: `/` (if using `src/app`)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
5. Click **Deploy**

>  Don’t forget to allow access to the deployed domain in your Polkadot.js extension!

---

##  Supported Networks

| Network            | RPC URL                                 | Explorer Link Format                    |
|--------------------|------------------------------------------|-----------------------------------------|
| Astar Shibuya      | `wss://rpc.shibuya.astar.network`        | `https://shibuya.subscan.io/extrinsic/` |
| Aleph Zero Testnet | `wss://ws.test.azero.dev`                | `https://alephzero.subscan.io/extrinsic/` |

> You can add more networks by editing `src/constants/chains.ts`

---


---

##  Security Considerations

-  All user inputs (constructor args) are sanitized before submission
-  No private keys are ever accessed or stored
-  Wallet access is granted only through Polkadot.js extension
-  No backend server stores deployment data
-  Dependencies are kept up-to-date via GitHub Dependabot & npm audit

---

## 🧪 Testing

This project supports:

###  Unit + Integration Tests

```bash
npm run test
```

- Built with **Jest** and **React Testing Library**
- Covers form inputs, deploy logic, constructor rendering

###  E2E Testing (optional)

```bash
npm run test:e2e
```

- Powered by **Playwright**
- Simulates wallet connect, file upload, deploy click

---

## GitHub Actions

Tests automatically run on every push or PR to `main` via this workflow:

```yaml
# .github/workflows/run-tests.yml

name: Run Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm install

      - name: Run unit + integration tests
        run: npm test
```

---

## Contribution Guide

We welcome PRs! Please:
- Follow the coding style in the project
- Write tests for new features
- Clearly describe your PR in the description

---

## License

MIT © 2025-present [Isaac Arogbonlo]
