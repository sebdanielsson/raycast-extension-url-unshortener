import { Clipboard, getSelectedText, showHUD } from "@raycast/api";
import { isValidUrl, unshortenUrl } from "./utils";

export default async function Command() {
  const selectedText = await getSelectedText();
  const clipboardText = await Clipboard.readText();
  const url = isValidUrl(selectedText) ? selectedText : clipboardText;

  if (!url) {
    showHUD("No url found in selection or clipboard");
    return;
  }

  try {
    const redirectionSteps = await unshortenUrl(url);
    const finalUrl = redirectionSteps.redirectionSteps[redirectionSteps.redirectionSteps.length - 1].url;
    await Clipboard.copy(finalUrl);
    await Clipboard.paste(finalUrl);
    await showHUD("Unshortened URL copied to clipboard");
  } catch (error) {
    if (error instanceof Error) {
      await showHUD(error.message);
    } else {
      await showHUD("An unknown error occurred");
    }
  }
}
