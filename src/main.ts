const core = require('@actions/core');
const github = require('@actions/github')
const parse = require('parse-diff')

async function run() {
    try {
        // get information on everything
        const token = core.getInput('github-token', {required: true})
        const octokit = github.getOctokit(token)
        const context = github.context

        // Request the pull request diff from the GitHub API
        const {data: prDiff} = await octokit.rest.pulls.get({
            owner: context.repo.owner,
            repo: context.repo.repo,
            pull_number: context.payload.pull_request.number,
            mediaType: {
                format: "diff",
            },
        });

        let files = parse(prDiff)


        let filteredExtensions = JSON.parse(core.getInput("extensionsToCheck"));
        let changes = ''
        // Get chunk only for file who follow the extensions input
        if (filteredExtensions.length > 0) {
            files = files.filter(file => filteredExtensions.some(v => file.to.includes(v)));
        }
        files.forEach(function (file) {
            // Get changed chunks
            file.chunks.forEach(function (chunk) {
                chunk.changes.forEach(function (change) {
                    if (change.add) {
                        changes += change.content
                    }
                })
            })
        })
        console.log('### before', changes);
        // Check that the pull request diff does not contain the forbidden string
        let inputStringDiff: string = core.getInput('diffDoesNotContain')
        console.log('### diffDoesNotContain', inputStringDiff);
        let diffDoesNotContain: Array<string> = JSON.parse(inputStringDiff);
        if (diffDoesNotContain.length > 0 && diffDoesNotContain.some(pattern => changes.includes(pattern))) {
            core.setFailed(`The PR diff should not include one of ${diffDoesNotContain.toString()}`);
        }

    } catch (error: any) {
        core.setFailed(error.message);
    }
}

run();
