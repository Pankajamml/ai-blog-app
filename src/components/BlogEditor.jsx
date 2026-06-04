import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";

export default function BlogEditor({ content, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Wait for editor to load
  if (!editor) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-gray-400 text-sm">
        Loading editor...
      </div>
    );
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">

      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-3 border-b border-gray-700 bg-gray-900">

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

        <div className="w-px bg-gray-600 mx-1" />

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

        <div className="w-px bg-gray-600 mx-1" />

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

        <div className="w-px bg-gray-600 mx-1" />

        <button
          onClick={() => editor.chain().focus().undo().run()}
          className="px-3 py-1 rounded text-sm bg-gray-700 text-white hover:bg-gray-600 transition"
        >
          ↩
        </button>

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
        className="p-4 min-h-48 text-gray-300 focus:outline-none prose prose-invert max-w-none"
      />

    </div>
  );
}