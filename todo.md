- logical | Better handle unknown expressions for boolean logical operators
              Uninterpreted expressions are returned as simple arrays, which
              in turn return mistaken true results (src/expressions/logical.ts)
- string  | $stringMatch is RegExp dependant, which may open vulnerabilities
             to RegExp DoS attacks. Might want to move away into non-built in. (src/expressions/string.ts)
- string  | $stringReplace is RegExp dependant, which may open vulnerabilities
             to RegExp DoS attacks. Might want to move away into non-built in. (src/expressions/string.ts)
- string  | $stringTest is RegExp dependant, which may open vulnerabilities
             to RegExp DoS attacks. Might want to move away into non-built in. (src/expressions/string.ts)
