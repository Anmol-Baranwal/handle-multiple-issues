import * as core from "@actions/core";
import * as github from "@actions/github";

async function run() {
  try {
    const token = core.getInput("GITHUB_TOKEN");
    const octokit = github.getOctokit(token);
    const context = github.context;

    // Retrieve custom inputs
    const label = core.getInput("label") || "up for grabs"; // Set default label
    const issueNumber = core.getInput("issueNumber") === "true";
    const comment = core.getInput("comment");
    const close = core.getInput("close") === "true";

    // Check if the same author has open issues
    const author = context.payload.issue.user.login;

    const { data: authorIssues } = await octokit.rest.issues.listForRepo({
      owner: context.repo.owner,
      repo: context.repo.repo,
      creator: author,
      state: "open",
    });

    if (authorIssues.length === 0) {
      core.notice("No existing open issues for this author.");
      return; // No need to continue.
    }

    for (const authorIssue of authorIssues) {
      const issueNumberToLabel = authorIssue.number;

      // Check if label is an array and add multiple labels if needed
      if (Array.isArray(label)) {
        for (const lbl of label) {
          await octokit.rest.issues.addLabels({
            owner: context.repo.owner,
            repo: context.repo.repo,
            issue_number: issueNumberToLabel,
            labels: [lbl],
          });
        }
      } else {
        // Add a single label
        await octokit.rest.issues.addLabels({
          owner: context.repo.owner,
          repo: context.repo.repo,
          issue_number: issueNumberToLabel,
          labels: [label],
        });
      }

      core.notice("Labels added to issue #" + issueNumberToLabel);

      // Add comments based on conditions
      if (issueNumber) {
        const issueLink = `#${issueNumberToLabel}`;
        let commentText: string;

        if (!comment) {
          // Condition 1: issueNumber is true, comment is false
          commentText = `${issueLink} is already opened by you.`;
        } else if (comment) {
          // Condition 2: issueNumber is true, comment is true
          commentText = `#${issueNumberToLabel} ${comment}`;
        }

        await octokit.rest.issues.createComment({
          owner: context.repo.owner,
          repo: context.repo.repo,
          issue_number: issueNumberToLabel,
          body: commentText,
        });

        core.notice("Comment added to issue #" + issueNumberToLabel);
      } else if (!issueNumber && comment) {
        // Condition 3: issueNumber is false, comment is true

        await octokit.rest.issues.createComment({
          owner: context.repo.owner,
          repo: context.repo.repo,
          issue_number: issueNumberToLabel,
          body: comment,
        });

        core.notice("Comment added to issue #" + issueNumberToLabel);
      }

      // Close the current issue if close is true
      if (close && issueNumberToLabel === context.issue.number) {
        await octokit.rest.issues.update({
          owner: context.repo.owner,
          repo: context.repo.repo,
          issue_number: issueNumberToLabel,
          state: "closed",
        });

        core.notice("Issue #" + issueNumberToLabel + " closed");
      }
    }
  } catch (error) {
    core.error("No Issue found!");
    core.setFailed("Workflow failed: " + error.message);
  }
}

run();
