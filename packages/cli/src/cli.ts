import { Builtins, Cli } from "clipanion";
import { RunCommand } from "./commands/index.js";
import { getVersion } from "./utils/version.js";

export function createCli() {
  const cli = new Cli({
    binaryLabel: "stoma",
    binaryName: "stoma",
    binaryVersion: getVersion(),
  });

  cli.register(Builtins.HelpCommand);
  cli.register(Builtins.VersionCommand);
  cli.register(RunCommand);

  return cli;
}

export async function runCli(argv: string[]) {
  const cli = createCli();
  await cli.runExit(argv);
}
