# How language matter?
Languages are powerful tools for thinking.
Different languages encourage different ways of thinking and lead to different thoughts.
Hence, inventing new languages is a powerful way for solving problems.
We can solve a problem by designing a language in which it is easy to express a solution and implementing an interpreter for that language.

# What is an interpreter?
An interpreter is just a program.
As input, it takes a specification of a program in interpreter some language.
As output, it produces the output of the input program.

# How to implementing an interpreter?
To implement an interpreter for a given target language we need to:

1. Implement a parser that takes as input a string representation of a program in the target language and produces a structural parse of the input program.
The parser should break the input string into its language components, and form a parse tree data structure that represents the input text in a structural way

2. Implement an evaluator that takes as input a structural parse of an input program, and evaluates that program.
The evaluator should implement the target language’s evaluation rules.

# How many approach to problem solving
So far, we have seen two main approaches for solving problems:

1. Functional programming
Break a problem into a group of simpler procedures that can be composed to solve the problem.

2. Data-centric programming
Model the data the problem involves, and develop procedures to manipulate that data.

# More on problem solving approach
All computational problems involve both data and procedures.
All procedures act on some form of data; without data they can have no meaningful inputs and outputs.
Any data-focused design must involve some procedures to perform computations using that data.
By packaging procedures and data together, object-oriented programming programming overcomes a weakness of both previous approaches.
The data and the procedures that manipulate it are separate. ( why? )

# More on problem solving approach (2)
How to and when to do the separation might be the answer.
I dont know it yet.
