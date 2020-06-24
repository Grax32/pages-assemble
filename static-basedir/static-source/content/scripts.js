/****js
{
    "minify": true,
    "webImport": true
}
****/
import.url('prism.js');

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
