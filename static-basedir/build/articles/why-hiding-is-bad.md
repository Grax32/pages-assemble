<html><body><p>Most of us have seen an error like the following:</p>
<pre><code> 'DerivedClass.MyMethod()' hides inherited member 'BaseClass.MyMethod()'. Use the new keyword if hiding was intended.
</code></pre>
<p>but many times we ignore it.  But what does it really mean?</p>
<p>Working from the code sample below</p>
<iframe width="100%" height="475" src="https://dotnetfiddle.net/Widget/7S6IFf" frameborder="0"></iframe>
<p>If you follow the recommended methods of using virtual and override when you have methods of the same name on the base and the derived class, you find that no matter what the type you get the same output.</p>
<p>If, however, you create a method on the derived class that shares the same name as the method on the base class, without the proper modifiers, you find that you create a situation where calling the method named &quot;GimmeFive&quot; when the object is cast to BaseClass returns one thing and calling the same method when the object is of type DerivedClass, returns a different value.</p>
<p>So, why is that bad?  Obviously, it isn't if that's what you want, but this is the kind of thing that can lead to mysterious bugs.</p>
<p>A better practice is to create a virtual method on the base class and an override method in the derived class.  It is also recommended to call the base method somewhere in the derived one, so that whatever functionality is in the base class will not be lost when overriding.</p>
</body></html>