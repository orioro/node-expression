- $type   | Return value for arrays, objects and regexp (move away from typeof) (src/expressions/type.ts)
- array   | Improve ease of use of the sorting comparison expression. (src/expressions/array.ts)
- array   | Merge with $arraySubstitue and $arrayAddAt (src/expressions/array.ts)
- array   | Merge with $arraySubstitute, overloading index parameter: number or [number, number] (src/expressions/array.ts)
- date    | Watch issue: https://github.com/moment/luxon/issues/870 (src/expressions/date.ts)
- logical | Better handle unknown expressions for boolean logical operators
              Uninterpreted expressions are returned as simple arrays, which
              in turn return mistaken true results (src/expressions/logical.ts)
- math    | Modify interface: take in array of numberExpressions to allow for multi comparison (src/expressions/math.ts)
- string  | $stringInterpolate verify if INTERPOLATION_RE is vulnerable to
             RegExp DoS attacks. (src/expressions/string.ts)
- string  | $stringMatch is RegExp dependant, which may open vulnerabilities
             to RegExp DoS attacks. Might want to move away into non-built in. (src/expressions/string.ts)
- string  | $stringReplace is RegExp dependant, which may open vulnerabilities
             to RegExp DoS attacks. Might want to move away into non-built in. (src/expressions/string.ts)
- string  | $stringTest is RegExp dependant, which may open vulnerabilities
             to RegExp DoS attacks. Might want to move away into non-built in. (src/expressions/string.ts)
- string  | Modify interface to allow for concatenating multiple strings at once (src/expressions/string.ts)
