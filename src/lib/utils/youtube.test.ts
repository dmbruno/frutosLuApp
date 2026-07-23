import { describe, it, expect } from 'vitest';
import { extractYoutubeId, getYoutubeEmbedUrl, getYoutubeThumbnailUrl } from './youtube';

describe('extractYoutubeId', () => {
  it('extrae el id de una URL watch?v=', () => {
    expect(extractYoutubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });

  it('extrae el id de una URL corta youtu.be', () => {
    expect(extractYoutubeId('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });

  it('extrae el id de una URL ya en formato embed', () => {
    expect(extractYoutubeId('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });

  it('extrae el id conservando parámetros extra como &t=10s', () => {
    expect(extractYoutubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=10s')).toBe('dQw4w9WgXcQ');
  });

  it('devuelve null para URLs que no son de YouTube', () => {
    expect(extractYoutubeId('https://instagram.com/p/abc123')).toBeNull();
  });
});

describe('getYoutubeEmbedUrl', () => {
  it('arma la URL de embed a partir de un link normal', () => {
    expect(getYoutubeEmbedUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(
      'https://www.youtube.com/embed/dQw4w9WgXcQ',
    );
  });

  it('devuelve null si no matchea', () => {
    expect(getYoutubeEmbedUrl('https://instagram.com/p/abc123')).toBeNull();
  });
});

describe('getYoutubeThumbnailUrl', () => {
  it('arma la URL del thumbnail', () => {
    expect(getYoutubeThumbnailUrl('https://youtu.be/dQw4w9WgXcQ')).toBe(
      'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    );
  });

  it('devuelve null si no matchea', () => {
    expect(getYoutubeThumbnailUrl('https://instagram.com/p/abc123')).toBeNull();
  });
});
