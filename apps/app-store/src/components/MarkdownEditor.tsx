import {
  BoldItalicUnderlineToggles, 
  headingsPlugin,
  listsPlugin, 
  ListsToggle, 
  markdownShortcutPlugin, 
  MDXEditor, 
  MDXEditorMethods, 
  toolbarPlugin, 
  UndoRedo} from "@mdxeditor/editor";
import '@mdxeditor/editor/style.css';
import {useEffect, useRef} from "react";

interface MarkdownEditorProps {
  value: string;
  onChange: (markdown: string) => void;
}

export const MarkdownEditor = ({value, onChange}: MarkdownEditorProps) => {

  const ref = useRef<MDXEditorMethods>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.setMarkdown(value);
    }
  })

  return (
  <MDXEditor 
    markdown={value}
    ref={ref}
    onChange={onChange}
    plugins={[
      listsPlugin(),
      headingsPlugin(),
      markdownShortcutPlugin(),
      toolbarPlugin({
        toolbarClassName: 'my-classname',
        toolbarContents: () => (
          <>
            {' '}
            <UndoRedo />
            <BoldItalicUnderlineToggles />
            <ListsToggle />
          </>
        )
      }),
    ]}
  />);
};
