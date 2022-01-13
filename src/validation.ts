import parseDiff from "parse-diff";

export type prDiffResult  = {
    isDiffValid : boolean,
    message: string
}
export function validate(files: parseDiff.File[], filteredExtensions: Array<string>, diffDoesNotContain: Array<string>) : prDiffResult{
    let changes = ''
    // Get chunk only for file who follow the extensions input
    if (filteredExtensions.length > 0) {
        files = files.filter( (file)=> filteredExtensions.some(v => file.to?.includes(v)));
    }
    console.log('files', files);
    files.forEach(function (file) {
        // Get changed chunks
        console.log('chunks', file.chunks);
        file.chunks.forEach(function (chunk) {
            chunk.changes.forEach(function (change) {
                if (change['add']) {
                    changes += change.content
                }
            })
        })
    });

    if (diffDoesNotContain.length > 0 && diffDoesNotContain.some(pattern => changes.includes(pattern))) {
        return {'isDiffValid' : false, message: ''};
        //core.setFailed(`The PR should not include one of ${diffDoesNotContain.toString()}`);
    }
    return {'isDiffValid' : true, message: ''};

}