"use client";

import { useState, useRef, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Image as ImageIcon,
  Quote,
  Code as CodeIcon,
  Table as TableIcon,
  Minus,
  Undo,
  Redo,
  UploadCloud,
  X,
  Loader2,
  Maximize2,
  Minimize2,
  Layout,
  Palette,
  ChevronDown,
  Check,
} from "lucide-react";
import { apiRequest } from "@/config/api";

export default function BlogWysiwygEditor({
  value = "",
  onChange,
  placeholder = "Write your blog article or paste HTML code here...",
  dir = "ltr",
}) {
  const [mode, setMode] = useState("visual"); // 'visual' | 'code'
  const [htmlCode, setHtmlCode] = useState(value || "");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Custom Dropdowns State
  const [isHeadingDropdownOpen, setIsHeadingDropdownOpen] = useState(false);
  const [currentBlockName, setCurrentBlockName] = useState("Paragraph");
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  // Link Modal
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [linkOpenNewTab, setLinkOpenNewTab] = useState(true);

  // Image Modal
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageCaption, setImageCaption] = useState("");
  const [imageAlign, setImageAlign] = useState("center"); // 'left' | 'center' | 'right'
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Saved Selection Range for Modals
  const savedSelectionRef = useRef(null);
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const headingDropdownRef = useRef(null);
  const colorPickerRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (headingDropdownRef.current && !headingDropdownRef.current.contains(e.target)) {
        setIsHeadingDropdownOpen(false);
      }
      if (colorPickerRef.current && !colorPickerRef.current.contains(e.target)) {
        setIsColorPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync external value to local state
  useEffect(() => {
    if (value !== htmlCode) {
      setHtmlCode(value || "");
      if (editorRef.current && mode === "visual" && editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || "";
      }
    }
  }, [value, mode]);

  // Keep visual editor updated when switched from code mode
  useEffect(() => {
    if (mode === "visual" && editorRef.current) {
      if (editorRef.current.innerHTML !== htmlCode) {
        editorRef.current.innerHTML = htmlCode || "";
      }
    }
  }, [mode, htmlCode]);

  // Save selection before opening modal
  const saveSelection = () => {
    if (window.getSelection) {
      const sel = window.getSelection();
      if (sel.getRangeAt && sel.rangeCount) {
        savedSelectionRef.current = sel.getRangeAt(0);
      }
    }
  };

  // Restore selection after modal action
  const restoreSelection = () => {
    if (savedSelectionRef.current && window.getSelection) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(savedSelectionRef.current);
    }
  };

  // Execute formatting command in Visual Mode
  const execCmd = (command, valueArg = null) => {
    if (mode !== "visual") {
      setMode("visual");
      setTimeout(() => {
        document.execCommand(command, false, valueArg);
        updateContent();
      }, 50);
      return;
    }
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(command, false, valueArg);
    updateContent();
  };

  // Helper to update parent state
  const updateContent = () => {
    if (editorRef.current) {
      const newHtml = editorRef.current.innerHTML;
      setHtmlCode(newHtml);
      onChange?.(newHtml);
    }
  };

  // Handle Input in Visual ContentEditable
  const handleVisualInput = () => {
    updateContent();
  };

  // Handle HTML Code Mode typing
  const handleCodeChange = (e) => {
    const newHtml = e.target.value;
    setHtmlCode(newHtml);
    onChange?.(newHtml);
  };

  // Toggle Mode (Visual <-> Code)
  const toggleMode = () => {
    if (mode === "visual") {
      if (editorRef.current) {
        const currentHtml = editorRef.current.innerHTML;
        setHtmlCode(currentHtml);
      }
      setMode("code");
    } else {
      setMode("visual");
    }
  };

  // Handle Heading / Block Format Change
  const handleBlockFormat = (tag, displayName) => {
    setCurrentBlockName(displayName);
    setIsHeadingDropdownOpen(false);

    if (tag === "blockquote") {
      execCmd("formatBlock", "blockquote");
    } else if (tag === "pre") {
      execCmd("formatBlock", "pre");
    } else {
      execCmd("formatBlock", tag);
    }
  };

  // Text Color Change
  const handleTextColor = (color) => {
    execCmd("foreColor", color);
    setIsColorPickerOpen(false);
  };

  // Open Link Modal
  const openLinkModal = () => {
    saveSelection();
    if (window.getSelection) {
      const selectedText = window.getSelection().toString();
      setLinkText(selectedText);
    }
    setIsLinkModalOpen(true);
  };

  // Insert Link
  const handleInsertLink = () => {
    if (!linkUrl) return;
    restoreSelection();
    const formattedUrl =
      linkUrl.startsWith("http://") || linkUrl.startsWith("https://") || linkUrl.startsWith("mailto:")
        ? linkUrl
        : `https://${linkUrl}`;

    const targetAttr = linkOpenNewTab ? 'target="_blank" rel="noopener noreferrer"' : "";
    const textToDisplay = linkText.trim() || linkUrl;

    if (mode === "visual") {
      const linkHtml = `<a href="${formattedUrl}" ${targetAttr} class="text-[#c4842f] font-semibold underline hover:text-[#9e661f] transition-colors">${textToDisplay}</a>`;
      execCmd("insertHTML", linkHtml);
    } else {
      const linkTag = `<a href="${formattedUrl}" ${targetAttr}>${textToDisplay}</a>`;
      const updated = htmlCode + linkTag;
      setHtmlCode(updated);
      onChange?.(updated);
    }

    setLinkUrl("");
    setLinkText("");
    setIsLinkModalOpen(false);
  };

  // Open Image Modal
  const openImageModal = () => {
    saveSelection();
    setIsImageModalOpen(true);
  };

  // Insert Image (Cloudinary or Direct URL)
  const handleInsertImage = (urlToInsert, captionText = "", alignment = "center") => {
    if (!urlToInsert) return;
    restoreSelection();

    let alignClass = "my-6 w-full";
    if (alignment === "left") alignClass = "my-4 md:float-left md:mr-6 md:max-w-md w-full";
    if (alignment === "right") alignClass = "my-4 md:float-right md:ml-6 md:max-w-md w-full";

    const imgHtml = `
      <figure class="${alignClass} clear-both">
        <img src="${urlToInsert}" alt="${captionText || 'Article image'}" class="w-full rounded-2xl object-cover shadow-md max-h-[520px]" />
        ${captionText ? `<figcaption class="text-xs text-gray-500 text-center mt-2 font-medium italic">${captionText}</figcaption>` : ''}
      </figure>
    `;

    if (mode === "visual") {
      execCmd("insertHTML", imgHtml);
    } else {
      const updated = htmlCode + "\n" + imgHtml;
      setHtmlCode(updated);
      onChange?.(updated);
    }

    setImageUrl("");
    setImageCaption("");
    setIsImageModalOpen(false);
  };

  // Handle Cloudinary Image File Upload
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxBytes = 15 * 1024 * 1024;
    if (file.size > maxBytes) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      alert(`Image file is too large (${sizeMB} MB). Please select an image under 15MB (Recommended: WebP, JPG, PNG).`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    if (!file.type.startsWith("image/")) {
      alert(`Invalid file format (${file.type}). Please upload a valid image (JPG, PNG, WebP, AVIF).`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "leela-gulf/blogs");

      const res = await apiRequest("/upload/single", {
        method: "POST",
        body: formData,
      });

      const uploadedUrl = res?.data?.url || res?.url;
      if (res?.success && uploadedUrl) {
        handleInsertImage(uploadedUrl, imageCaption || file.name.replace(/\.[^/.]+$/, ""), imageAlign);
      } else {
        alert(res?.message || "Image upload failed. Please try again.");
      }
    } catch (err) {
      console.error("Image upload error:", err);
      alert("Image upload failed: " + (err.message || "Network error"));
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Insert Table
  const handleInsertTable = () => {
    const tableHtml = `
      <div class="overflow-x-auto my-6 rounded-xl border border-gray-200">
        <table class="min-w-full border-collapse text-left text-sm">
          <thead>
            <tr class="bg-gray-100/80 border-b border-gray-200">
              <th class="px-4 py-3 font-bold text-gray-900 border-r border-gray-200">Feature / Specification</th>
              <th class="px-4 py-3 font-bold text-gray-900 border-r border-gray-200">Standard Value</th>
              <th class="px-4 py-3 font-bold text-gray-900">Compliance Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr>
              <td class="px-4 py-3 text-gray-800 font-medium border-r border-gray-200">Purity Grade (%)</td>
              <td class="px-4 py-3 text-gray-600 border-r border-gray-200">99.8% USP Standard</td>
              <td class="px-4 py-3 text-emerald-700 font-semibold">Certified</td>
            </tr>
            <tr class="bg-gray-50/50">
              <td class="px-4 py-3 text-gray-800 font-medium border-r border-gray-200">Packaging Type</td>
              <td class="px-4 py-3 text-gray-600 border-r border-gray-200">200L Steel Drum / ISO Tank</td>
              <td class="px-4 py-3 text-emerald-700 font-semibold">Approved</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;

    if (mode === "visual") {
      execCmd("insertHTML", tableHtml);
    } else {
      const updated = htmlCode + "\n" + tableHtml;
      setHtmlCode(updated);
      onChange?.(updated);
    }
  };

  // Insert Callout Box (Focus Areas / Highlight Banner)
  const handleInsertCallout = () => {
    const calloutHtml = `
      <div class="my-6 p-5 rounded-2xl bg-[#faf6ee] border-l-4 border-[#c4842f] shadow-xs space-y-1.5">
        <h4 class="text-sm font-bold text-gray-900 flex items-center gap-1.5">
          <span>⚡ Focus Areas / Key Highlights:</span>
        </h4>
        <p class="text-xs sm:text-sm text-gray-700 leading-relaxed">
          Summarize critical insights, regulatory requirements, or strategic milestones for your organization here.
        </p>
      </div>
    `;

    if (mode === "visual") {
      execCmd("insertHTML", calloutHtml);
    } else {
      const updated = htmlCode + "\n" + calloutHtml;
      setHtmlCode(updated);
      onChange?.(updated);
    }
  };

  // Word and character count stats
  const cleanText = (htmlCode || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const wordCount = cleanText ? cleanText.split(" ").length : 0;
  const charCount = cleanText ? cleanText.length : 0;

  return (
    <div
      className={`border border-gray-200/90 rounded-2xl bg-white shadow-2xs transition-all flex flex-col relative overflow-visible ${
        isFullscreen ? "fixed inset-3 z-50 shadow-2xl border-gold-main" : "z-10"
      }`}
    >
      {/* ══════════════════════════════════════════════════════════════════
          2-ROW CLEAN COMPACT TOOLBAR (Floats freely, No Clipping)
          ══════════════════════════════════════════════════════════════════ */}
      <div className="bg-[#faf9f6] border-b border-gray-200 px-3 py-1.5 space-y-1.5 select-none rounded-t-2xl relative z-30 overflow-visible">
        {/* ── ROW 1: TEXT FORMATTING & STYLING ── */}
        <div className="flex items-center justify-between gap-2">
          {/* Left Controls: Format Dropdown, B, I, U, S, Palette, Lists, Alignments */}
          <div className="flex items-center gap-1">
            {/* Custom Theme Formatter Dropdown */}
            <div className="relative shrink-0" ref={headingDropdownRef}>
              <button
                type="button"
                onClick={() => setIsHeadingDropdownOpen(!isHeadingDropdownOpen)}
                className="h-7 px-2.5 bg-white border border-gray-200 hover:border-gold-main text-gray-900 font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer transition-all"
              >
                <span>{currentBlockName}</span>
                <ChevronDown className={`w-3 h-3 text-gray-500 transition-transform ${isHeadingDropdownOpen ? "rotate-180 text-gold-dark" : ""}`} />
              </button>

              {isHeadingDropdownOpen && (
                <div className="absolute top-full left-0 mt-1.5 w-48 bg-white border border-gold-main/40 rounded-2xl p-1.5 shadow-2xl z-50 animate-[fadeIn_0.1s_ease-out] space-y-0.5">
                  {[
                    { tag: "p", name: "Paragraph" },
                    { tag: "h2", name: "Heading 2 (H2)" },
                    { tag: "h3", name: "Heading 3 (H3)" },
                    { tag: "h4", name: "Heading 4 (H4)" },
                    { tag: "blockquote", name: "Quote Callout" },
                    { tag: "pre", name: "Code Snippet" },
                  ].map((item) => (
                    <button
                      key={item.tag}
                      type="button"
                      onClick={() => handleBlockFormat(item.tag, item.name)}
                      className={`w-full px-3 py-1.5 text-left rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                        currentBlockName === item.name
                          ? "bg-[#faf6ee] text-gold-dark font-extrabold"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      <span>{item.name}</span>
                      {currentBlockName === item.name && <Check className="w-3.5 h-3.5 text-gold-dark" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="h-4 w-px bg-gray-300 mx-0.5 shrink-0" />

            {/* Basic Text Formats: Bold, Italic, Underline, Strike */}
            <div className="flex items-center bg-white border border-gray-200 rounded-lg p-0.5 shadow-2xs shrink-0">
              <button
                type="button"
                onClick={() => execCmd("bold")}
                className="w-6 h-6 flex items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 hover:text-black transition-colors cursor-pointer"
                title="Bold (Ctrl+B)"
              >
                <Bold className="w-3 h-3 stroke-[2.5]" />
              </button>
              <button
                type="button"
                onClick={() => execCmd("italic")}
                className="w-6 h-6 flex items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 hover:text-black transition-colors cursor-pointer"
                title="Italic (Ctrl+I)"
              >
                <Italic className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => execCmd("underline")}
                className="w-6 h-6 flex items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 hover:text-black transition-colors cursor-pointer"
                title="Underline (Ctrl+U)"
              >
                <Underline className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => execCmd("strikeThrough")}
                className="w-6 h-6 flex items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 hover:text-black transition-colors cursor-pointer"
                title="Strikethrough"
              >
                <Strikethrough className="w-3 h-3" />
              </button>
            </div>

            {/* Custom Theme Color Picker Dropdown */}
            <div className="relative shrink-0" ref={colorPickerRef}>
              <button
                type="button"
                onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-gray-200 hover:border-gold-main text-gray-700 shadow-2xs transition-colors cursor-pointer"
                title="Text Color"
              >
                <Palette className="w-3.5 h-3.5 text-gold-dark" />
              </button>

              {isColorPickerOpen && (
                <div className="absolute top-full left-0 mt-1.5 bg-white border border-gold-main/40 rounded-2xl p-2 shadow-2xl z-50 flex items-center gap-1.5 animate-[fadeIn_0.1s_ease-out]">
                  {[
                    { color: "#111827", label: "Black" },
                    { color: "#c4842f", label: "Gold Brand" },
                    { color: "#dc2626", label: "Red" },
                    { color: "#16a34a", label: "Green" },
                    { color: "#2563eb", label: "Blue" },
                    { color: "#4b5563", label: "Gray" },
                  ].map((c) => (
                    <button
                      key={c.color}
                      type="button"
                      onClick={() => handleTextColor(c.color)}
                      className="w-5 h-5 rounded-full border border-gray-300 hover:scale-115 transition-transform shadow-2xs cursor-pointer"
                      style={{ backgroundColor: c.color }}
                      title={c.label}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="h-4 w-px bg-gray-300 mx-0.5 shrink-0" />

            {/* Lists: Bullets, Numbers */}
            <div className="flex items-center bg-white border border-gray-200 rounded-lg p-0.5 shadow-2xs shrink-0">
              <button
                type="button"
                onClick={() => execCmd("insertUnorderedList")}
                className="w-6 h-6 flex items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 hover:text-black transition-colors cursor-pointer"
                title="Bullet List"
              >
                <List className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => execCmd("insertOrderedList")}
                className="w-6 h-6 flex items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 hover:text-black transition-colors cursor-pointer"
                title="Numbered List"
              >
                <ListOrdered className="w-3 h-3" />
              </button>
            </div>

            {/* Alignments */}
            <div className="flex items-center bg-white border border-gray-200 rounded-lg p-0.5 shadow-2xs shrink-0">
              <button
                type="button"
                onClick={() => execCmd("justifyLeft")}
                className="w-6 h-6 flex items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 hover:text-black transition-colors cursor-pointer"
                title="Align Left"
              >
                <AlignLeft className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => execCmd("justifyCenter")}
                className="w-6 h-6 flex items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 hover:text-black transition-colors cursor-pointer"
                title="Align Center"
              >
                <AlignCenter className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => execCmd("justifyRight")}
                className="w-6 h-6 flex items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 hover:text-black transition-colors cursor-pointer"
                title="Align Right"
              >
                <AlignRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Undo / Redo */}
          <div className="flex items-center bg-white border border-gray-200 rounded-lg p-0.5 shadow-2xs shrink-0">
            <button
              type="button"
              onClick={() => execCmd("undo")}
              className="w-6 h-6 flex items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 hover:text-black transition-colors cursor-pointer"
              title="Undo (Ctrl+Z)"
            >
              <Undo className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => execCmd("redo")}
              className="w-6 h-6 flex items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 hover:text-black transition-colors cursor-pointer"
              title="Redo (Ctrl+Y)"
            >
              <Redo className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* ── ROW 2: INSERTS, CALLOUTS & MODE SWITCHER (Strictly Single Line) ── */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-gray-200/70">
          {/* Left Inserts: Link, Image, Table, Callout Box, Divider */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={openLinkModal}
              className="h-7 px-2.5 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gold-main rounded-lg text-xs font-bold text-gray-700 flex items-center gap-1 shadow-2xs transition-colors cursor-pointer shrink-0"
              title="Insert Hyperlink"
            >
              <LinkIcon className="w-3 h-3 text-gold-dark" />
              <span>Link</span>
            </button>

            <button
              type="button"
              onClick={openImageModal}
              className="h-7 px-2.5 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gold-main rounded-lg text-xs font-bold text-gray-700 flex items-center gap-1 shadow-2xs transition-colors cursor-pointer shrink-0"
              title="Upload / Insert Image"
            >
              <ImageIcon className="w-3 h-3 text-gold-dark" />
              <span>Image</span>
            </button>

            <button
              type="button"
              onClick={handleInsertTable}
              className="h-7 px-2.5 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gold-main rounded-lg text-xs font-bold text-gray-700 flex items-center gap-1 shadow-2xs transition-colors cursor-pointer shrink-0"
              title="Insert Responsive Table"
            >
              <TableIcon className="w-3 h-3 text-gold-dark" />
              <span>Table</span>
            </button>

            <button
              type="button"
              onClick={handleInsertCallout}
              className="h-7 px-2.5 bg-[#faf6ee] hover:bg-gold-main/20 border border-gold-main/40 rounded-lg text-xs font-extrabold text-gold-dark flex items-center gap-1 shadow-2xs transition-colors cursor-pointer shrink-0"
              title="Insert Highlight Focus Area Callout"
            >
              <Layout className="w-3 h-3" />
              <span>Callout</span>
            </button>

            <button
              type="button"
              onClick={() => execCmd("insertHorizontalRule")}
              className="h-7 px-2 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gold-main rounded-lg text-xs font-bold text-gray-700 flex items-center gap-1 shadow-2xs transition-colors cursor-pointer shrink-0"
              title="Insert Horizontal Divider"
            >
              <Minus className="w-3 h-3 text-gray-500" />
              <span>Line</span>
            </button>
          </div>

          {/* Right Mode Toggle: Shopify-like Visual vs HTML Code Mode + Fullscreen */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={toggleMode}
              className={`h-7 px-2.5 rounded-lg text-xs font-heading font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs shrink-0 ${
                mode === "code"
                  ? "bg-black text-gold-main ring-1 ring-gold-main/60 font-black"
                  : "bg-white text-gray-800 hover:text-black border border-gray-200 hover:border-gold-main font-bold"
              }`}
              title="Toggle HTML Source Code View"
            >
              <CodeIcon className="w-3 h-3" />
              <span>{mode === "code" ? "Visual View" : "HTML Code"}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-gray-200 hover:border-gold-main text-gray-600 hover:text-black shadow-2xs transition-colors cursor-pointer shrink-0"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          MAIN EDITOR CANVAS: VISUAL WYSIWYG vs HTML CODE SOURCE
          ══════════════════════════════════════════════════════════════════ */}
      <div className="relative flex-1 min-h-[380px] bg-white rounded-b-2xl">
        {mode === "visual" ? (
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleVisualInput}
            onBlur={handleVisualInput}
            dir={dir}
            data-placeholder={placeholder}
            className="wysiwyg-content-area w-full min-h-[380px] p-6 sm:p-8 text-gray-800 focus:outline-none font-subheading leading-relaxed overflow-y-auto text-sm sm:text-base [scrollbar-width:thin]"
            style={{
              maxHeight: isFullscreen ? "calc(100vh - 160px)" : "600px",
            }}
          />
        ) : (
          <textarea
            value={htmlCode}
            onChange={handleCodeChange}
            placeholder="<p>Paste or write clean HTML code here...</p>"
            dir="ltr"
            className="w-full min-h-[380px] p-6 font-mono text-xs sm:text-sm text-gray-800 bg-[#fafafa] focus:outline-none focus:bg-white resize-none leading-relaxed border-none [scrollbar-width:thin]"
            style={{
              maxHeight: isFullscreen ? "calc(100vh - 160px)" : "600px",
            }}
          />
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          FOOTER STATUS BAR
          ══════════════════════════════════════════════════════════════════ */}
      <div className="bg-[#faf9f6] border-t border-gray-200 px-4 py-2 flex items-center justify-between text-[11px] font-medium text-gray-500 select-none rounded-b-2xl">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                mode === "visual" ? "bg-emerald-500" : "bg-amber-500"
              }`}
            />
            <span className="font-bold text-gray-700 uppercase tracking-wider">
              {mode === "visual" ? "Visual WYSIWYG" : "HTML Source Code"}
            </span>
          </span>
          <span>•</span>
          <span>Direction: <strong className="text-gray-700">{dir.toUpperCase()}</strong></span>
        </div>

        <div className="flex items-center gap-2.5">
          <span>Words: <strong className="text-gray-900 font-bold">{wordCount}</strong></span>
          <span>•</span>
          <span>Characters: <strong className="text-gray-900 font-bold">{charCount}</strong></span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          INSERT LINK MODAL DIALOG
          ══════════════════════════════════════════════════════════════════ */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-2xs animate-[fadeIn_0.15s_ease-out]">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gold-main/30 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-gold-dark" />
                <h3 className="font-heading font-extrabold text-sm text-gray-900">
                  Insert Hyperlink
                </h3>
              </div>
              <button
                onClick={() => setIsLinkModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Destination URL *
                </label>
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:border-gold-main"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Anchor Text (Optional)
                </label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="e.g. Read full technical datasheet"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:border-gold-main"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={linkOpenNewTab}
                  onChange={(e) => setLinkOpenNewTab(e.target.checked)}
                  className="accent-[#c4842f] rounded"
                />
                <span className="text-xs font-medium text-gray-700">Open link in a new tab</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsLinkModalOpen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-bold text-gray-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInsertLink}
                className="px-4 py-2 bg-black hover:bg-gray-800 text-gold-main rounded-xl text-xs font-bold cursor-pointer"
              >
                Insert Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          INSERT IMAGE MODAL DIALOG (Custom Theme Segmented UI)
          ══════════════════════════════════════════════════════════════════ */}
      {isImageModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-2xs animate-[fadeIn_0.15s_ease-out]">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gold-main/30 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-gold-dark" />
                <h3 className="font-heading font-extrabold text-sm text-gray-900">
                  Insert Image into Article
                </h3>
              </div>
              <button
                onClick={() => setIsImageModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Cloudinary Upload Option */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1.5">
                Upload from Computer / Device
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="wysiwyg-file-upload-dialog"
              />
              <label
                htmlFor="wysiwyg-file-upload-dialog"
                className={`w-full border-2 border-dashed border-gray-200 hover:border-gold-main rounded-2xl p-4 flex flex-col items-center justify-center gap-1 cursor-pointer bg-gray-50 hover:bg-[#faf6ee]/60 transition-colors ${
                  isUploadingImage ? "pointer-events-none opacity-60" : ""
                }`}
              >
                {isUploadingImage ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-gold-dark" />
                    <span className="text-xs text-gray-600 font-bold">Uploading to Cloudinary...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-6 h-6 text-gold-dark" />
                    <span className="text-xs font-bold text-gray-800">Click to Browse & Upload Image</span>
                    <span className="text-[10px] text-gray-400">JPG, PNG, WebP up to 10MB</span>
                  </>
                )}
              </label>
            </div>

            <div className="flex items-center gap-2 my-1">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-[10px] font-bold text-gray-400 uppercase">Or image web url</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            {/* Image URL Input */}
            <div>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:border-gold-main"
              />
            </div>

            {/* Caption & Custom Theme Alignment Selector */}
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">
                  Caption (Optional)
                </label>
                <input
                  type="text"
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  placeholder="e.g. Chemical Storage Facility"
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-gold-main"
                />
              </div>

              {/* Custom Theme Alignment (Segmented Pills instead of native dropdown) */}
              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1.5">
                  Image Alignment
                </label>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-gray-100 rounded-xl">
                  {[
                    { id: "center", label: "Center (Full)" },
                    { id: "left", label: "Left Wrap" },
                    { id: "right", label: "Right Wrap" },
                  ].map((align) => (
                    <button
                      key={align.id}
                      type="button"
                      onClick={() => setImageAlign(align.id)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                        imageAlign === align.id
                          ? "bg-white text-gold-dark shadow-xs font-extrabold border border-gold-main/30"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      {align.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsImageModalOpen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-bold text-gray-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleInsertImage(imageUrl, imageCaption, imageAlign)}
                disabled={!imageUrl}
                className="px-4 py-2 bg-black hover:bg-gray-800 text-gold-main rounded-xl text-xs font-bold disabled:opacity-40 cursor-pointer"
              >
                Insert Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
