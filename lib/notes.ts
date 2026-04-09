export interface NoteReference {
  type: 'post' | 'link';
  title: string;
  url: string;
  description?: string;
  image?: string;
}

export interface Note {
  id: string;
  author: string;
  content: string;
  reference?: NoteReference;
  date: string;
  likes: number;
  liked: boolean;
  comments: number;
  reposts: number;
}

const NOTES_STORAGE_KEY = 'sheepblog-notes';

export function getNotes(): Note[] {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem(NOTES_STORAGE_KEY);
  if (saved) {
    return JSON.parse(saved);
  }
  // 默认示例笔记
  return [
    {
      id: '1',
      author: 'SheepBlog',
      content: '新架构 open-weight 模型发布！GLM-5.1 是一个 DeepSeek-V3.2-like 架构（包括 MoE 和 DeepSeek Sparsen Attention），但有更多的 layers。\n\nAnd the benchmarks look better throughout! Looks like THE flagship open-weight model now.',
      reference: {
        type: 'link',
        title: 'Components of A Coding Agent',
        url: '/posts/hello-world',
        description: 'How coding agents use tools, memory, and repo context to make LLMs work better in practice.',
      },
      date: new Date(Date.now() - 3600000 * 2).toISOString(),
      likes: 104,
      liked: false,
      comments: 31,
      reposts: 10,
    },
    {
      id: '2',
      author: 'SheepBlog',
      content: 'Sebastian Raschka, PhD · 🔥\n\nNew architecture open-weight model release! GLM-5.1 is a DeepSeek-V3.2-like architecture (including MoE and DeepSeek Sparsen Attention) but with more layers.\n\nAnd the benchmarks look better throughout! Looks like THE flagship open-weight model now.',
      reference: {
        type: 'post',
        title: 'Components of A Coding Agent',
        url: '/posts/hello-world',
        description: 'How coding agents use tools, memory, and repo context to make LLMs work better in practice.',
      },
      date: new Date(Date.now() - 3600000 * 5).toISOString(),
      likes: 524,
      liked: true,
      comments: 51,
      reposts: 51,
    },
  ];
}

export function saveNotes(notes: Note[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
}

export function addNote(note: Omit<Note, 'id' | 'likes' | 'liked' | 'comments' | 'reposts'>): Note {
  const newNote: Note = {
    ...note,
    id: Date.now().toString(),
    likes: 0,
    liked: false,
    comments: 0,
    reposts: 0,
  };
  const notes = getNotes();
  saveNotes([newNote, ...notes]);
  return newNote;
}

export function updateNote(updatedNote: Note) {
  const notes = getNotes();
  const index = notes.findIndex(n => n.id === updatedNote.id);
  if (index !== -1) {
    notes[index] = updatedNote;
    saveNotes(notes);
  }
}
