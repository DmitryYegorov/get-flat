import { Stack } from '@mui/material'
import './styles.scss'

import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import { Editor, EditorProvider, useCurrentEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React from 'react'
import { IconButton } from 'rsuite'
import { BiBold, BiHeading, BiItalic, BiParagraph, BiStrikethrough } from 'react-icons/bi'
import { LuHeading1, LuHeading2, LuHeading3, LuHeading4, LuHeading5, LuHeading6, LuList, LuListOrdered } from "react-icons/lu";
import { BsBlockquoteLeft } from 'react-icons/bs'

const MenuBar = () => {
  const { editor } = useCurrentEditor()

  if (!editor) {
    return null
  }

  return (
    <Stack direction={'row'} flexWrap={'wrap'} spacing={0.5}>
      <IconButton
        icon={<BiBold />}
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .toggleBold()
            .run()
        }
        className={editor.isActive('bold') ? 'is-active' : ''}
      />
      <IconButton
        icon={<BiItalic />}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .toggleItalic()
            .run()
        }
        className={editor.isActive('italic') ? 'is-active' : ''}
      />
      <IconButton
        icon={<BiStrikethrough />}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .toggleStrike()
            .run()
        }
        className={editor.isActive('strike') ? 'is-active' : ''}
      />
      <IconButton
        icon={<BiParagraph />}
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={editor.isActive('paragraph') ? 'is-active' : ''}
      />
      <IconButton
        icon={<LuHeading1 />}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
      />
      <IconButton
        icon={<LuHeading2 />}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
      />
      <IconButton
        icon={<LuHeading3 />}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
      />
      <IconButton
        icon={<LuHeading4 />}
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        className={editor.isActive('heading', { level: 4 }) ? 'is-active' : ''}
      />
      <IconButton
        icon={<LuHeading5 />}
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        className={editor.isActive('heading', { level: 5 }) ? 'is-active' : ''}
      />
      <IconButton
        icon={<LuHeading6 />}
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        className={editor.isActive('heading', { level: 6 }) ? 'is-active' : ''}
      />
      <IconButton
        icon={<LuList />}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'is-active' : ''}
      />
      <IconButton
        icon={<LuListOrdered />}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'is-active' : ''}
      />
      <IconButton
        icon={<BsBlockquoteLeft />}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive('blockquote') ? 'is-active' : ''}
      />
    </Stack>
  )
}

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({ types: [ListItem.name] }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
  }),
];

interface Props {
    content: string;
    onChange: (html: string) => void;
}

const Tiptap: React.FC<Props> = ({content, onChange}) => {
    
    return (
        <EditorProvider
            slotBefore={<MenuBar />}
            editorProps={{
                attributes: {
                    class: 'border-solid border-indigo-600 border-2 rounded-md p-2 bg-slate-50'
                }
            }}
            extensions={extensions}
            content={content}
            onUpdate={({ editor }) => {
                onChange(editor.getHTML());
            }}
        />
    );
}

export default Tiptap;