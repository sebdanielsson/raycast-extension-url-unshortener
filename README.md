# URL Unshortener

Unshorten or expand those pesky shortened links in your clipboard or text selection, enhancing your privacy and security.

## Features

- URL Validation: URL Unshortener checks whether your selected or clipboard text is a valid URL, ensuring reliability and effectiveness. If both are valid, the selected text takes precedence.
- Flexibility: Run the extension through the command menu or by using a keyboard shortcut of your choice.
- Clipboard Integration: The expanded URL is immediately copied to your clipboard, streamlining your workflow.

## Usage

1. Select a shortened URL or copy it to your clipboard.
2. Run the extension through the command menu or by using a keyboard shortcut of your choice.
3. The expanded URL is copied to your clipboard.

## Limitations

URL Unshortener only works with HTTP redirects, meaning that it cannot expand shortened URLs that use other methods, such as JavaScript. I created a version that used Puppeteer to handle these cases, but it was too slow to be practical. I may revisit this in the future if I can find a way to speed up the process or use a third-party API. If you have any ideas, please let me know!

## License

MIT
