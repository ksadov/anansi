import React, { useState } from 'react';
import Accordion, { AccordionItem, AccordionProps } from './Accordion';
import { LoomNode } from './types';

function loomNodeToAccordionItem(loomNode: LoomNode): AccordionItem {
  return {
    id: loomNode.id,
    title: loomNode.text,
    children: loomNode.children.map(loomNodeToAccordionItem)
  };
}

function accordionLoom(root_node: LoomNode, searchTerm: string): AccordionProps {
  return {
    items: [loomNodeToAccordionItem(root_node)],
    searchTerm
  };
}


export default function LoomList({ root_node }: { root_node: LoomNode }) {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Accordion {...accordionLoom(root_node, searchTerm)} />
    </div>
  );
}