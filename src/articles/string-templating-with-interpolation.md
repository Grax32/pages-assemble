---
layout: pages
permalink: /2014/10/string-templating-with-interpolation.html
title: String templating with Interpolation Format Provider
tags:
 - coding
category: tech
---
So I wrote this [other blog post](/2014/10/tiny-template-engine-pattern-that-you.html) about a templating pattern that I like for simplicity and that it is something I can remember. The response to it was somewhere between meh and ick but the resulting discussion gave me some ideas. (I'm still proud of it by the way)

C# and .NET have some interfaces and code surrounding ToString() and string.Format() that I decided to take advantage of.

The goal here is to enable to string.Format to insert either property/field values or dictionary values based on the property names or keys.

The resulting InterpolationFormatProvider is a provider that is passed to the string.Format. The format strings look like `"{0:FirstName}"` to display the FirstName property or `"{0:BirthDate:D}"` to display the BirthDate datetime value using the "D" datetime formatting.
<br />
```csharp
var dates = new Dictionary<string, DateTime>
{
    { "Anniversary", new DateTime(2014,4,4) }
};

var person = new 
{
    FullName = "John Grax", 
    BirthDate = new DateTime(1978, 6, 6), 
    SignificantDates = dates 
};

string.Format(
  new InterpolationFormatProvider { ConvertNullsToEmptyStrings = true }, 
  "I am {0:FullName}. My anniversary is {0:SignificantDates:Anniversary:D}. Current Time {1:D}", person, DateTime.Now);
```

Now, good or bad, I made an assumption that if a type implements IFormattable, that we should use that format instead of using the interpolation formatting.

The plus side of this is that we can create a format like `"{0:SignificantDates:Anniversary:D}"` and the provider will look at the first argument passed to string.format (the "0") and then fetch the "SignificantDates" property.

This happens to be a Dictionary with string keys and DateTime values in this case. In this case, it will look to fetch the Anniversary value from the dictionary. Finally, it sees that the DateTime type implements IFormattable, so it passed the "D" to the DateTime's formatting and returns the expected result.

The downside is that you can't use the InterpolationFormatProvider to get properties by name from a type that implements the IFormattable interface.

Anyhow, I am interested in feedback, comments, recommendations, etc. Let me know what you think.

Add this to your project using the [NuGet](https://www.nuget.org/packages/InterpolationFormatProvider/) command:

```bash
install-package InterpolationFormatProvider
```

Check out the source code at [https://github.com/Grax32/InterpolationFormatProvider/](https://github.com/Grax32/InterpolationFormatProvider/). The unit test is a good place to look for sample usage code.
