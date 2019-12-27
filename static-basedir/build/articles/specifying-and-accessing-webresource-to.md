<html><body><p>Adam Miller had a great <a href="http://blog.milrr.com/2011/12/aspnet-load-image-from-embedded.html#comment-form">post</a> on this blog about returning an embedded resource in an aspx page.  Since I have some experience with embedded resources, I wanted to share instructions to access embedded resources using the WebResource attribute.</p>
<p>If you specify the embedded resource as an web resource, you can access it using a special url.</p>
<p>In your AssemblyInfo.cs, add a using statement for System.Web.UI and a WebResource attribute for each embedded resource you need to access.</p>
<p>Substitute the embedded resource path that is returned from GetManifestResourceNames() for &quot;Your.Resource.Path.gif&quot; and substitute a type from the assembly containing the embedded resource for &quot;ATypeInYourAssembly&quot;</p>
<pre><code>using System.Web.UI;
[assembly: WebResource(&quot;Your.Resource.Path.gif&quot;, &quot;image/gif&quot;)]
</code></pre>
<p>Then use the link returned from Page.ClientScript.GetWebResourceUrl(typeof(ATypeInYourAssembly), &quot;Your.Resource.Path.gif&quot;)
to reference the resource.</p>
</body></html>