import { Plugins } from "./plugins";
export declare class SnippetDevtool extends Plugins {
    publish(path: string): Promise<void>;
    docs(path: string): Promise<void>;
    promptVersion(path: string): Promise<void>;
    publishToVSCode(path: string): Promise<void>;
}
