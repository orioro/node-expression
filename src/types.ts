export type Expression = any[]

export type EvaluationContext = {
  interpreters: {
    [key: string]: (context:EvaluationContext, ...args:any[]) => any,
  },
  data: {
    $$VALUE: any,
    $$ARRAY?: any[],
    $$INDEX?: number,
    $$ACC?: any
  }
}

export type NumberExpression = Expression | number
export type ArrayExpression = Expression | any[]
export type StringExpression = Expression | string
export type PlainObjectExpression = Expression | { [key:string]: any }
export type BooleanExpression = Expression | boolean
