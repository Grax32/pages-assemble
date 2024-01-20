/****
 webImport: true,
 minify: true
****/

import.url('prism.js');

function shareTo(service, itemDescription) {
  const encodedUrl = encodeURIComponent(document.URL);
  const description = itemDescription || 'article';

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
    case 'email':
      const subject = document.title;
      const body = `Check out this ${description}: \n${subject}\n${document.URL}\n`;
      const emailLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      navigate(emailLink);
      break;
    default:
      alert('unsupported share target ' + service);
  }
}

function initializeImageResizer(containerQuerySelector) {
  // resize image to be contained within container element
  // assumes container is position:relative and image is a image element which is a child of the container
  const container = document.querySelector(containerQuerySelector);
  if (!container) {
    console.error('Could not find element using querySelector ' + containerQuerySelector);
    return;
  }

  const initialContainerStyle = getComputedStyle(container);
  if (initialContainerStyle.position !== 'relative' && initialContainerStyle.position !== 'absolute') {
    throw new Error('Container position must be relative or absolute');
  }

  const mainImage = container.getElementsByTagName('img')[0];

  if (!mainImage) {
    console.error('Could not find image element in ' + containerQuerySelector);
    return;
  }

  mainImage.style.position = 'absolute';

  function resizeImage(noRecurse) {
    const naturalHeight = mainImage.naturalHeight, naturalWidth = mainImage.naturalWidth;
    const innerHeight = window.innerHeight, innerWidth = window.innerWidth;

    const bodyAspect = innerWidth / innerHeight;
    const imageAspect = naturalWidth / naturalHeight;

    /*
     square = 1.0
     wide = 2.0
     skinny = .5
    */

    if (bodyAspect > imageAspect * 2){
      document.body.classList.add(('image-skinny'));
    } else {
      document.body.classList.remove(('image-skinny'));
    }

    const containerStyle = getComputedStyle(container);

    const containerPaddingTop = parseInt(containerStyle.paddingTop);
    const containerPaddingLeft = parseInt(containerStyle.paddingLeft);

    const containerHeight = container.clientHeight - containerPaddingTop - parseInt(containerStyle.paddingBottom);
    const containerWidth = container.clientWidth - containerPaddingLeft - parseInt(containerStyle.paddingRight);

    const newValues = {
      top: 'unset',
      left: 'unset',
      width: 'unset',
      height: 'unset',
    };

    const testNewWidth = (containerHeight / naturalHeight) * naturalWidth;
    if (testNewWidth > containerWidth) {
      const newHeight = (containerWidth / naturalWidth) * naturalHeight;
      const topValue = (containerHeight - newHeight) / 2;

      newValues.top = containerPaddingTop + topValue + 'px';
      newValues.left = containerPaddingLeft + 'px';

      newValues.width = containerWidth + 'px';
      newValues.height = newHeight + 'px';
    } else {
      const leftValue = (containerWidth - testNewWidth) / 2;
      newValues.top = containerPaddingTop + 'px';
      newValues.left = containerPaddingLeft + leftValue + 'px';

      newValues.width = testNewWidth + 'px';
      newValues.height = containerHeight + 'px';
    }

    mainImage.style.top = newValues.top;
    mainImage.style.left = newValues.left;
    mainImage.style.width = newValues.width;
    mainImage.style.height = newValues.height;
  }

  window.addEventListener('resize', resizeImage);

  mainImage.addEventListener('error', _ => container.classList.add('image-load-failed'));

  function completeImageLoad() {
    resizeImage();
    resizeImage();
    mainImage.style.opacity = '1';
    container.classList.add('image-is-loaded');
  }

  if (mainImage.complete && mainImage.naturalHeight !== 0) {
    completeImageLoad();
  } else {
    mainImage.addEventListener('load', completeImageLoad);
  }

  setInterval(resizeImage, 500);
}

