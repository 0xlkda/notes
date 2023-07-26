var loadJS = function(url, onload, location = document.head) {
  const scriptTag = document.createElement('script')
  scriptTag.src = url
  scriptTag.onload = onload
  scriptTag.onreadystatechange = onload

  location.appendChild(scriptTag)
}

var loadJSFromRawGit = function(author, jsPath, onload) {
  return loadJS(`https://raw.githubusercontent.com/${author}/${jsPath}`, onload)
}
