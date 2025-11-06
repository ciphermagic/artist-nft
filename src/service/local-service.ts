import type { Scratch } from './types.ts';

export const getArticle = async (title: string) => {
  const aid = 'article-' + title;
  return localStorage.getItem(aid);
};

export const saveArticle = async (title: string, content: string) => {
  const aid = 'article-' + title;
  localStorage.setItem(aid, content);
};

export const removeArticle = async (title: string) => {
  const aid = 'article-' + title;
  localStorage.removeItem(aid);
  return articles();
};

export const articles = async () => {
  const result: Scratch[] = [];
  const keys = Object.keys(localStorage).filter(key => key.startsWith('article'));
  keys.forEach((key, index) => {
    const title = key.split('-')[1] ?? 'Untitled';
    const content = localStorage.getItem(key) ?? '';
    const id = index + 1;
    result.push({ key: id, index: id, title, content });
  });
  return result;
};
