import { ActionPanel, Action, Icon, List, Clipboard, getSelectedText, showToast, Toast } from "@raycast/api";
import fetch from "node-fetch";
import { useState, useEffect } from "react";

interface RedirectionStep {
  step: string;
  url: string;
}

async function unshortenUrl(url: string): Promise<{ redirectionSteps: RedirectionStep[] }> {
  const redirectionSteps = [{ step: "Original", url: url }];

  try {
    let response = await fetch(url, {
      method: "HEAD",
      redirect: "manual",
    });

    while (response.url) {
      if (response.status === 301 || response.status === 302) {
        const nextUrl = response.headers.get("location");
        if (nextUrl) {
          redirectionSteps.push({ step: "Redirect", url: nextUrl });
          response = await fetch(nextUrl, { method: "HEAD", redirect: "manual" });
        } else {
          break;
        }
      } else {
        break;
      }
    }

    return { redirectionSteps };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
}

function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
}

function UrlRedirectionList() {
  const [redirectionSteps, setRedirectionSteps] = useState<RedirectionStep[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [initialUrl, setInitialUrl] = useState("");

  useEffect(() => {
    const init = async () => {
      const selectedText = await getSelectedText();
      const clipboardText = await Clipboard.readText();
      let urlToFetch = "";

      if (selectedText && isValidUrl(selectedText)) {
        urlToFetch = selectedText;
      } else if (clipboardText && isValidUrl(clipboardText)) {
        urlToFetch = clipboardText;
      }

      if (urlToFetch) {
        setInitialUrl(urlToFetch);
        fetchData(urlToFetch);
      }
    };

    init();
  }, []);

  const fetchData = async (url: string) => {
    setIsLoading(true);
    if (!isValidUrl(url)) {
      setIsLoading(false);
      return;
    }

    try {
      const result = await unshortenUrl(url);
      setRedirectionSteps(result.redirectionSteps);
    } catch (error) {
      if (error instanceof Error) {
        showToast(Toast.Style.Failure, error.message);
      } else {
        showToast(Toast.Style.Failure, "An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onSearchTextChange = async (newText: string) => {
    setInitialUrl(newText);

    if (isValidUrl(newText)) {
      fetchData(newText);
    } else {
      setRedirectionSteps([]); // Clear previous results if the new URL is not valid
    }
  };

  const getFaviconUrl = (url: string) => {
    try {
      const hostname = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${hostname}`;
    } catch (error) {
      return Icon.Globe; // Return the default globe icon if the URL is not valid
    }
  };

  return (
    <List
      isLoading={isLoading}
      searchText={initialUrl} // Use the searchText state for the search field value
      searchBarPlaceholder="Enter or paste a URL here"
      onSearchTextChange={onSearchTextChange}
    >
      {redirectionSteps.length < 1 ? (
        <List.EmptyView title="No URL found in text selection or clipboard" />
      ) : (
        redirectionSteps.map((step, index) => (
          <List.Item
            key={index}
            title={step.step}
            subtitle={step.url}
            icon={{ source: getFaviconUrl(step.url) || Icon.Globe }} // Attempt to use favicon, fallback to globe
            actions={
              <ActionPanel>
                <Action.CopyToClipboard content={step.url} />
                <Action.Paste content={step.url} />
                <Action.OpenInBrowser url={step.url} />
              </ActionPanel>
            }
          />
        ))
      )}
    </List>
  );
}

export default UrlRedirectionList;
