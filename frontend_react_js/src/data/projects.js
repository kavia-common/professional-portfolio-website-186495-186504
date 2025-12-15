const projects = [
  {
    id: 'proj-1',
    title: 'Accessible UI Kit',
    description: 'A collection of accessible, framework-agnostic UI components built with modern CSS.',
    tech: ['HTML', 'CSS', 'ARIA'],
    links: [
      { label: 'Repo', href: 'https://github.com/', variant: 'btn-outline' },
      { label: 'Live', href: 'https://example.com', variant: 'btn-primary' },
    ],
  },
  {
    id: 'proj-2',
    title: 'Realtime Chat',
    description: 'Lightweight chat demo using WebSocket APIs and optimistic UI updates.',
    tech: ['React', 'WebSocket', 'Node.js'],
    links: [
      { label: 'Repo', href: 'https://github.com/', variant: 'btn-outline' },
    ],
  },
  {
    id: 'proj-3',
    title: 'Portfolio Builder',
    description: 'A static-site generator tailored for personal portfolios with markdown content.',
    tech: ['JavaScript', 'Vite', 'MDX'],
    links: [
      { label: 'Live', href: 'https://example.com', variant: 'btn-primary' },
    ],
  },
];

export default projects;
