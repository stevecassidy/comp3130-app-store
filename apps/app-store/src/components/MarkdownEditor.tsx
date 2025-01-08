import {
  BoldItalicUnderlineToggles, 
  headingsPlugin,
  listsPlugin, 
  ListsToggle, 
  markdownShortcutPlugin, 
  MDXEditor, 
  toolbarPlugin, 
  UndoRedo} from "@mdxeditor/editor";
import '@mdxeditor/editor/style.css';

interface MarkdownEditorProps {
  value: string;
  onChange: (markdown: string) => void;
}

export const MarkdownEditor = ({value, onChange}: MarkdownEditorProps) => {

  return (
  <MDXEditor 
  markdown={value} 
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
