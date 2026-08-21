export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getExcerptFromContent(content: string, maxLen = 160): string {
  const plain = content
    .replace(/^#+\s+/gm, '')
    .replace(/[*_`~]/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\n+/g, ' ')
    .trim();
  if (plain.length <= maxLen) return plain;
  return plain.slice(0, maxLen - 1).trimEnd() + '…';
}

export function estimateReadTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function extractHeadings(content: string): { id: string; text: string; level: number }[] {
  const lines = content.split('\n');
  const headings: { id: string; text: string; level: number }[] = [];
  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.+)/);
    if (match) {
      const level = match[1].length;
      const text = match[2].replace(/[*_`~]/g, '').trim();
      const id = slugify(text);
      headings.push({ id, text, level });
    }
  }
  return headings;
}

export function extractKeyTakeaway(content: string): string {
  const lines = content.split('\n');
  let inTakeaway = false;
  let takeaway = '';

  for (const line of lines) {
    if (/^##\s+Key Takeaway/i.test(line) || /^##\s+Direct Answer/i.test(line) || /^##\s+TL;DR/i.test(line)) {
      inTakeaway = true;
      continue;
    }
    if (inTakeaway && /^##\s+/.test(line)) break;
    if (inTakeaway && line.trim()) {
      takeaway += line.replace(/[*_`~]/g, '').trim() + ' ';
    }
  }

  if (takeaway.trim()) {
    const cleaned = takeaway.trim();
    if (cleaned.length <= 300) return cleaned;
    const words = cleaned.split(/\s+/);
    return words.slice(0, 50).join(' ') + '…';
  }

  const plain = content
    .replace(/^#+\s+/gm, '')
    .replace(/[*_`~]/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\n+/g, ' ')
    .trim();

  const firstParagraph = plain.split(/(?<=[.!?])\s/)[0] || plain;
  if (firstParagraph.length <= 300) return firstParagraph;
  const words = firstParagraph.split(/\s+/);
  return words.slice(0, 50).join(' ') + '…';
}

export function extractFAQ(content: string): { question: string; answer: string }[] {
  const faqs: { question: string; answer: string }[] = [];
  const lines = content.split('\n');
  let inFAQ = false;
  let currentQ = '';
  let currentA = '';

  for (const line of lines) {
    if (/^##\s+FAQ/i.test(line) || /^##\s+Frequently Asked/i.test(line)) {
      inFAQ = true;
      continue;
    }
    if (inFAQ && /^###\s+/.test(line)) {
      if (currentQ && currentA) {
        faqs.push({ question: currentQ, answer: currentA.trim() });
      }
      currentQ = line.replace(/^###\s+/, '').replace(/[*_`~]/g, '').trim();
      currentA = '';
    } else if (inFAQ && currentQ && line.trim()) {
      currentA += line.replace(/[*_`~]/g, '').trim() + ' ';
    } else if (inFAQ && /^##\s+/.test(line) && !/^###\s+/.test(line)) {
      if (currentQ && currentA) {
        faqs.push({ question: currentQ, answer: currentA.trim() });
      }
      break;
    }
  }
  if (currentQ && currentA) {
    faqs.push({ question: currentQ, answer: currentA.trim() });
  }
  return faqs;
}
