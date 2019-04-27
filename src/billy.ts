import { PackageJSON, Snippet, SnippetDocs, SnippetContent } from './types';
import { App, Lane, Action, param, ParamOptions } from "@fivethree/billy-core";
import { Plugins } from "./plugins";
import { MarkdownTableHeader } from '@fivethree/billy-plugin-markdown';

const path: ParamOptions = {
    name: 'path',
    description: 'The path to the snippet repository',
    optional: true
}

@App()
export class SnippetDevtool extends Plugins {

    @Lane('Publish a new version of the snippet tool')
    async publish(@param(path) path: string) {
        path = path || '.';
        const isClean = await this.git_porcelain(path);
        if (!isClean) {
            this.print('Git Repository is dirty!');
            return;
        }
        await this.promptVersion(path);
        await this.docs(path);
        await this.publishToVSCode(path);
    }

    @Lane('Create Snippet Documentation and append it to readme')
    async docs(@param(path) path: string) {
        path = path || '.';
        const packageJSON: PackageJSON = this.parseJSON(path + '/package.json');
        const snippets: Snippet[] = packageJSON.contributes.snippets;
        const snippetDocs: SnippetDocs[] = [];
        snippets.forEach(s => {
            const snippetJSON = this.parseJSON(path + '/' + s.path);
            const snippetDoc: SnippetDocs = { snippet: snippetJSON, meta: s, keys: Object.keys(snippetJSON) };
            snippetDocs.push(snippetDoc);
        });

        const mdBuilder = this.createMdBuilder({ hasAutoGeneratedComment: true })
            .lineBreak()
            .h1('Snippets Documentation', true)
            .text('| Prefix | Description |')
            .text('| ------- | ----------|')
            .text('| `s-` | Svelte Snippets |')
            .lineBreak()

        const headers: MarkdownTableHeader[] = [{ key: 'prefix', title: 'Prefix' }, { key: 'description', title: 'Description' }];


        snippetDocs.forEach(doc => {
            const contents: SnippetContent[] = [];
            doc.keys
                .forEach(k => contents.push(doc.snippet[k]))
            mdBuilder
                .h2(this.camelcase(doc.meta.language, true), true)
                .lineBreak()
                .table(headers, contents)
                .lineBreak();
        });

        mdBuilder.text('**[⬆ back to top](#table-of-content)**')

        let readme = this.readText(path + '/README.md');
        const index = readme.indexOf(this.mdComment('Auto Generated Below'));
        if (index > -1) {
            readme = readme.substring(0, index);
        }
        this.writeText(path + '/README.md', readme + mdBuilder.build());
    }

    @Action('prompt the user for the version')
    async promptVersion(path: string) {
        const answer = await this.prompt([
            {
                type: 'list',
                name: 'update',
                message: 'Which version do you want to update the Markdown Plugin too?',
                choices: [
                    { name: 'Patch', value: 0 },
                    { name: 'Minor', value: 1 },
                    { name: 'Major', value: 2 },
                ]
            }
        ]);

        switch (answer.update) {
            case 0:
                await this.exec(`cd ${path} && npm version patch`, true);
                break;
            case 1:
                await this.exec(`cd ${path} && npm version minor`, true);
                break;
            case 2:
                await this.exec(`cd ${path} && npm version major`, true);
                break;
        }
    }

    @Action('prompt the user for the version')
    async publishToVSCode(path: string) {
        await this.exec(`cd ${path} && vsce publish`, true);
    }

}