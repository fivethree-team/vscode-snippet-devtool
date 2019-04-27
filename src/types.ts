
export interface PackageJSON {
    name: string;
    displayName: string;
    description: string;
    version: string;
    license: string;
    publisher: string;
    repository: Repository;
    bugs: Bugs;
    engines: Engines;
    categories: string[];
    keywords: string[];
    contributes: Contributes;
    scripts: Scripts;
}

export interface Bugs {
    url: string;
}

export interface Contributes {
    languages: Language[];
    snippets: Snippet[];
}

export interface Language {
    id: string;
    aliases: string[];
    filenamePatterns: string[];
}

export interface Snippet {
    language: string;
    path: string;
}

export interface Engines {
    vscode: string;
}

export interface Repository {
    type: string;
    url: string;
}

export interface Scripts {
    "vscode:publish": string;
    version: string;
}

export interface SnippetJSON {
    [key: string]: SnippetContent;
}

export interface SnippetContent {
    prefix: string;
    description: string;
    body: string;
}

export interface SnippetDocs {
    snippet: SnippetJSON;
    meta: Snippet;
    keys: string[];
}
