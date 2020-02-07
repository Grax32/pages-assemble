/****js
{
    "minify": false,
    "webImport": true
}
****/
import.url('https://code.jquery.com/jquery-3.4.1.slim.min.js');
import.url('https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js');
import.url('https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js');
import.url('https://cdnjs.cloudflare.com/ajax/libs/prism/1.17.1/components/prism-core.min.js');
import.url('https://cdnjs.cloudflare.com/ajax/libs/prism/1.17.1/plugins/autoloader/prism-autoloader.min.js');
var exports = { __esModule: true };
import.url('fitty.module.js');
(function() {
  var authorImage = document.getElementsByClassName('page-header-author-image')[0];
  console.log('authorImage', authorImage);
  if (authorImage) {
    var imgTextId = 'zzz2020';
    var altText = authorImage.getAttribute('alt');
    var div = document.createElement('div');
    div.id = imgTextId;
    div.style.fontWeight = 'bold';
    div.style.color = 'white';
    div.innerHTML = '&nbsp;' + altText + '&nbsp;';
    authorImage.parentElement.appendChild(div);
    console.log('div', div, altText);
    fitty('#' + imgTextId);
  }
})();
