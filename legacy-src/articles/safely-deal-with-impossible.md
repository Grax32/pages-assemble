---
layout: pages
permalink: /articles/future-proof-your-switch-statements/
alternatepermalink: /2014/09/safely-deal-with-impossible.html
title: Future Proof Your Switch Statements
tags:
 - coding
systemTags:
 - page:tech
 - page:csharp
category: tech
---
I wanted to point out this little hidden coding gem from Ted Neward's column in the <a href="https://msdn.microsoft.com/en-us/magazine/dn781363.aspx">September 2014 issue of MSDN Magazine</a>.<br />

<br />

```csharp
if (locAmt == remAmt)
{
    ...
}
else if (locAmt < remAmt)
{
    ...
}
else if (locAmt > remAmt)
{
    ...
}
else
    throw new Exception("How is this possible?");
```

Why does he throw an exception when it is clearly impossible to reach that line of code? &nbsp;If you check for equal to, less than, and greater than, it is impossible for a value to sneak through.<br />
<br />
The answer that is that this little bit of code can make find a future error incredibly easier compared to the alternative. &nbsp;It is true that the line of code will never be reached, so it doesn't currently effect our code except to provide a negligible increase in the size. &nbsp;The payback comes when you got to refactor this section of code and leave one of the pathways open.<br />
<br />
Say you commented out the greater than branch or accidentally replaced the greater-than symbol with a less-than symbol, the resulting exception would be right next to the mistake you made and would be very easy to spot and fix.<br />
<br />
I like to do the same thing in switch statements when applicable.

```csharp
public enum Timeline
{
    None,
    Current,
    RecentHistory,
    AncientHistory
}

public DateTime GetTimelineEnd(Timeline timeline)
{
    switch (timeline)
    {
        case Timeline.None:
            throw new Exception("None is not a usable value");
        case Timeline.Current:
            return DateTime.Now;
        case Timeline.RecentHistory:
            return DateTime.Now.AddYears(-10);
        case Timeline.AncientHistory:
            return DateTime.Now.AddYears(-100);
        default:
            throw new Exception("Unexpected timeline value");
    }
}
```

If the goal of the switch statement is to handle all possibilities, I like to throw an exception in the "default" branch.
<br />
Someone could add a new value to the Timeline enum or the function could be called with a value that is not part of the enum. "GetTimelineEnd((Timeline)65536)" is valid code, even though 65536 is not a valid Timeline enum entry.<br />
<br />
If that happens, the default branch throwing an exception will bring our attention quickly to the right issue and prevent other parts of our code from possibly having to deal with undefined or unexpected data.<br />
<br />
<br />
<br />
