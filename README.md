## Handle Multiple Issues

> ℹ️ This GitHub workflow is designed for open source projects where users are allowed to work on only one issue at a time.

With this GitHub workflow, you can automate tasks whenever an author creates multiple open issues.

### Use cases

- The workflow can comment the issues that are already created by the author which are currently in the open state.
- You can also filter the issues that are assigned to the author of the issue
- You can add your own comment message (even multiline) in the issue.
- You can add label or labels based on your preferences.
- Optionally, you can also close the issue (previous issues won't be affected), and only the current issue will be closed.
- You can ignore this workflow for specific users by using `ignoreUsers`
- You can directly pass `ignoreCollaborators`

---

### 🚀 Getting Started

- For custom configuration in-depth, you can check [examples](#examples).
- Create a file in the repository at the following path: `.github/workflows/handle-multiple-issues.yml` and paste the following code into it.

```yml
name: Handle Multiple Issues

on:
  issues:
    types:
      - reopened
      - opened
jobs:
  handle-multiple-issues:
    runs-on: ubuntu-latest
    steps:
      - name: Handle Multiple Issues
        uses: Anmol-Baranwal/handle-multiple-issues@v1
        with:
          label: "multiple issues" #default
          close: false  #default
          issueNumber: true  #default is true
```

---

### Inputs

Various inputs are defined to let you configure the action:

| Name | Description | Default |
| ---- | ----------- | ------- |
| `gh-token` | The GitHub token for authentication | `'${{ github.token }}'` |
| `label` | Add a label to the current issue. Use commas to separate if there are multiple labels. | `'multiple issues'` |
| `comment` | A message to comment on the issue | `''` |
| `close` | This will close the issue if set to true | `'false'` |
| `issueNumber` | This will comment all the previous issues that are created by the author | `'true'` |
| `assign` | This will filter the issues that are assigned to the author (works only if `issueNumber` is `true`) | `'false'` |
| `ignoreUsers` | Specify usernames that should be ignored while running this workflow. Use commas to separate if there are multiple users. | `''` |
| `ignoreCollaborators` | This will ignore all the collaborators in the repository while running this workflow | `'false'` |

<br>

The Combinations that you can use with `comment`, `assign` and `issueNumber`:

> Suppose, a user has created `#1`, `#2` which are currently open, only `#2` is assigned to author and we have now included this workflow. Now suppose he creates the `#3` issue.

> You can see the [examples](#examples) for better clarity.

| issueNumber | comment | assign | Purpose | Message by Bot |
| ----------- | ------- | ------ | ------- | -------------- |
| `true` |  | `false` | To mention issue number with the default message | `#2, #1 is already opened by you` |
| `true` | `custom_message` | `false` | To mention issue number with a custom message | `#2, #1 custom_message` |
| `false` | `custom_message` | `false` | Custom message without mentioning issue | `custom_message` |
| `false` |  | `false` | Nothing is mentioned; only the label is added as per the workflow |  |
| `true` |  | `true` | To filter issues that are created by the author and assigned to the same author  | `#2 has been opened by you and is also assigned to you.` |

> Only the default message is modified when `assign` is set to `true`; the concept of a custom message remains unchanged.


---

### 🔖 Examples

<details>
  <summary>Add a custom label and print the issue number with a default message</summary>

```yml
uses: Anmol-Baranwal/handle-multiple-issues@v1
with:
  label: "up for grabs" #default is 'multiple issues'
  close: false  #default
  issueNumber: true  #default is true
```
  
</details>

<br>

<details>
  <summary>Add a default label and print the issue number with a custom message</summary>
  
```yml
uses: Anmol-Baranwal/handle-multiple-issues@v1
with:
  # label 'multiple issues' will be added
  comment: 'custom message'
  issueNumber: true  #default is true
```
  
</details>

<br>

<details>
  <summary>Print a custom message without mentioning issue number</summary>
  
```yml
uses: Anmol-Baranwal/handle-multiple-issues@v1
with:
  label: "multiple issues" #default
  comment: 'custom message'
  issueNumber: false  #default is true
```
  
</details>

<br>

<details>
  <summary>Multiline comment message with issue number</summary>
  
```yml
uses: Anmol-Baranwal/handle-multiple-issues@v1
with:
  label: "multiple issues" #default
  comment: |
    custom message1
    custom message2
  issueNumber: true  #default is true

#  Suppose #1 is already created by the author.
#  Output
#  #1 custom message1
#  custom message2
```

</details>

<br>

<details>
  <summary>Add multiple labels</summary>
  
```yml
uses: Anmol-Baranwal/handle-multiple-issues@v1
with:
  label: 'label1, label2'   # separate using comma
  issueNumber: true  #default is true
```

</details>

<br>

<details>
  <summary>To filter issues that are assigned to the author</summary>

  <br>

  - The same rules for message applies to this condition
  - This will not work unless `issueNumber` is `true`.

  
```yml
uses: Anmol-Baranwal/handle-multiple-issues@v1
with:
  issueNumber: true   # default is true
  assign: true   # this will not work, unless 'issueNumber' is true

#  Suppose #1, #2 is already created by the author. But only #2 is assigned to the author.
#  Output
#  #2 has been opened by you and is also assigned to you.
```

</details>

<br>

<details>
  <summary>To ignore specified users while running this workflow</summary>

<br>

  - Suppose, we have to ignore this workflow for users with username: `Anmol-Baranwal`, `AnmolB2`.

```yml
uses: Anmol-Baranwal/handle-multiple-issues@v1
with:
  issueNumber: true   # default is true
  ignoreUsers: 'Anmol-Baranwal, AnmolB2'

#  Suppose Anmol-Baranwal created an issue. You will receive a log message during the workflow execution.
#  Log Message
#  User: Anmol-Baranwal is on the ignore list. Ignoring the workflow for this user.
```

</details>

<br>

<details>
  <summary>To ignore collaborators of the repository while running this workflow</summary>

<br>

  - Suppose, we have to ignore this workflow for users with username: `Anmol-Baranwal`, `AnmolB2`.

```yml
uses: Anmol-Baranwal/handle-multiple-issues@v1
with:
  issueNumber: true   # default is true
  ignoreCollaborators: true

#  Suppose Anmol-Baranwal created an issue and is a collaborator. You will receive a log message during the workflow execution.
#  Log Message
#  User: Anmol-Baranwal is a collaborator. Ignoring the issue for collaborators.
```

</details>

---

### 🤝 How to Contribute?

All changes are welcome. Please read our [contributing guidelines](Contributing.md)

Feel free to suggest any features or report bugs using these [issue templates](https://github.com/Anmol-Baranwal/handle-multiple-issues/issues/new/choose).

---

### 📝 License

<table>
  <tr>
     <td>
       <p align="center"> <img src="https://github.com/rupali-codes/LinksHub/assets/66154908/65ae0c03-9cad-47a6-80b8-23c91cd2ac4e" width="80%"></img>
    </td>
    <td> 
      <img src="https://img.shields.io/badge/License-MIT-yellow.svg"/> <br> 
The scripts and documentation in this project are released under the <a href="./LICENSE">MIT License</a>. <img width=2300/>
    </td>
  </tr>
</table>

---

### <img src="https://user-images.githubusercontent.com/74038190/221857984-5bf77e81-6f65-4502-a7c8-f29a978efb3f.png" alt="bullseye" width="25" /> Tech & Tools

> In case you want to run the action locally, without having to commit/push every time, you can use the [act](https://github.com/nektos/act) tool.

<img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" /> <img src="https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white" />

---

### Author 

> Feel free to contact me if you need a custom workflow for your project. I'll be happy to build one.

<table>
<td align="center" width="200"><pre><a href="https://github.com/Anmol-Baranwal"><img src="https://avatars.githubusercontent.com/u/74038190?v=4" width="200" alt="GitHub Profile of Anmol Baranwal" /><br><sub>Anmol Baranwal</sub></a><br>@Anmol-Baranwal</pre></td>
</table>
