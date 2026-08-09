import * as readline from 'readline';
import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

// Color definitions for terminal output
const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',

  fg: {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    crimson: '\x1b[38m'
  },
  bg: {
    black: '\x1b[40m',
    red: '\x1b[41m',
    green: '\x1b[42m',
    yellow: '\x1b[43m',
    blue: '\x1b[44m',
    magenta: '\x1b[45m',
    cyan: '\x1b[46m',
    white: '\x1b[47m',
    crimson: '\x1b[48m'
  }
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function clearScreen() {
  process.stdout.write('\x1Bc');
}

function printBanner() {
  console.log(`${COLORS.fg.cyan}${COLORS.bright}`);
  console.log('██████╗ ███████╗███████╗██╗   ██╗███╗   ███╗███████╗ █████╗ ██╗');
  console.log('██╔══██╗██╔════╝██╔════╝██║   ██║████╗ ████║██╔════╝██╔══██╗██║');
  console.log('██████╔╝█████╗  ███████╗██║   ██║██╔████╔██║█████╗  ███████║██║');
  console.log('██╔══██╗██╔══╝  ╚════██║██║   ██║██║╚██╔╝██║██╔══╝  ██╔══██║██║');
  console.log('██║  ██║███████╗███████║╚██████╔╝██║ ╚═╝ ██║███████╗██║  ██║██║');
  console.log('╚═╝  ╚═╝╚══════╝╚══════╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝╚═╝  ╚═╝╚═╝');
  console.log(`${COLORS.reset}`);
  console.log(`${COLORS.fg.yellow}=== Interactive Workspace Explorer & Control Center ===${COLORS.reset}\n`);
}

function waitForKey(message = 'Press ENTER to return to the main menu...') {
  return new Promise<void>((resolve) => {
    rl.question(`\n${COLORS.fg.green}${message}${COLORS.reset}`, () => {
      resolve();
    });
  });
}

function runCommand(command: string): Promise<void> {
  return new Promise((resolve) => {
    clearScreen();
    console.log(`${COLORS.fg.yellow}${COLORS.bright}Executing: ${command}${COLORS.reset}\n`);
    const child = exec(command);

    child.stdout?.on('data', (data) => {
      process.stdout.write(data);
    });

    child.stderr?.on('data', (data) => {
      process.stderr.write(data);
    });

    child.on('close', (code) => {
      console.log(`\n${COLORS.fg.cyan}-------------------------------------------------------${COLORS.reset}`);
      console.log(`Command finished with exit code: ${code === 0 ? COLORS.fg.green : COLORS.fg.red}${code}${COLORS.reset}`);
      waitForKey().then(() => resolve());
    });
  });
}

async function showOverview() {
  clearScreen();
  console.log(`${COLORS.fg.cyan}${COLORS.bright}=== Project Overview & Product Vision ===${COLORS.reset}\n`);
  console.log(`${COLORS.bright}AI Resume Analyzer${COLORS.reset} is an advanced, comprehensive resume optimization application with AI-powered insights.`);
  console.log('It empowers users to analyze resume formatting and content, calculate ATS compatibility scores, conduct job matching gap analyses, and receive tailored resume recommendations.\n');
  console.log(`${COLORS.fg.magenta}${COLORS.bright}Core Value Propositions:${COLORS.reset}`);
  console.log(` - ${COLORS.bright}ATS & Resume Scoring:${COLORS.reset} Real-time, detailed score check to help get resumes shortlisted faster.`);
  console.log(` - ${COLORS.bright}Tailored AI Suggestions:${COLORS.reset} Personalized recommendations to enhance bullet points and highlight professional achievements.`);
  console.log(` - ${COLORS.bright}Job Description Matching:${COLORS.reset} Instantly compare resume keywords against job post requirements.`);
  console.log(` - ${COLORS.bright}Skill Gap Analysis:${COLORS.reset} Identify missing key skills compared to industry benchmarks and outline career paths.\n`);
  await waitForKey();
}

async function showTechStack() {
  clearScreen();
  console.log(`${COLORS.fg.cyan}${COLORS.bright}=== Technical Stack Overview ===${COLORS.reset}\n`);
  console.log(`${COLORS.fg.yellow}${COLORS.bright}Frontend Structure:${COLORS.reset}`);
  console.log(' - React 18 / 19 with TypeScript');
  console.log(' - Tailwind CSS for styling');
  console.log(' - Responsive layouts with robust modern layout designs (Expo / Mobile & React Components)');
  console.log(' - API integration client auto-generated with Orval (Zod & React Query)\n');

  console.log(`${COLORS.fg.yellow}${COLORS.bright}Backend Architecture:${COLORS.reset}`);
  console.log(' - Express 5 (TypeScript) for routing and middleware server API orchestration');
  console.log(' - PostgreSQL as core relational storage system');
  console.log(' - Drizzle ORM for declarative database schema and type-safe query management');
  console.log(' - Zod schema validation libraries on both client and server boundaries\n');

  console.log(`${COLORS.fg.yellow}${COLORS.bright}AI Services & Tools:${COLORS.reset}`);
  console.log(' - OpenAI ChatGPT GPT-3.5 & GPT-4 models integrated seamlessly');
  console.log(' - Semantic classification & automated insights algorithms');
  await waitForKey();
}

async function showArchitecture() {
  clearScreen();
  console.log(`${COLORS.fg.cyan}${COLORS.bright}=== Architecture Decisions & Repository Map ===${COLORS.reset}\n`);
  console.log(`${COLORS.fg.yellow}${COLORS.bright}Monorepo Workspaces Layout:${COLORS.reset}`);
  console.log(` - ${COLORS.bright}lib/api-spec:${COLORS.reset} Single source of truth containing \`openapi.yaml\` and Orval configuration`);
  console.log(` - ${COLORS.bright}lib/api-zod:${COLORS.reset} Auto-generated TypeScript Zod validation schemas matching openapi spec`);
  console.log(` - ${COLORS.bright}lib/api-client-react:${COLORS.reset} Auto-generated react hooks (React Query + Fetchers) from openapi spec`);
  console.log(` - ${COLORS.bright}lib/db:${COLORS.reset} Core database connection, migrations and schemas declaring PostgreSQL structures`);
  console.log(` - ${COLORS.bright}artifacts/api-server:${COLORS.reset} API backend Express application offering robust REST handlers`);
  console.log(` - ${COLORS.bright}artifacts/mobile:${COLORS.reset} Expo & React Native mobile client codebase`);
  console.log(` - ${COLORS.bright}artifacts/mockup-sandbox:${COLORS.reset} Rapid browser-based sandbox UI for previewing layouts\n`);

  console.log(`${COLORS.fg.yellow}${COLORS.bright}Design Philosophy:${COLORS.reset}`);
  console.log(' 1. Define API specs globally first in OpenAPI.');
  console.log(' 2. Regenerate TypeScript structures (Zod + hooks) to avoid manual drifting.');
  console.log(' 3. Consume auto-generated logic in both mobile, mockup, and server projects.');
  await waitForKey();
}

async function showGotchas() {
  clearScreen();
  console.log(`${COLORS.fg.cyan}${COLORS.bright}=== Repository Gotchas & Developer Notes ===${COLORS.reset}\n`);
  console.log(` 1. ${COLORS.bright}Auto-Generated Code:${COLORS.reset} Never modify files inside folders named \`generated\` directly. Update the OpenAPI spec in \`lib/api-spec/openapi.yaml\` instead, then run \`pnpm --filter @workspace/api-spec run codegen\`.`);
  console.log(` 2. ${COLORS.bright}Database Changes:${COLORS.reset} After updating Drizzle models in \`lib/db\`, always run \`pnpm --filter @workspace/db run push\` to sync database structures with local environment.`);
  console.log(` 3. ${COLORS.bright}Package Installation:${COLORS.reset} We enforce \`pnpm\` usage in this workspace. Installing packages via npm or yarn will trigger preinstall failures to ensure lockfile sanity.`);
  console.log(` 4. ${COLORS.bright}Environment Variables:${COLORS.reset} \`DATABASE_URL\` is strictly required. For AI integrations, specify \`OPENAI_API_KEY\` to allow models to respond correctly.`);
  await waitForKey();
}

async function showCommandRunner() {
  let inRunner = true;
  while (inRunner) {
    clearScreen();
    console.log(`${COLORS.fg.cyan}${COLORS.bright}=== Command Orchestration Room ===${COLORS.reset}\n`);
    console.log('Choose a command to run within the workspace monorepo:\n');
    console.log(` 1. Run typecheck across all projects (\`pnpm run typecheck\`)`);
    console.log(` 2. Build all packages (\`pnpm run build\`)`);
    console.log(` 3. Push local Drizzle DB schema updates (\`pnpm --filter @workspace/db run push\`)`);
    console.log(` 4. Regenerate API client bindings (\`pnpm --filter @workspace/api-spec run codegen\`)`);
    console.log(` 5. Start Express API Server (\`pnpm --filter @workspace/api-server run dev\`)`);
    console.log(` 6. Back to main menu`);

    const answer = await new Promise<string>((resolve) => {
      rl.question(`\n${COLORS.fg.green}Select an option [1-6]: ${COLORS.reset}`, resolve);
    });

    switch (answer.trim()) {
      case '1':
        await runCommand('pnpm run typecheck');
        break;
      case '2':
        await runCommand('pnpm run build');
        break;
      case '3':
        await runCommand('pnpm --filter @workspace/db run push');
        break;
      case '4':
        await runCommand('pnpm --filter @workspace/api-spec run codegen');
        break;
      case '5':
        await runCommand('pnpm --filter @workspace/api-server run dev');
        break;
      case '6':
        inRunner = false;
        break;
      default:
        console.log(`${COLORS.fg.red}Invalid option. Try again.${COLORS.reset}`);
        await new Promise(resolve => setTimeout(resolve, 800));
    }
  }
}

async function mainMenu() {
  while (true) {
    clearScreen();
    printBanner();
    console.log('Select a topic to read or perform a repository action:\n');
    console.log(`  ${COLORS.fg.cyan}1.${COLORS.reset} Project Overview & Product Vision`);
    console.log(`  ${COLORS.fg.cyan}2.${COLORS.reset} Technical Architecture & Tech Stack`);
    console.log(`  ${COLORS.fg.cyan}3.${COLORS.reset} Monorepo Architecture & Package Layout`);
    console.log(`  ${COLORS.fg.cyan}4.${COLORS.reset} Repository Gotchas & Developer Notes`);
    console.log(`  ${COLORS.fg.cyan}5.${COLORS.reset} Command Orchestration Room (Build, Typecheck, Dev Servers)`);
    console.log(`  ${COLORS.fg.cyan}6.${COLORS.reset} Exit`);

    const answer = await new Promise<string>((resolve) => {
      rl.question(`\n${COLORS.fg.green}Select an option [1-6]: ${COLORS.reset}`, resolve);
    });

    switch (answer.trim()) {
      case '1':
        await showOverview();
        break;
      case '2':
        await showTechStack();
        break;
      case '3':
        await showArchitecture();
        break;
      case '4':
        await showGotchas();
        break;
      case '5':
        await showCommandRunner();
        break;
      case '6':
        console.log(`\n${COLORS.fg.yellow}Thank you for exploring AI Resume Analyzer! Have a great hacking session! 🚀${COLORS.reset}\n`);
        rl.close();
        process.exit(0);
      default:
        console.log(`${COLORS.fg.red}Invalid option. Please enter a number between 1 and 6.${COLORS.reset}`);
        await new Promise(resolve => setTimeout(resolve, 800));
    }
  }
}

// Start the CLI
mainMenu().catch((err) => {
  console.error('An unexpected error occurred:', err);
  rl.close();
  process.exit(1);
});
