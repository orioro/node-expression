# expression

```
npm install @orioro/expression
```

## API

##### `$arrayIncludes(valueExp, arrayExp = $$VALUE)`

Equivalent of `Array.prototype.includes`.

- `valueExp` {AnyValueExpression}
- `arrayExp` {ArrayExpression} Default: `$$VALUE`
- Returns: `includes` {boolean}

##### `$arrayIncludesAll(valuesExp, arrayExp = $$VALUE)`

Similar to `$arrayIncludes`, but receives an array
of values to be searched for and returns whether the
context array contains all of the searched values.

- `valuesExp` {ArrayExpression}
- `arrayExp` {ArrayExpression} Default: `$$VALUE`
- Returns: `includes` {boolean}
