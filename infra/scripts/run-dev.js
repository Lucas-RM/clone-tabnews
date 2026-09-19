const { spawn } = require("node:child_process");

function runDev() {
  const nextProcess = spawn(
    "npm run services:up && npm run services:wait:database && npm run migrations:up && next dev",
    { stdio: "inherit", shell: true },
  );

  process.on("SIGINT", () => {
    nextProcess.kill();

    const stopProcess = spawn("npm run postdev", {
      stdio: "inherit",
      shell: true,
    });

    stopProcess.on("error", (error) => {
      console.error("Failed to stop services:", error.message);
      process.exitCode = 1;
    });
  });
}

runDev();
