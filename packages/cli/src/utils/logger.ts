export interface Logger {
  info: (message: string) => void;
  verbose: (message: string) => void;
  error: (message: string) => void;
}

export function createLogger(verbose: boolean): Logger {
  return {
    info: (message: string) => console.log(message),
    verbose: verbose
      ? (message: string) => console.log(message)
      : () => {},
    error: (message: string) => console.error(message),
  };
}
