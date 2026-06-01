import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import CharacterCount from "@tiptap/extension-character-count";
import Placeholder from "@tiptap/extension-placeholder";

export default function BlogEditor({ content, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
      }),
      CharacterCount,
      Placeholder.configure({
        placeholder: "Your AI generated blog will appear here...",
      }),
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">

      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-3 border-b border-gray-700 bg-gray-900">

        {/* Bold */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1 rounded text-sm font-bold transition ${
            editor.isActive("bold")
              ? "bg-cyan-500 text-black"
              : "bg-gray-700 text-white hover:bg-gray-600"
          }`}
        >
          B
        </button>

        {/* Italic */}
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1 rounded text-sm italic transition ${
            editor.isActive("italic")
              ? "bg-cyan-500 text-black"
              : "bg-gray-700 text-white hover:bg-gray-600"
          }`}
        >
          I
        </button>

        {/* Underline */}
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`px-3 py-1 rounded text-sm underline transition ${
            editor.isActive("underline")
              ? "bg-cyan-500 text-black"
              : "bg-gray-700 text-white hover:bg-gray-600"
          }`}
        >
          U
        </button>

        {/* Divider */}
        <div className="w-px bg-gray-600 mx-1" />

        {/* Heading 1 */}
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-3 py-1 rounded text-sm font-bold transition ${
            editor.isActive("heading", { level: 1 })
              ? "bg-cyan-500 text-black"
              : "bg-gray-700 text-white hover:bg-gray-600"
          }`}
        >
          H1
        </button>

        {/* Heading 2 */}
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-3 py-1 rounded text-sm font-bold transition ${
            editor.isActive("heading", { level: 2 })
              ? "bg-cyan-500 text-black"
              : "bg-gray-700 text-white hover:bg-gray-600"
          }`}
        >
          H2
        </button>

        {/* Divider */}
        <div className="w-px bg-gray-600 mx-1" />

        {/* Bullet List */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1 rounded text-sm transition ${
            editor.isActive("bulletList")
              ? "bg-cyan-500 text-black"
              : "bg-gray-700 text-white hover:bg-gray-600"
          }`}
        >
          • List
        </button>

        {/* Ordered List */}
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-3 py-1 rounded text-sm transition ${
            editor.isActive("orderedList")
              ? "bg-cyan-500 text-black"
              : "bg-gray-700 text-white hover:bg-gray-600"
          }`}
        >
          1. List
        </button>

        {/* Divider */}
        <div className="w-px bg-gray-600 mx-1" />

        {/* Align Left */}
        <button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`px-3 py-1 rounded text-sm transition ${
            editor.isActive({ textAlign: "left" })
              ? "bg-cyan-500 text-black"
              : "bg-gray-700 text-white hover:bg-gray-600"
          }`}
        >
          ←
        </button>

        {/* Align Center */}
        <button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`px-3 py-1 rounded text-sm transition ${
            editor.isActive({ textAlign: "center" })
              ? "bg-cyan-500 text-black"
              : "bg-gray-700 text-white hover:bg-gray-600"
          }`}
        >
          ↔
        </button>

        {/* Align Right */}
        <button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`px-3 py-1 rounded text-sm transition ${
            editor.isActive({ textAlign: "right" })
              ? "bg-cyan-500 text-black"
              : "bg-gray-700 text-white hover:bg-gray-600"
          }`}
        >
          →
        </button>

        {/* Divider */}
        <div className="w-px bg-gray-600 mx-1" />

        {/* Blockquote */}
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-3 py-1 rounded text-sm transition ${
            editor.isActive("blockquote")
              ? "bg-cyan-500 text-black"
              : "bg-gray-700 text-white hover:bg-gray-600"
          }`}
        >
          " "
        </button>

        {/* Code */}
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`px-3 py-1 rounded text-sm transition ${
            editor.isActive("code")
              ? "bg-cyan-500 text-black"
              : "bg-gray-700 text-white hover:bg-gray-600"
          }`}
        >
          {"</>"}
        </button>

        {/* Divider */}
        <div className="w-px bg-gray-600 mx-1" />

        {/* Undo */}
        <button
          onClick={() => editor.chain().focus().undo().run()}
          className="px-3 py-1 rounded text-sm bg-gray-700 text-white hover:bg-gray-600 transition"
        >
          ↩
        </button>

        {/* Redo */}
        <button
          onClick={() => editor.chain().focus().redo().run()}
          className="px-3 py-1 rounded text-sm bg-gray-700 text-white hover:bg-gray-600 transition"
        >
          ↪
        </button>

      </div>

      {/* Editor Content */}
      <EditorContent
        editor={editor}
        className="prose prose-invert max-w-none p-4 min-h-64 text-gray-300 focus:outline-none"
      />

      {/* Character Count */}
      <div className="px-4 py-2 border-t border-gray-700 text-right">
        <span className="text-gray-500 text-xs">
          {editor.storage.characterCount.characters()} characters ·{" "}
          {editor.storage.characterCount.words()} words
        </span>
      </div>

    </div>
  );
}