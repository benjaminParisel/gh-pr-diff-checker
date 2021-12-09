# Github PR diff checker

This action checks the diff in a PR, and fails if one or more of the set criteria isn't met.

# Using this action

You need to add this in a file in `.github/workflows` and set appropriate options.

```
name: Check PR content

on: [pull_request]

jobs:
  check_pr:
    runs-on: ubuntu-latest
    name: Check for forbidden string
    steps:
      - name: Scan forbidden string
        uses: benjaminParisel/gh-pr-diff-checker@main
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          diffDoesNotContain: "['http://documentation.mydomain','link:']"
```

An example is also provided in .github/workflows/ in this repository.

## License

This is a modification and inspiration from [JJ/github-pr-contains-action](https://github.com/JJ/github-pr-contains-action/) and is released under the MIT license.
