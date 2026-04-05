---
layout: pages
permalink: /2014/11/use-of-unassigned-local-variable-in-c.html
title: Use of unassigned local variable in C#
tags:
 - coding
 - csharp
systemTags:
 - page:tech
 - page:csharp
category: tech
---
Here is a simple tip that you may not have run across yet.

**TLDR**: Initialize a variable to null to indicate to the compiler that you plan to assign it later.

Suppose you have a situation where you need to create a variable but you will be assigning a value to it within a conditional statement (if, for, foreach, while, etc). In the code that follows the conditional section you then want to reference the variable.

```csharp
string myvar;
if (condition)
{
    myvar = "Information";
}

Console.WriteLine(myvar); // Error: Use of unassigned local variable 'myvar'
```

But this code generates the error "Use of unassigned local variable 'myvar'"

However, if you initialize the variable to null, the compiler sees it as an assigned variable and compiles correctly.

```csharp
string myvar = null;
if (condition)
{
    myvar = "Information";
}

Console.WriteLine(myvar);
```

This code works. Be aware that now you are responsible for assigning a value or you will get a null reference exception. To be on the safer side, I only initialize a variable to null when I have reviewed the following code and I am satisfied that I will not get a null reference exception.
