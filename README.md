# Deaf First Magicians System - Interactive Architecture

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

This project is a dynamic, interactive visualization of the **Deaf First Magicians System**, a conceptual, AI-powered ecosystem designed to support Deaf and Hard-of-Hearing individuals in entrepreneurship, creative arts, and employment.

The application provides a "God view" of the entire system architecture, showcasing the core components, specialized AI agents, data flows, and their relationships. It is built with React, TypeScript, and Tailwind CSS, and leverages the **Google Gemini API** for on-demand analysis and summarization.

## Core Philosophy: "Deaf First"

Unlike traditional applications that add accessibility as an afterthought, this system is conceptualized from a "Deaf First" perspective. This means:

-   **Conceptual Clarity:** UI/UX and terminology are designed with Deaf cultural and linguistic context in mind first, then adapted for hearing users.
-   **ASL Gloss:** The "Deaf Mode" feature translates standard technical labels into American Sign Language (ASL) gloss, a written representation of ASL signs. This prioritizes native communication clarity over hearing-centric jargon.
-   **Multimodal Communication:** The architecture's core pillars, like `PinkSync`, are built around the seamless translation between signed, spoken, and written language.

## Key Features

-   **Interactive Diagram:** Pan and zoom across the architecture canvas to explore every component.
-   **Component Details:** Click any node for a detailed modal with its description, connections, live metrics, verification status, and API examples.
-   **"Deaf Mode" Toggle:** Instantly switch the entire diagram's labeling system between standard technical terms and conceptually equivalent ASL gloss.
-   **Cloud Provider Equivalents:** Dynamically view the equivalent services for each component on Google Cloud (GCP), AWS, and Azure.
-   **AI-Powered Architecture Summary:** Use the Gemini API to generate a concise summary of the architecture's capabilities and recommend a cloud partner.
-   **AI-Powered Feedback Analysis:** In "Deaf Mode," users can submit feedback on ASL gloss labels, which can be sent to the Gemini API for analysis and improvement suggestions.
-   **Search & Filter:** Quickly find components by name, type, or label to highlight them and their immediate connections.
-   **Informational Modals:** Access a high-level **System Overview**, explore potential **User Pathways**, and view a **Component Legend** for clarity.

## Conceptual Storyline: The Coda Humanoid

What if this architecture wasn't just a system, but a physical being? Imagine a humanoid designed from the ground up on the "Deaf First" philosophy. We call it **Coda**—a name that respects its programming (`code`) and its role as a bridge between Deaf and hearing worlds (CODA: Child of Deaf Adult).

### Core Concept

Coda is not a voice-first assistant with sign language bolted on. It is a **multimodal-native being**. Its primary function is to understand and express information through the most effective channel for the user, seamlessly translating between sign, text, and speech.

### Anatomy of Coda: From Software to Physical Form

-   **Eyes (High-Fidelity Cameras):** The primary input, feeding directly into **`PinkSync`**. They don't just "see"; they understand handshapes, facial expressions, and body language to comprehend signed communication with incredible accuracy.
-   **Ears (Microphone Array):** These capture spoken language, feeding it into the **`Speech-to-Text Model`** for real-time captioning displayed on its screen.
-   **Mind & Brain (`MagicianCore` & `PinkSync`):** This is Coda's cognitive hub. `PinkSync` acts as the universal translator, converting all inputs into an abstract "meaning" layer. `MagicianCore` is the executive brain, receiving this intent and activating the correct AI agent (or "skill") to respond.
-   **Hands & Arms (High-Dexterity Manipulators):** Coda's most important feature. These are not simple grippers but are designed to replicate the nuance and fluidity of American Sign Language, driven by the **`Text-to-Sign Model`**.
-   **Face/Chest (Integrated Screen):** This screen is Coda's multi-purpose communication surface. It displays real-time captions, text-based responses, or the ASL Avatar for complex visual aids. It is the physical manifestation of the **`USER_INTERFACE`**.
-   **Identity & Conscience (`DeafAuth` & `FibonRose`):** Coda recognizes users via biometric scans (`DeafAuth`), granting secure access to their profile. Before responding to a sensitive query, its **`FibonRose`** ethical governor runs a check, ensuring the advice is safe, unbiased, and includes appropriate disclaimers.

### A Scenario: Interaction with Coda

Imagine an aspiring Deaf entrepreneur, Maria, approaching Coda in a co-working space.

1.  **Recognition:** Coda's cameras see Maria. **`DeafAuth`** recognizes her face. Its screen lights up, and it signs:
    > "HELLO MARIA. WELCOME BACK."

2.  **Interaction:** Maria signs:
    > "I need money for my new art business. What are my options?"

3.  **Understanding:** Coda's cameras feed the signs to **`PinkSync`**, which translates the query. **`MagicianCore`** understands the intent is about business finance and activates the **`FundingMagician`** agent.

4.  **Action & Response:** `FundingMagician` queries its knowledge base, including live data from **`Federal/State APIs`**.

5.  **Multimodal Output:** Coda responds:
    -   **Sign:** Its hands begin signing, "GOOD QUESTION. THERE-ARE THREE MAIN-PATHS: GRANTS, LOANS, AND COMMUNITY-FUNDS. LET-ME-SHOW-YOU."
    -   **Screen:** As it signs, its chest screen lists the three categories with details pulled from its data, such as "SBA Microloan Program" and "Access Ventures Grant."
    -   **Speech (Optional):** If a hearing mentor were present, Coda might say, "I am showing Maria her options for funding," while displaying captions for full transparency.

Coda would be more than a humanoid; it would be the ultimate embodiment of the Deaf First Magicians System—a partner, a tool, and a bridge, built to empower and connect.

## The Handoff: From Visualization to Reality

The "Deploy Agents" and "Ready to Build" buttons in the AI-generated summary represent the critical handoff from conceptual architecture to tangible, cloud-native infrastructure. Here’s how that process is envisioned to work on the backend:

### The Magic Wand: PinkFlow CLI

At the heart of this automation is the **`PinkFlow CLI`**, the system's command-line powerhouse. It's the "magic wand" that developers and the `DeveloperMagician API` use to bring the architecture to life. It's more than just a deployment script; it's a comprehensive automation and governance engine.

-   **Infrastructure as Code (IaC):** When a build is triggered, `PinkFlow` reads the system definition from `Source Control` and uses tools like Terraform to provision every piece of infrastructure—databases, serverless functions, Kubernetes clusters, and networking.
-   **Policy Enforcement:** Before deploying, `PinkFlow` consults the **`FibonRose`** ethics engine. It checks the IaC templates against predefined policies to ensure security best practices, cost controls, and ethical guidelines are met. A deployment that violates policy is automatically halted.
-   **Security Automation:** It integrates security scanning directly into the pipeline, checking for vulnerabilities in container images, dependencies, and infrastructure configurations before they ever reach production.
-   **Automated Deployment Plans:** `PinkFlow` intelligently generates deployment plans, understanding the dependencies between services (`EDGES`) to ensure components are created in the correct order.

This CLI turns the abstract visualization into a repeatable, secure, and automated reality.

### "Deploy Agents" -> Agent Management Platform

When a user clicks **"Deploy Agents"**, they are redirected to a conceptual service like `https://agents.mbtq.dev`. This action isn't just a link; it's a handoff of the *AI agent configuration* to a specialized backend platform responsible for their lifecycle management.

1.  **Handoff:** The user's browser sends the configuration (the list of agents like `IdeaMagician`, `FundingMagician`, etc., and the chosen cloud partner) to the Agent Management Platform.
2.  **Provisioning:** The platform's backend uses an IaC tool (like Terraform) to provision serverless infrastructure for each agent (e.g., Google Cloud Functions, AWS Lambda).
3.  **Orchestration Setup:** It configures the `MagicianCore` (e.g., a Google Workflow or AWS Step Function) to correctly route requests to the appropriate agent function.
4.  **Monitoring & Management:** The user is presented with a dashboard on `agents.mbtq.dev` to monitor invocations, view logs, manage versions, and analyze costs for their deployed agents. This provides a serverless, managed environment for the "brains" of the operation.

### "Ready to Build" -> Full Infrastructure Scaffolding

Clicking **"Ready to Build"** is a more comprehensive step, handing off the *entire system architecture* to a scaffolding engine at a conceptual service like `https://build.mbtq.dev`.

1.  **Handoff:** The entire system definition (all `NODES` and `EDGES` from `constants.ts`) and the chosen cloud partner are sent to the Scaffolding Platform.
2.  **IaC Generation:** The platform's backend analyzes the architecture and generates a complete set of Infrastructure as Code scripts (e.g., Terraform, Pulumi, or CloudFormation). These scripts define every component:
    -   **Databases:** `Cloud SQL` / `RDS` instances.
    -   **APIs:** `Cloud Run` / `Lambda` services with `API Gateway` configurations.
    -   **Messaging:** `Pub/Sub` topics / `SNS` topics.
    -   **Networking & Security:** VPCs, firewalls, and IAM roles (`DeafAuth`).
3.  **CI/CD Pipeline:** The generated code is committed to a new Git repository, and a CI/CD pipeline (e.g., GitLab CI, GitHub Actions) is triggered.
4.  **Deployment:** The pipeline runs the IaC scripts, building out the entire, interconnected infrastructure in the user's own cloud account. The result is a fully provisioned, "empty" backend, ready for developers to implement the specific business logic for each microservice.

## Architecture Overview

The diagram is organized into logical layers, representing a modern, microservices-based, AI-driven platform.

-   **User Interaction Layer:** The web and mobile frontends (`ui-web-mobile`).
-   **Core Services & Gateways:** The central pillars of the system: `DeafAuth` (Identity), `PinkSync` (Accessibility), and `FibonRose` (Ethics).
-   **Microservice APIs:** Domain-specific gateways for different user pathways (Creative, Business, Job, Developer).
-   **AI Magician Agents:** A suite of specialized AI agents (e.g., `IdeaMagician`, `BuilderMagician`, `FundingMagician`) that perform complex, goal-oriented tasks.
-   **Data & Intelligence Layer:** The persistence and messaging backbone, including databases (`Supabase`), caches (`Upstash`), event buses (`Syix`), and analytics warehouses (`BigQuery`).
-   **Infrastructure & Observability:** The foundational layer for hosting AI models (`Vertex AI`), managing source code (`GitLab`), and monitoring the entire system's health.

## Technical Deep Dive: The Build-less Approach

This project intentionally avoids a traditional Node.js/npm-based build setup (like Webpack or Vite). Instead, it relies on modern browser features:

-   **ES Modules (ESM):** All code is written in standard JavaScript modules, which modern browsers can load natively.
-   **`importmap`:** The `index.html` file contains an `importmap` script tag. This tells the browser how to resolve "bare" import specifiers (like `import React from 'react'`) to full URLs, pointing to a CDN like `esm.sh`.

This approach offers several advantages for a project of this nature:
-   **Zero Setup:** No `npm install` is needed. You can clone the repository and run it immediately with a local server.
-   **Simplicity:** The "toolchain" is just the browser itself, making the codebase easier to understand and debug.
-   **Fast Iteration:** Changes are reflected instantly on browser refresh without any bundling delays.

## Tech Stack

-   **Framework:** React 19
-   **Language:** TypeScript
-   **AI Integration:** Google Gemini API (`@google/genai`)
-   **Styling:** Tailwind CSS
-   **Module Loading:** Browser-native ES Modules with an `importmap`.
-   **Hosting:** Dependencies are served from `esm.sh`, a modern CDN for ES Modules.

## Project Structure

```
.
├── components/             # Reusable React components
│   ├── ArchitectureNode.tsx  # Renders a single node
│   ├── NodeDetailModal.tsx   # Modal for component details
│   └── ...                 # Other UI components
├── __tests__/              # Mock unit tests
│   └── api.test.ts         # Example tests for API domains
├── App.tsx                 # Main application component
├── constants.ts            # Defines all nodes, edges, and static data
├── index.html              # App entry point with importmap
├── index.tsx               # Mounts the React app
├── metadata.json           # Application metadata
├── README.md               # This file
└── types.ts                # TypeScript type definitions
```

## Running Locally

This project is designed to be run directly in the browser without a complex build process.

### Prerequisites

1.  A modern web browser (Chrome, Firefox, Edge, Safari).
2.  A Google Gemini API key. You can get one from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/deaf-first-magicians.git
    cd deaf-first-magicians
    ```

2.  **Set up the API Key:**
    The application code expects the API key to be available at `process.env.API_KEY`. Since this is a client-side application running in the browser, `process.env` is not directly available. **You must simulate this environment variable.**

    **The recommended approach is to use a tool that injects this variable before serving the files.** For simple local development, you can create a new HTML file named `dev.html` and add a script to set the variable:

    **`dev.html`:**
    ```html
    <!DOCTYPE html>
    <html>
      <head>
        <title>DEV RUNNER</title>
        <script>
          // IMPORTANT: This exposes your API key in the client.
          // Do NOT commit this file or deploy it publicly.
          window.process = {
            env: {
              API_KEY: 'YOUR_GEMINI_API_KEY_HERE'
            }
          };
        </script>
      </head>
      <body>
        <script type="module" src="/index.tsx"></script>
        <!-- The rest of your index.html body content -->
        <div id="root"></div>
      </body>
    </html>
    ```
    *Note: This is for local development only. For a real deployment, you would use a secure method like server-side rendering or a proxy to handle the API key.*

3.  **Serve the application:**
    You need a simple local web server.

    **Using VS Code:**
    -   Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension.
    -   Right-click on `index.html` (or your new `dev.html`) and select "Open with Live Server".

    **Using Python:**
    ```bash
    # If you have Python 3
    python -m http.server
    ```

4.  **Access the App:**
    Open your web browser and navigate to the local server's address (e.g., `http://localhost:8000`).

## Contributing

Contributions are welcome! If you have ideas for new features, components, or improvements to the architecture or code, please feel free to:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a new Pull Request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.