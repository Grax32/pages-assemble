<html><body><p><b>Edit</b>: Updated with working code samples for JavaScript and C#.  See also string interpolation.<br />
<br />
Let's say you have a bunch of property values and you need a simple template engine.  Here is a fairly simple pattern that you can memorize to make a templating function for almost any language.<br />
<br /></p>
<ol>
<li> Determine your delimiters.  The pattern I am outlining only works with distinct start and end delimiters.  For example, &quot;{{&quot; for start and &quot;}}&quot; for end.  Your template will resemble <br /></li>
</ol>
<pre>"<span style="background-color: #eeeeee;">The quick {% raw %}{{Color}} {{Animal}}{% endraw %} jumped over the lazy dog</span>"</pre>
<p>and that would yield the output of &quot;<span style="background-color: #eeeeee;">The quick brown fox jumped over the lazy dog</span>&quot; for the input of <span style="background-color: #eeeeee;">{Animal: fox, Color: brown}</span>.   Any delimiters will work as long as they are not contained in your template string (adding escaping is an exercise for some other time.  For now, just don't use delimiters that appear in your template text.)<br />
<br />
2.  Split the template on the start delimiter.  Store the resulting array of fragments in a variable.<br />
<br />
3.  Add the first item in the array of fragments to the return value.  This is never part of a property name.<br />
<br />
4.  Loop through the remaining fragments.  Split the fragment on the end delimiter.  The first fragment section is the name of the property to look up, so look up the property that shares a name with the first fragment.  Add the property value to the return value and then add the 2nd fragment section to the return value.<br />
<br />
5.  Return the return value.<br />
<br />
Here is some pseudo-code demonstrating the concepts<br />
<br /></p>
<pre>var returnValue = "";

var templateFragments = template.Split({% raw %}"{{"{% endraw %});

returnValue&nbsp;+= templateFragments[0];

for (var i = 1; i &lt; templateFragments.Length; i++) {
&nbsp; &nbsp; &nbsp;var fragmentSections = templateFragments[i].Split({% raw %}"}}"{% endraw %}, 2);
&nbsp; &nbsp; &nbsp;returnValue&nbsp;+= properties[fragmentSections[0]];
&nbsp; &nbsp; &nbsp;returnValue&nbsp;+= fragmentSections[1];
}

return returnValue;
</pre>
<br />
Note that the for loop starts with index 1 to skip over item 0 that is returned separately.
<br />
The property value lookup could be any lookup that can look up string data based on the a string key.<br />
<br />
<a href="http://jsfiddle.net/rg42apuh/">Working JavaScript Version (JSFiddle)</a><br />
<a href="https://dotnetfiddle.net/KOZdLf">Working C# Version (DotNetFiddle)</a><br />
<br />
My goal was to break down the process to something a developer could remember and use quickly and easily in a pinch. &nbsp;It doesn't do escaping or anything fancy but it is quick and simple.<br />
<br />
Reddit user <a href="http://www.reddit.com/user/gynnihanssen">gynnihanssen</a> posted a link to a regex variant &nbsp;<a href="https://dotnetfiddle.net/WojntT">https://dotnetfiddle.net/WojntT</a>&nbsp;which I think could meet that goal also.<br />
<br />
John Resig has a nice micro-templating function that caches a reusable templating function at <a href="http://ejohn.org/blog/javascript-micro-templating/">http://ejohn.org/blog/javascript-micro-templating/</a>&nbsp; It doesn't necessarily meet my quick, simple, and memorable design goal but it is pretty succint and should offer some nice performance and memory usage gains.<br />
<br />
Phil Haack has a more involved version that looks at escaping and edge cases at<br />
<a href="http://haacked.com/archive/2009/01/04/fun-with-named-formats-string-parsing-and-edge-cases.aspx/">http://haacked.com/archive/2009/01/04/fun-with-named-formats-string-parsing-and-edge-cases.aspx/</a><br />
<br />
Scott Hanselman has a fairly involved ToString function that does string interpolation. &nbsp;<a href="http://www.hanselman.com/blog/ASmarterOrPureEvilToStringWithExtensionMethods.aspx">http://www.hanselman.com/blog/ASmarterOrPureEvilToStringWithExtensionMethods.aspx</a><br />
</body></html>