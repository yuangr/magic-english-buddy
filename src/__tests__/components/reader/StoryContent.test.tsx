import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../utils/render';
import { StoryContent } from '@/components/reader/StoryContent';
const paragraphs = ['Hello world', 'Second page'].map((text, index) => ({
  paragraphId: String(index), text, translation: '', audioStart: 0, audioEnd: 1,
  words: text.split(' ').map((word, i) => ({ word, start: 0, end: 1, index: i })),
}));
const props = { paragraphs, currentWordIndex: -1, currentParagraphIndex: 0, showTranslation: false };
describe('paragraph narration after upstream merge', () => {
  it('narrates only the requested paragraph from an accessible button', () => {
    const narrate = vi.fn();
    render(<StoryContent {...props} onParagraphClick={narrate} />);
    fireEvent.click(screen.getByRole('button', { name: '朗读第 2 段' }));
    expect(narrate).toHaveBeenCalledExactlyOnceWith(1, 'Second page');
  });
  it('keeps dictionary word clicks separate and preserves global word offsets', () => {
    const narrate = vi.fn(); const word = vi.fn();
    render(<StoryContent {...props} onParagraphClick={narrate} onWordClick={word} />);
    fireEvent.click(screen.getByText('Second'));
    expect(word).toHaveBeenCalledExactlyOnceWith('Second', 2, 1);
    expect(narrate).not.toHaveBeenCalled();
  });
  it('does not display narration controls for consumers without a handler', () => {
    render(<StoryContent {...props} />);
    expect(screen.queryByRole('button', { name: /朗读第/ })).not.toBeInTheDocument();
  });
});
