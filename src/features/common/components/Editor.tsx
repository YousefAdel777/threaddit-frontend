"use client";

import { 
    MDXEditor, 
    MDXEditorMethods, 
    headingsPlugin, 
    listsPlugin, 
    toolbarPlugin, 
    thematicBreakPlugin, 
    quotePlugin,
    UndoRedo,
    BoldItalicUnderlineToggles,
    InsertTable,
    tablePlugin,
    imagePlugin,
    linkDialogPlugin,
    linkPlugin,
    frontmatterPlugin,
    codeBlockPlugin,
    markdownShortcutPlugin,
    codeMirrorPlugin,
    CodeToggle,
    BlockTypeSelect,
    InsertCodeBlock,
    ListsToggle,
    InsertThematicBreak,
    CreateLink,
} from "@mdxeditor/editor";
import '@mdxeditor/editor/style.css'
import { Suspense } from "react";
import Loading from "./Loading";

interface EditorProps {
    markdown: string;
    editorRef?: React.MutableRefObject<MDXEditorMethods | null>;
    onChange: (value: string) => void;
}

const Editor: React.FC<EditorProps> = ({ markdown, onChange }) => {
    return (
        <Suspense fallback={<Loading text="Loading Editor" />}>
            <MDXEditor
                className="prose rounded-md shadow-md z-0 mb-4 max-w-none w-full"
                markdown={markdown || ""}
                onChange={onChange}
                plugins={[
                    toolbarPlugin({ toolbarContents: () => 
                        <>
                            <UndoRedo />
                            <BoldItalicUnderlineToggles />
                            <ListsToggle />
                            <InsertTable />
                            <CodeToggle />
                            <InsertCodeBlock />
                            <BlockTypeSelect />
                            <InsertThematicBreak />
                            <CreateLink />
                        </>
                    }),
                    listsPlugin(),
                    quotePlugin(),
                    headingsPlugin(),
                    linkPlugin(),
                    linkDialogPlugin(),
                    imagePlugin(),
                    tablePlugin(),
                    thematicBreakPlugin(),
                    frontmatterPlugin(),
                    codeBlockPlugin({ defaultCodeBlockLanguage: 'txt' }),
                    codeMirrorPlugin({ codeBlockLanguages: { js: 'JavaScript', css: 'CSS', txt: 'text', tsx: 'TypeScript' } }),
                    markdownShortcutPlugin()
                ]}
            />
        </Suspense>
    );
};

export default Editor;