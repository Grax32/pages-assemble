---
layout: pages
route: /2015/03/trimming-all-strings-submitted-to-aspnet.html
title: Trimming all strings submitted to ASP.NET
tags:
 - coding
 - mvc
category: tech
---
<b>"Usernames cannot end with a space." 
You had the time to code that error message, but not the time to call trim()?</b><br />
&nbsp; &nbsp;&nbsp;<a href="https://twitter.com/shanselman/">@shanselman</a> <a href="https://twitter.com/shanselman/status/575075952767541249">https://twitter.com/shanselman/status/575075952767541249</a><br />
<br />
&nbsp;In my C#/ASP.NET applications, I add the following TrimModelBinder.  This trims every single string that is sent to the server before my controllers even get them.  Before we implemented it, we did a small case study and found no instances of it being necessary to submit leading or trailing spaces.  Since we have had it implemented, we have not once needed to work around it.  Your mileage may vary.

To use, register it in application_start in global.asax or application initialization code that is called from there.
<br />
<br />
<pre><code class="language-csharp">ModelBinders.Binders.Add(typeof(string),new TrimModelBinder());
</code></pre>
<br />
and here is the model binder code.  It implements IModelBinder and trims submitted strings, if they are found.<br />
<br />

<pre><code class="language-csharp">public class TrimModelBinder : IModelBinder
{
    /// &lt;summary&gt;
    /// Binds the model to a value by using the specified controller context and binding context.
    /// &lt;/summary&gt;
    /// &lt;param name=&quot;controllerContext&quot; /&gt;The controller context.
    /// &lt;param name=&quot;bindingContext&quot; /&gt;The binding context.
    /// &lt;returns&gt;The bound value.&lt;/returns&gt;
    public object BindModel(ControllerContext controllerContext,    ModelBindingContext bindingContext)
    {
        var valueResult = bindingContext.ValueProvider.GetValue(bindingContext.ModelName);
        if (valueResult == null || valueResult.AttemptedValue == null)
        {
            return null;
        }

        return (String.IsNullOrWhiteSpace(valueResult.AttemptedValue) ? 
            valueResult.AttemptedValue : 
            valueResult.AttemptedValue.Trim());
    }
}
</code></pre>
