<html><body><p>Update 1: I decided to revisit this with a <a href="/2013/06/fast-array-fill-function-revisited.html">a new blog post</a></p>
<p>Update 2: A reader (<a href="https://plus.google.com/113579231183226302374">+Michael Hsu</a>) posted an improved version on <a href="https://github.com/mykohsu/Extensions/blob/master/ArrayExtensions.cs">GitHub</a> and I blogged about it <a href="/2014/04/better-array-fill-function.html">here</a></p>
<p>In the course of my other work this week, I discovered a method for quickly initializing an array to a single value or to a repeating value.</p>
<p>The theory is based on the idea that Array.Copy is very fast. Understanding that, I copy the value into the array at position zero. Now I keep copying that value into the array, doubling the size of my copy each time.</p>
<p>For example, if my array contained ten elements and my value contains one element (a '7'), the operations will look like this.</p>
<ul>
<li>Empty Array: 0,0,0,0,0,0,0,0,0,0</li>
<li>First Pass: 7,0,0,0,0,0,0,0,0,0</li>
<li>Second Pass: 7,7,0,0,0,0,0,0,0,0</li>
<li>Third Pass: 7,7,7,7,0,0,0,0,0,0</li>
<li>Fourth Pass: 7,7,7,7,7,7,7,7,0,0</li>
<li>Fifth Pass: 7,7,7,7,7,7,7,7,7,7</li>
</ul>
<p>If you were to iterate through and set each value to '7' directly, you would have to perform ten operations. Here we only performed five operations. The time taken is fairly similar at this level but this method is much faster for large arrays.</p>
<p>To test this I wrote two functions. ArrayFillIterative, which sets each element to a value directly and ArrayFill, which uses Array.Copy to quickly fill all elements. Both do the same thing in that they fill the output array with the input array over and over.</p>
<h2>The (fast) Array.Copy Way</h2>
<pre><code class="cs">public static void ArrayFill&lt;T&gt;(T[] arrayToFill, T fillValue)
{
    // if called with a single value, wrap the value in an array and call the main function
    ArrayFill&lt;T&gt;(arrayToFill, new T[] { fillValue });
}

public static void ArrayFill&lt;T&gt;(T[] arrayToFill, T[] fillValue)
{
    if (fillValue.Length &gt;= arrayToFill.Length)
    {
        throw new ArgumentException(&quot;fillValue array length must be smaller than length of arrayToFill&quot;);
    }

    // set the initial array value
    Array.Copy(fillValue, arrayToFill, fillValue.Length);

    int arrayToFillHalfLength = arrayToFill.Length / 2;

    for (int i = fillValue.Length; i &lt; arrayToFill.Length; i *= 2)
    {
        int copyLength = i;
        if (i &gt; arrayToFillHalfLength)
        {
            copyLength = arrayToFill.Length - i;
        }

        Array.Copy(arrayToFill, 0, arrayToFill, i, copyLength);
    }
}
</code></pre>
<p><b>The (slow) Iterative Way</b></p>
<pre><code class="cs">public static void ArrayFillIterative&lt;T&gt;(T[] arrayToFill, T[] fillValue)
        {
            int counter = 0;
            int arrayLengthUsed = arrayToFill.Length - fillValue.Length;

            for (int i = 0; i &lt; arrayLengthUsed; i += fillValue.Length)
            {
                for (int x = 0; x &lt;; fillValue.Length; x++)
                {
                    counter = i + x;
                    arrayToFill[counter] = fillValue[x];
                }
            }

            // fill remaining elements&lt;/span&gt;
            for (int i = counter + 1, x = 0; i &lt; arrayToFill.Length; i++, x++)
            {
                arrayToFill[i] = fillValue[x];
            }
        }
</code></pre>
<h2>The Test Results</h2>
<p>I worked with a byte array that I sized to hold 357,913,941 elements. The number is fairly random. I needed a large number that would not cause an out of memory exception when the array is instantiated.</p>
<p>I ran the following code to compare the results of filling the array each way.</p>
<pre><code class="cs">Stopwatch watch = new Stopwatch();
byte[] myArray1 = new byte[myArrayLength];
byte[] myArray2 = new byte[myArrayLength];

watch.Restart();
ArrayFillIterative(myArray1, fillValue);
watch.Stop();

Debug.Print(&quot;Took {0} ticks or {1} milliseconds to iteratively fill an array of type {2} sized at {3}&quot;, 
    watch.ElapsedTicks, watch.ElapsedMilliseconds,&quot;byte&quot;, myArray1.Length);

watch.Restart();
ArrayFill(myArray2, fillValue);
watch.Stop();

Debug.Print(&quot;Took {0} ticks or {1} milliseconds to fill ArrayFill an array of type {2} sized at {3}&quot;, 
    watch.ElapsedTicks, watch.ElapsedMilliseconds, &quot;byte&quot;, myArray2.Length);
</code></pre>
<p>On my machine, the iterative fill took about 2800 milliseconds to fill the byte array with a repeating 4 byte pattern.</p>
<p>In contrast, the array copy method took around 280 milliseconds. That is a one-tenth the time of the original function! It should also be very memory efficient since it uses itself as the source for the copy operation.</p>
</body></html>