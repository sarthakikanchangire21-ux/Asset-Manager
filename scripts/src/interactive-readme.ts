import * as readline from 'readline';
import { exec } from 'child_process';

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
  console.log('██████╗ ███████╗███████╗██╗   ██╗███╗   ███╗███████╗     █████╗ ██╗');
  console.log('██╔══██╗██╔════╝██╔════╝██║   ██║████╗ ./███║██╔════╝    ██╔══██╗██║');
  console.log('██████╔╝█████╗  ███████╗██║   ██║██╔████╔██║█████╗      ███████║██║');
  console.log('██╔══██╗██╔══╝  ╚════██║██║   ██║██║╚██╔╝██║██╔══╝      ██╔══██║██║');
  console.log('██║  ██║███████╗███████║╚██████╔╝██║ ╚═╝ ██║███████╗    ██║  ██║██║');
  console.log('╚═╝  ╚═╝╚══════╝╚══════╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝    ╚═╝  ╚═╝╚═╝');
  console.log(`${COLORS.reset}`);
  console.log(`${COLORS.fg.yellow}=== AI Resume Analyzer — Explorer & Control Center ===${COLORS.reset}\n`);
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
  console.log(`${COLORS.bright}AI Resume Analyzer (ResumeAI)${COLORS.reset} is an intelligent resume optimizer and career preparation suite.`);
  console.log('It empowers job seekers to upload resumes, get comprehensive ATS compatibility scores, pinpoint skill gaps, match jobs dynamically, and leverage AI to re-write weak sections.\n');
  console.log(`${COLORS.fg.magenta}${COLORS.bright}Core Value Propositions:${COLORS.reset}`);
  console.log(` - ${COLORS.bright}ATS & Resume Score Analysis:${COLORS.reset} Evaluates resume formatting, vocabulary, formatting, and structural quality against common applicant tracking systems.`);
  console.log(` - ${COLORS.bright}Dynamic Job Matching & Skill Gap Analysis:${COLORS.reset} Paste a target job description to verify keyword compliance and receive recommended steps to close skill gaps.`);
  console.log(` - ${COLORS.bright}AI Resume Rewrite Assistant:${COLORS.reset} Revamps summary points and weak descriptions with active verbs, impact metrics, and highly tailored phrasing.`);
  console.log(` - ${COLORS.bright}Comprehensive Career Dashboard:${COLORS.reset} Multi-page interface tracking analysis history, matching statistics, and document revisions.\n`);
  await waitForKey();
}

async function showTechStack() {
  clearScreen();
  console.log(`${COLORS.fg.cyan}${COLORS.bright}=== Technical Stack Overview ===${COLORS.reset}\n`);
  console.log(`${COLORS.fg.yellow}${COLORS.bright}Web Client Layout (mockup-sandbox):${COLORS.reset}`);
  console.log(' - Modern responsive single-page layouts (built with HTML5, Tailwind-styled variables, and CSS components)');
  console.log(' - Structured dynamic interaction scripts in vanilla JS (`js/app.js`, `js/navigation.js`, `js/animation.js`, `js/storage.js`)');
  console.log(' - Responsive layouts using grid layouts, transition presets, and beautiful dark/light themes\n');

  console.log(`${COLORS.fg.yellow}${COLORS.bright}Mobile Client Architecture (artifacts/mobile):${COLORS.reset}`);
  console.log(' - Built using Expo, React Native, and TypeScript 5.9');
  console.log(' - Native Navigation (Expo Router) for clean tab navigation between Home, Transactions, Budgets, AI, and Profile');
  console.log(' - Reusable customized components: BudgetCard, StatCard, DonutChart, CategoryIcon, and TransactionItem\n');

  console.log(`${COLORS.fg.yellow}${COLORS.bright}Backend & API Services:${COLORS.reset}`);
  console.log(' - API backend written with Express 5 (TypeScript) for routing, logging middleware, and controller handling');
  console.log(' - PostgreSQL for secure data tracking, utilizing Drizzle ORM for type-safe query management and database push operations');
  console.log(' - API contract specification managed globally using OpenAPI YAML and schema binding validation via Zod libraries\n');

  console.log(`${COLORS.fg.yellow}${COLORS.bright}AI Integrations & Services:${COLORS.reset}`);
  console.log(' - High-performance models (such as GPT-3.5 and GPT-4) integrated via OpenAI SDK');
  console.log(' - Intelligent matching algorithms, automated classification, and semantic analytics models');
  await waitForKey();
}

async function showArchitecture() {
  clearScreen();
  console.log(`${COLORS.fg.cyan}${COLORS.bright}=== Architecture Decisions & Repository Map ===${COLORS.reset}\n`);
  console.log(`${COLORS.fg.yellow}${COLORS.bright}Monorepo Workspaces Layout:${COLORS.reset}`);
  console.log(` - ${COLORS.bright}lib/api-spec:${COLORS.reset} Global OpenAPI specifications (\`openapi.yaml\`) and configuration setups`);
  console.log(` - ${COLORS.bright}lib/api-zod:${COLORS.reset} Auto-generated TypeScript Zod schemas mapping directly from openapi spec`);
  console.log(` - ${COLORS.bright}lib/api-client-react:${COLORS.reset} Unified react fetch hooks generated natively from the specification`);
  console.log(` - ${COLORS.bright}lib/db:${COLORS.reset} Core database connection schemas, tables, and migrations using Drizzle ORM`);
  console.log(` - ${COLORS.bright}artifacts/api-server:${COLORS.reset} Backend High-Performance Express 5 API Application`);
  console.log(` - ${COLORS.bright}artifacts/mobile:${COLORS.reset} Interactive Expo & React Native mobile client workspace`);
  console.log(` - ${COLORS.bright}artifacts/mockup-sandbox:${COLORS.reset} Browser-based sandboxed interface offering swift component previews\n`);

  console.log(`${COLORS.fg.yellow}${COLORS.bright}Design Philosophy:${COLORS.reset}`);
  console.log(' 1. Specify contracts upfront using OpenAPI definitions.');
  console.log(' 2. Auto-generate schemas and network binders to avoid drift across micro-packages.');
  console.log(' 3. Focus on offline-ready patterns with modular presentation structures.');
  await waitForKey();
}

async function showGotchas() {
  clearScreen();
  console.log(`${COLORS.fg.cyan}${COLORS.bright}=== Repository Gotchas & Developer Notes ===${COLORS.reset}\n`);
  console.log(` 1. ${COLORS.bright}Generated Artifacts:${COLORS.reset} Do not modify any \`generated\` folders manually. Always run codegen triggers from \`lib/api-spec\` to update API properties safely.`);
  console.log(` 2. ${COLORS.bright}Database Schemas:${COLORS.reset} After updating ORM definitions under \`lib/db\`, use \`pnpm --filter @workspace/db run push\` to sync the structures directly to PostgreSQL.`);
  console.log(` 3. ${COLORS.bright}Package Management:${COLORS.reset} This monorepo enforces \`pnpm\` usage strictly. Avoid running standard npm/yarn installs, as they are blocked by checks.`);
  console.log(` 4. ${COLORS.bright}Configuring Credentials:${COLORS.reset} Verify that \`DATABASE_URL\` is declared correctly in your environmental scope. For full AI functions, specify your \`OPENAI_API_KEY\`.`);
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
        console.log(`\n${COLORS.fg.yellow}Thank you for exploring AI Resume Analyzer! Have an amazing hacking session! 🚀${COLORS.reset}\n`);
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
