async function main() {
  const apiKey = (process.env.POSTMAN_API_KEY || "").trim();
  const apiBase = (process.env.POSTMAN_API_BASE || "https://api.getpostman.com").trim();
  const mockId = (process.env.POSTMAN_MOCK_ID || "").trim();

  if (!apiKey || !mockId) {
    console.log("Skipping mock cleanup: missing POSTMAN_API_KEY or POSTMAN_MOCK_ID.");
    return;
  }

  const response = await fetch(`${apiBase}/mocks/${encodeURIComponent(mockId)}`, {
    method: "DELETE",
    headers: {
      "X-Api-Key": apiKey,
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Failed to delete mock ${mockId}: ${response.status}\n${body}`);
  }

  console.log(`Deleted Postman mock ${mockId}`);
}

main().catch((error) => {
  console.error(error?.stack || error);
  process.exit(1);
});
