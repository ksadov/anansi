import React, { useState, useEffect } from 'react';

export interface AccordionItem {
  id: string;
  title: string;
  content?: string;
  children?: AccordionItem[];
}

export interface AccordionProps {
  items: AccordionItem[];
  searchTerm: string;
}

const Accordion: React.FC<AccordionProps> = ({ items, searchTerm }) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const itemMatchesSearch = (item: AccordionItem): boolean => {
    const titleMatch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const contentMatch = item.content ? item.content.toLowerCase().includes(searchTerm.toLowerCase()) : false;
    return titleMatch || contentMatch;
  };

  const findMatchingItems = (items: AccordionItem[]): AccordionItem[] => {
    let matches: AccordionItem[] = [];
    for (const item of items) {
      if (itemMatchesSearch(item)) {
        matches.push(item);
      }
      if (item.children) {
        matches = matches.concat(findMatchingItems(item.children));
      }
    }
    return matches;
  };

  const findPathToItem = (items: AccordionItem[], targetId: string, path: string[] = []): string[] | null => {
    for (const item of items) {
      if (item.id === targetId) {
        return [...path, item.id];
      }
      if (item.children) {
        const childPath = findPathToItem(item.children, targetId, [...path, item.id]);
        if (childPath) {
          return childPath;
        }
      }
    }
    return null;
  };

  useEffect(() => {
    if (selectedItemId) {
      const path = findPathToItem(items, selectedItemId);
      if (path) {
        setExpandedItems(new Set(path));
      }
    } else {
      setExpandedItems(new Set());
    }
  }, [selectedItemId, items]);

  const renderAccordionItem = (item: AccordionItem) => {
    const isExpanded = expandedItems.has(item.id);
    const hasChildren = item.children && item.children.length > 0;
    const isSelected = item.id === selectedItemId;

    return (
      <div key={item.id}>
        <div
          onClick={() => {
            if (hasChildren) {
              setExpandedItems(prev => {
                const newSet = new Set(prev);
                if (newSet.has(item.id)) {
                  newSet.delete(item.id);
                } else {
                  newSet.add(item.id);
                }
                return newSet;
              });
            }
          }}
          style={{
            cursor: hasChildren ? 'pointer' : 'default',
            fontWeight: isExpanded ? 'bold' : 'normal',
            backgroundColor: isSelected ? 'yellow' : 'transparent'
          }}
        >
          {hasChildren ? (isExpanded ? '▼' : '►') : '•'} {item.title}
        </div>
        {isExpanded && (
          <div style={{ marginLeft: '20px' }}>
            {item.content && <p>{item.content}</p>}
            {hasChildren && item.children!.map(renderAccordionItem)}
          </div>
        )}
      </div>
    );
  };

  const matchingItems = findMatchingItems(items);

  if (searchTerm && matchingItems.length === 0) {
    return <div>Not found</div>;
  }

  if (searchTerm && !selectedItemId) {
    return (
      <div>
        <h3>Search Results:</h3>
        <ul>
          {matchingItems.map(item => (
            <li
              key={item.id}
              onClick={() => setSelectedItemId(item.id)}
              style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
            >
              {item.title}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div>
      {selectedItemId && (
        <button onClick={() => setSelectedItemId(null)}>Back to Search Results</button>
      )}
      {items.map(renderAccordionItem)}
    </div>
  );
};

export default Accordion;