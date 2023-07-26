var loadJS = function(url, onload, location = document.head) {
  const scriptTag = document.createElement('script')
  scriptTag.src = url
  scriptTag.onload = onload
  scriptTag.onreadystatechange = onload

  location.appendChild(scriptTag)
}
