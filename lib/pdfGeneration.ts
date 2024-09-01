export const downloadMarkdownFile = (markdown: string, filename: string) => {
  // Create a new Blob object with the markdown content
  const blob = new Blob([markdown], { type: "text/markdown" });

  // Create a URL for the Blob object
  const url = URL.createObjectURL(blob);

  // Create a temporary anchor element
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;

  // Programmatically click the anchor to trigger the download
  a.click();

  // Clean up the URL after the download
  URL.revokeObjectURL(url);
};
