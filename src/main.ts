const core = require('@actions/core');
const github = require('@actions/github')
const parse = require('parse-diff')

async function run() {
    try {
        // get information on everything
        const token = core.getInput('github-token', { required: true })
        const octokit = github.getOctokit(token)
        const context = github.context
        console.log('### PR number', context.payload.pull_request.number);
        // Request the pull request diff from the GitHub API
        const { data: prDiff } = await octokit.pulls.get({
            owner: context.repo.owner,
            repo: context.repo.repo,
            pull_number: context.payload.pull_request.number,
            mediaType: {
                format: "diff",
            },
        });
        const files = parse(prDiff)

        // Get changed chunks
        let changes = ''
        files.forEach(function(file) {
            file.chunks.forEach(function(chunk) {
                chunk.changes.forEach(function(change) {
                    if (change.add) {
                        changes += change.content
                    }
                })
            })
        })
        console.log('### before', changes);
        // Check that the pull request diff does not contain the forbidden string
        let inputStringDiff :string = core.getInput('diffDoesNotContain')
        console.log('### diffDoesNotContain',inputStringDiff);
        let diffDoesNotContain: Array<string> = JSON.parse(inputStringDiff);
        if (diffDoesNotContain.length > 0) {
            diffDoesNotContain.forEach(pattern => {
                if (changes.includes(pattern)) {
                    core.setFailed(`The PR diff should not include one of ${diffDoesNotContain.toString()}`);
                }
            });
        }

    } catch (error:any) {
        core.setFailed(error.message);
    }
}

run();
