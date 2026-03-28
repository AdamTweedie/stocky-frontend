interface FocusSectionProps {
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
}

const FOCUS_CATEGORIES = [
  'bloomberg.com',
  'reuters.com',
  'wsj.com',
  'ft.com',
  'cnbc.com',
  'marketwatch.com',
  'seekingalpha.com',
  'barrons.com',
];

const FocusSection = ({ selectedCategory, onCategorySelect }: FocusSectionProps) => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">In Focus</h3>
      
      <div className="flex flex-wrap gap-2">
        {FOCUS_CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => onCategorySelect(selectedCategory === category ? null : category)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-all ${
              selectedCategory === category
                ? 'bg-primary text-primary-foreground border-primary shadow-[0_0_12px_hsl(var(--primary)/0.4)]'
                : 'bg-card/50 text-foreground border-border/50 hover:border-primary/50 hover:text-primary'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FocusSection;