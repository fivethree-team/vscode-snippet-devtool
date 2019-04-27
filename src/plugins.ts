
import { CorePlugin } from '@fivethree/billy-plugin-core';
import { Markdown } from '@fivethree/billy-plugin-markdown';
import { usesPlugins } from '@fivethree/billy-core';

//we need this line for intellisense :)
export interface Plugins extends CorePlugin, Markdown { }

export class Plugins {
    @usesPlugins(CorePlugin, Markdown)
    this;
}
