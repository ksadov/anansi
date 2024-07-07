import React, { useState, useEffect, useCallback } from 'react';

export interface AccordionItem {
  id: string;
  title: string;
  content?: string;
  children?: AccordionItem[];
}

export interface AccordionProps {
  items: AccordionItem[];
}

const Accordion: React.FC<AccordionProps> = ({ items }) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Use useCallback to memoize these functions
  const getAllItemIds = useCallback((items: AccordionItem[]): string[] => {
    return items.reduce((acc: string[], item) => {
      acc.push(item.id);
      if (item.children) {
        acc.push(...getAllItemIds(item.children));
      }
      return acc;
    }, []);
  }, []);

  const findPathToItem = useCallback((items: AccordionItem[], targetId: string, path: string[] = []): string[] | null => {
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
  }, []);


  // Initialize expanded items and handle persistence
  useEffect(() => {
    const allIds = getAllItemIds(items);
    const storedCollapsed = localStorage.getItem('collapsedItems');
    if (storedCollapsed) {
      const collapsedSet = new Set(JSON.parse(storedCollapsed));
      setExpandedItems(new Set(allIds.filter(id => !collapsedSet.has(id))));
    } else {
      setExpandedItems(new Set(allIds));
    }
  }, [items]);

  // Update local storage when expanded items change
  useEffect(() => {
    const allIds = getAllItemIds(items);
    const collapsedItems = allIds.filter(id => !expandedItems.has(id));
    localStorage.setItem('collapsedItems', JSON.stringify(collapsedItems));
  }, [expandedItems, items]);
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

  // Initialize expanded items and handle persistence
  useEffect(() => {
    const allIds = getAllItemIds(items);
    const storedCollapsed = localStorage.getItem('collapsedItems');
    if (storedCollapsed) {
      const collapsedSet = new Set(JSON.parse(storedCollapsed));
      setExpandedItems(new Set(allIds.filter(id => !collapsedSet.has(id))));
    } else {
      setExpandedItems(new Set(allIds));
    }
  }, [items, getAllItemIds]);

  // Update local storage when expanded items change
  useEffect(() => {
    const allIds = getAllItemIds(items);
    const collapsedItems = allIds.filter(id => !expandedItems.has(id));
    localStorage.setItem('collapsedItems', JSON.stringify(collapsedItems));
  }, [expandedItems, items, getAllItemIds]);

  // Handle selected item expansion
  useEffect(() => {
    if (selectedItemId) {
      const path = findPathToItem(items, selectedItemId);
      if (path) {
        setExpandedItems(new Set(path));
      }
    }
  }, [selectedItemId, items, findPathToItem]);

  const renderAccordionItem = (item: AccordionItem) => {
    const isExpanded = expandedItems.has(item.id);
    const hasChildren = item.children && item.children.length > 0;
    const isSelected = item.id === selectedItemId;

    return (
      <div key={item.id}>
        <div
          style={{
            cursor: hasChildren ? 'pointer' : 'default',
            fontWeight: isExpanded ? 'bold' : 'normal',
            backgroundColor: isSelected ? 'yellow' : 'transparent'
          }}
        >
          <span
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
          >
            {hasChildren ? (isExpanded ? '▼' : '►') : '•'}
          </span> {item.title}
        </div>
        {
          isExpanded && (
            <div style={{ marginLeft: '20px' }}>
              {item.content && <p>{item.content}</p>}
              {hasChildren && item.children!.map(renderAccordionItem)}
            </div>
          )
        }
      </div>
    );
  };

  const matchingItems = findMatchingItems(items);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setSelectedItemId(null);
  };

  const handleBackToSearch = () => {
    setSelectedItemId(null);
  };

  return (
    <div>
      {!selectedItemId && (
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search..."
          style={{ marginBottom: '10px', width: '100%', padding: '5px' }}
        />
      )}

      {searchTerm && matchingItems.length === 0 ? (
        <div>Not found</div>
      ) : searchTerm && !selectedItemId ? (
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
      ) : (
        <div>
          {selectedItemId && (
            <button onClick={handleBackToSearch} style={{ marginBottom: '10px' }}>
              Back to Search Results
            </button>
          )}
          <div className="searchable-accordion-body">
            {items.map(renderAccordionItem)}
          </div>
        </div>
      )}
    </div>
  );
};

export default Accordion;