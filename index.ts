import * as core from "@actions/core";
import * as github from "@actions/github";

async function run() {
  try {
    const token = core.getInput("GITHUB_TOKEN");
    const octokit = github.getOctokit(token);

    const issue = github.context.payload.issue;

    // Fetch all issues by the same author
    const author = issue?.user.login;
    const { data: authorIssues } = await octokit.rest.issues.listForRepo({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      creator: author,
      state: "open",
    });

    console.log({ authorIssues });

    // Close duplicate issues
    for (const authorIssue of authorIssues) {
      if (authorIssue.number !== issue?.number) {
        await octokit.rest.issues.update({
          owner: github.context.repo.owner,
          repo: github.context.repo.repo,
          issue_number: authorIssue.number,
          state: "closed",
        });

        console.log(`Closed issue ${authorIssue.number}`);
      }
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
