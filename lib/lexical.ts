// Simplified Lexical ↔ HTML conversion for custom forms

export function lexicalToHtml(lexical: any): string {
  if (!lexical?.root?.children) return "";
  return lexical.root.children.map((node: any) => nodeToHtml(node)).join("");
}

function nodeToHtml(node: any): string {
  const children = (node.children || []).map((c: any) => nodeToHtml(c)).join("");
  switch (node.type) {
    case "text": {
      let t = escapeHtml(node.text || "");
      if (node.format & 1) t = `<strong>${t}</strong>`;
      if (node.format & 2) t = `<em>${t}</em>`;
      if (node.format & 8) t = `<u>${t}</u>`;
      return t;
    }
    case "paragraph": return `<p>${children || "<br>"}</p>`;
    case "heading": return `<${node.tag}>${children}</${node.tag}>`;
    case "list":
      return node.listType === "bullet" ? `<ul>${children}</ul>` : `<ol>${children}</ol>`;
    case "listitem": return `<li>${children}</li>`;
    case "link": return `<a href="${node.url || "#"}">${children}</a>`;
    case "linebreak": return "<br>";
    case "horizontalrule": return "<hr>";
    default: return children;
  }
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function htmlToLexical(html: string): any {
  if (!html || html === "<p></p>" || html === "<p><br></p>") {
    return emptyLexical();
  }

  // Parse HTML into DOM-like structure using regex (no DOM in Node)
  const blocks = parseHtmlBlocks(html);

  return {
    root: {
      type: "root",
      version: 1,
      direction: "ltr",
      format: "",
      indent: 0,
      children: blocks.length ? blocks : [makeParagraph("")],
    },
  };
}

function parseHtmlBlocks(html: string): any[] {
  const results: any[] = [];
  const blockRe = /<(p|h[1-6]|ul|ol|hr)[^>]*>([\s\S]*?)<\/\1>|<hr\s*\/?>/gi;
  let match;
  while ((match = blockRe.exec(html)) !== null) {
    const tag = (match[1] || "hr").toLowerCase();
    const inner = match[2] || "";
    if (tag === "hr") {
      results.push({ type: "horizontalrule", version: 1 });
    } else if (/^h[1-6]$/.test(tag)) {
      results.push({
        type: "heading", tag, version: 1, direction: "ltr", format: "", indent: 0,
        children: parseInline(inner),
      });
    } else if (tag === "ul" || tag === "ol") {
      const items: any[] = [];
      const liRe = /<li[^>]*>([\s\S]*?)<\/li>/gi;
      let li;
      while ((li = liRe.exec(inner)) !== null) {
        items.push({
          type: "listitem", version: 1, direction: "ltr", format: "", indent: 0, value: items.length + 1,
          children: parseInline(li[1]),
        });
      }
      results.push({
        type: "list", listType: tag === "ul" ? "bullet" : "number", version: 1, direction: "ltr", format: "", indent: 0, start: 1,
        children: items,
      });
    } else {
      results.push(makeParagraph(inner));
    }
  }
  return results;
}

function parseInline(html: string): any[] {
  const nodes: any[] = [];
  // Remove tags and extract text with basic format
  const text = html.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ");
  if (text) {
    nodes.push({ type: "text", version: 1, detail: 0, format: 0, mode: "normal", style: "", text });
  }
  if (!nodes.length) nodes.push({ type: "text", version: 1, detail: 0, format: 0, mode: "normal", style: "", text: "" });
  return nodes;
}

function makeParagraph(inner: string): any {
  return {
    type: "paragraph", version: 1, direction: "ltr", format: "", indent: 0,
    children: parseInline(inner),
  };
}

function emptyLexical() {
  return {
    root: {
      type: "root", version: 1, direction: null, format: "", indent: 0,
      children: [makeParagraph("")],
    },
  };
}
