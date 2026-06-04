import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { Modal } from './Modal';

describe('Modal', () => {
  it('renders nothing when closed', () => {
    const html = renderToString(
      <Modal open={false} onClose={() => {}} title="Hi">
        <p>secret</p>
      </Modal>,
    );
    expect(html).toBe('');
  });

  it('renders a labelled dialog with its title, close affordance, and children when open', () => {
    const html = renderToString(
      <Modal open onClose={() => {}} title="Review this game">
        <iframe title="form" src="https://example.test/embed" />
      </Modal>,
    );
    expect(html).toContain('role="dialog"');
    expect(html).toContain('aria-modal="true"');
    expect(html).toContain('Review this game');
    expect(html).toContain('aria-label="Close"');
    expect(html).toContain('https://example.test/embed');
  });
});
