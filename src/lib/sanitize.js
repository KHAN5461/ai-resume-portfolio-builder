import DOMPurify from 'dompurify';

/**
 * Sanitize untrusted HTML strings using DOMPurify
 * Permits only safe tags and attributes suitable for formatted resume descriptions
 */
export function sanitizeHtml(dirty) {
  if (!dirty || typeof dirty !== 'string') return '';
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'b', 'i', 'em', 'strong', 'u', 'p', 'br', 'ul', 'ol', 'li', 'span', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'style'],
    ALLOW_DATA_ATTR: false
  });
}

/**
 * Strip all HTML tags to produce pure text
 */
export function stripHtml(dirty) {
  if (!dirty || typeof dirty !== 'string') return '';
  return dirty.replace(/<[^>]*>?/gm, '').trim();
}
