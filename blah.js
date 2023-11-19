async function unshortenURL(shortURL) {
  try {
    const response = await fetch(shortURL, {
      method: "HEAD",
      redirect: "follow",
    });
    const expandedURL = response.url;
    return expandedURL;
  } catch (error) {
    throw new Error(error);
  }
}

const url = "https://t.co/53tqACKKQX";
const expandedURL = unshortenURL(url)
  .then((expandedURL) => {
    console.log("Expanded URL:", expandedURL);
  })
  .catch((error) => {
    console.error(error.message);
  });
