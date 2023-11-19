import { ActionPanel, Action, Icon, List, Clipboard, getSelectedText, showHUD, showToast, Toast } from "@raycast/api";
import fetch from "node-fetch";

function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
}

async function unshortenUrl(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
    });
    const expandedURL = response.url;
    return expandedURL;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
}

export default async function Command() {
  const selectedText = await getSelectedText();
  const clipboardText = await Clipboard.readText();
  const url = isValidUrl(selectedText) ? selectedText : clipboardText;

  if (!url) {
    showToast(Toast.Style.Failure, "No text found in selection or clipboard");
    showHUD("No text found in selection or clipboard");
    return;
  }

  try {
    const unshortenedUrl = await unshortenUrl(url);
    await Clipboard.copy(unshortenedUrl);
    await showToast(Toast.Style.Success, "Unshortened URL copied to clipboard");
    await showHUD("Unshortened URL copied to clipboard");
  } catch (error) {
    if (error instanceof Error) {
      await showToast(Toast.Style.Failure, error.message);
      await showHUD(error.message);
    } else {
      await showToast(Toast.Style.Failure, "An unknown error occurred");
      await showHUD("An unknown error occurred");
    }
  }
}
