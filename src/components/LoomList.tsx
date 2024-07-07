import React, { useState } from 'react';
import Accordion, { AccordionItem, AccordionProps } from './Accordion';
import { LoomNode } from './types';

function loomNodeToAccordionItem(loomNode: LoomNode): AccordionItem {
  return {
    loomNode,
    children: loomNode.children.map(loomNodeToAccordionItem),
  };
}

function accordionLoom(root_node: LoomNode): AccordionProps {
  return {
    items: [loomNodeToAccordionItem(root_node)],
  };
}


export default function LoomList({ root_node }: { root_node: LoomNode }) {
  const [searchTerm] = useState('');
  return (
    <div>
      <Accordion {...accordionLoom(root_node)} />
    </div>
  );
}