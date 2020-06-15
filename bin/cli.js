#!/usr/bin/env node
const os = require('os');
const { program } = require('commander');
const { listLanguages, donwloadSubtitles, toSrtTimeString } = require('../src');

(async function () {
    program
        .command('list-languages <video-id>')
        .description('list available subtitle languages')
        .action(async (videoId) => {
            const langs = await listLanguages(videoId)
            if (langs === null) {
                console.error(`"${videoId}" does not have any subtitles`)
                return;
            }
            process.stdout.write(langs.join(os.EOL) + os.EOL);
        })

    program
        .command('download-subtitles <video-id> <language-code>')
        .description('downloads subtitles for given 2-letter language code and output SRT')
        .action(async (videoId, languageCode) => {
            const srtObjects = await donwloadSubtitles(videoId, languageCode);
            if (srtObjects === null) {
                console.error(`"${videoId}" does not have "${languageCode}" subtitles`)
                return;
            }

            const str = srtObjects.map(({ id, fromSeconds, toSeconds, text }) => {
                return `${id}\n${toSrtTimeString(fromSeconds)} --> ${toSrtTimeString(toSeconds)}\n${text}\n\n`;
            }) + '\n';

            process.stdout.write(str);
        });

    program.parse(process.argv);
})()

