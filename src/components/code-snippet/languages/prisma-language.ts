import type { Monaco } from '@monaco-editor/react';

export const setupPrismaLanguage = (monaco: Monaco) => {
    // Only register once
    if (monaco.languages.getLanguages().some((lang) => lang.id === 'prisma')) {
        return;
    }

    monaco.languages.register({ id: 'prisma' });

    monaco.editor.defineTheme('prisma-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'comment', foreground: '6A9955' },
            { token: 'keyword', foreground: '569CD6' },
            { token: 'string', foreground: 'CE9178' },
            { token: 'annotation', foreground: 'DCDCAA' },
            { token: 'delimiter', foreground: 'D4D4D4' },
            { token: 'type', foreground: '4EC9B0' },
            { token: 'identifier', foreground: '9CDCFE' },
            { token: 'number', foreground: 'B5CEA8' },
        ],
        colors: {},
    });

    monaco.editor.defineTheme('prisma-light', {
        base: 'vs',
        inherit: true,
        rules: [
            { token: 'comment', foreground: '008000' },
            { token: 'keyword', foreground: '0000FF' },
            { token: 'string', foreground: 'A31515' },
            { token: 'annotation', foreground: '795E26' },
            { token: 'delimiter', foreground: '000000' },
            { token: 'type', foreground: '267F99' },
            { token: 'identifier', foreground: '001080' },
            { token: 'number', foreground: '098658' },
        ],
        colors: {},
    });

    monaco.languages.setMonarchTokensProvider('prisma', {
        keywords: ['model', 'enum', 'datasource', 'generator', 'type'],
        typeKeywords: [
            'String',
            'Int',
            'BigInt',
            'Float',
            'Decimal',
            'Boolean',
            'DateTime',
            'Json',
            'Bytes',
            'Unsupported',
        ],

        tokenizer: {
            root: [
                // Comments
                [/\/\/.*$/, 'comment'],

                // Block keywords
                [/\b(model|enum|datasource|generator|type)\b/, 'keyword'],

                // Attributes (@ and @@)
                [/@@?\w+/, 'annotation'],

                // Strings
                [/"[^"]*"/, 'string'],

                // Numbers
                [/\b\d+\b/, 'number'],

                // Type keywords
                [
                    /\b(String|Int|BigInt|Float|Decimal|Boolean|DateTime|Json|Bytes|Unsupported)\b/,
                    'type',
                ],

                // Delimiters
                [/[{}()[\]]/, 'delimiter'],

                // Identifiers
                [/[a-zA-Z_]\w*/, 'identifier'],
            ],
        },
    });
};
