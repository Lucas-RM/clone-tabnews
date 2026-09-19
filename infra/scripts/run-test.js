const { spawn, spawnSync } = require("node:child_process");

function run(command) {
  const result = spawnSync(command, {
    stdio: "inherit",
    shell: true,
  });

  return result.status ?? 1;
}

function runTests() {
  const testProcess = spawn(
    'npx concurrently -n next,jest --hide next -k -s command-jest "next dev" "jest --runInBand --verbose"',
    {
      stdio: "inherit",
      shell: true,
    },
  );

  let cleanupDone = false;

  function cleanup(exitCode) {
    if (cleanupDone) {
      return;
    }

    cleanupDone = true;

    run("npm run services:stop");

    process.exitCode = exitCode;
  }

  process.on("SIGINT", () => {
    testProcess.kill("SIGINT");

    cleanup(130);
  });

  testProcess.on("exit", (code, signal) => {
    let testExitCode = code ?? 1;

    if (signal === "SIGINT") {
      testExitCode = 130;
    }

    cleanup(testExitCode);
  });
}

function main() {
  const servicesExitCode = run("npm run services:up");

  if (servicesExitCode !== 0) {
    process.exitCode = servicesExitCode;
    return;
  }

  runTests();
}

main();
