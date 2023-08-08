Nested radius

```css
.parent {
  --nested-radius: calc(var(--radius) - var(--padding));
}

.nested {
  border-radius: var(--nested-radius);
}
```
