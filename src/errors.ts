export class EvaluationError extends Error {
  constructor(interpreterId: string, message: string) {
    super(`Interpreter \`${interpreterId}\`: ${message}`)

    this.interpreterId = interpreterId
  }

  interpreterId: string
}

export class SyncModePromiseUnsupportedError extends EvaluationError {
  constructor(interpreterId: string) {
    super(interpreterId, 'Promise is an invalid evaluation result in SYNC mode')
  }
}

export class AsyncModeUnsupportedError extends EvaluationError {
  constructor(interpreterId: string) {
    super(interpreterId, 'ASYNC mode unsupported')
  }
}

export class SyncModeUnsupportedError extends EvaluationError {
  constructor(interpreterId: string) {
    super(interpreterId, 'SYNC mode unsupported')
  }
}
