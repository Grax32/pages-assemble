<html><body><p>Some of you already know how amazing SubtractJS 1.0 is, but now I have something else to add to it.  With SubtractJS 1.0.1, you can add an additional class &quot;sj-margin-box-model&quot; to make it easy to set up percentage-based sections.</p>
<p>For example, here is a box split into 4 row of 25 percent each, with margins and borders.
<br />
<br />
&lt;style&gt;<br />
.fourRow{<br />
  height: 25%;<br />
  border: 1px solid black;<br />
  margin: 2px;<br />
  padding: 2px;<br />
}<br />
&lt;/style&gt;<br />
<br />
&lt;div style=&quot;background: #CCCCCC; height: 100px; position: relative; width: 200px;&quot;&gt;<br />
 &lt;div class=&quot;sj-fill-top sj-margin-box-model fourRow&quot;&gt;&lt;/div&gt;<br />
 &lt;div class=&quot;sj-fill-top sj-margin-box-model fourRow&quot;&gt;&lt;/div&gt;<br />
 &lt;div class=&quot;sj-fill-top sj-margin-box-model fourRow&quot;&gt;&lt;/div&gt;<br />
 &lt;div class=&quot;sj-fill-top sj-margin-box-model fourRow&quot;&gt;&lt;/div&gt;<br />
&lt;/div&gt;<br />
<br />
<br /></p>
<style>
.fourRow{
  height: 25%;
  border: 1px solid black;
  margin: 2px;
  padding: 2px;
}
.fiveCol{
  width: 20%;
  border: 1px solid black;
  margin: 2px;
  padding: 2px;
}
</style>
<br />
<div style="background: #CCCCCC; height: 100px; position: relative; width: 200px;">
<div class="sj-fill-top sj-margin-box-model fourRow">
</div>
<div class="sj-fill-top sj-margin-box-model fourRow">
</div>
<div class="sj-fill-top sj-margin-box-model fourRow">
</div>
<div class="sj-fill-top sj-margin-box-model fourRow">
</div>
</div>
or here is a box split into 5 columns of 20 percent each, again with margins and borders.
<br />
<br />
&lt;style&gt;<br />
.fiveCol{<br />
&nbsp; width: 20%;<br />
&nbsp; border: 1px solid black;<br />
&nbsp; margin: 2px;<br />
&nbsp; padding: 2px;<br />
}<br />
&lt;/style&gt;<br />
&lt;div style="background: #CCCCCC; height: 100px; position: relative; width: 200px;"&gt;<br />
&nbsp;&lt;div class="sj-fill-left sj-margin-box-model fiveCol"&gt;&lt;/div&gt;<br />
&nbsp;&lt;div class="sj-fill-left sj-margin-box-model fiveCol"&gt;&lt;/div&gt;<br />
&nbsp;&lt;div class="sj-fill-left sj-margin-box-model fiveCol"&gt;&lt;/div&gt;<br />
&nbsp;&lt;div class="sj-fill-left sj-margin-box-model fiveCol"&gt;&lt;/div&gt;<br />
&nbsp;&lt;div class="sj-fill-left sj-margin-box-model fiveCol"&gt;&lt;/div&gt;<br />
&lt;/div&gt;<br />
<br />
<div style="background: #CCCCCC; height: 100px; position: relative; width: 200px;">
<div class="sj-fill-left sj-margin-box-model fiveCol">
</div>
<div class="sj-fill-left sj-margin-box-model fiveCol">
</div>
<div class="sj-fill-left sj-margin-box-model fiveCol">
</div>
<div class="sj-fill-left sj-margin-box-model fiveCol">
</div>
<div class="sj-fill-left sj-margin-box-model fiveCol">
</div>
</div>
<br />
Get the update via NuGet or download it from CodePlex at (Link Unavailable)
</body></html>