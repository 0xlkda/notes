# [NAND Gate visualization with javascript](https://stackoverflow.com/a/59481040/8743686) 

Since NAND is Not AND you can declare it using AND and Not

```javascript
function nand(a, b) {
  return !(a && b)
}

console.log(nand(false, false)) // true
console.log(nand(true, false)) // true
console.log(nand(false, true)) // true
console.log(nand(true, true)) // false
```

Using multiplication you can declare NAND with 0 and 1.
Since AND is a * b (you get 1 if both are 1), NAND is 1 - a * b:

```javascript
function nand(a, b) {
  return 1 - a * b
}

console.log(nand(0, 0)) // 1
console.log(nand(1, 0)) // 1
console.log(nand(0, 1)) // 1
console.log(nand(1, 1)) // 0
```
