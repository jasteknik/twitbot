//Add url <a> link to text

function urlify(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, (url) => {
      return '<a href="' + url + '">' + url + '</a>';
  })
}

//const text = "Find me at http://www.example.com and also at http://stackoverflow.com";
//const html = urlify(text);

module.exports = {
  urlify: urlify
}