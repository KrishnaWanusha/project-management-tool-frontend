export async function analyzeRepository(
  accessToken: string,
  owner: string,
  repo: string
) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SKILL_API}/analyze_single_repo?access_token=${accessToken}&repo_name=${owner}/${repo}`,
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
