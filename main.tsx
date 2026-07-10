import { 
  Bold, 
  Italic, 
  Heading3, 
  Link as LinkIcon, 
  Quote, 
  Code, 
  List, 
  ListTodo, 
  Minus,
  HelpCircle
} from "lucide-react";

interface MarkdownToolbarProps {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  value: string;
  onChange: (val: string) => void;
}

export function MarkdownToolbar({ textareaRef, value, onChange }: MarkdownToolbarProps) {
  
  const handleInsert = (syntaxType: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    let replacement = "";
    let cursorOffsetStart = 0;
    let cursorOffsetEnd = 0;

    switch (syntaxType) {
      case "bold":
        replacement = `**${selectedText || "bold text"}**`;
        cursorOffsetStart = 2;
        cursorOffsetEnd = replacement.length - 2;
        break;
      case "italic":
        replacement = `*${selectedText || "italic text"}*`;
        cursorOffsetStart = 1;
        cursorOffsetEnd = replacement.length - 1;
        break;
      case "heading":
        replacement = `\n### ${selectedText || "Heading"}\n`;
        cursorOffsetStart = 5;
        cursorOffsetEnd = replacement.length - 1;
        break;
      case "link":
        replacement = `[${selectedText || "link text"}](https://example.com)`;
        cursorOffsetStart = 1;
        cursorOffsetEnd = (selectedText || "link text").length + 1;
        break;
      case "quote":
        replacement = `\n> ${selectedText || "Blockquote"}\n`;
        cursorOffsetStart = 3;
        cursorOffsetEnd = replacement.length - 1;
        break;
      case "code":
        replacement = `\n\`\`\`javascript\n${selectedText || "// code block"}\n\`\`\`\n`;
        cursorOffsetStart = 15;
        cursorOffsetEnd = replacement.length - 5;
        break;
      case "bullet":
        replacement = `\n* ${selectedText || "List item"}\n`;
        cursorOffsetStart = 3;
        cursorOffsetEnd = replacement.length - 1;
        break;
      case "task":
        replacement = `\n- [ ] ${selectedText || "Task item"}\n`;
        cursorOffsetStart = 7;
        cursorOffsetEnd = replacement.length - 1;
        break;
      case "rule":
        replacement = `\n---\n`;
        cursorOffsetStart = replacement.length;
        cursorOffsetEnd = replacement.length;
        break;
      default:
        return;
    }

    const newValue = value.substring(0, start) + replacement + value.substring(end);
    onChange(newValue);

    // Re-focus and set selection range after React updates state
    setTimeout(() => {
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(start + cursorOffsetStart, start + cursorOffsetEnd);
      }
    }, 50);
  };

  const buttons = [
    { type: "bold", icon: Bold, label: "Bold text", tooltip: "Bold (**)" },
    { type: "italic", icon: Italic, label: "Italic text", tooltip: "Italic (*)" },
    { type: "heading", icon: Heading3, label: "Heading", tooltip: "Header (###)" },
    { type: "link", icon: LinkIcon, label: "Link", tooltip: "Link [text](url)" },
    { type: "quote", icon: Quote, label: "Blockquote", tooltip: "Quote (>)" },
    { type: "code", icon: Code, label: "Code block", tooltip: "Code block (```)" },
    { type: "bullet", icon: List, label: "Bullet list", tooltip: "List (*)" },
    { type: "task", icon: ListTodo, label: "Task list", tooltip: "Tasks (- [ ])" },
    { type: "rule", icon: Minus, label: "Horizontal rule", tooltip: "Divider (---)" },
  ];

  return (
    <div id="markdown-editor-toolbar" className="flex items-center justify-between border-b border-[#2a2a2a] bg-[#181818] px-4 py-2">
      <div className="flex flex-wrap gap-1">
        {buttons.map((btn) => (
          <button
            key={btn.type}
            type="button"
            onClick={() => handleInsert(btn.type)}
            className="group relative rounded-md p-1.5 text-slate-400 hover:bg-[#252525] hover:text-white transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            title={btn.tooltip}
            id={`toolbar-btn-${btn.type}`}
          >
            <btn.icon className="h-4 w-4" />
            <span className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded border border-[#333] bg-[#252525] px-2 py-1 text-xs text-slate-200 opacity-0 shadow-sm transition-opacity duration-150 group-hover:opacity-100">
              {btn.tooltip}
            </span>
          </button>
        ))}
      </div>

      <div className="flex items-center text-xs text-slate-500 gap-1 select-none">
        <HelpCircle className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Markdown active</span>
      </div>
    </div>
  );
}
