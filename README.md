## Handle Multiple Issues

> ℹ️ This is specifically for open source projects, where contributors are allowed to work on only 1 issue at a time.

With this GitHub workflow, you can automate tasks whenever an author creates multiple open issues. More details are below.

### Use cases

- The workflow can comment which open issues are already created by the author.
- You can add your own comment message
- You can add a custom label to add whenever there is open issues by the same author
- You can close the issue (previous issues won't be affected) and just the current issue will be closed

---

### Getting Started

- For custom configuration in depth, you can check examples.

```yml
on:
  issues:
    types:
      - reopened
      - opened
jobs:
  handle-multiple-issues:
    runs-on: ubuntu-latest
    steps:
      - name: Custom Action
        uses: Anmol-Baranwal/handle-multiple-issues@main
        with:
          label: "multiple issues" #default
          close: false  #default
          issueNumber: true  #default is false
          gh-token: ${{ secrets.GITHUB_TOKEN }} #required
```

---

### Inputs

Various inputs are defined to let you configure the action:

| Name | Description | Default |
| --- | --- | --- |
| `gh-token` | The GitHub token for authentication | N/A |
| `label` | A label to add if the conditions are fulfilled | `'multiple issues'` |
| `comment` | A message to comment | `''` |
| `close` | This is used to close the issue if set to true | `'false'` |
| `issueNumber` | This will comment all the previous issues that are created by him | `'potential-duplicate'` |

> Various Combinations that you can use


---

### Examples

<details>
  <summary>Issue Triage</summary>
</details>

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

> Contact me for further details.

<table>
<td align="center" width="200"><pre><a href="https://github.com/Anmol-Baranwal"><img src="https://avatars.githubusercontent.com/u/74038190?v=4" width="200" alt="GitHub Profile of Anmol Baranwal" /><br><sub>Anmol Baranwal</sub></a><br>@Anmol-Baranwal</pre></td>
</table>
