/****js
{
    "minify": true,
    "webImport": true
}
****/
import.url('https://code.jquery.com/jquery-3.4.1.slim.min.js');
import.url('https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js');
import.url('https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js');
import.url('https://cdnjs.cloudflare.com/ajax/libs/prism/1.17.1/components/prism-core.min.js');
import.url('https://cdnjs.cloudflare.com/ajax/libs/prism/1.17.1/plugins/autoloader/prism-autoloader.min.js');

function shareTo(service) {
  const encodedUrl = encodeURIComponent(document.URL);
  function navigate(url) {
    window.top.location.href = url;
  }

  switch (service) {
    case 'facebook':
      navigate('https://www.facebook.com/sharer/sharer.php?u=' + encodedUrl);
      break;
    case 'linkedin':
      navigate('https://www.linkedin.com/sharing/share-offsite/?url=' + encodedUrl);
      break;
    case 'twitter':
      navigate('https://twitter.com/intent/tweet?url=' + encodedUrl);
      break;
    case 'email':
      const subject = document.title;
      const body = `Check out this article: \n${subject}\n${document.URL}\n`;
      const emailLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      navigate(emailLink);
      break;
    default:
      alert('unsupported share target ' + service);
  }
}
