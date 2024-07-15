import React, { useState, useEffect, useCallback } from 'react';
import { ChevronRight, ChevronDown } from "lucide-react"
import { LoomNode } from 'components/types';
import { SearchInput } from "@/components/ui/input"
import NodeLink from "components/NodeLink"
// TODO: Maybe we should be managing state via our Zustand store?

export interface AccordionItem {
  loomNode: LoomNode,
  content?: string;
  children?: AccordionItem[];
}

export interface AccordionProps {
  items: AccordionItem[];
  setFocusedNodeId: (id: string) => void;
}

const Accordion: React.FC<AccordionProps> = ({ items, setFocusedNodeId }) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Use useCallback to memoize these functions
  const getAllItemIds = useCallback((items: AccordionItem[]): string[] => {
    return items.reduce((acc: string[], item) => {
      acc.push(item.loomNode.id);
      if (item.children) {
        acc.push(...getAllItemIds(item.children));
      }
      return acc;
    }, []);
  }, []);

  const findPathToItem = useCallback((items: AccordionItem[], targetId: string, path: string[] = []): string[] | null => {
    for (const item of items) {
      if (item.loomNode.id === targetId) {
        return [...path, item.loomNode.id];
      }
      if (item.children) {
        const childPath = findPathToItem(item.children, targetId, [...path, item.loomNode.id]);
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
    const titleMatch = item.loomNode.latestText.toLowerCase().includes(searchTerm.toLowerCase());
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

  useEffect(() => {
    if (selectedItemId) {
      setFocusedNodeId(selectedItemId);
    }
  }, [selectedItemId, setFocusedNodeId]);

  const itemIcon = (hasChildren: boolean | undefined, isExpanded: boolean) => {
    return (
      <span>
        {hasChildren ? (isExpanded ? <ChevronDown /> : <ChevronRight />) : '•'}
      </span>
    );
  }

  const renderAccordionItem = (item: AccordionItem) => {
    const isExpanded = expandedItems.has(item.loomNode.id);
    const hasChildren = item.children && item.children.length > 0;
    const isSelected = item.loomNode.id === selectedItemId;

    const bgColor = isSelected ? 'bg-accent' : 'transparent'
    const cursor = hasChildren ? 'cursor-pointer' : 'cursor-default'
    const fontWeight = isExpanded ? 'font-bold' : 'font-normal'
    const classString = `${bgColor} ${cursor} ${fontWeight} flex items-center rounded-md text-nowrap`

    return (
      <div key={item.loomNode.id}>
        <div
          className={classString}
        >
          <span
            onClick={() => {
              if (hasChildren) {
                setExpandedItems(prev => {
                  const newSet = new Set(prev);
                  if (newSet.has(item.loomNode.id)) {
                    newSet.delete(item.loomNode.id);
                  } else {
                    newSet.add(item.loomNode.id);
                  }
                  return newSet;
                });
              }
            }}
          >
            {itemIcon(hasChildren, isExpanded)}
          </span >
          <p>
            <NodeLink
              text={item.loomNode.latestText}
              nodeId={item.loomNode.id}
              setFocusedNodeId={setFocusedNodeId}
            />
          </p>
        </div>
        {
          isExpanded && (
            <div className="ml-5">
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
    <div className="p-2">
      <div className="mb-2">
        {!selectedItemId && (
          <SearchInput
            id="loom-search-input"
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search..."
          />
        )}
      </div>

      {
        searchTerm && matchingItems.length === 0 ? (
          <div>Not found</div>
        ) : searchTerm && !selectedItemId ? (
          <div>
            <h3>Search Results:</h3>
            <ul>
              {matchingItems.map(item => (
                <li
                  key={item.loomNode.id}
                  onClick={() => setSelectedItemId(item.loomNode.id)}
                  className={"cursor-pointer text-blue-500 text-decoration-line: underline inline-block whitespace-nowrap"}
                >
                  {item.loomNode.latestText}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div>
            {selectedItemId && (
              <button onClick={handleBackToSearch} className="mb-2.5 flex underline">
                Back to Search Results
              </button>
            )}
            <div className="searchable-accordion-body">
              {items.map(renderAccordionItem)}
            </div>
          </div>
        )
      }
    </div >
  );
};

export default Accordion;