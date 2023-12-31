import * as core from "@actions/core"
import * as github from "@actions/github"

async function HandleMultipleIssues() {
  try {
    const token = core.getInput("gh-token")

    if (!token) core.debug(token + "")
    else core.debug(token)

    if (!token) {
      core.setFailed(
        "GitHub token is missing. Make sure to set the GITHUB_TOKEN secret."
      )
      return
    }

    const octokit = github.getOctokit(token)
    const context = github.context

    core.notice("step 1.")

    // Retrieve custom inputs
    const labels = core
      .getInput("label")
      .split(",")
      .map((label) => label.trim())
    const assign = core.getInput("assign") === "true" || false
    const issueNumber = core.getInput("issueNumber") === "true"
    const comment = core.getInput("comment")
    const close = core.getInput("close") === "true" || false
    const ignoreUsers = core
      .getInput("ignoreUsers")
      .split(",")
      .map((user) => user.trim())
    const ignoreCollaboratorsInput =
      core.getInput("ignoreCollaborators") === "true" || false

    const checkComment = comment.trim() !== ""

    // Check if the same author has open issues
    const author = context.payload.issue?.user.login

    if (ignoreUsers.includes(author)) {
      core.notice(
        `User: ${author} is on the ignore list. Ignoring the workflow for this user.`
      )
      return // No need to continue.
    }

    const collaboratorUsernames = ignoreCollaboratorsInput
      ? (
          await octokit.rest.repos.listCollaborators({
            owner: context.repo.owner,
            repo: context.repo.repo
          })
        ).data.map((collaborator) => collaborator.login)
      : []

    if (collaboratorUsernames.includes(author)) {
      core.notice(
        `User ${author} is a collaborator. Ignoring the issue for collaborators.`
      )
      return // No need to continue.
    }

    core.notice("step 2.")

    const {data: authorIssues} = await octokit.rest.issues.listForRepo({
      owner: context.repo.owner,
      repo: context.repo.repo,
      creator: author,
      state: "open"
    })

    const filteredIssues = assign
      ? authorIssues.filter((issue: any) =>
          issue.assignees.some((assignee: any) => assignee.login === author)
        )
      : authorIssues

    if (filteredIssues.length === 0) {
      core.notice(
        `No existing ${
          assign === true
            ? "issues created by and assigned to"
            : "open issues for"
        } this author.`
      )
      return // No need to continue.
    }

    core.notice("step 3.")

    const previousIssueNumbers = filteredIssues
      .filter((issue: {number: any}) => issue.number !== context.issue.number) // Exclude the current issue
      .map((issue: {number: any}) => issue.number)

    if (previousIssueNumbers.length > 0) {
      const issueNumberToLabel = context.issue.number

      const issueLinks = previousIssueNumbers
        .map((issueNumber: any) => `#${issueNumber}`)
        .join(", ")

      // Check if label is an array and add multiple labels if needed
      if (Array.isArray(labels)) {
        for (const lbl of labels) {
          await octokit.rest.issues.addLabels({
            owner: context.repo.owner,
            repo: context.repo.repo,
            issue_number: issueNumberToLabel,
            labels: [lbl]
          })
        }
      } else {
        // Add a single label
        await octokit.rest.issues.addLabels({
          owner: context.repo.owner,
          repo: context.repo.repo,
          issue_number: issueNumberToLabel,
          labels: [labels]
        })
      }

      core.notice("Labels added to issue #" + issueNumberToLabel)

      // Add comments based on conditions
      if (issueNumber) {
        // const issueLink = `#${issueNumberToLabel}`;
        let commentText: string = ""

        if (!checkComment) {
          // Condition 1: issueNumber is true, comment is false

          if (assign)
            commentText = `${issueLinks} has been opened by you and is also assigned to you.`
          else commentText = `${issueLinks} is already opened by you.`
        } else if (checkComment) {
          // Condition 2: issueNumber is true, comment is true
          commentText = `${issueLinks} ${comment}`
        }

        await octokit.rest.issues.createComment({
          owner: context.repo.owner,
          repo: context.repo.repo,
          issue_number: issueNumberToLabel,
          body: commentText
        })

        core.notice("Comment added to issue #" + issueNumberToLabel)
      } else if (!issueNumber && checkComment) {
        // Condition 3: issueNumber is false, comment is true

        await octokit.rest.issues.createComment({
          owner: context.repo.owner,
          repo: context.repo.repo,
          issue_number: issueNumberToLabel,
          body: comment
        })

        core.notice("Comment added to issue #" + issueNumberToLabel)
      }

      // Close the current issue if close is true
      if (close && issueNumberToLabel === context.issue.number) {
        await octokit.rest.issues.update({
          owner: context.repo.owner,
          repo: context.repo.repo,
          issue_number: issueNumberToLabel,
          state: "closed"
        })

        core.notice("Issue #" + issueNumberToLabel + " closed")
      }
    }
  } catch (error: any) {
    core.notice("No Issue found!")
    core.notice("Workflow failed: " + error.message)
  }
}

HandleMultipleIssues()
