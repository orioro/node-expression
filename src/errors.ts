export class EvaluationError extends Error {}

export class AsyncModeUnsupportedError extends EvaluationError {
  constructor(interpreterId: string, message?: string) {
    super(
      message
        ? message
        : `Interpreter \`${interpreterId}\` does not support ASYNC mode`
    )

    this.interpreterId = interpreterId
  }

  interpreterId: string
}

export class SyncModeUnsupportedError extends EvaluationError {
  constructor(interpreterId: string, message?: string) {
    super(
      message
        ? message
        : `Interpreter \`${interpreterId}\` does not support SYNC mode`
    )

    this.interpreterId = interpreterId
  }

  interpreterId: string
}
