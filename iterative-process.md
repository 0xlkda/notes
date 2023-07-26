# Fibonacci

```javascript
function fib(n) {
    function fib_iter(a, b, count) {
        return count === 0
            ? b
            : fib_iter(a + b, a, count - 1);
    }

    return fib_iter(1, 0, n);
}

fib(6);
```

# Factorial

```javascript
function factorial(n) {
    function iter(product, counter) {
        return counter > n 
               ? product
               : iter(counter * product,
                      counter + 1);
    }
    return iter(1, 1);
}

factorial(5);
```

# Exponential

```javascript
function expt(b, n) {
    function expt_iter(b, counter, product) {
        return counter === 0
               ? product
               : expt_iter(b, counter - 1, b * product);
    }

    return expt_iter(b, n, 1);
}

expt(3, 4);
```
