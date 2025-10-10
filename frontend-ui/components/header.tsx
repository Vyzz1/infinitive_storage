interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <header className="border-b border-border bg-background px-6 py-4">
      <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
    </header>
  );
}
