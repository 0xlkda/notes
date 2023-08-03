/*
try using Parameter Labels in javascript

inspired by Swift:
Swift lets us provide two names for each parameter:
one to be used externally when calling the function,
and one to be used internally inside the function.

This is as simple as writing two names, separated by a space.
func sayHello(to name: String) {}
*/

const hello = name => console.log(name)

function sayHello({ to: name }) {
  hello(name)
}

sayHello({ to: "Mike" })
