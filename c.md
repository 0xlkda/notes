# Checking for Odd and Even Numbers

```c
int x = 3;
if (x&1) {
    printf("is odd");
} else {
    printf("is even")
}
```

# why?

(Considering only 4 bits for simplicity.)

- The logic behind x&1 is that the binary representation of 1 is 0001,
and the place value of the least significant bit is 1.

- All odd numbers can be represented as 2n+1

So the least significant bit is always 1 for odd numbers.
So when compare any odd number with 0001 using the bitwise AND (&), the output bytes will be 0001.

