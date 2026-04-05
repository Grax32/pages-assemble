---
layout: pages
permalink: /2014/10/combining-function-expressions-in-c.html
title: Combining Function Expressions in C# using a ReplacementVisitor
tags:
 - coding
 - memorable
 - csharp
systemTags:
 - page:tech
 - page:csharp
category: tech
---
When working with expressions, I often want to combine multiple expressions into one. Using a ReplacementVisitor enables me to do that.

## ReplacementVisitor

ReplacementVisitor is a memorable pattern* for C#. I first saw it somewhere on StackOverflow and I have started to use it extensively.
```csharp
public class ReplaceVisitor : ExpressionVisitor
{
    Expression _left;
    Expression _right;

    public ReplaceVisitor(Expression left, Expression right)
    {
        _left = left;
        _right = right;
    }

    public override Expression Visit(Expression node)
    {
        if (node.Equals(_left))
        {
            return _right;
        }

        return base.Visit(node);
    }
}
```

I usually like to pair this with a function that encapsulates the replacement operation:

```csharp
public Expression Replace(Expression main, Expression current, Expression replacement)
{
    return (new ReplaceVisitor(current, replacement)).Visit(main);
}
```

## Expression Composition

Now there are lots of different ways to combine function expressions but I am going to demonstrate a fairly direct combination pattern.

We will be combining 2 expressions where the output type of the first function expression is the input type of the second function expression. For example, our "f" function expression takes a string and returns a string and our "g" function also takes a string and returns a string. Other variations would work, but as long as the output of the first is the same type as the input to the second, we can composite the functions.

```csharp
Expression<Func<string, string>> f = z => z.Trim();
Expression<Func<string, string>> g = v => v.ToUpper();
```

Goal:

```csharp
Expression<Func<string, string>> fg = z => z.Trim().ToUpper();
```

1. Variable f is of type LambdaExpression which has properties we care about of "Parameters" and "Body".
   - `f.Parameters` is a collection containing expression parameters, so it will have a length of one and a single parameter of type string with a name of `z`
   - `f.Body` is an expression which represents the body of our lambda expression. It will contain an expression of `z.Trim()`

2. In order to composite these 2 expressions, we want to create a new expression that uses the parameter(s) from the first expression (`z` of type string) and a body combining both expressions (`z.Trim().ToUpper()`).

Note: Even if we had named both parameters the same, the parameter from the first expression is different from the parameter in the second expression.

3. Look at the body of the g function, which is `v.ToUpper()`

4. If we replace the parameter `v` with the body of the "f" function, we get an expression that looks like `z.Trim().ToUpper()`. As you can see, that is the body of the goal function.

5. Assign this to a variable of fgBody.

```csharp
var fgBody = Replace(g.Body, g.Parameters[0], f.Body);
```

6. Create the goal function from the new body we created combined with the `z` parameter.

```csharp
var resultExpression = Expression.Lambda<Func<string,string>>(fgBody, f.Parameters[0]);
// and compile it
var func = resultExpression.Compile();
// and test that it returns "ABCD" for an input of "    abcd    "
Assert.AreEqual("ABCD", func("    abcd    "));
```

---

\* When I say memorable pattern, I am referring to a piece of code that is easy enough and short enough to just type in if you need it in your project.
