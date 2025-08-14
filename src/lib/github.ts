import { Octokit } from "octokit";
import { db } from "~/server/db";

console.log("Hello, world!");

export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const DUMMY_GITHUB_URL = "https://github.com/docker/genai-stack";
const DOCKER_GENAI_PROJECT_ID = "cmebiitgh0000q7l32akb8ub4";

type CommitResponse = {
  hash: string;
  message: string;
  authorName: string;
  authorAvatarUrl: string;
  date: string;
};

export async function getcommitHashes(
  githubUrl: string,
): Promise<CommitResponse[]> {
  //   const [owner, repo] = githubUrl.split("/").slice(-2);

  //   const response = await octokit.request(`GET /repos/${owner}/${repo}/commits`);
  const { data } = await octokit.rest.repos.listCommits({
    owner: "docker",
    repo: "genai-stack",
  });

  const sortedCommits = data.sort((a, b) => {
    const dateA = a.commit.author?.date;
    const dateB = b.commit.author?.date;

    // If both have no date, they're equal
    if (!dateA && !dateB) return 0;

    // If A has no date but B does, B should come first
    if (!dateA && dateB) return 1;

    // If A has a date but B doesn't, A should come first
    if (dateA && !dateB) return -1;

    // Both have dates, sort by newest first
    return new Date(dateB!).getTime() - new Date(dateA!).getTime();
  });

  return sortedCommits.slice(0, 10).map((commit) => ({
    hash: commit.sha,
    message: commit.commit.message,
    authorName: commit.author?.name ?? "",
    authorAvatarUrl: commit.author?.avatar_url ?? "",
    date: commit.commit.author?.date ?? "",
  }));

  const date = data[0]?.commit.author?.date;

  console.log(data);
}

await getcommitHashes(DUMMY_GITHUB_URL);

export async function pollCommits(projectId: string): Promise<void> {
  const { project } = await fetchProjectGithubUrl(projectId);
  const commitHashes = await getcommitHashes(
    project?.githubUrl ?? DUMMY_GITHUB_URL,
  );
  const unprocessedCommits = await filterUnrocessedCommits(
    projectId,
    commitHashes,
  );

  console.log(unprocessedCommits);
}

async function fetchProjectGithubUrl(projectId: string) {
  // TODO: Maybe add findUniqueOrThrow heres
  const project = await db.project.findUnique({
    where: {
      id: projectId,
    },
    select: {
      githubUrl: true,
    },
  });

  return { project };
}

async function filterUnrocessedCommits(
  projectId: string,
  commitHashes: CommitResponse[],
) {
  const processedCommits = await db.commit.findMany({
    where: {
      projectId: projectId,
    },
  });

  // TODO: Create better data structure for de-duping/finding-uniques in array
  const unprocessedCommits = commitHashes.filter(
    (commit) =>
      !processedCommits.some((localCommit) => localCommit.hash === commit.hash),
  );

  return unprocessedCommits;
}

await pollCommits(DOCKER_GENAI_PROJECT_ID).then(console.log);
