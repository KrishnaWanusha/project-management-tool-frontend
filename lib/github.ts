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

    const allItems = await response.json();

    const issuesOnly = allItems.filter((item: any) => !item.pull_request);
    return issuesOnly;
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

export async function getRepositoryLabels(
  accessToken: string,
  owner: string,
  repo: string
) {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/labels`,
    {
      headers: {
        Authorization: `token ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    }
  );

  if (!res.ok) throw new Error(`Error fetching labels: ${res.status}`);
  return res.json();
}

export async function createRepositoryLabel(
  accessToken: string,
  owner: string,
  repo: string,
  label: { name: string; color: string; description?: string }
) {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/labels`,
    {
      method: "POST",
      headers: {
        Authorization: `token ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(label),
    }
  );

  if (!res.ok) throw new Error(`Error creating label: ${res.status}`);
  return res.json();
}
