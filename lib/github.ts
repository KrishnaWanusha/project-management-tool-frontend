export async function getUserRepositories(accessToken: string) {
  try {
    const response = await fetch("https://api.github.com/user/repos", {
      headers: {
        Authorization: `token ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const repositories = await response.json();
    return repositories;
  } catch (error) {
    console.error("Failed to fetch repositories:", error);
    return [];
  }
}

export async function getRepositoryIssues(
  accessToken: string,
  owner: string,
  repo: string
) {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/issues?state=all`,
      {
        headers: {
          Authorization: `token ${accessToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const repositories = await response.json();
    return repositories;
  } catch (error) {
    console.error("Failed to fetch Issues:", error);
    return [];
  }
}

export async function getUserProfile(accessToken: string) {
  try {
    const response = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `token ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    return null;
  }
}
