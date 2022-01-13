import core from '@actions/core';
import github from '@actions/github';
import parse from'parse-diff';
import 'jest';
import {validate} from "../validation";

test('throws invalid number', () => {
    let result = validate([], ['.adoc'], ['']);
    expect(result.isDiffValid).toBe(true);
})
