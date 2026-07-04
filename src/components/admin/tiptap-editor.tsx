"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import LinkExt from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import TextAlign from "@tiptap/extension-text-align"
import Underline from "@tiptap/extension-underline"
import { TextStyle } from "@tiptap/extension-text-style"
import { Extension } from "@tiptap/core"
import { Button } from "@/components/ui/button"
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Code, Minus,
  AlignLeft, AlignCenter, AlignRight,
  ImageIcon, Link2, Undo, Redo,
} from "lucide-react"
import { useCallback, useRef } from "react"
import { toast } from "sonner"

// Custom FontSize extension — stores font-size as inline style via TextStyle
const FontSize = Extension.create({
  name: "fontSize",
  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (el) => (el as HTMLElement).style.fontSize || null,
            renderHTML: (attrs) =>
              attrs.fontSize ? { style: `font-size: ${attrs.fontSize}` } : {},
          },
        },
      },
    ]
  },
  addCommands() {
    return {
      setFontSize:
        (size: string) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ({ chain }: { chain: () => any }) =>
          chain().setMark("textStyle", { fontSize: size }).run(),
      unsetFontSize:
        () =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ({ chain }: { chain: () => any }) =>
          chain().setMark("textStyle", { fontSize: null }).removeEmptyTextStyle().run(),
    }
  },
})

const FONT_SIZES = ["12px", "14px", "16px", "18px", "20px", "24px", "28px", "32px", "36px", "48px", "64px"]

interface TiptapEditorProps {
  content?: string
  onChange?: (html: string) => void
  placeholder?: string
}

export function TiptapEditor({ content = "", onChange, placeholder = "İçerik yazın..." }: TiptapEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      FontSize,
      Image.configure({ inline: false, allowBase64: true }),
      LinkExt.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose-base max-w-none min-h-[300px] p-4 focus:outline-none",
      },
    },
  })

  const imageInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !editor) return

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || "Yükleme başarısız")
        return
      }
      editor.chain().focus().setImage({ src: data.url }).run()
      toast.success("Görsel eklendi")
    } catch {
      toast.error("Yükleme başarısız")
    } finally {
      if (imageInputRef.current) imageInputRef.current.value = ""
    }
  }, [editor])

  const addLink = useCallback(() => {
    const url = window.prompt("Link URL:")
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }, [editor])

  if (!editor) return null

  return (
    <div className="rounded-md border">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-0.5 border-b bg-muted/30 p-1.5">
        {/* Font size */}
        <select
          title="Yazı Boyutu"
          className="h-8 rounded border border-input bg-background px-1.5 text-xs focus:outline-none"
          value={editor.getAttributes("textStyle").fontSize ?? ""}
          onChange={(e) => {
            const val = e.target.value
            const chain = editor.chain().focus() as unknown as Record<string, (...a: unknown[]) => { run: () => void }>
            if (val) {
              chain.setFontSize(val).run()
            } else {
              chain.unsetFontSize().run()
            }
          }}
        >
          <option value="">Boyut</option>
          {FONT_SIZES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <div className="mx-1 w-px bg-border" />

        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Kalın">
          <Bold className="size-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="İtalik">
          <Italic className="size-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Altı Çizili">
          <UnderlineIcon className="size-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Üstü Çizili">
          <Strikethrough className="size-4" />
        </ToolbarButton>

        <div className="mx-1 w-px bg-border" />

        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })} title="Başlık 1">
          <Heading1 className="size-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="Başlık 2">
          <Heading2 className="size-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="Başlık 3">
          <Heading3 className="size-4" />
        </ToolbarButton>

        <div className="mx-1 w-px bg-border" />

        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Madde Listesi">
          <List className="size-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Numaralı Liste">
          <ListOrdered className="size-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Alıntı">
          <Quote className="size-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")} title="Kod Bloğu">
          <Code className="size-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Ayırıcı">
          <Minus className="size-4" />
        </ToolbarButton>

        <div className="mx-1 w-px bg-border" />

        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} title="Sola Hizala">
          <AlignLeft className="size-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} title="Ortala">
          <AlignCenter className="size-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} title="Sağa Hizala">
          <AlignRight className="size-4" />
        </ToolbarButton>

        <div className="mx-1 w-px bg-border" />

        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        <ToolbarButton onClick={() => imageInputRef.current?.click()} title="Görsel Yükle">
          <ImageIcon className="size-4" />
        </ToolbarButton>
        <ToolbarButton onClick={addLink} active={editor.isActive("link")} title="Link Ekle">
          <Link2 className="size-4" />
        </ToolbarButton>

        <div className="mx-1 w-px bg-border" />

        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Geri Al">
          <Undo className="size-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="İleri Al">
          <Redo className="size-4" />
        </ToolbarButton>
      </div>

      {/* Editor */}
      <div className="tiptap-content">
        <EditorContent editor={editor} />
      </div>

      <style jsx global>{`
        .tiptap-content .tiptap {
          min-height: 300px;
          padding: 1rem;
          outline: none;
        }
        .tiptap-content .tiptap > * + * {
          margin-top: 0.75em;
        }
        .tiptap-content .tiptap h1 { font-size: 1.75rem; font-weight: 700; margin-top: 1.5em; }
        .tiptap-content .tiptap h2 { font-size: 1.375rem; font-weight: 700; margin-top: 1.25em; }
        .tiptap-content .tiptap h3 { font-size: 1.125rem; font-weight: 600; margin-top: 1em; }
        .tiptap-content .tiptap p { line-height: 1.7; }
        .tiptap-content .tiptap ul { list-style: disc; padding-left: 1.5em; }
        .tiptap-content .tiptap ol { list-style: decimal; padding-left: 1.5em; }
        .tiptap-content .tiptap li { margin-top: 0.25em; }
        .tiptap-content .tiptap blockquote {
          border-left: 3px solid hsl(var(--border));
          padding-left: 1em;
          color: hsl(var(--muted-foreground));
          font-style: italic;
        }
        .tiptap-content .tiptap code {
          background: hsl(var(--muted));
          padding: 0.15em 0.4em;
          border-radius: 0.25em;
          font-size: 0.9em;
        }
        .tiptap-content .tiptap pre {
          background: hsl(var(--muted));
          padding: 1em;
          border-radius: 0.5em;
          overflow-x: auto;
        }
        .tiptap-content .tiptap img {
          max-width: 100%;
          border-radius: 0.5em;
        }
        .tiptap-content .tiptap hr {
          border-color: hsl(var(--border));
          margin: 1.5em 0;
        }
        .tiptap-content .tiptap a {
          color: hsl(var(--primary));
          text-decoration: underline;
        }
        .tiptap-content .tiptap strong { font-weight: 700; }
        .tiptap-content .tiptap em { font-style: italic; }
        .tiptap-content .tiptap span[style*="font-size"] { line-height: 1.3; }
        .tiptap-content .tiptap p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: hsl(var(--muted-foreground));
          pointer-events: none;
          height: 0;
        }
      `}</style>
    </div>
  )
}

function ToolbarButton({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void
  active?: boolean
  title: string
  children: React.ReactNode
}) {
  return (
    <Button
      type="button"
      variant={active ? "secondary" : "ghost"}
      size="icon"
      className="size-8"
      onClick={onClick}
      title={title}
    >
      {children}
    </Button>
  )
}
