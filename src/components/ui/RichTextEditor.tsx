"use client";

import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";

import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Code,
  Quote,
} from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  editable?: boolean;
}

const RichTextEditor = ({
  content,
  onChange,
  placeholder = "Start writing...",
  editable = true,
}: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert focus:outline-none max-w-full h-full min-h-[200px] p-4 overflow-y-auto",
        placeholder,
      },
    },
  });

  useEffect(() => {
    if (editor && content === "") {
      editor.commands.setContent("");
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  const handleImageAdd = () => {
    const url = window.prompt("Enter the URL of the image:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const handleLinkAdd = () => {
    const url = window.prompt("Enter the URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addTable = () => {
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      {editable && (
        <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-2">
          <div className="flex flex-wrap gap-1 items-center">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
                editor.isActive("bold") ? "bg-gray-200 dark:bg-gray-700" : ""
              }`}
              title="Bold"
              type="button"
            >
              <Bold size={16} />
            </button>

            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
                editor.isActive("italic") ? "bg-gray-200 dark:bg-gray-700" : ""
              }`}
              title="Italic"
              type="button"
            >
              <Italic size={16} />
            </button>

            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
                editor.isActive("strike") ? "bg-gray-200 dark:bg-gray-700" : ""
              }`}
              title="Strike through"
              type="button"
            >
              <Strikethrough size={16} />
            </button>

            <span className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></span>

            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
                editor.isActive("heading", { level: 1 })
                  ? "bg-gray-200 dark:bg-gray-700"
                  : ""
              }`}
              title="Heading 1"
              type="button"
            >
              <Heading1 size={16} />
            </button>

            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
                editor.isActive("heading", { level: 2 })
                  ? "bg-gray-200 dark:bg-gray-700"
                  : ""
              }`}
              title="Heading 2"
              type="button"
            >
              <Heading2 size={16} />
            </button>

            <span className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></span>

            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
                editor.isActive("bulletList")
                  ? "bg-gray-200 dark:bg-gray-700"
                  : ""
              }`}
              title="Bullet List"
              type="button"
            >
              <List size={16} />
            </button>

            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
                editor.isActive("orderedList")
                  ? "bg-gray-200 dark:bg-gray-700"
                  : ""
              }`}
              title="Ordered List"
              type="button"
            >
              <ListOrdered size={16} />
            </button>

            <span className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></span>

            <button
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
                editor.isActive("codeBlock")
                  ? "bg-gray-200 dark:bg-gray-700"
                  : ""
              }`}
              title="Code Block"
              type="button"
            >
              <Code size={16} />
            </button>

            <button
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
                editor.isActive("blockquote")
                  ? "bg-gray-200 dark:bg-gray-700"
                  : ""
              }`}
              title="Quote"
              type="button"
            >
              <Quote size={16} />
            </button>

            <span className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></span>

            <button
              onClick={handleLinkAdd}
              className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
                editor.isActive("link") ? "bg-gray-200 dark:bg-gray-700" : ""
              }`}
              title="Add Link"
              type="button"
            >
              <LinkIcon size={16} />
            </button>

            <button
              onClick={handleImageAdd}
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
              title="Add Image"
              type="button"
            >
              <ImageIcon size={16} />
            </button>

            <button
              onClick={addTable}
              className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
                editor.isActive("table") ? "bg-gray-200 dark:bg-gray-700" : ""
              }`}
              title="Add Table"
              type="button"
            >
              <TableIcon size={16} />
            </button>

            <span className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></span>

            <button
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30"
              title="Undo"
              type="button"
            >
              <Undo size={16} />
            </button>

            <button
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30"
              title="Redo"
              type="button"
            >
              <Redo size={16} />
            </button>
          </div>
        </div>
      )}

      <EditorContent editor={editor} className="bg-white dark:bg-gray-900" />
    </div>
  );
};

export default RichTextEditor;
